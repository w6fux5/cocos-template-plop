import { _decorator, Component, Button } from "cc";

export class UIControllers extends Component {
  protected View: any = {}; // 所有 view 節點的 map

  private loadAllNodeInView(root: any, path: string) {
    for (let i = 0; i < root.children.length; i++) {
      const currentPath = `${path}${root.children[i].name}`;

      this.View[currentPath] = root.children[i];

      this.loadAllNodeInView(
        root.children[i],
        `${path}${root.children[i].name}`
      );
    }
  }

  onLoad(): void {
    // loop 所有的 children，將所有的 path/node 對象 map 到 this.view
    this.loadAllNodeInView(this.node, "");
  }

  public AddButtonListener(viewName: string, caller: any, func: any) {
    const viewNode = this.View[viewName];
    if (!viewNode) return;

    const btn = viewNode.getComponent(Button);
    if (!btn) return;

    viewNode.on("click", func, caller);
  }
}
