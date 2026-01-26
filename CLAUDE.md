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

# iOS native deps (after cloning or updating native deps)
bundle install             # First time only - install CocoaPods
cd ios && RCT_NEW_ARCH_ENABLED=1 bundle exec pod install && cd ..
```

**Node version**: v22.13.1 (see `.nvmrc`), minimum v18.

## Architecture

### Navigation (`src/navigation/`)
Two-stack conditional navigation based on auth state:
- **AuthNavigator**: Login, SignUp, ForgotPassword, VerifyEmail, Eula
- **AppNavigator**: Authenticated app with bottom tabs + stack screens
- **TabsNavigator**: 4 bottom tabs — TabMain, TabGlobalVideo, TabForYou, TabProfile
- Screen names and type-safe params are defined in `src/navigation/screens.ts`
- `navigationRef.ts` provides imperative navigation outside React components

### State Management (Zustand + React Query)
- **Zustand stores** in `src/state/` with AsyncStorage persistence via `src/lib/createPersistStore.ts`
  - `authStore` — user auth, JWT token, profile, push token
  - `uiStore` — menu visibility, selected US state filter
- **TanStack React Query v5** for server state, configured in `src/lib/api.ts`
  - Query cache persisted to AsyncStorage
  - 24-hour garbage collection time

### API Layer (`src/lib/api.ts`)
- Axios instance with base URL from `react-native-config` (`APP_API_URL` in `.env`)
- Request interceptor auto-injects JWT Bearer token from authStore
- Response interceptor handles 401 errors with silent logout and store cache clearing
- Custom headers: `X-Client: ReelApp`, `x-Client-Version`

### Styling
- **NativeWind v4** (Tailwind CSS for React Native) with `tailwind.config.js`
- Global styles in `global.css`
- Custom dark theme colors in `src/theme/colors.ts`
- Prettier sorts Tailwind classes via `prettier-plugin-tailwindcss`

### Key Source Directories
- `src/components/` — reusable UI (video feed, chat, user components, bottom sheets)
- `src/screens/` — full-screen page components organized by feature (auth, home, user, video, chat)
- `src/hooks/` — custom hooks (push notifications, etc.)
- `src/lib/` — core utilities (API client, store persistence, NativeWind interops)
- `src/state/` — Zustand stores and types

### Video & Media Stack
- `react-native-video` for playback
- `react-native-vision-camera` for recording
- `@react-native-camera-roll/camera-roll` for gallery access
- `react-native-create-thumbnail` for video thumbnails

### Forms
- `react-hook-form` with `zod` v4 validation via `@hookform/resolvers`

## Code Style

- TypeScript strict mode, extending `@react-native/typescript-config`
- Platform-specific files via module suffixes: `.ios.ts`, `.android.ts`, `.native.ts`
- ESLint extends `@react-native`
- Prettier: single quotes, semicolons, 100 char width, trailing commas, 2-space tabs
- Functional components with hooks only (no class components)

## Environment Setup

Copy `.env.example` to `.env` and set `APP_API_URL`. The app reads env vars via `react-native-config`.
