# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

RushRanks is a React Native 0.79 mobile app (iOS + Android) for video ranking/streaming social media. Built with TypeScript, React 19, and the React Native CLI (not Expo).

## Commands

```bash
# Start Metro dev server
npm start

# Build and run
npm run ios
npm run android
npm run release:android    # Production Android build

# Code quality
npm run lint               # ESLint
npm run test               # Jest
npx jest path/to/test      # Run a single test file

# iOS native deps (after cloning or updating native deps)
bundle install             # First time only - install CocoaPods
cd ios && RCT_NEW_ARCH_ENABLED=1 bundle exec pod install && cd ..
```

**Node version**: v22.13.1 (see `.nvmrc`), minimum v18.

## Architecture

### App Bootstrap (`App.tsx`)
Provider stack in order: KeyboardProvider → GestureHandlerRootView → PersistQueryClientProvider → SafeAreaProvider → PortalProvider → RootNavigation → Toasts. The app waits for all Zustand stores to hydrate (`getAllStoreHydratedPromises()`) before hiding the splash screen.

### Navigation (`src/navigation/`)
Two-stack conditional navigation based on auth state in `RootNavigation.tsx`:
- **AuthNavigator**: Login, SignUp, ForgotPassword, ResetPassword, VerifyEmail, Eula
- **AppNavigator**: Authenticated app with bottom tabs + stack screens, wrapped in DrawerMenuWrapper
- **TabsNavigator**: 4 bottom tabs — TabMain, TabGlobalVideo, TabForYou, TabProfile
- Screen names and type-safe params defined in `src/navigation/screens.ts` (`AuthStackParamList`, `AppStackParamList`, `BottomTabParamList`)
- `navigationRef.ts` provides imperative navigation outside React components (used for deep links from push notifications)
- Type-safe hooks: `src/navigation/hooks/useNavigation.ts`, `useRoute.ts`
- Modal screens use `fade_from_bottom` animation (UserSearch, VideoModal, VideoFeedModal)

### State Management (Zustand + React Query)
- **Zustand stores** in `src/state/` with AsyncStorage persistence via `src/lib/createPersistStore.ts`
  - `authStore` — user auth, JWT token, profile, push notifications, account management
  - `uiStore` — menu visibility, selected US state filter
  - `videoRecordStore` (in `src/components/videoRecording/`) — camera recording state
- `createPersistStore` excludes `actions` key from serialization automatically; `clearStoreCaches()` wipes all stores + query client on logout
- **TanStack React Query v5** for server state, configured in `src/lib/api.ts`
  - Query cache persisted to AsyncStorage with 24-hour GC time
  - Infinite queries used for video feeds with `@shopify/flash-list`

### API Layer (`src/lib/api.ts`)
- Axios instance with base URL from `react-native-config` (`APP_API_URL` in `.env`)
- Request interceptor auto-injects JWT Bearer token from authStore
- Response interceptor handles 401 errors with silent logout and store cache clearing
- Custom headers: `X-Client: ReelApp`, `x-Client-Version`

### Styling
- **NativeWind v4** (Tailwind CSS for React Native) with `tailwind.config.js`
- Global styles in `global.css`; Metro configured via `withNativeWind` in `metro.config.js`
- Custom dark theme colors in `src/theme/colors.ts` — semantic mapping (background, surface, input, buttons, text variants)
- `src/lib/nativewindInterops.ts` configures `cssInterop` for third-party components (@gorhom/bottom-sheet, react-native-fast-image, @react-native-community/blur)
- Prettier sorts Tailwind classes via `prettier-plugin-tailwindcss`

### Key Source Directories
- `src/components/` — reusable UI (video feed, chat, user components, bottom sheets)
- `src/screens/` — full-screen page components organized by feature (auth, home, user, video, chat)
- `src/hooks/` — custom hooks (push notifications, useDisclosure, useLoadingCallback)
- `src/lib/` — core utilities (API client, store persistence, NativeWind interops)
- `src/state/` — Zustand stores and types

### Major Component Systems

**Video Feed** (`src/components/videoFeed/`): Self-contained module with its own hooks/, provider/, queries/, comments/, ads/, report/, share/ subdirectories. Uses FlashList with infinite scroll and AdMob ad interleaving. The VideoFeedProvider creates a **context-scoped Zustand store** (via `createVideoFeedStore()`) — unlike the global stores in `src/state/`, each VideoFeed instance gets its own isolated store through React context.

**Video Recording** (`src/components/videoRecording/`): Camera capture with vision-camera, preview, and description input. Has its own Zustand store (`videoRecordStore.ts`) and camera permission helpers.

**Chat** (`src/components/chat/`): Full messaging system with hooks for chat list, messages, send, read tracking, and unread counts. Uses `react-native-gifted-chat` for the dialog UI.

**UI Kit** (`src/components/ui/`): Form components (FormInput, FormItem, ValidationMessage), common components (Button, Input, Avatar, SearchInput, PinInput, SvgIcon), BottomSheet wrapper around @gorhom/bottom-sheet with backdrop.

**Drawer Menu** (`src/components/menu/`): DrawerMenuWrapper wraps the app navigator; MenuButton in header toggles it.

**Hideable Container** (`src/components/hidebleContainer/`): Context-based animated scroll wrapper that hides/shows elements (header, tab bar) during scroll. Note: folder name has a typo (`hideble` instead of `hideable`).

### Video & Media Stack
- `react-native-video` for playback
- `react-native-vision-camera` for recording (patched — see below)
- `@react-native-camera-roll/camera-roll` for gallery access
- `react-native-create-thumbnail` for video thumbnails
- `react-native-image-picker` for avatar uploads

### Firebase & Ads
- `@react-native-firebase/messaging` for push notifications (`src/hooks/pushNotifications/`)
- `react-native-google-mobile-ads` for AdMob integration, initialized in App.tsx

### Forms
- `react-hook-form` with `zod` v4 validation via `@hookform/resolvers`

## Native Patches

`patch-package` runs on `postinstall`. Active patches in `patches/`:
- **react-native-vision-camera+4.7.3.patch**: Filters Bayer/ProRes RAW pixel formats that cannot be encoded with standard codecs; prioritizes 8-bit formats (420v, 420f, BGRA) for HEVC/H.264; handles 10-bit formats for HEVC Main10. Fixes iPhone video recording with incompatible Bayer-only camera formats.

## Code Style

- TypeScript strict mode, extending `@react-native/typescript-config`
- Platform-specific files via module suffixes: `.ios.ts`, `.android.ts`, `.native.ts`
- ESLint extends `@react-native`
- Prettier: single quotes, semicolons, 100 char width, trailing commas, 2-space tabs
- Functional components with hooks only (no class components)

## Native Build Config

- **iOS**: Permissions configured in Podfile via react-native-permissions (Camera, Microphone, PhotoLibrary, Location, Notifications, AppTrackingTransparency). Static framework linkage for Firebase/AdMob.
- **Android**: minSdk 24, compileSdk 35, targetSdk 35. Google Services plugin for Firebase. NDK 27.1.12297006, Kotlin 2.0.21.
- **Ruby/CocoaPods**: Gemfile pins CocoaPods >= 1.13 (excluding 1.15.0, 1.15.1), xcodeproj < 1.26.0, concurrent-ruby < 1.3.4. These constraints prevent known build failures.

## Environment Setup

Copy `.env.example` to `.env` and set `APP_API_URL`. The app reads env vars via `react-native-config`.
