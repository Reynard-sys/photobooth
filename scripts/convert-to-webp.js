/**
 * scripts/convert-to-webp.js
 *
 * Batch-converts all PNG files in public/ (and public/strips/) to WebP.
 * Run once with: node scripts/convert-to-webp.js
 * Then verify the output and delete the original PNGs.
 */

const sharp  = require("sharp");
const fs     = require("fs");
const path   = require("path");

const QUALITY = 90;

/**
 * Recursively find all .png files under `dir`.
 * @param {string} dir
 * @returns {string[]}
 */
function findPngs(dir) {
  const results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...findPngs(full));
    } else if (entry.isFile() && entry.name.toLowerCase().endsWith(".png")) {
      results.push(full);
    }
  }
  return results;
}

async function main() {
  const publicDir = path.join(__dirname, "..", "public");
  const pngFiles  = findPngs(publicDir);

  console.log(`Found ${pngFiles.length} PNG files to convert.\n`);

  let converted = 0;
  let failed    = 0;

  for (const pngPath of pngFiles) {
    const webpPath = pngPath.replace(/\.png$/i, ".webp");
    try {
      await sharp(pngPath).webp({ quality: QUALITY }).toFile(webpPath);
      const pngSize  = fs.statSync(pngPath).size;
      const webpSize = fs.statSync(webpPath).size;
      const saving   = (((pngSize - webpSize) / pngSize) * 100).toFixed(1);
      console.log(`✓ ${path.relative(publicDir, pngPath)} → .webp  (saved ${saving}%)`);
      converted++;
    } catch (err) {
      console.error(`✗ Failed: ${pngPath}`, err.message);
      failed++;
    }
  }

  console.log(`\nDone. ${converted} converted, ${failed} failed.`);
  console.log("Review the .webp files then delete the original .png files.");
}

main().catch((err) => {
  console.error("Script error:", err);
  process.exit(1);
});
