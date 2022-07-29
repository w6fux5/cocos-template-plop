import { Label, _decorator } from "cc";
import { UIControllers } from "../../Framework/Manager/UI/UIControllers";
const { ccclass } = _decorator;

@ccclass("LoginUI_Ctrl")
export class LoginUI_Ctrl extends UIControllers {
  private version: Label | null = null;

  onLoad(): void {
    super.onLoad();
    this.AddButtonListener("StartBtn", this, this.onGameStartClick);

    this.version = this.View["Version"].getComponent(Label);
    this.version.string = "3.1.2";
    console.log(this.View);

  }

  private onGameStartClick(): void {
    console.log("click!");
  }
}
