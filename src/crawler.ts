import superagent from 'superagent';
import * as cheerio from 'cheerio';
import fs from 'fs';
import path from 'path';
import {
  IObjJSON,
  ICartonInfo,
  ICartonInfoResult,
} from './types'

class Crawler {
  private webUrl = 'http://www.yinghuajinju.com/top/';

  constructor() {
    this.initSpiderProcess();
  }

  async initSpiderProcess() {
    const html = await this.getRawHtml();
    const info = this.getJSONInfo(html);
    this.writeJSONContent(info);
  }

  async getRawHtml() {
    const res = await superagent.get(this.webUrl);
    return res?.text;
  }

  getJSONInfo(html: string) {
    const $ = cheerio.load(html);
    const info: ICartonInfo[] = [];

    const ctx = String($('.topli>ul').html());
    const regex = /<a\s+href="([^"]+)"\s+target="_blank">([^<]+)<\/a>/g;
    let match;
    while ((match = regex.exec(ctx)) !== null) {
      const url = 'http://www.yinghuajinju.com' + match[1];
      const name = match[2];
      info.push({
        name,
        url,
      });
    }

    const result = {
      time: new Date().getTime(),
      data: info,
    };
    return result;
  }

  writeJSONContent(info: ICartonInfoResult) {
    const filePath = path.resolve(__dirname, '../data/carton-top.json');
    let fileContent: IObjJSON = {};
    if (fs.existsSync(filePath)) {
      fileContent = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    }
    fileContent[info.time] = info.data;
    fs.writeFileSync(filePath, JSON.stringify(fileContent));
  }
}

new Crawler();
