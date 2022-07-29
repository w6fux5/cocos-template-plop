/**
 // 參數
    const repeat = 5;
    const duration = 2;
    const delay = 10;
    const params = { name: "mike" };

 //10 秒後執行一次 function
    TimerManager.Instance.Once(() => {
      console.log("timer up");
    }, delay);

//repeat 5 次， 第一次 10 秒後執行，第二次開始每 2 秒執行一次
    TimerManager.Instance.Schedule(
      () => {
        console.log("timer up");
      },
      repeat,
      duration,
      delay
    );

//帶有參數的 timer
    TimerManager.Instance.ScheduleWithParams(
      (data: any) => {
        console.log(data);
      },
      params,
      repeat,
      duration,
      delay
    );

//第一次 2 秒後觸發，之後每兩秒觸發一次，無限循環，10秒後取消
    const timerID = TimerManager.Instance.Schedule(
      () => {
        console.log("timer!!");
      },-1, duration, 2);

    TimerManager.Instance.Once(() => {
      TimerManager.Instance.Unschedule(timerID);
      console.log("cancel");
    }, 10);
 */

import { _decorator, Component } from "cc";

class TimerNode {
  public callback: Function = null as unknown as Function;
  public duration: number = 0; // 兩個 timer 之間觸發的時間差
  public delay: number = 0; // 第一次觸發的延遲時間
  public repeat: number = 0; // timer 觸發的次數
  public passedTime: number = 0; // 當前 timer 執行了多久
  public param: any = null; // 使用 timer 傳遞的參數
  public isRemoved: boolean = false; // 是否已經移除
  public timerID: number = 0; // timer id，唯一的標識符號
}

export class TimerManager extends Component {
  public static Instance: TimerManager = null as unknown as TimerManager;

  private autoIncID: number = 0;
  private timers: any = {}; //  timer map
  private removeTimers: Array<TimerNode> = [];
  private newAddTimers: Array<TimerNode> = [];

  onLoad(): void {
    if (TimerManager.Instance === null) {
      TimerManager.Instance = this;
    } else {
      this.destroy();
      return;
    }
  }

  update(dt: number): void {
    // 新增 timer
    this.addTimer();

    // 執行 timer
    this.runTimer(dt);

    // 清理 timer
    this.clearTimer();
  }

  private addTimer(): void {
    // 把新加進來的 timer 放到 map
    for (let i = 0; i < this.newAddTimers.length; i++) {
      this.timers[this.newAddTimers[i].timerID] = this.newAddTimers[i];
    }
    this.newAddTimers.length = 0; // 清空 array
  }

  private runTimer(dt: number): void {
    for (let key in this.timers) {
      const timer = this.timers[key];

      if (timer.isRemoved) {
        this.removeTimers.push(timer);
        continue;
      }

      timer.passedTime += dt; // 更新 timer 時間

      // 觸發 timer
      if (timer.passedTime >= timer.delay + timer.duration) {
        timer.callback(timer.param);
        timer.repeat--;
        timer.passedTime -= timer.delay + timer.duration; // 過去時間扣掉觸發時間
        timer.delay = 0; // 第一次觸發後 delay 改為 0

        // 執行結束
        if (timer.repeat === 0) {
          timer.isRemoved = true;
          this.removeTimers.push(timer);
        }
      }
    }
  }

  private clearTimer(): void {
    for (let i = 0; i < this.removeTimers.length; i++) {
      delete this.timers[this.removeTimers[i].timerID];
    }
    this.removeTimers.length = 0;
  }

  // [repeat < 0 or repeat == 0 無限觸發]
  public ScheduleWithParams(
    func: Function,
    param: any,
    repeat: number,
    duration: number,
    delay: number = 0
  ): number {
    const timer: TimerNode = new TimerNode();

    timer.callback = func;
    timer.param = param;
    timer.repeat = repeat;
    timer.duration = duration;
    timer.delay = delay;
    timer.passedTime = timer.duration;
    timer.isRemoved = false;

    timer.timerID = this.autoIncID;
    this.autoIncID++;

    this.newAddTimers.push(timer);

    return timer.timerID;
  }

  // [repeat < 0 or repeat == 0 無限觸發]
  public Schedule(
    func: Function,
    repeat: number,
    duration: number,
    delay: number = 0
  ): number {
    return this.ScheduleWithParams(func, null, repeat, duration, delay);
  }

  // 執行一次不帶參數
  public Once(func: Function, delay: number): number {
    return this.Schedule(func, 1, 0, delay);
  }

  // 執行一次帶參數
  public ScheduleOnce(func: Function, param: any, delay: number): number {
    return this.ScheduleWithParams(func, param, 1, 0, delay);
  }

  // 清除 timer
  public Unschedule(timerID: number) {
    if (!this.timers[timerID]) return;

    let timer: TimerNode = this.timers[timerID];
    timer.isRemoved = true;
  }
}
