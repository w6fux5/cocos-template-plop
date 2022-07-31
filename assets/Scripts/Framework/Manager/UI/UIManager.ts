import { _decorator, Component, Node, find, instantiate, Prefab } from "cc";
import { ResourceManager } from "../ResourceManager";

export class UIManager extends Component {
  public static Instance: UIManager | null = null;

  private canvas: Node | null = null;

  private uiMap: any = {};

  onLoad(): void {
    if (UIManager.Instance) {
      this.destroy();
      return;
    }

    UIManager.Instance = this;

    // 掛載 ui 的 canvas
    this.canvas = find("Canvas");
  }

  // 顯示 landing ui
  public showUIPrefab(preFab: Prefab, parent?: Node): void {
    // Init view by prefab
    const uiView: Node = instantiate(preFab) as Node;
    parent = parent || this.canvas;
    parent.addChild(uiView);

    // 在節點掛載 ui controllers
    uiView.addComponent(`${preFab.data.name}_Ctrl`);
    this.uiMap[preFab.data.name] = uiView;
  }

  // 顯示 ui
  public ShowUIView(viewName: string, parent?: Node): void {
    // Get Prefab
    const uiPrefab = ResourceManager.Instance.getAsset(
      "GUI",
      `UIPrefabs/${viewName}`
    );

    if (!uiPrefab) {
      console.log("can not find ui prefab");
      return;
    }

    // Init view by prefab
    const uiView: Node = instantiate(uiPrefab) as Node;
    parent = parent || this.canvas;
    parent.addChild(uiView);
    this.uiMap[viewName] = uiView;

    // 在節點掛載 ui controllers
    uiView.addComponent(`${viewName}_Ctrl`);
  }

  public RemoveUI(uiName: string) {
    if (this.uiMap[uiName]) {
      this.uiMap[uiName].destroy();
      this.uiMap[uiName] = null;
    }
  }

  public ClearAll() {
    for (var key in this.uiMap) {
      if (this.uiMap[key]) {
        this.uiMap[key].destroy();
        this.uiMap[key] = null;
      }
    }
  }
}
