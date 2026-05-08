# Expense Tracker

React Native app built with Expo Router and Supabase.

## Stack

- Expo SDK 55
- React Native 0.83
- React 19.2
- TypeScript
- Supabase JS client
- Clerk Expo SDK

Expo SDK 54 targets React Native 0.81. This project is on Expo SDK 55 because React Native 0.83 is supported on that Expo track.

## Setup

Install dependencies:

```bash
corepack yarn install
```

Create your local environment file:

```bash
cp .env.example .env
```

Fill in `EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY` from Clerk, plus `EXPO_PUBLIC_SUPABASE_URL` and `EXPO_PUBLIC_SUPABASE_ANON_KEY` from your Supabase project settings.

Create the Supabase table by running [supabase/schema.sql](supabase/schema.sql) in the Supabase SQL editor.

Start the development server:

```bash
corepack yarn start
```

## Scripts

- `corepack yarn start` starts Expo.
- `corepack yarn ios` opens the iOS target.
- `corepack yarn android` opens the Android target.
- `corepack yarn web` starts the web target.
- `corepack yarn lint` runs Expo linting.
- `corepack yarn build` exports the web app to `dist`.
- `corepack yarn expo:prebuild` generates native projects when needed.

## Hostinger web hosting

This app can be hosted as a static Expo web export on Hostinger.

Build with production public environment variables available:

```bash
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_... \
EXPO_PUBLIC_SUPABASE_URL=https://...supabase.co \
EXPO_PUBLIC_SUPABASE_ANON_KEY=... \
corepack yarn build
```

Upload the contents of `dist` to Hostinger's `public_html`. The `public/.htaccess` file is copied into `dist` during the build and lets direct routes such as `/sign-in` and `/expenses` work on Apache hosting.

In Clerk, configure the production instance for your Hostinger domain before testing sign-in:

- Add the Hostinger domain in Clerk's production settings.
- Enable Email/Password and Google OAuth if both buttons should work.
- Add the production domain to Clerk's allowed redirect/origin settings for Expo web and SSO.

In Supabase, run [supabase/schema.sql](supabase/schema.sql) and use the matching project URL and anon key when building.

## GitHub

Create an empty GitHub repository, then connect this local repo:

```bash
git remote add origin git@github.com:<your-user-or-org>/expense-tracker.git
git push -u origin main
```

The GitHub CLI is not installed in this environment, so remote repository creation needs to happen through GitHub.com or after installing `gh`.
