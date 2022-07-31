import { Component } from "cc";
import {
  EventManager,
  ProtoManager,
  NetManager,
} from "../../Framework/Manager";

import { Cmd } from "./Cmd";
import { ServiceType } from "./ServiceType";

export class NetEventDispatch extends Component {
  public static Instance: NetEventDispatch | null = null;

  onLoad(): void {
    console.log(Cmd);
    if (NetEventDispatch.Instance) {
      this.destroy();
      return;
    }

    NetEventDispatch.Instance = this;
  }

  public Init(): void {
    EventManager.Instance.AddEventListener(
      EventManager.Instance.EventType.NET_MESSAGE,
      this,
      this.onRecvMsg
    );
  }

  public sendMessage(serviceType: number, cmdType: number, message: any) {
    console.log(serviceType, cmdType, message);
    // step1: message => buf
    // enum Cmd --->  {0: "INVALID_CMD", INVALID_CMD: 0}
    const messageBuf = ProtoManager.Instance.SerializeMessage(
      Cmd[cmdType],
      message
    );
    // end

    // step2: 依照協議封裝二進制數據包
    const total_len = messageBuf.length + 2 + 2 + 4;
    const buf = new ArrayBuffer(total_len); // 記憶體

    // DataView => 在 buffer 裡面寫東西的工具
    const dataview = new DataView(buf);

    // [serverType(2個字節), cmdType(2個字節), 預留(4個字節), body Buf]
    dataview.setInt16(0, serviceType, true); // offset, serverType
    dataview.setInt16(2, cmdType, true); // offset = 2, cmdType;
    dataview.setInt32(4, 0, true); // offset = 4, 預留;
    // end

    const uint8Buf = new Uint8Array(buf); // 相同記憶體位置
    uint8Buf.set(messageBuf, 8);

    // step3: Websocket 發送
    NetManager.Instance.SendData(buf);
    // end
  }

  private onRecvMsg(eventName: string, data: ArrayBuffer): void {
    // Get serverType and cmdType;
    const dataView = new DataView(data);
    const serviceType = dataView.getInt16(0, true);
    const cmdType = dataView.getInt16(2, true);
    // end

    // Get serialize binary data
    const uint8Buf: Uint8Array = new Uint8Array(data);
    const msgBuf = uint8Buf.subarray(4 + 4); // 從第八個字節開始
    // end

    // DeserializeMsg and transform binary data to javascript obj
    const msgBody = ProtoManager.Instance.DeserializeMsg(Cmd[cmdType], msgBuf);
    // end

    EventManager.Instance.Emit(ServiceType[serviceType], {
      cmdType,
      body: msgBody,
    });
  }
}
