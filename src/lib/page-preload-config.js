const FILTER_IDS = ["none", "aden", "inkwell", "perpetua", "crema", "sutro"];
const STRIP_ASSET_NAMES = [
  "star",
  "neko",
  "love",
  "wanted",
  "blue-rose",
  "ado",
  "frog",
  "stardew",
  "chopper",
  "valentines",
  "valentines2",
  "cats",
  "op",
  "snacks",
];
const TIMER_SECONDS = [3, 5, 10];
const SHOT_COUNTS = [3, 4];

const unique = (assets) => [...new Set(assets)];

const FILTER_SELECT_ASSETS = FILTER_IDS.flatMap((id) => [
  `/webp-${id}.webp`,
  `/webp-hover-${id}.webp`,
]);

const STRIP_SELECT_ASSETS = unique([
  "/webp-back-page.webp",
  "/webp-next-page.webp",
  ...STRIP_ASSET_NAMES.flatMap((assetName) => [
    `/webp-${assetName}.webp`,
    `/webp-hover-${assetName}.webp`,
  ]),
]);

const HOME_PAGE_ASSETS = unique([
  "/webp-cute-booth.webp",
  "/webp-pc-title.webp",
  "/webp-pc-booth.webp",
  "/webp-def-start.webp",
  "/webp-hovered-start.webp",
]);

const SELECT_PAGE_ASSETS = unique([
  "/webp-cute-booth.webp",
  "/webp-timer-asset.webp",
  "/webp-shots-asset.webp",
  "/webp-next-button.webp",
  "/webp-hover-next.webp",
  "/webp-back-page.webp",
  ...TIMER_SECONDS.flatMap((seconds) => [
    `/webp-${seconds}s.webp`,
    `/webp-hover-${seconds}s.webp`,
  ]),
  ...SHOT_COUNTS.flatMap((shots) => [
    `/webp-${shots}shots.webp`,
    `/webp-hover-${shots}shots.webp`,
  ]),
]);

const CAPTURE_PAGE_ASSETS = unique([
  "/webp-smile-title.webp",
  "/webp-back-page.webp",
  "/webp-capturing-asset.webp",
  ...SHOT_COUNTS.flatMap((shots) => [
    `/webp-start-${shots}s.webp`,
    `/webp-hover-start-${shots}s.webp`,
  ]),
]);

const CHECK_PAGE_ASSETS = unique([
  "/webp-retake-asset.webp",
  "/webp-redo-asset.webp",
  "/webp-next-button.webp",
  "/webp-hover-next.webp",
]);

const EDIT_PAGE_ASSETS = unique([
  "/webp-strips-title.webp",
  "/webp-filters-title.webp",
  "/webp-next-button.webp",
  "/webp-hover-next.webp",
  "/webp-retake-button.webp",
  "/webp-hover-retake-button.webp",
  ...FILTER_SELECT_ASSETS,
  ...STRIP_SELECT_ASSETS,
]);

const RETAKE_PAGE_ASSETS = unique([
  "/webp-smile-title.webp",
  "/webp-back-page.webp",
  "/webp-capturing-asset.webp",
  "/webp-retake-button.webp",
  "/webp-hover-retake-button.webp",
]);

const DOWNLOAD_PAGE_ASSETS = unique([
  "/webp-machine.webp",
  "/webp-top-machine.webp",
  "/webp-download.webp",
  "/webp-hover-download.webp",
  "/webp-edit.webp",
  "/webp-hover-edit.webp",
  "/webp-reset.webp",
  "/webp-hover-reset.webp",
  "/webp-email.webp",
  "/webp-hover-email.webp",
  "/webp-sending.webp",
  "/webp-credits.webp",
]);

export const PAGE_PRELOADS = {
  "/": {
    routes: ["/select"],
    assets: SELECT_PAGE_ASSETS,
  },
  "/select": {
    routes: ["/capture"],
    assets: CAPTURE_PAGE_ASSETS,
  },
  "/capture": {
    routes: ["/check"],
    assets: CHECK_PAGE_ASSETS,
  },
  "/check": {
    routes: ["/edit", "/retake"],
    assets: unique([...EDIT_PAGE_ASSETS, ...RETAKE_PAGE_ASSETS]),
  },
  "/edit": {
    routes: ["/download", "/check"],
    assets: unique([...DOWNLOAD_PAGE_ASSETS, ...CHECK_PAGE_ASSETS]),
  },
  "/retake": {
    routes: ["/check"],
    assets: CHECK_PAGE_ASSETS,
  },
  "/download": {
    routes: ["/edit", "/"],
    assets: unique([...EDIT_PAGE_ASSETS, ...HOME_PAGE_ASSETS]),
  },
};
