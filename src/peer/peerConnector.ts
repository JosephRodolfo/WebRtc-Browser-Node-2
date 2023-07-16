import { DataConnection } from "peerjs";

export interface P2PLibrary {
  connect(peerId: string): void;
  disconnect(): void;
  send(peerId: string, data: string): void;
  onConnect(callback: () => void): void;
  onDisconnect(callback: () => void): void;
  onData(connection: DataConnection): void;
  openConnection(callback: () => void): void;

}

export class PeerConnector<T extends P2PLibrary> {

  private p2pLibrary: T;

  constructor(p2pLibrary: T) {
    this.p2pLibrary = p2pLibrary;
  }

  connect(peerId: string): void {
    this.p2pLibrary.connect(peerId);
  }

  disconnect(): void {
    this.p2pLibrary.disconnect();
  }

  send(peerId: string, data: any): void {
    this.p2pLibrary.send(peerId, data);
  }

  onConnect(callback: () => void): void {
    this.p2pLibrary.onConnect(callback);
  }

  onDisconnect(callback: () => void): void {
    this.p2pLibrary.onDisconnect(callback);
  }

  onData(connection: DataConnection): void {
    this.p2pLibrary.onData(connection);
  }
  openConnection(callback: () => void) {
    this.p2pLibrary.openConnection(callback);
  }
  // getPeers() {
  //   return this.peerManagementHelper.getPeers;
  // }
}
