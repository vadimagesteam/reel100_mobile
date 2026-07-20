# Releasing RushRanks

Both platforms must ship together. Android was previously left on 1.0.16 for
several releases while iOS advanced to 1.2.9, because each release bumped the
iOS project by hand and never touched the Android config. The version tooling
below exists to make that divergence impossible.

## Versioning model

One marketing version string and one integer build number, shared by both
platforms:

| Field | Android (`android/app/build.gradle`) | iOS (`project.pbxproj`) | Source of truth |
| --- | --- | --- | --- |
| Marketing version | `versionName` | `MARKETING_VERSION` | `package.json` `version` |
| Build number | `versionCode` | `CURRENT_PROJECT_VERSION` | same integer on both |

The Play Store requires `versionCode` to strictly increase on every upload, so
the build number only ever moves forward.

## Bumping the version

Never edit the version in `build.gradle` or the Xcode project directly. Use:

```bash
# Bump marketing version; build number becomes current max + 1
npm run version:set 1.3.0

# Or pin an explicit build number
npm run version:set 1.3.0 100

# Verify all platforms agree (exits non-zero on drift — good for CI)
npm run version:check
```

`version:set` writes `package.json`, `build.gradle`, and every build config in
the Xcode project in one shot, then re-reads them and fails if they disagree.

Add `npm run version:check` to CI so a release that touches only one platform
fails the build.

## Android release build and upload

The steps below need the release keystore and Play Console access; they cannot
be run from CI without those secrets.

1. Bump the version (above) and commit.
2. Build a signed AAB:
   ```bash
   cd android && ./gradlew bundleRelease
   ```
   Output: `android/app/build/outputs/bundle/release/app-release.aab`, signed
   with the `release` config in `build.gradle`.
3. Upload the AAB to the Play Console production track.
4. Roll out and confirm the update appears on a real device (the reason this
   task was opened — a device stuck on 1.0.16 with no update available).

## iOS release build

1. Bump the version (same command — it already updated the Xcode project).
2. Archive in Xcode (or via `xcodebuild`) and upload to App Store Connect.

## Checklist

- [ ] `npm run version:check` passes
- [ ] Android `versionCode` is higher than the last uploaded build
- [ ] Signed AAB uploaded to the Play production track
- [ ] iOS build uploaded to App Store Connect
- [ ] Update confirmed live on a real Android device
