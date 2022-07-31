import { Label, _decorator } from "cc";
import { UIControllers } from "../../Framework/Manager/UI/UIControllers";
import { AuthProxy } from "../ServerProxy";
const { ccclass } = _decorator;

@ccclass("TestUI_Ctrl")
export class TestUI_Ctrl extends UIControllers {
  private version: Label | null = null;

  onLoad(): void {
    super.onLoad();
    this.AddButtonListener("StartBtn", this, this.onGameStartClick);

    this.version = this.View["Version"].getComponent(Label);
    this.version.string = "3.1.2";
  }

  private onGameStartClick(): void {
    console.log("click!");
    // AuthProxy.Instance.UserNameLogin({ userName: "Mike!!", password: "1234!!" });
  }
}
