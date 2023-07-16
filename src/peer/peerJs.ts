import Peer, { DataConnection } from "peerjs";
import { P2PLibrary } from "./peerConnector";
import { usePeerStore } from "./peerStore";

export class ExampleP2PLibrary implements P2PLibrary {
  private peer: Peer;
  private connections: DataConnection[];
  private peerStore = usePeerStore();

  constructor() {
    const path = window.location.port;
    this.peer = new Peer(path, {
      host: "localhost",
      port: 9000,
      path: "/myapp",
    });
    this.connections = [];
  }

  removePeerById(peerId: string): void {
    const connection = this.getConnection(peerId);
    if (connection) {
      connection.close();
      const index = this.connections.indexOf(connection);
      if (index > -1) {
        this.connections.splice(index, 1);
        this.peerStore.removePeerById(peerId);
      }
    }
  }

  addPeer(peerId: string): void {
    if (!this.getConnection(peerId)) {
      this.peerStore.addPeer(peerId);
    }
  }

  connect(peerId: string): void {
    const existingConnection = this.getConnection(peerId);
    if (existingConnection) {
      console.log(`Already connected to peer ${peerId}.`);
      return;
    }

    const connection = this.peer.connect(peerId);
    console.log(connection);
    connection.on("open", () => {
      console.log(`Connected to peer ${peerId} using PeerJS.`);
      this.connections.push(connection);
      this.peerStore.addPeer(peerId);
    });

    connection.on("close", () => {
      console.log(`Disconnected from peer ${peerId} using PeerJS.`);
      this.removePeerById(peerId);
    });

    connection.on("data", (data) => {
      console.log('Data received:', data);
    });
  }

  disconnect(): void {
    this.peer.destroy();
    for (const connection of this.connections) {
      connection.close();
    }
    this.connections = [];
    this.peerStore.removeAllPeers();
  }

  send(peerId: string, data: any): void {
    const connection = this.getConnection(peerId);
    if (connection) {
      connection.send(data);
      console.log(`Sent data using PeerJS to peer ${connection.peer}:`, data);
    } else {
      console.log(`No active connection to peer ${peerId}.`);
    }
  }

  openConnection(callback: (dataConnection: DataConnection) => void): void {
    this.peer.on("connection", (data) => {
      callback(data)
    });
  }

  onConnect(callback: () => void): void {
    this.peer.on("open", callback);
  }

  onDisconnect(callback: () => void): void {
    this.peer.on("close", callback);
  }

  onData(connection: DataConnection, callback: (data: any) => void): void {
    console.log(connection, 'datjkealjjd');

    if (connection) {
      console.log('onDataEventListener set up');
      connection.on("data", (data) => {
        console.log('data recieved', data);
        callback(data);
      });
    } else {
      // console.log(`No active connection to peer ${peerId}.`);
    }
  }

  private getConnection(peerId: string): DataConnection | undefined {
    return this.connections.find((connection) => connection.peer === peerId);
  }
}
