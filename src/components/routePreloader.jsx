"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { PAGE_PRELOADS } from "../lib/page-preload-config";

const prefetchedRoutes = new Set();
const preloadedAssets = new Set();

function preloadImage(src) {
  if (preloadedAssets.has(src)) {
    return;
  }

  preloadedAssets.add(src);

  const img = new window.Image();
  img.decoding = "async";
  img.fetchPriority = "low";
  img.src = src;
}

export default function RoutePreloader() {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const preloadConfig = PAGE_PRELOADS[pathname];
    if (!preloadConfig) {
      return;
    }

    preloadConfig.routes.forEach((route) => {
      if (prefetchedRoutes.has(route)) {
        return;
      }

      prefetchedRoutes.add(route);
      router.prefetch(route);
    });

    preloadConfig.assets.forEach(preloadImage);
  }, [pathname, router]);

  return null;
}
