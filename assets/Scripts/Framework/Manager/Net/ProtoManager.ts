import protobuf from "protobufjs";
import { Component, TextAsset } from "cc";

type MsgBody = {
  [propName: string]: any;
};

export class ProtoManager extends Component {
  public static Instance: ProtoManager | null = null;

  // 協議描述對象
  private pbTexAsset: TextAsset | null = null;

  // 根據描述協議動態生成的解析對象
  private pb: any = null;

  onLoad(): void {
    if (ProtoManager.Instance) {
      this.destroy();
      return;
    }

    ProtoManager.Instance = this;
  }

  public Init(pbText: TextAsset | null): void {
    this.pbTexAsset = pbText;
    this.pb = protobuf.parse(this.pbTexAsset);
  }

  // msgName => Cmd[cmdTpe]
  public SerializeMessage(msgName: string, msgBody: MsgBody): Uint8Array {
    const rs = this.pb.root.lookupType(msgName);
    const msg = rs.create(msgBody);
    const buf = rs.encode(msg).finish();
    return buf;
  }

  // msgName => Cmd[cmdTpe]
  public DeserializeMsg(msgName: string, msgBuf: Uint8Array): MsgBody {
    const rs = this.pb.root.lookupType(msgName);
    const msg = rs.decode(msgBuf);
    return msg;
  }
}
