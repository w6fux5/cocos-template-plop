import { Component } from "cc";
import { EventManager } from "../EventManager";

enum State {
  disconnected = 0, // 斷開連接
  connecting = 1, // 正在連接
  connected = 2, // 已經連接
}

export class NetManager extends Component {
  public static Instance: NetManager | null = null;

  private url: string = "";
  private state: number = State.disconnected;
  private socket: WebSocket | null = null;

  onLoad(): void {
    if (NetManager.Instance) {
      this.destroy();
      return;
    }

    NetManager.Instance = this;
    this.state = State.disconnected;
  }

  update(deltaTime: number): void {
    if (this.state !== State.disconnected) return;
    this.ConnectToServer();
  }

  public Init(url: string): void {
    this.url = url;
    this.state = State.disconnected;
  }

  // Connect
  public ConnectToServer(): void {
    if (this.state !== State.disconnected) return;

    EventManager.Instance.Emit(
      EventManager.Instance.EventType.NET_CONNECTING,
      null
    );

    this.state = State.connecting;

    this.socket = new WebSocket(this.url);

    this.socket.binaryType = "arraybuffer"; // 二進制
    this.socket.onopen = this.on_opened.bind(this);
    this.socket.onmessage = this.on_recv_data.bind(this);
    this.socket.onclose = this.on_socket_close.bind(this);
    this.socket.onerror = this.on_socket_err.bind(this);
  }

  // Close
  public CloseSocket(): void {
    if (this.state === State.connected && this.socket) {
      this.socket.close();
      this.socket = null;
    }

    EventManager.Instance.Emit(
      EventManager.Instance.EventType.NET_DISCONNECTED,
      null
    );

    this.state = State.disconnected;
  }

  // Send Data
  public SendData(data: ArrayBuffer): void {
    if (this.state === State.connected && this.socket) {
      this.socket.send(data);
    }
  }

  //==== Event ====//
  // 成功連接 event
  private on_opened(event: any): void {
    this.state = State.connected;
    console.log(`connect to server: ${this.url} success!`);

    EventManager.Instance.Emit(
      EventManager.Instance.EventType.NET_CONNECT_SUCCESS,
      null
    );
  }

  // 收到 server 訊息 event
  private on_recv_data(event: any): void {
    console.log(event.data)
    EventManager.Instance.Emit(
      EventManager.Instance.EventType.NET_MESSAGE,
      event.data
    );
  }

  // 關閉 socket event
  private on_socket_close(event: any): void {
    this.CloseSocket();
  }

  // Socket error event
  private on_socket_err(event: any): void {
    this.CloseSocket();
  }
  //==== End ====//
}
