import { _decorator, Component, TextAsset } from "cc";

import {
  EventManager,
  NetManager,
  ResourceManager,
  SoundManager,
  TimerManager,
  UIManager,
  ProtoManager,
} from "./Framework/Manager";

import { GameApp } from "./Game";
const { ccclass, property } = _decorator;

@ccclass("GameLaunch")
export class GameLaunch extends Component {
  public static Instance: GameLaunch | null = null;

  @property
  public NetMode: boolean = true;

  @property
  private wsUrl: string = "ws://127.0.0.1:9876?token='ccccc";

  @property(TextAsset)
  private pbTexAsset: TextAsset | null = null; // 協議描述對象

  onLoad(): void {
    if (GameLaunch.Instance) {
      this.destroy();
      return;
    }

    GameLaunch.Instance = this;

    console.log("Game Launching......");

    // 初始化框架邏輯： 資源管理，聲音管理，網路管理
    this.node.addComponent(ResourceManager);
    this.node.addComponent(SoundManager);
    this.node.addComponent(TimerManager);
    this.node.addComponent(UIManager);
    this.node.addComponent(EventManager);

    // 是否使用網路模塊
    if (this.NetMode) {
      this.node.addComponent(ProtoManager).Init(this.pbTexAsset);
      this.node.addComponent(NetManager).Init(this.wsUrl);
    }

    this.node.addComponent(GameApp);
    // end

    // 檢查更新
    // end

    // 進入遊戲
    GameApp.Instance.EnterGame();
    // end
  }
}
