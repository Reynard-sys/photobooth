/**
 * Shared photo filter utilities used by the edit and download pages.
 */

/**
 * Maps a filter ID to its CSS class name (from instagram.css).
 * @param {string} filterId
 * @returns {string}
 */
export function getFilterClass(filterId) {
  switch (filterId) {
    case "aden":      return "filter-aden";
    case "inkwell":   return "filter-inkwell";
    case "perpetua":  return "filter-perpetua";
    case "crema":     return "filter-crema";
    case "sutro":     return "filter-sutro";
    default:          return "";
  }
}

/**
 * Applies a CSS-equivalent filter directly to canvas pixel data.
 * Used when rasterising the photo strip for download / email.
 * @param {CanvasRenderingContext2D} ctx
 * @param {HTMLCanvasElement} canvas
 * @param {string} filterType
 */
export function applyCSSFilterToCanvas(ctx, canvas, filterType) {
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;

  switch (filterType) {
    case "inkwell": {
      // brightness(1.25) contrast(.85) grayscale(1)
      for (let i = 0; i < data.length; i += 4) {
        const gray = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
        let r = gray * 1.25;
        let g = gray * 1.25;
        let b = gray * 1.25;
        const cf = 0.85;
        r = ((r / 255 - 0.5) * cf + 0.5) * 255;
        g = ((g / 255 - 0.5) * cf + 0.5) * 255;
        b = ((b / 255 - 0.5) * cf + 0.5) * 255;
        data[i]     = Math.min(255, Math.max(0, r));
        data[i + 1] = Math.min(255, Math.max(0, g));
        data[i + 2] = Math.min(255, Math.max(0, b));
      }
      break;
    }

    case "aden": {
      // sepia(.2) brightness(1.15) saturate(1.4) + overlay
      for (let i = 0; i < data.length; i += 4) {
        let r = data[i], g = data[i + 1], b = data[i + 2];
        const sr = r * 0.393 + g * 0.769 + b * 0.189;
        const sg = r * 0.349 + g * 0.686 + b * 0.168;
        const sb = r * 0.272 + g * 0.534 + b * 0.131;
        r = r * 0.8 + sr * 0.2; g = g * 0.8 + sg * 0.2; b = b * 0.8 + sb * 0.2;
        r *= 1.15; g *= 1.15; b *= 1.15;
        const gray = 0.299 * r + 0.587 * g + 0.114 * b;
        r = gray + (r - gray) * 1.4; g = gray + (g - gray) * 1.4; b = gray + (b - gray) * 1.4;
        r = r * 0.9 + ((r * 125) / 255) * 0.1;
        g = g * 0.9 + ((g * 105) / 255) * 0.1;
        b = b * 0.9 + ((b * 24)  / 255) * 0.1;
        data[i]     = Math.min(255, Math.max(0, r));
        data[i + 1] = Math.min(255, Math.max(0, g));
        data[i + 2] = Math.min(255, Math.max(0, b));
      }
      break;
    }

    case "perpetua": {
      // contrast(1.1) brightness(1.25) saturate(1.1) + gradient overlay
      for (let i = 0; i < data.length; i += 4) {
        let r = data[i], g = data[i + 1], b = data[i + 2];
        r *= 1.25; g *= 1.25; b *= 1.25;
        const gray = 0.299 * r + 0.587 * g + 0.114 * b;
        r = gray + (r - gray) * 1.1; g = gray + (g - gray) * 1.1; b = gray + (b - gray) * 1.1;
        r = ((r / 255 - 0.5) * 1.1 + 0.5) * 255;
        g = ((g / 255 - 0.5) * 1.1 + 0.5) * 255;
        b = ((b / 255 - 0.5) * 1.1 + 0.5) * 255;
        const y = Math.floor(i / 4 / canvas.width);
        const gm = (y / canvas.height) * 0.25;
        r = r * (1 - gm);
        g = g * (1 - gm) + ((g * 91)  / 255) * gm;
        b = b * (1 - gm) + ((b * 154) / 255) * gm;
        data[i]     = Math.min(255, Math.max(0, r));
        data[i + 1] = Math.min(255, Math.max(0, g));
        data[i + 2] = Math.min(255, Math.max(0, b));
      }
      break;
    }

    case "crema": {
      // sepia(.5) contrast(1.25) brightness(1.15) saturate(.9) + overlay
      for (let i = 0; i < data.length; i += 4) {
        let r = data[i], g = data[i + 1], b = data[i + 2];
        const sr = r * 0.393 + g * 0.769 + b * 0.189;
        const sg = r * 0.349 + g * 0.686 + b * 0.168;
        const sb = r * 0.272 + g * 0.534 + b * 0.131;
        r = r * 0.5 + sr * 0.5; g = g * 0.5 + sg * 0.5; b = b * 0.5 + sb * 0.5;
        r *= 1.15; g *= 1.15; b *= 1.15;
        const gray = 0.299 * r + 0.587 * g + 0.114 * b;
        r = gray + (r - gray) * 0.9; g = gray + (g - gray) * 0.9; b = gray + (b - gray) * 0.9;
        r = ((r / 255 - 0.5) * 1.25 + 0.5) * 255;
        g = ((g / 255 - 0.5) * 1.25 + 0.5) * 255;
        b = ((b / 255 - 0.5) * 1.25 + 0.5) * 255;
        r = r * 0.8 + ((r * 125) / 255) * 0.2;
        g = g * 0.8 + ((g * 105) / 255) * 0.2;
        b = b * 0.8 + ((b * 24)  / 255) * 0.2;
        data[i]     = Math.min(255, Math.max(0, r));
        data[i + 1] = Math.min(255, Math.max(0, g));
        data[i + 2] = Math.min(255, Math.max(0, b));
      }
      break;
    }

    case "sutro": {
      // sepia(.4) contrast(1.2) brightness(.9) saturate(1.4) + vignette
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const maxDist = Math.sqrt(centerX * centerX + centerY * centerY);
      for (let py = 0; py < canvas.height; py++) {
        for (let px = 0; px < canvas.width; px++) {
          const i = (py * canvas.width + px) * 4;
          let r = data[i], g = data[i + 1], b = data[i + 2];
          const sr = r * 0.393 + g * 0.769 + b * 0.189;
          const sg = r * 0.349 + g * 0.686 + b * 0.168;
          const sb = r * 0.272 + g * 0.534 + b * 0.131;
          r = r * 0.6 + sr * 0.4; g = g * 0.6 + sg * 0.4; b = b * 0.6 + sb * 0.4;
          r *= 0.9; g *= 0.9; b *= 0.9;
          const gray = 0.299 * r + 0.587 * g + 0.114 * b;
          r = gray + (r - gray) * 1.4; g = gray + (g - gray) * 1.4; b = gray + (b - gray) * 1.4;
          r = ((r / 255 - 0.5) * 1.2 + 0.5) * 255;
          g = ((g / 255 - 0.5) * 1.2 + 0.5) * 255;
          b = ((b / 255 - 0.5) * 1.2 + 0.5) * 255;
          const dx = px - centerX, dy = py - centerY;
          const distRatio = Math.sqrt(dx * dx + dy * dy) / maxDist;
          if (distRatio > 0.5) {
            const vignette = 1 - Math.min(1, ((distRatio - 0.5) / 0.4) * 0.5);
            r *= vignette; g *= vignette; b *= vignette;
          }
          data[i]     = Math.min(255, Math.max(0, r));
          data[i + 1] = Math.min(255, Math.max(0, g));
          data[i + 2] = Math.min(255, Math.max(0, b));
        }
      }
      break;
    }

    default:
      console.warn(`[filters] Unknown filter type: "${filterType}"`);
      break;
  }

  ctx.putImageData(imageData, 0, 0);
}

/**
 * Loads an image, applies a filter to it on an off-DOM canvas, and resolves
 * with the resulting data URL.
 * @param {string} src
 * @param {string} filterType
 * @returns {Promise<string>} data URL
 */
export function loadAndFilterImage(src, filterType) {
  return new Promise((resolve) => {
    const img = new window.Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width  = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);
      if (filterType !== "none") {
        applyCSSFilterToCanvas(ctx, canvas, filterType);
      }
      resolve(canvas.toDataURL());
    };
    img.onerror = () => resolve(src); // fallback: return original
    img.src = src;
  });
}
