import { _decorator, Label, instantiate } from "cc";
import { UIControllers } from "../../Framework/Manager/UI/UIControllers";
import { EventManager } from "../../Framework/Manager/EventManager";
const { ccclass } = _decorator;

@ccclass("LoadingUI_Ctrl")
export class LoadingUI_Ctrl extends UIControllers {
  private progress: Label | null = null;

  onLoad(): void {
    super.onLoad();

    EventManager.Instance.AddEventListener(
      EventManager.Instance.EventType.LOADING_PROGRESS,
      this,
      this.onProgress
    );

    this.progress = this.View["Progress"].getComponent(Label);
    this.progress.string = "0%";
  }

  onDestroy(): void {
    EventManager.Instance.RemoveEventListener(
      EventManager.Instance.EventType.LOADING_PROGRESS,
      this,
      this.onProgress
    );
  }

  private onProgress(eventName: string, progress: string): void {
    this.progress.string = `${progress}%`;
  }
}
