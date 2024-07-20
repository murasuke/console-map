/**
 * image file to sixel converter
 * original
 * https://github.com/jerch/node-sixel/blob/master/img2sixel.js
 */

// set to 16 for xterm in VT340 mode
const MAX_PALETTE = 256;

// 0 - default action (background color)
// 1 - keep previous content
// 2 - set background color
const BACKGROUND_SELECT = 0;

import { loadImage, createCanvas } from 'canvas';
import { image2sixel } from 'sixel/lib/index';

/**
 *
 * @param filename URL or local filename
 * @param palLimit
 * @returns
 */
export async function imgToSixel(filename, palLimit = MAX_PALETTE) {
  // load image
  let img;
  try {
    img = await loadImage(filename);
  } catch (e) {
    console.error(`cannot load image "${filename}"`);
    return;
  }
  const canvas = createCanvas(img.width, img.height);
  const ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0);

  // use image2sixel with internal quantizer
  const data = ctx.getImageData(0, 0, img.width, img.height).data;
  return image2sixel(data, img.width, img.height, palLimit, BACKGROUND_SELECT);
}
