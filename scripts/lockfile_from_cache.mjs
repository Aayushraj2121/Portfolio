/**
 * Generate package-lock.json from the local npm cache, with no network access.
 *
 * Why this exists
 * ---------------
 * The registry is unreachable from this environment, but ~/.npm/_cacache holds
 * every tarball this project needs. Plain `npm install --offline` still fails,
 * because it must first resolve semver ranges against *packuments*, and cached
 * packuments are unusable here on two counts: they carry
 * `cache-control: max-age=300` (long expired) and `vary: accept-encoding`, whose
 * stored request headers don't record an accept-encoding to compare against.
 * Tarball entries have neither problem — no `vary`, and `immutable` with a
 * one-year TTL.
 *
 * So this script does the resolution step itself: it reads the packument bodies
 * straight out of cacache (bypassing the HTTP cache-matching layer that rejects
 * them), resolves the dependency tree with npm's own semver, and writes a
 * lockfile. `npm ci --offline` then installs from tarballs alone and never
 * requests a packument.
 *
 * Usage:  node scripts/lockfile_from_cache.mjs
 *
 * This is a bootstrap tool, not part of the normal build. Once the registry is
 * reachable, `rm package-lock.json && npm install` regenerates it conventionally
 * and this script can be deleted.
 */

import { createRequire } from 'node:module';
import { execFileSync } from 'node:child_process';
import { gunzipSync } from 'node:zlib';
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { homedir } from 'node:os';

// semver and cacache ship inside npm itself, so no install is needed to run this.
const npmRoot = execFileSync('npm', ['root', '-g'], { encoding: 'utf8' }).trim();
const require = createRequire(join(npmRoot, 'npm', 'node_modules', 'index.js'));
const semver = require('semver');
const cacache = require('cacache');

const CACHE = join(homedir(), '.npm', '_cacache');
const REGISTRY = 'https://registry.npmjs.org/';
const PLATFORM = process.platform;
const ARCH = process.arch;

const root = JSON.parse(readFileSync('package.json', 'utf8'));

// ---------------------------------------------------------------------------
// Index the cache
// ---------------------------------------------------------------------------

const entries = await cacache.ls(CACHE);

/** Bare package name -> cache integrity of its packument. */
const packumentIndex = new Map();
/** Tarball URL -> integrity, so we only resolve to versions we can install. */
const tarballIndex = new Map();

for (const entry of Object.values(entries)) {
  const key = entry.key ?? '';
  const marker = 'make-fetch-happen:request-cache:';
  if (!key.startsWith(marker)) continue;

  const url = key.slice(marker.length);
  if (!url.startsWith(REGISTRY)) continue;

  const path = url.slice(REGISTRY.length);

  if (path.includes('/-/') && path.endsWith('.tgz')) {
    tarballIndex.set(url, entry.integrity);
    continue;
  }

  // Scoped names are percent-encoded in the cache key.
  const name = decodeURIComponent(path);
  if (name.includes('/-/')) continue;

  // Several variants can exist (abbreviated and full). Prefer the largest,
  // which is the full packument and always carries the fields we read.
  const existing = packumentIndex.get(name);
  if (!existing || entry.size > existing.size) {
    packumentIndex.set(name, { integrity: entry.integrity, size: entry.size });
  }
}

console.log(
  `cache: ${packumentIndex.size} packuments, ${tarballIndex.size} tarballs at ${CACHE}`
);

// ---------------------------------------------------------------------------
// Read packuments directly out of content-addressed storage
// ---------------------------------------------------------------------------

const packumentCache = new Map();

async function getPackument(name) {
  if (packumentCache.has(name)) return packumentCache.get(name);

  const record = packumentIndex.get(name);
  if (!record) {
    packumentCache.set(name, null);
    return null;
  }

  let body = (await cacache.get.byDigest(CACHE, record.integrity, { memoize: false }));
  if (typeof body === 'string') body = Buffer.from(body);

  // Bodies are stored exactly as received, so gzip is still applied.
  if (body[0] === 0x1f && body[1] === 0x8b) body = gunzipSync(body);

  const parsed = JSON.parse(body.toString('utf8'));
  packumentCache.set(name, parsed);
  return parsed;
}

/** True when a package declares os/cpu constraints this machine doesn't meet. */
function platformMatches(manifest) {
  const check = (list, actual) => {
    if (!Array.isArray(list) || list.length === 0) return true;
    const allowed = list.filter((value) => !value.startsWith('!'));
    const denied = list.filter((value) => value.startsWith('!')).map((value) => value.slice(1));
    if (denied.includes(actual)) return false;
    return allowed.length === 0 || allowed.includes(actual);
  };
  return check(manifest.os, PLATFORM) && check(manifest.cpu, ARCH);
}

/**
 * Highest version satisfying `range` whose tarball is present in the cache.
 * Restricting to cached versions is what makes the resulting lockfile
 * guaranteed-installable offline.
 */
