
import superagent from 'superagent';
import fs from 'fs';
import path from 'path';
import UrlAnalyzer from './url-analyzer';
import { IAnalyzer } from '../types'

class Crawler {

  constructor(private analyzer: IAnalyzer, private url: string, private filePath: string) {
    this.initSpiderProcess();
  }

  async initSpiderProcess() {
    const html = await this.getRawHtml();
    const content = this.analyzer.analyze(html, this.filePath);
    this.writeJSONContent(content);
  }

  async getRawHtml() {
    const res = await superagent.get(this.url);
    return res?.text;
  }

  writeJSONContent(content: string) {
    fs.writeFileSync(this.filePath, content);
  }
}

const cartonWebUrl = 'http://www.yinghuajinju.com/top/';
const cartonWebFilePath = path.resolve(__dirname, '../../data/carton-top.json');
new Crawler(new UrlAnalyzer(), cartonWebUrl, cartonWebFilePath);
