/**
 * 【住所から地図を表示するコンソールアプリ】
 * $ npx tsx place2map.ts 東京タワー
 * ・引数：<地名、住所>　<ズームレベル:デフォルト(15)>
 * ・パラメータで渡された「地名」をwww.geocoding.jpのAPIで緯度経度に変換
 * ・国土地理院の地図(地理院タイル)を取得
 * ・ターミナルに画像表示するためSixel Graphicsに変換
 * ※要Sixel対応ターミナル(mintty, Git Bash)
 */

import xml2js from 'xml2js';
import { calcTileInfo, tileUrl } from './lib/calc-map-tile';
import { imgToSixel } from './lib/img2sixel';

let z = 15; // デフォルトの
let dataType = 'std';

/**
 * 地名から経度、緯度に変換(www.geocoding.jpのAPIを利用)
 * @param place
 * @returns
 */
async function placeToCoord(place: string) {
  const url = `https://www.geocoding.jp/api/?q=${place}`;
  try {
    const response = await fetch(url);
    const xmlText = await response.text();
    const json = await xml2js.parseStringPromise(xmlText);

    const coord = json.result.coordinate[0];

    return [coord.lat[0], coord.lng[0]];
  } catch (error) {
    throw error;
  }
}

/**
 * 地名から地図を表示する
 * @returns
 */
async function main() {
  if (process.argv.length < 3) {
    return;
  }

  const place = process.argv[2];
  if (process.argv.length == 4) {
    z = parseInt(process.argv[3]);
  }

  const latlng = await placeToCoord(place);
  // タイルの位置を取得
  // @ts-ignore
  const { x, y, pX, pY } = calcTileInfo(...latlng, z);
  const url = tileUrl(x, y, z, dataType);
  console.log(`緯度:${latlng[0]} 経度:${latlng[1]} zoom:${z}`);
  console.log(url);
  console.log(await imgToSixel(url));
}

main();
