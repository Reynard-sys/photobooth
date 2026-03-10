/**
 * Central source of truth for all static data used across the photobooth app.
 * Import from here instead of scattering definitions across components.
 */

// ---------------------------------------------------------------------------
// Strip frame thumbnail icons (used in StripSelect)
// ---------------------------------------------------------------------------
export const STRIP_FRAMES = [
  { id: "Frame1",  icon: "/images/strips/star.webp",        hoverIcon: "/images/strips/hover_star.webp",        alt: "Lucky Star" },
  { id: "Frame2",  icon: "/images/strips/neko.webp",        hoverIcon: "/images/strips/hover_neko.webp",        alt: "Neko" },
  { id: "Frame3",  icon: "/images/strips/love.webp",        hoverIcon: "/images/strips/hover_love.webp",        alt: "Love" },
  { id: "Frame4",  icon: "/images/strips/wanted.webp",      hoverIcon: "/images/strips/hover_wanted.webp",      alt: "Wanted" },
  { id: "Frame5",  icon: "/images/strips/blue_rose.webp",   hoverIcon: "/images/strips/hover_blue_rose.webp",   alt: "Blue Rose" },
  { id: "Frame6",  icon: "/images/strips/ado.webp",         hoverIcon: "/images/strips/hover_ado.webp",         alt: "Ado" },
  { id: "Frame7",  icon: "/images/strips/frog.webp",        hoverIcon: "/images/strips/hover_frog.webp",        alt: "Frog" },
  { id: "Frame8",  icon: "/images/strips/stardew.webp",     hoverIcon: "/images/strips/hover_stardew.webp",     alt: "Stardew" },
  { id: "Frame9",  icon: "/images/strips/chopper.webp",     hoverIcon: "/images/strips/hover_chopper.webp",     alt: "Chopper" },
  { id: "Frame10", icon: "/images/strips/valentines.webp",  hoverIcon: "/images/strips/hover_valentines.webp",  alt: "Valentines" },
  { id: "Frame11", icon: "/images/strips/valentines2.webp", hoverIcon: "/images/strips/hover_valentines2.webp", alt: "Valentines 2" },
  { id: "Frame12", icon: "/images/strips/cats.webp",        hoverIcon: "/images/strips/hover_cats.webp",        alt: "Cats" },
  { id: "Frame13", icon: "/images/strips/op.webp",          hoverIcon: "/images/strips/hover_op.webp",          alt: "One Piece" },
  { id: "Frame14", icon: "/images/strips/snacks.webp",      hoverIcon: "/images/strips/hover_snacks.webp",      alt: "Snacks" },
];

// ---------------------------------------------------------------------------
// Filter options (used in FilterSelect)
// ---------------------------------------------------------------------------
export const FILTERS = [
  { id: "none",     icon: "/images/filters/none.webp",      hoverIcon: "/images/filters/hover_none.webp",      alt: "Original" },
  { id: "aden",     icon: "/images/filters/aden.webp",      hoverIcon: "/images/filters/hover_aden.webp",      alt: "Aden" },
  { id: "inkwell",  icon: "/images/filters/inkwell.webp",   hoverIcon: "/images/filters/hover_inkwell.webp",   alt: "Inkwell" },
  { id: "perpetua", icon: "/images/filters/perpetua.webp",  hoverIcon: "/images/filters/hover_perpetua.webp",  alt: "Perpetua" },
  { id: "crema",    icon: "/images/filters/crema.webp",     hoverIcon: "/images/filters/hover_crema.webp",     alt: "Crema" },
  { id: "sutro",    icon: "/images/filters/sutro.webp",     hoverIcon: "/images/filters/hover_sutro.webp",     alt: "Sutro" },
];

// ---------------------------------------------------------------------------
// Timer and shot options (used in select page)
// ---------------------------------------------------------------------------
export const TIMER_OPTIONS = [3, 5, 10];
export const SHOT_OPTIONS  = [3, 4];

// ---------------------------------------------------------------------------
// Images to preload when on a given page (so next page loads instantly)
// ---------------------------------------------------------------------------
export const PRELOADS = {
  /** Preload on home page — needed for /select */
  home: [
    "/images/ui/timer_asset.webp",
    "/images/ui/shots_asset.webp",
    "/images/ui/3s.webp", "/images/ui/hover_3s.webp",
    "/images/ui/5s.webp", "/images/ui/hover_5s.webp",
    "/images/ui/10s.webp", "/images/ui/hover_10s.webp",
    "/images/ui/3shots.webp", "/images/ui/hover_3shots.webp",
    "/images/ui/4shots.webp", "/images/ui/hover_4shots.webp",
    "/images/ui/next_button.webp", "/images/ui/hover_next.webp",
    "/images/booth/cute_booth.webp",
  ],
  /** Preload on /select — needed for /capture */
  select: [
    "/images/ui/smile_title.webp",
    "/images/ui/start_3s.webp", "/images/ui/hover_start_3s.webp",
    "/images/ui/start_4s.webp", "/images/ui/hover_start_4s.webp",
    "/images/ui/capturing_asset.webp",
    "/images/ui/back_page.webp",
  ],
  /** Preload on /capture — needed for /check */
  capture: [
    "/images/ui/retake_asset.webp",
    "/images/ui/redo_asset.webp",
    "/images/ui/next_button.webp", "/images/ui/hover_next.webp",
  ],
  /** Preload on /check — needed for /edit */
  check: [
    "/images/ui/strips_title.webp",
    "/images/ui/filters_title.webp",
    "/images/ui/next_button.webp", "/images/ui/hover_next.webp",
    "/images/ui/retake_button.webp", "/images/ui/hover_retake_button.webp",
    "/images/ui/back_page.webp",
    "/images/ui/next_page.webp",
  ],
  /** Preload on /edit — needed for /download */
  edit: [
    "/images/booth/machine.webp",
    "/images/booth/top_machine.webp",
    "/images/ui/download.webp", "/images/ui/hover_download.webp",
    "/images/ui/edit.webp",     "/images/ui/hover_edit.webp",
    "/images/ui/reset.webp",    "/images/ui/hover_reset.webp",
    "/images/ui/email.webp",    "/images/ui/hover_email.webp",
    "/images/ui/sending.webp",
    "/images/ui/credits.webp",
  ],
};
