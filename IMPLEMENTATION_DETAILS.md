# Implementation Details

## Overview
This project is a Next.js 16 App Router photo booth web app. Users choose session settings, capture 3 or 4 photos from the camera, retake individual shots, pick a strip template and filter, then download or email the final composite strip.

## Tech Stack
- Framework: Next.js 16.1.6 + React 19
- Styling: Tailwind CSS 4 + PostCSS
- State: Zustand (`src/lib/store.js`)
- Export: `html2canvas`
- Email: Nodemailer API route (`src/app/api/send-email/route.js`)
- Assets: WebP-heavy UI and strip templates in `public/`

## High-Level Flow
1. `/` resets app state and starts session.
2. `/select` sets timer (3/5/10) and shot count (3/4).
3. `/capture` runs countdown capture loop and stores shots.
4. `/check` previews shots and links to single-shot retake.
5. `/retake?i=<index>` replaces one shot in store.
6. `/edit` selects strip frame and visual filter.
7. `/download` animates strip from machine, exports PNG, or emails image.

## State Model (Zustand)
File: `src/lib/store.js`
- `timer`: default `3`
- `shotCount`: default `3`
- `shots`: array of captured JPEG data URLs
- `template`: default `Frame15`
- `filter`: default `none`
- Actions: setters, `replaceShot(index, dataUrl)`, and `resetSession()`

This store is the single source of truth across routes.

## Routing and Preloading
- Global preloader component in layout: `src/components/routePreloader.jsx`
- Config map: `src/lib/page-preload-config.js`

Behavior:
- Prefetches likely next routes using `router.prefetch(...)`
- Preloads route-specific static image assets with `new Image()`
- Uses in-memory `Set`s to avoid duplicate prefetch/preload work

## App Shell
### `src/app/layout.js`
- Loads Geist font
- Applies global CSS
- Injects `RoutePreloader`
- Defines page metadata

### `src/app/globals.css`
- Tailwind import + global tokens
- Fixed border-focused visual style
- Disables body scrolling (`overflow: hidden`) and overscroll bounce

## Route Implementations
### Home (`src/app/page.js`)
- Runs `resetSession()` on mount
- Responsive desktop/mobile landing composition
- Start CTA navigates to `/select`

### Select (`src/app/select/page.js`)
- Uses `TimerButton` and `ShotButton`
- Persists selected timer/shotCount to Zustand
- Enables "Next" when mounted and values are available
- Navigates to `/capture`

### Capture (`src/app/capture/page.js`)
Core logic:
- Starts camera stream with `getUserMedia`
- Supports switching camera device IDs
- Captures each shot after countdown (`runCountdown`)
- Crops frames to 16:9 and renders to 1920x1080 canvas
- Mirrors front/selfie camera output for visual consistency
- Saves captured shots to Zustand then routes to `/check`

### Check (`src/app/check/page.js`)
- Displays captured shots grid
- Per-shot retake button routes to `/retake?i=<index>`
- Continue button routes to `/edit`

### Retake (`src/app/retake/page.js`)
- Reads shot index from query param
- Re-opens camera and runs countdown capture
- Replaces one shot via `replaceShot(index, dataUrl)`
- Returns to `/check`

### Edit (`src/app/edit/page.js`)
- Shows strip selector (`StripSelect`) and filter selector (`FilterSelect`)
- Renders live preview via `PhotoStripComposite3` or `PhotoStripComposite4`
- Computes responsive preview scale from native strip dimensions
- Uses filter class names for preview styling (`instagram.css`)
- Has local pixel-filter helpers duplicated from util logic for export path

### Download (`src/app/download/page.js`)
Responsibilities:
- Preloads machine UI assets and runs strip reveal animation
- Renders final strip preview (3 or 4 shot composite)
- Generates export image using `html2canvas`
- Applies filter pipeline for exported source images
- Supports:
  - Downloading generated image
  - Sending image via `/api/send-email`
- Provides sending/loading/success/error UI feedback

## Composite Rendering Components
### `src/components/photostrip3.jsx`
### `src/components/photostrip4.jsx`
- Contain per-template absolute placement maps (`Frame1`..`Frame14`, plus `Frame15` in 3-shot)
- Render order:
  1. Shot images placed at configured x/y/w/h/rotation
  2. Overlay template image on top
- Uses `.webp` overlay during interactive rendering
- Uses `.png` overlay when `isExporting` is true

## Camera UI Components
### `src/components/camera.jsx`
### `src/components/retakeCamera.jsx`
- Enumerate available cameras
- Handle mobile front/back toggle semantics
- Surface camera state to parent (`onCameraStateChange`)
- Display countdown overlay and action controls

## Selection UI Components
- `src/components/timerSelect.jsx`: timer option card button
- `src/components/shotSelect.jsx`: shot count card button
- `src/components/filterSelect.jsx`: 6 filter options (`none`, `aden`, `inkwell`, `perpetua`, `crema`, `sutro`)
- `src/components/stripSelect.jsx`: paginated strip picker (6 per page across 15 templates)
- `src/components/border.jsx`: fixed decorative frame layer

## Filter Pipeline
File: `src/lib/filterUtils.js`
- Implements pixel-level approximations of Instagram-like filters:
  - `inkwell`
  - `aden`
  - `perpetua`
  - `crema`
  - `sutro`
- Exports:
  - `applyCSSFilterToCanvas(ctx, canvas, filterType)`
  - `loadAndFilterImage(src, filterType)`

Note: `edit/page.js` and `download/page.js` currently include local duplicate filter functions instead of fully reusing the utility implementation.

## Template Dimensions
File: `src/lib/templateDimensions.js`
- Returns native export size by shot count:
  - 3 shots: `1200 x 2800`
  - 4 shots: `1200 x 3600`

## Email API
File: `src/app/api/send-email/route.js`
- Runtime: Node.js
- Validates:
  - recipient email format
  - attached image presence/type/size (max 10 MB)
- SMTP config required via env vars:
  - `SMTP_HOST`
  - `SMTP_PORT`
  - `SMTP_USER`
  - `SMTP_PASS`
  - `SMTP_FROM`
- Uses pooled Nodemailer transporter (module-level singleton)
- Sends HTML + text email with inline CID image attachment
- Handles common SMTP/auth/network failure cases with user-safe errors

## Config and Tooling
- `next.config.mjs`: enables React Compiler (`reactCompiler: true`)
- `eslint.config.mjs`: Next core-web-vitals + default ignore list
- `tailwind.config.js`: content globs + custom spacing/border width
- `jsconfig.json`: `@/*` path alias to `src/*`
- `scripts/convert-to-webp.js`: recursive PNG -> WebP conversion (Sharp)

## Assets
- UI assets: `public/webp-*.webp`
- Strip overlays:
  - 3-shot: `public/strips/3photos/*`
  - 4-shot: `public/strips/4photos/*`

The app relies heavily on pre-rendered image assets for themed visuals and button states.

## Current Architectural Characteristics
- Strong client-side flow using a shared Zustand store.
- Heavy visual composition through absolute-positioned template overlays.
- Separate capture and retake camera flows, each handling camera switching.
- Export and email paths are browser-generated image first, then API delivery.
- Some logic duplication exists (notably filter conversion code in route pages).
