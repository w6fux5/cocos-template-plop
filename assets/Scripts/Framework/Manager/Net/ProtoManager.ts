import { _decorator, Component, TextAsset } from "cc";

export class ProtoManager extends Component {
  public static Instance: ProtoManager | null = null;

    
  private pbTexAsset: TextAsset | null = null;


  onLoad(): void {
    if (ProtoManager.Instance) {
      this.destroy();
      return;
    }

    ProtoManager.Instance = this;
  }


}
