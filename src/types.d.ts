export interface ICartonInfo {
  name: string;
  url: string;
}

export interface ICartonInfoResult {
  time: number;
  data: ICartonInfo[];
}

export interface IObjJSON {
  [propName: number]: ICartonInfo[];
}

export interface IAnalyzer {
  analyze: (html: string, filePath: string) => string;
}
