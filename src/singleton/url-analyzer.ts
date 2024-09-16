import * as cheerio from 'cheerio';
import fs from 'fs';
import {
  IObjJSON,
  ICartonInfo,
  ICartonInfoResult,
  IAnalyzer,
} from '../types'

export default class UrlAnalyzer implements IAnalyzer {

  static instance: UrlAnalyzer;

  static getInstance() {
    if (!this.instance) {
      this.instance = new UrlAnalyzer();
    }
    return this.instance;
  }

  private getJSONInfo(html: string) {
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

  private getJSONContent(info: ICartonInfoResult, filePath: string) {
    let fileContent: IObjJSON = {};
    if (fs.existsSync(filePath)) {
      fileContent = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    }
    fileContent[info.time] = info.data;
    return fileContent;
  }

  public analyze(html: string, filePath: string) {
    const info = this.getJSONInfo(html);
    const fileContent = this.getJSONContent(info, filePath);
    return JSON.stringify(fileContent);
  }
}