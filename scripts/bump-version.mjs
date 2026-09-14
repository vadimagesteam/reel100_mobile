#!/usr/bin/env node
/**
 * Single source of truth for the app version across all three platforms.
 *
 * Android was shipped stuck at 1.0.16 while iOS moved to 1.2.9 because every
 * release bumped iOS by hand and never touched android/app/build.gradle. This
 * script makes that impossible: one command writes the marketing version and
 * build number to package.json, the Android gradle config, and the iOS
 * pbxproj together, and fails loudly if any file does not end up consistent.
 *
 * Usage:
 *   node scripts/bump-version.mjs <version> [buildNumber]
 *   node scripts/bump-version.mjs 1.3.0            # build = current max + 1
 *   node scripts/bump-version.mjs 1.3.0 100        # build pinned to 100
 *   node scripts/bump-version.mjs --check          # verify all in sync, write nothing
 *
 * Convention: the Android versionCode and the iOS CURRENT_PROJECT_VERSION are
 * the same integer (the "build number"), and both platforms carry the same
 * marketing version string. The Play Store requires versionCode to increase on
 * every upload, so the default bump only ever moves it forward.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const PKG = join(root, 'package.json');
const GRADLE = join(root, 'android/app/build.gradle');
const PBXPROJ = join(root, 'ios/RushRanks.xcodeproj/project.pbxproj');

const read = (p) => readFileSync(p, 'utf8');

/** Pull the current version/build off every file so we can validate. */
function readState() {
  const pkg = JSON.parse(read(PKG));
  const gradle = read(GRADLE);
  const pbx = read(PBXPROJ);

  const gradleName = gradle.match(/versionName\s+"([^"]+)"/)?.[1];
  const gradleCode = gradle.match(/versionCode\s+(\d+)/)?.[1];

  const marketingVersions = [...pbx.matchAll(/MARKETING_VERSION\s*=\s*([^;]+);/g)].map((m) =>
    m[1].trim(),
  );
  const projectVersions = [...pbx.matchAll(/CURRENT_PROJECT_VERSION\s*=\s*([^;]+);/g)].map((m) =>
    m[1].trim(),
  );

  return {
    pkgVersion: pkg.version,
    gradleName,
    gradleCode,
    marketingVersions,
    projectVersions,
  };
}

function currentMaxBuild(state) {
  const codes = [state.gradleCode, ...state.projectVersions]
    .map((v) => parseInt(v, 10))
    .filter((n) => Number.isFinite(n));
  return codes.length ? Math.max(...codes) : 0;
}

function check() {
  const s = readState();
  const problems = [];

  const names = new Set([s.pkgVersion, s.gradleName, ...s.marketingVersions]);
  if (names.size > 1) {
    problems.push(
      `Marketing version diverges: package.json=${s.pkgVersion}, ` +
        `gradle=${s.gradleName}, ios=[${[...new Set(s.marketingVersions)].join(', ')}]`,
    );
  }

  const codes = new Set([s.gradleCode, ...s.projectVersions]);
  if (codes.size > 1) {
    problems.push(
      `Build number diverges: gradle versionCode=${s.gradleCode}, ` +
        `ios CURRENT_PROJECT_VERSION=[${[...new Set(s.projectVersions)].join(', ')}]`,
    );
  }

  return { state: s, problems };
}

function write(version, build) {
  if (!/^\d+\.\d+\.\d+$/.test(version)) {
    throw new Error(`Version must be MAJOR.MINOR.PATCH, got "${version}"`);
  }

  // package.json
  const pkg = JSON.parse(read(PKG));
  pkg.version = version;
  writeFileSync(PKG, `${JSON.stringify(pkg, null, 2)}\n`);

  // android/app/build.gradle
  let gradle = read(GRADLE);
  gradle = gradle.replace(/versionCode\s+\d+/, `versionCode ${build}`);
  gradle = gradle.replace(/versionName\s+"[^"]+"/, `versionName "${version}"`);
  writeFileSync(GRADLE, gradle);

  // ios pbxproj — every build config
  let pbx = read(PBXPROJ);
  pbx = pbx.replace(/CURRENT_PROJECT_VERSION\s*=\s*[^;]+;/g, `CURRENT_PROJECT_VERSION = ${build};`);
  pbx = pbx.replace(/MARKETING_VERSION\s*=\s*[^;]+;/g, `MARKETING_VERSION = ${version};`);
  writeFileSync(PBXPROJ, pbx);
}

function main() {
  const args = process.argv.slice(2);

  if (args[0] === '--check') {
    const { state, problems } = check();
    if (problems.length) {
      console.error('Version mismatch across platforms:\n  ' + problems.join('\n  '));
      process.exit(1);
    }
    console.log(
      `In sync: v${state.pkgVersion} (build ${state.gradleCode}) across package.json, Android, iOS.`,
    );
    return;
  }

  const version = args[0];
  if (!version) {
    console.error(
      'Usage: node scripts/bump-version.mjs <version> [buildNumber] | --check',
    );
    process.exit(1);
  }

  const before = readState();
  const build = args[1] ? parseInt(args[1], 10) : currentMaxBuild(before) + 1;
  if (!Number.isFinite(build) || build <= 0) {
    throw new Error(`Build number must be a positive integer, got "${args[1]}"`);
  }

  write(version, build);

  const { problems } = check();
  if (problems.length) {
    console.error('Post-write verification failed:\n  ' + problems.join('\n  '));
    process.exit(1);
  }

  console.log(`Set version ${version}, build ${build} across package.json, Android, iOS.`);
}

main();
