/*
【 DESC 】:
ab 包對象沒有釋放，有需要可以考慮;
釋放 ab 包對象不會釋放資源;

預加載:  preloadResPkg/releaseResPkg, 常駐記憶體
遊戲中較大的資源,preloadAsset/releaseAsset 單個操作
獲取資源: getAsset(); 


【 格式 】:
let resPkg = {
  Ab包名字: [
    { typeAsset: "資源類型", urls: [] },
    { typeAsset: "資源類型", urls: [] },
  ],

  Ab包名字1: "資源類型", //整個包一起加載，只能一種資源類型
};

*/

import { _decorator, Component, assetManager, AssetManager, Asset } from "cc";

export class ResourceManager extends Component {
  public static Instance: ResourceManager = null as unknown as ResourceManager;

  private totalAb: number = 0; // 須加載的 ab 數量
  private nowAb: number = 0; // 已經加載完的 ab 包數量

  private now: number = 0;
  private total: number = 0;

  onLoad(): void {
    if (ResourceManager.Instance === null) {
      ResourceManager.Instance = this;
    } else {
      this.destroy();
      return;
    }
  }

  //=================//
  //       加載      //
  //================//
  //加載 ab 包
  public preloadResPkg(
    resPkg: any, // 資源列表
    progress: Function, // 進度回調
    endFunc: Function // 結束回調
  ): void {
    this.totalAb = 0; // 總共有多少 ab 包
    this.nowAb = 0; // 下載了多少 ab 包

    this.total = 0; // 時
    this.now = 0;

    // 計算有多少資源包需要加載
    for (let key in resPkg) {
      this.totalAb++;

      // 計算 Array 類型的 ab 包，有多少 url 就代表需要加載幾個資源ㄋ
      if (resPkg[key] instanceof Array) {
        for (let i = 0; i < resPkg[key].length; i++) {
          this.total += resPkg[key][i].urls.length;
        }
      }
    }

    // 加载ab包， key 是 ab 包的名字
    for (let key in resPkg) {
      assetManager.loadBundle(key, (err, bundle: AssetManager.Bundle) => {
        if (err) {
          console.log("load bundle error: ", err);
          return;
        }

        this.nowAb++; // 已經加載好的 ab 包數量

        // 整包加載的類型，將路徑全部取出，計算數量
        if (!(resPkg[key] instanceof Array)) {
          let infos = bundle.getDirWithPath("/");
          this.total += infos.length;
        }

        // ab包加载完毕
        if (this.nowAb >= this.totalAb) {
          this.preloadAssetsInAssetsBundles(resPkg, progress, endFunc);
        }
      });
    }
    // end
  }

  // 計算 ab 裡面的資源
  private preloadAssetsInAssetsBundles(
    resPkg: any,
    progress: Function,
    endFunc: Function
  ): void {
    for (let key in resPkg) {
      // 獲取 ab 包對象
      let abBundle: AssetManager.Bundle = assetManager.getBundle(
        key
      ) as AssetManager.Bundle;

      if (!abBundle) {
        continue;
      }

      // Array 類型 ab 包
      if (resPkg[key] instanceof Array) {
        for (let i = 0; i < resPkg[key].length; i++) {
          // let info: any = abBundle.getDirWithPath("/");
          // console.log(info);

          // 加載路徑
          this.loadAssetsInUrls(
            abBundle,
            resPkg[key][i].typeAsset,
            resPkg[key][i].urls,
            progress,
            endFunc
          );
        }
      } else {
        // 整包類型的 ab 包作轉換
        let typeAsset = resPkg[key];
        let infos = abBundle.getDirWithPath("/");
        let urls: any = [];

        for (let i = 0; i < infos.length; i++) {
          urls.push(infos[i].path);
        }

        this.loadAssetsInUrls(abBundle, typeAsset, urls, progress, endFunc);
      }
    }
  }

  private loadAssetsInUrls(
    abBundle: AssetManager.Bundle,
    typeAsset: any,
    urls: Array<string>,
    progress: Function,
    endFunc: Function
  ): void {
    for (let i = 0; i < urls.length; i++) {
      this.loadAndRef(abBundle, urls[i], typeAsset, progress, endFunc);
    }
  }

  // 加載資源
  private loadAndRef(
    abBundle: AssetManager.Bundle,
    url: string,
    typeAsset: any,
    progress: Function,
    endFunc: Function
  ): void {
    abBundle.load(url, typeAsset, (err: any, asset: Asset) => {
      if (err) {
        console.log("load assets error: ", err);
        return;
      }

      console.log("load asset success：", url);
      asset.addRef(); // 增加引用計數，表示資源已經在用;

      this.now++;

      // 更新進度
      if (progress) {
        progress(this.now, this.total);
      }

      // 加載結束
      if (this.now >= this.total) {
        if (endFunc) {
          endFunc();
        }
      }
    });
  }

  //=================//
  //    釋放資源      //
  //================//

  // 獲取 ab 包
  public releaseResPkg(resPkg: any): void {
    // 判斷需要釋放的 ab 包
    for (let key in resPkg) {
      let abBundle: AssetManager.Bundle = assetManager.getBundle(
        key
      ) as AssetManager.Bundle;

      if (!abBundle) {
        continue;
      }

      // 手動指定的 Array 類型 ab 包
      if (resPkg[key] instanceof Array) {
        for (let i = 0; i < resPkg[key].length; i++) {
          this.releaseAssetsInUrls(
            abBundle,
            resPkg[key][i].typeAsset,
            resPkg[key][i].urls
          );
        }
      } else {
        // 整包的類型
        let typeAsset = resPkg[key];
        let infos = abBundle.getDirWithPath("/");
        let urls: any = [];
        for (let i = 0; i < infos.length; i++) {
          urls.push(infos[i].path);
        }
        this.releaseAssetsInUrls(abBundle, typeAsset, urls);
      }
    }
  }

  // 釋放資源
  private releaseAssetsInUrls(
    abBundle: AssetManager.Bundle,
    typeAsset: any,
    urls: Array<string>
  ): void {
    for (let i = 0; i < urls.length; i++) {
      // console.log(urls[i]);
      let asset: Asset = abBundle.get(urls[i]) as Asset;

      if (!asset) {
        continue;
      }

      // console.log(asset.refCount);
      asset.decRef(true); // 減少引用，true 表示自動釋放， ref 為 0 自動釋放
    }
  }

  // 依據 url 加載特定資源，不需使用引用計數，完全手動指定
  public preloadAsset(
    abName: string,
    url: string,
    typeClass: any,
    endFunc: Function
  ): void {
    // 加載 ab 包
    assetManager.loadBundle(abName, (err, abBundle: AssetManager.Bundle) => {
      if (err) {
        console.log(err);
        return;
      }

      // 加載資源
      abBundle.load(url, typeClass, (err, asset: Asset) => {
        if (err) {
          console.log(err);
          return;
        }

        // 加載結束
        if (endFunc) {
          endFunc();
        }
      });
    });
  }

  // 依據 url 釋放特定資源
  public releaseAsset(abName: string, url: string): void {
    // 獲取 ab 包
    const abBundle: AssetManager.Bundle = assetManager.getBundle(
      abName
    ) as AssetManager.Bundle;

    if (!abBundle) {
      return;
    }
    // 釋放資源
    abBundle.release(url);
  }

  // 同步接口，前面已經加載好了，資源不在返回空
  public getAsset(abName: string, url: string): any {
    const abBundle: AssetManager.Bundle = assetManager.getBundle(
      abName
    ) as AssetManager.Bundle;

    if (!abBundle) {
      return null;
    }

    return abBundle.get(url);
  }
}