async function resolve(name, range) {
  const packument = await getPackument(name);
  if (!packument?.versions) return null;

  const installable = Object.keys(packument.versions).filter((version) => {
    const tarball = packument.versions[version]?.dist?.tarball;
    return tarball && tarballIndex.has(tarball);
  });
  if (installable.length === 0) return null;

  // `latest` covers dist-tags like "*" that maxSatisfying handles poorly.
  const wanted = range === 'latest' || range === '' ? '*' : range;
  const version = semver.maxSatisfying(installable, wanted, { loose: true });
  if (!version) return null;

  return { version, manifest: packument.versions[version] };
}

// ---------------------------------------------------------------------------
// Walk the tree
// ---------------------------------------------------------------------------

/** name -> { version, manifest, dev, optional, ranges: Set } */
const resolved = new Map();
const missing = [];
const conflicts = [];

const queue = [];

for (const [name, range] of Object.entries(root.dependencies ?? {})) {
  queue.push({ name, range, dev: false, optional: false });
}
for (const [name, range] of Object.entries(root.devDependencies ?? {})) {
  queue.push({ name, range, dev: true, optional: false });
}

while (queue.length > 0) {
  const item = queue.shift();
  const existing = resolved.get(item.name);

  if (existing) {
    // Already placed. Reachable from a production path as well? Promote it.
    if (!item.dev) existing.dev = false;
    if (!item.optional) existing.optional = false;

    if (!semver.satisfies(existing.version, item.range, { loose: true })) {
      // A flat tree can't satisfy both ranges; report rather than emit a
      // lockfile that quietly installs the wrong version.
      conflicts.push(`${item.name}: have ${existing.version}, also required ${item.range}`);
    }
    continue;
  }

  const match = await resolve(item.name, item.range);
  if (!match) {
    if (item.optional) continue; // Optional and uncached: fine to drop.
    missing.push(`${item.name}@${item.range}`);
    continue;
  }

  resolved.set(item.name, {
    version: match.version,
    manifest: match.manifest,
    dev: item.dev,
    optional: item.optional,
  });

  const manifest = match.manifest;

  for (const [name, range] of Object.entries(manifest.dependencies ?? {})) {
    queue.push({ name, range, dev: item.dev, optional: item.optional });
  }

  // Optional deps are where platform binaries live (e.g. @next/swc-*). Only
  // enqueue the ones that match this machine.
  for (const [name, range] of Object.entries(manifest.optionalDependencies ?? {})) {
    const candidate = await resolve(name, range);
    if (candidate && !platformMatches(candidate.manifest)) continue;
    queue.push({ name, range, dev: item.dev, optional: true });
  }

  // npm auto-installs non-optional peers.
  const peerMeta = manifest.peerDependenciesMeta ?? {};
  for (const [name, range] of Object.entries(manifest.peerDependencies ?? {})) {
    if (peerMeta[name]?.optional) continue;
    queue.push({ name, range, dev: item.dev, optional: item.optional });
  }
}

if (conflicts.length > 0) {
  console.error('\nversion conflicts — a flat tree cannot satisfy these:');
  for (const line of conflicts) console.error(`  ${line}`);
}

if (missing.length > 0) {
  console.error('\nnot resolvable from cache:');
  for (const line of missing) console.error(`  ${line}`);
  console.error('\nAborting: the lockfile would be incomplete.');
  process.exit(1);
}

// ---------------------------------------------------------------------------
// Emit the lockfile
// ---------------------------------------------------------------------------

const packages = {
  '': {
    name: root.name,
    version: root.version,
    ...(root.license ? { license: root.license } : {}),
    dependencies: root.dependencies,
    devDependencies: root.devDependencies,
  },
};

for (const name of [...resolved.keys()].sort()) {
  const { version, manifest, dev, optional } = resolved.get(name);

  const entry = {
    version,
    resolved: manifest.dist.tarball,
    integrity: manifest.dist.integrity ?? undefined,
  };

  if (dev) entry.dev = true;
  if (optional) entry.optional = true;
  if (manifest.hasInstallScript) entry.hasInstallScript = true;
  if (manifest.bin) entry.bin = manifest.bin;
  if (manifest.dependencies) entry.dependencies = manifest.dependencies;
  if (manifest.optionalDependencies) entry.optionalDependencies = manifest.optionalDependencies;
  if (manifest.peerDependencies) entry.peerDependencies = manifest.peerDependencies;
  if (manifest.peerDependenciesMeta) entry.peerDependenciesMeta = manifest.peerDependenciesMeta;
  if (manifest.engines) entry.engines = manifest.engines;
  if (manifest.os) entry.os = manifest.os;
  if (manifest.cpu) entry.cpu = manifest.cpu;

  packages[`node_modules/${name}`] = entry;
}

const lockfile = {
  name: root.name,
  version: root.version,
  lockfileVersion: 3,
  requires: true,
  packages,
};

writeFileSync('package-lock.json', `${JSON.stringify(lockfile, null, 2)}\n`);

console.log(`\nresolved ${resolved.size} packages`);
for (const name of [...resolved.keys()].sort()) {
  const { version, dev, optional } = resolved.get(name);
  const flags = [dev && 'dev', optional && 'optional'].filter(Boolean).join(',');
  console.log(`  ${name}@${version}${flags ? `  (${flags})` : ''}`);
}
console.log('\nwrote package-lock.json — now run: npm ci --offline');
