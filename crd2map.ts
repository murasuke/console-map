/**
 * 【経度緯度から地図を表示するコンソールアプリ】
 * $  npx tsx crd2map.ts 35.658581 139.745433
 * ・引数：<緯度> <経度>　<ズームレベル:デフォルト(15)>
 * ・パラメータで渡された「緯度,経度」をもとに、国土地理院の地図(地理院タイル)を取得
 * ・ターミナルに画像表示するためSixel Graphicsに変換
 * ※要Sixel対応ターミナル(mintty, Git Bash)
 */

import { calcTileInfo, tileUrl } from './lib/calc-map-tile';
import { imgToSixel } from './lib/img2sixel';

const lat = 35.36072;
const lng = 138.72743;
const z = 15;
let dataType = 'std';

async function main() {
  let latlng: number[] = [lat, lng, z];
  if (process.argv.slice(2).length >= 2) {
    latlng = process.argv.slice(2).map((value) => parseFloat(value));
    if (latlng.length === 2) {
      latlng.push(z);
    }
  }

  // タイルの位置を取得
  // @ts-ignore
  const { x, y, pX, pY } = calcTileInfo(...latlng);
  const url = tileUrl(x, y, latlng[2], dataType);
  console.log(`緯度:${latlng[0]} 経度:${latlng[1]} zoom:${latlng[2]}`);
  console.log(url);
  console.log(await imgToSixel(url));
}

main();
