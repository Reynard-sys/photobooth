// Filter calculation. Used AI to get filter calculation (╥﹏╥)
// Shared between download/page.js and edit/page.js

/**
 * Applies a CSS-filter equivalent directly to canvas pixel data.
 * @param {CanvasRenderingContext2D} ctx
 * @param {HTMLCanvasElement} canvas
 * @param {string} filterType - "inkwell" | "aden" | "perpetua" | "crema" | "sutro"
 */
export function applyCSSFilterToCanvas(ctx, canvas, filterType) {
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;

  switch (filterType) {
    case "inkwell":
      // brightness(1.25) contrast(.85) grayscale(1)
      for (let i = 0; i < data.length; i += 4) {
        const gray = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
        const cf = 0.85;
        let r = ((gray * 1.25) / 255 - 0.5) * cf + 0.5;
        let g = r, b = r;
        data[i]     = Math.min(255, Math.max(0, r * 255));
        data[i + 1] = Math.min(255, Math.max(0, g * 255));
        data[i + 2] = Math.min(255, Math.max(0, b * 255));
      }
      break;

    case "aden":
      // sepia(.2) brightness(1.15) saturate(1.4) + overlay
      for (let i = 0; i < data.length; i += 4) {
        let r = data[i], g = data[i + 1], b = data[i + 2];
        const sr = r * 0.393 + g * 0.769 + b * 0.189;
        const sg = r * 0.349 + g * 0.686 + b * 0.168;
        const sb = r * 0.272 + g * 0.534 + b * 0.131;
        r = (r * 0.8 + sr * 0.2) * 1.15;
        g = (g * 0.8 + sg * 0.2) * 1.15;
        b = (b * 0.8 + sb * 0.2) * 1.15;
        const gray = 0.299 * r + 0.587 * g + 0.114 * b;
        r = gray + (r - gray) * 1.4;
        g = gray + (g - gray) * 1.4;
        b = gray + (b - gray) * 1.4;
        r = r * 0.9 + ((r * 125) / 255) * 0.1;
        g = g * 0.9 + ((g * 105) / 255) * 0.1;
        b = b * 0.9 + ((b *  24) / 255) * 0.1;
        data[i]     = Math.min(255, Math.max(0, r));
        data[i + 1] = Math.min(255, Math.max(0, g));
        data[i + 2] = Math.min(255, Math.max(0, b));
      }
      break;

    case "perpetua":
      // contrast(1.1) brightness(1.25) saturate(1.1) + gradient overlay
      for (let i = 0; i < data.length; i += 4) {
        let r = data[i] * 1.25, g = data[i + 1] * 1.25, b = data[i + 2] * 1.25;
        const gray = 0.299 * r + 0.587 * g + 0.114 * b;
        r = gray + (r - gray) * 1.1;
        g = gray + (g - gray) * 1.1;
        b = gray + (b - gray) * 1.1;
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

    case "crema":
      // sepia(.5) contrast(1.25) brightness(1.15) saturate(.9) + overlay
      for (let i = 0; i < data.length; i += 4) {
        let r = data[i], g = data[i + 1], b = data[i + 2];
        const sr = r * 0.393 + g * 0.769 + b * 0.189;
        const sg = r * 0.349 + g * 0.686 + b * 0.168;
        const sb = r * 0.272 + g * 0.534 + b * 0.131;
        r = (r * 0.5 + sr * 0.5) * 1.15;
        g = (g * 0.5 + sg * 0.5) * 1.15;
        b = (b * 0.5 + sb * 0.5) * 1.15;
        const gray = 0.299 * r + 0.587 * g + 0.114 * b;
        r = ((gray + (r - gray) * 0.9) / 255 - 0.5) * 1.25 + 0.5;
        g = ((gray + (g - gray) * 0.9) / 255 - 0.5) * 1.25 + 0.5;
        b = ((gray + (b - gray) * 0.9) / 255 - 0.5) * 1.25 + 0.5;
        r = (r * 255) * 0.8 + ((r * 255 * 125) / 255) * 0.2;
        g = (g * 255) * 0.8 + ((g * 255 * 105) / 255) * 0.2;
        b = (b * 255) * 0.8 + ((b * 255 *  24) / 255) * 0.2;
        data[i]     = Math.min(255, Math.max(0, r));
        data[i + 1] = Math.min(255, Math.max(0, g));
        data[i + 2] = Math.min(255, Math.max(0, b));
      }
      break;

    case "sutro": {
      // sepia(.4) contrast(1.2) brightness(.9) saturate(1.4) + vignette
      const cx = canvas.width / 2;
      const cy = canvas.height / 2;
      const maxD = Math.sqrt(cx * cx + cy * cy);
      for (let py = 0; py < canvas.height; py++) {
        for (let px = 0; px < canvas.width; px++) {
          const i = (py * canvas.width + px) * 4;
          let r = data[i], g = data[i + 1], b = data[i + 2];
          const sr = r * 0.393 + g * 0.769 + b * 0.189;
          const sg = r * 0.349 + g * 0.686 + b * 0.168;
          const sb = r * 0.272 + g * 0.534 + b * 0.131;
          r = (r * 0.6 + sr * 0.4) * 0.9;
          g = (g * 0.6 + sg * 0.4) * 0.9;
          b = (b * 0.6 + sb * 0.4) * 0.9;
          const gray = 0.299 * r + 0.587 * g + 0.114 * b;
          r = ((gray + (r - gray) * 1.4) / 255 - 0.5) * 1.2 + 0.5;
          g = ((gray + (g - gray) * 1.4) / 255 - 0.5) * 1.2 + 0.5;
          b = ((gray + (b - gray) * 1.4) / 255 - 0.5) * 1.2 + 0.5;
          r *= 255; g *= 255; b *= 255;
          const dr = px - cx, dy2 = py - cy;
          const dr2 = Math.sqrt(dr * dr + dy2 * dy2) / maxD;
          if (dr2 > 0.5) {
            const v = 1 - Math.min(1, ((dr2 - 0.5) / 0.4) * 0.5);
            r = Math.min(r, r * v);
            g = Math.min(g, g * v);
            b = Math.min(b, b * v);
          }
          data[i]     = Math.min(255, Math.max(0, r));
          data[i + 1] = Math.min(255, Math.max(0, g));
          data[i + 2] = Math.min(255, Math.max(0, b));
        }
      }
      break;
    }
  }
  ctx.putImageData(imageData, 0, 0);
}

/**
 * Loads an image from a URL, optionally applies a filter, and returns a data URL.
 * @param {string} src
 * @param {string} filterType
 * @returns {Promise<string>}
 */
export function loadAndFilterImage(src, filterType) {
  return new Promise((resolve) => {
    const img = new window.Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);
      if (filterType !== "none") {
        applyCSSFilterToCanvas(ctx, canvas, filterType);
      }
      resolve(canvas.toDataURL());
    };
    img.src = src;
  });
}
