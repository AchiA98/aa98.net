# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Svelte 5 + Vite TypeScript project called "AA98.net" - a personal website with dynamic wallpaper switching capabilities. The application features a boot screen animation followed by a wallpaper selector interface with local image assets.

## Development Commands

- `pnpm run dev` - Start development server with hot reload
- `pnpm run build` - Build for production (runs TypeScript compiler + Vite build)
- `pnpm start` - Preview production build locally
- `svelte-check` - Run Svelte type checking (available as dev dependency)

## Project Structure

### Core Architecture
- **Entry Point**: `src/main.ts` - Mounts the Svelte app to `#app` element
- **Root Component**: `src/App.svelte` - Manages boot sequence and main app state
- **State Management**: Uses Svelte 5's new runes (`$state`, `$derived`) and custom persistent store
- **Asset Management**: Wallpapers loaded dynamically via Vite's `import.meta.glob`

### Key Components
- `BootScreen.svelte` - Animated loading screen with progress bar
- `WallpaperSwitcher.svelte` - Dropdown menu for selecting background wallpapers
- `wallpaper.svelte.ts` - Custom store with localStorage persistence

### State Management Pattern
The app uses a custom `persisted()` store function that automatically syncs with localStorage:
```typescript
export const currentWallpaper = persisted<string>('selected-wallpaper', '');
```

### Asset Handling
Wallpapers are dynamically imported from `src/assets/wallpapers/` using Vite's glob import:
```typescript
const wallpaperModules = import.meta.glob('/src/assets/wallpapers/*.{jpg,jpeg,png,webp}', { 
  eager: true,
  query: '?url',
  import: 'default'
});
```

## Technology Stack
- **Framework**: Svelte 5 (using new runes syntax)
- **Build Tool**: Vite 7.0
- **Language**: TypeScript 5.8
- **Package Manager**: pnpm (has pnpm-lock.yaml and pnpm-workspace.yaml)
- **Node Version**: 22 (specified in package.json engines)

## Development Notes
- Uses strict TypeScript configuration with comprehensive linting rules
- Global CSS reset applied in `src/styles/global.css`
- Responsive design with mobile-first approach
- No external UI library dependencies - custom CSS with modern features (backdrop-filter, CSS Grid)
- Images are included as assets in Vite build configuration