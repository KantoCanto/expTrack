# Expense Tracker

React Native app built with Expo Router and Supabase.

## Stack

- Expo SDK 55
- React Native 0.83
- React 19.2
- TypeScript
- Supabase JS client

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

Fill in `EXPO_PUBLIC_SUPABASE_URL` and `EXPO_PUBLIC_SUPABASE_ANON_KEY` from your Supabase project settings.

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

## GitHub

Create an empty GitHub repository, then connect this local repo:

```bash
git remote add origin git@github.com:<your-user-or-org>/expense-tracker.git
git push -u origin main
```

The GitHub CLI is not installed in this environment, so remote repository creation needs to happen through GitHub.com or after installing `gh`.
