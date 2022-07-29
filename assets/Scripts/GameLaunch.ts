import { _decorator, Component } from "cc";

import {
  EventManager,
  NetManager,
  ResourceManager,
  SoundManager,
  TimerManager,
  UIManager,
} from "./Framework/Manager";

import { GameApp } from "./Game";
const { ccclass, property } = _decorator;

@ccclass("GameLaunch")
export class GameLaunch extends Component {
  @property
  private isNetMode: boolean = false;

  @property
  private wsUrl: string = "ws://127.0.0.1:9876?token='mike";

  onLoad(): void {
    console.log("Game Launching......");
    // 初始化框架邏輯： 資源管理，聲音管理，網路管理
    this.node.addComponent(ResourceManager);
    this.node.addComponent(SoundManager);
    this.node.addComponent(TimerManager);
    this.node.addComponent(UIManager);
    this.node.addComponent(EventManager);

    if (this.isNetMode) {
      this.node.addComponent(NetManager);
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
