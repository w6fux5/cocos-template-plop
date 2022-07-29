import { _decorator, Component, Node, find, instantiate } from "cc";
import { ResourceManager } from "../ResourceManager";

export class UIManager extends Component {
  public static Instance: UIManager | null = null;

  private canvas: Node | null = null;

  onLoad(): void {
      
    if (UIManager.Instance) {
      this.destroy();
      return;
    }

    UIManager.Instance = this;

    // 掛載 ui 的 canvas
    this.canvas = find("Canvas");
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

    // 在節點掛載 ui controllers
    uiView.addComponent(`${viewName}_Ctrl`);
  }
}
