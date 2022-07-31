/**
 *  純數據，不需要用組建的模式
 */

import { Component } from "cc";
import { EventManager } from "../../../Framework/Manager";
import { NetEventDispatch } from "../NetEventDispatch";

import { ServiceType } from ".././ServiceType";
import { Cmd } from "../Cmd";

import { UserNameLogin, RecvDataFromServer } from "./Interfaces";

export class AuthProxy extends Component {
  public static Instance: AuthProxy = new AuthProxy();

  public Init(): void {
    EventManager.Instance.AddEventListener(
      ServiceType[ServiceType.Auth],
      this,
      this.RecvDataFromServer
    );
  }

  private RecvDataFromServer(eventName: string, data: object): void {
    console.log(data)
    console.log(eventName)
  }

  public UserNameLogin({ userName, password }: UserNameLogin): void {
    // const md5Pwd = hex_md5(password);
    NetEventDispatch.Instance.sendMessage(ServiceType.Auth, Cmd.UnameLoginReq, {
      userName,
      password,
    });
  }
}
