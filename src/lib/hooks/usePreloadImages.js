"use client";

import { useEffect, useState } from "react";

/**
 * Preloads a list of image paths on mount so they are cached in the browser
 * before the user navigates to the next page.
 *
 * @param {string[]} paths - Array of image src paths to preload.
 * @returns {{ ready: boolean }} - `ready` becomes true once all images resolved.
 */
export function usePreloadImages(paths) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!paths || paths.length === 0) {
      setReady(true);
      return;
    }

    let cancelled = false;

    Promise.all(
      paths.map(
        (src) =>
          new Promise((resolve) => {
            const img = new window.Image();
            img.onload  = resolve;
            img.onerror = resolve; // don't block on missing images
            img.src = src;
          }),
      ),
    ).then(() => {
      if (!cancelled) setReady(true);
    });

    return () => {
      cancelled = true;
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return { ready };
}
