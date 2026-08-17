/**
 * Crop a tall full-page screenshot into readable slices.
 *   node scripts/crop.mjs <in.png> <outPrefix> [sliceHeight]
 */
import sharp from "sharp";

const [, , input, prefix = "slice", hArg = "1100"] = process.argv;
const H = Number(hArg);

const img = sharp(input);
const { width, height } = await img.metadata();
const n = Math.ceil(height / H);

for (let i = 0; i < n; i++) {
  const top = i * H;
  const h = Math.min(H, height - top);
  await sharp(input)
    .extract({ left: 0, top, width, height: h })
    .png()
    .toFile(`${prefix}-${String(i).padStart(2, "0")}.png`);
}
console.log(`${n} slices of ${width}x${H} from ${width}x${height}`);
