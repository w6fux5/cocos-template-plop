import { Component } from "cc";

export class EventManager extends Component {
  public static Instance: EventManager | null = null;

  private eventMap: object = {};

  public EventType = {
    NET_CONNECTING: "NET_CONNECTING",
    NET_DISCONNECTED: "NET_DISCONNECTED",
    NET_CONNECT_SUCCESS: "NET_CONNECT_SUCCESS",
    NET_MESSAGE: "NET_MESSAGE",

    LOADING_PROGRESS: "LOADING_PROGRESS",
  };

  onLoad(): void {
    if (EventManager.Instance) {
      this.destroy();
      return;
    }

    EventManager.Instance = this;
  }

  public AddEventListener(
    eventName: string,
    caller: any,
    callback: Function
  ): void {
    if (!this.eventMap[eventName]) {
      this.eventMap[eventName] = [];
    }

    this.eventMap[eventName].push({ caller, callback });
  }

  public RemoveEventListener(
    eventName: string,
    caller: any,
    callback: Function
  ): void {

    if (!this.eventMap[eventName]) return;


    for (let i = 0; i < this.eventMap[eventName].length; i++) {
      let obj = this.eventMap[eventName][i];
      if (obj.caller == caller && obj.callback == callback) {
        this.eventMap[eventName].splice(i, 1);
        break;
      }
    }

    if (this.eventMap[eventName].length <= 0) {
      this.eventMap[eventName] = null;
    }
  }

  public Emit(eventName: string, data: any) {
    if (!this.eventMap[eventName]) return;

    for (let i = 0; i < this.eventMap[eventName].length; i++) {
      let obj = this.eventMap[eventName][i];
      obj.callback.call(obj.caller, eventName, data);
    }
  }
}
