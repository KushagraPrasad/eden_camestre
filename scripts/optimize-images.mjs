import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const sourceDir = path.resolve("assets/img");
const outputDir = path.resolve("assets/webp");

const images = [
  { input: "cropped-Picsart_26-04-01_16-49-28-592-1.png", output: "eden-icon.webp", width: 512, quality: 86 },
  { input: "Picsart_26-04-26_00-01-21-125.png", output: "eden-logo.webp", width: 900, quality: 88 },
  { input: "DJI_20260418163136_0897_D-scaled-e1777362790960.jpg", output: "aerial-view.webp", width: 1800, quality: 82 },
  { input: "Gemini_Generated_Image_svqj1ksvqj1ksvqj-e1777355820450-1024x1014.png", output: "location-map.webp", width: 1000, quality: 82 },
  { input: "Picsart_26-04-25_22-37-10-693.jpg-1.jpeg", output: "lots-render.webp", width: 1400, quality: 82 },
  { input: "edenS-Model_page-0001-edited-1.jpg", output: "lotification-plan.webp", width: 1200, quality: 86 },
  { input: "Gemini_Generated_Image_rdq2uzrdq2uzrdq2-scaled-e1777343661385.png", output: "amenities-hero.webp", width: 1800, quality: 78 },
  { input: "Gemini_Generated_Image_siwhyvsiwhyvsiwh-scaled-e1777347394308-1024x605.png", output: "green-areas.webp", width: 1100, quality: 82 },
  { input: "Gemini_Generated_Image_wj879lwj879lwj87-e1777348346353-1024x609.png", output: "running-track.webp", width: 1100, quality: 82 },
  { input: "Gemini_Generated_Image_n6edrtn6edrtn6ed-scaled-e1777348979214-1024x607.png", output: "park.webp", width: 1100, quality: 82 },
  { input: "Gemini_Generated_Image_fqkjbwfqkjbwfqkj-scaled-e1777349557994-1024x613.png", output: "controlled-access.webp", width: 1100, quality: 82 }
];

await fs.mkdir(outputDir, { recursive: true });

for (const image of images) {
  const input = path.join(sourceDir, image.input);
  const output = path.join(outputDir, image.output);

  await sharp(input)
    .rotate()
    .resize({ width: image.width, withoutEnlargement: true })
    .webp({ quality: image.quality, effort: 6 })
    .toFile(output);

  const before = (await fs.stat(input)).size;
  const after = (await fs.stat(output)).size;
  const saved = Math.round((1 - after / before) * 100);
  console.log(`${image.output}: ${Math.round(before / 1024)}KB -> ${Math.round(after / 1024)}KB (${saved}% saved)`);
}
