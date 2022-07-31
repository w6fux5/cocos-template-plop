import { _decorator, Component, AudioClip, Prefab } from "cc";

import { GameLaunch } from "../GameLaunch";

import {
  ResourceManager,
  EventManager,
  NetManager,
  SoundManager,
  TimerManager,
  UIManager,
  ProtoManager,
} from "../Framework/Manager";

import { AuthProxy, NetEventDispatch } from "./ServerProxy";

const resPkg = {
  // 手動指定加載
  GUI: [{ assetType: Prefab, urls: ["UIPrefabs/TestUI"] }],
  Sounds: [{ assetType: AudioClip, urls: ["CK_attack1", "Qinbing_die"] }],

  // 整包加載
  // "Sounds": AudioClip,
};

export class GameApp extends Component {
  public static Instance: GameApp = null as unknown as GameApp;

  onLoad(): void {
    if (GameApp.Instance) {
      this.destroy();
      return;
    }

    GameApp.Instance = this;

    if (GameLaunch.Instance.NetMode) {
      this.node.addComponent(NetEventDispatch).Init();
      AuthProxy.Instance.Init();
    }
  }

  // 遊戲邏輯入口
  public EnterGame(): void {
    console.log("Enter game...");

    UIManager.Instance.showUIPrefab(GameLaunch.Instance.Prefab);

    ResourceManager.Instance.preloadResPkg(
      resPkg,
      (now: any, total: any) => {
        // console.log(now, total);
        EventManager.Instance.Emit(
          EventManager.Instance.EventType.LOADING_PROGRESS,
          ((now / total) * 100).toFixed(0)
        );
      },
      () => {
        // this.EnterLoadingScene();
        this.testScene(); // for test
      }
    );
  }

  public EnterLoadingScene(): void {
    console.log("Loading scene...");
    // render 地圖
    // end

    // render 遊戲角色
    // end

    // render UI
    // end
  }

  private testScene(): void {
    console.log("Testing scene...");
    //==== NetEventDispatch 測試  ====//
    //=== end ====//

    //==== ProtoManager 測試  ====//
    // const buf = ProtoManager.Instance.SerializeMessage("UnameLoginReq", {
    //   userName: "Mie",
    //   password: "123",
    // });
    // console.log(buf);

    // const data = ProtoManager.Instance.DeserializeMsg("UnameLoginReq", buf);
    // console.log(data.userName);
    //=== end ====//

    //==== NetManager 測試  ====//
    // NetManager.Instance.ConnectToServer()
    //=== end ====//

    //==== EventManager 測試  ====//
    // const eventHandler = (eventName: string, data: any) => {
    //   console.log("Get Event");
    //   console.log(eventName);
    //   console.log(data);
    // };

    // EventManager.Instance.AddEventListener("test", this, eventHandler);

    // TimerManager.Instance.Schedule(
    //   () => {
    //     EventManager.Instance.Emit("test", { name: "mike" });
    //   }, 10, 1, 1);

    // TimerManager.Instance.Once(() => {
    //   EventManager.Instance.RemoveEventListener("test", this, eventHandler)
    // }, 3)
    //=== end ====//

    //==== UIManager 測試  ====//
    UIManager.Instance.ClearAll()
    UIManager.Instance.ShowUIView("TestUI");
    //=== end ====//

    //=== ResourceManager 測試 ====//
    // ResourceManager.Instance.releaseResPkg(resPkg);
    // this.scheduleOnce(() => {
    //   console.log(ResourceManager.Instance.getAsset("Sounds", "CK_attack1"));
    //   console.log(ResourceManager.Instance.getAsset("Sounds", "Qinbing_die"));
    // }, 3);
    //=== end ====//

    //==== 播放聲音測試 ====//
    // const as = this.node.addComponent(AudioSource);
    // as.clip = ResourceManager.Instance.getAsset("Sounds", "Qinbing_die");
    // as.play();
    // console.log(as.clip);
    //=== end ====//

    //==== SoundManager 測試 ====//
    // const clip = ResourceManager.Instance.getAsset("Sounds", "CK_attack1");
    // // SoundManager.Instance.playSound(clip);
    // SoundManager.Instance.playBgMusic(clip, true);
    // this.scheduleOnce(() => {
    //   SoundManager.Instance.setBgMusicMute(true);

    //   this.scheduleOnce(() => {
    //     SoundManager.Instance.setBgMusicMute(false);
    //   }, 3);
    // }, 3);
    //=== end ====//

    //==== Timer 測試 ====//
    // const repeat = 5;
    // const duration = 2;
    // const delay = 2;
    // const params = { name: "mike" };

    // // 10 秒後執行一次 function
    // TimerManager.Instance.Once(() => {
    //   console.log("timer up");
    // }, delay);

    // // repeat 5 次， 第一次 10 秒後執行，第二次開始每 2 秒執行一次
    // TimerManager.Instance.Schedule(
    //   () => {
    //     console.log("timer up");
    //   },
    //   repeat,
    //   duration,
    //   delay
    // );

    // 帶有參數的 timer
    // TimerManager.Instance.ScheduleWithParams(
    //   (data: any) => {
    //     console.log(data);
    //   },
    //   params,
    //   repeat,
    //   duration,
    //   delay
    // );

    // //第一次 2 秒後觸發，之後每兩秒觸發一次，無限循環，10秒後取消
    // const timerID = TimerManager.Instance.Schedule(
    //   () => {
    //     console.log("timer!!");
    //   },-1, duration, 2);

    // TimerManager.Instance.Once(() => {
    //   TimerManager.Instance.Unschedule(timerID);
    //   console.log("cancel");
    // }, 10);
    //=== end ====//
  }
}
