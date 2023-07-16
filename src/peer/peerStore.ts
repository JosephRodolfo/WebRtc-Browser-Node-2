import { defineStore } from "pinia";

export const usePeerStore = defineStore('peer', {
    state: () => ({
      peers: [] as string[],
    }),
    getters: {
      getPeers: (state) => state.peers,
      getConnectedPeers: (state) => state.peers,
    },
    actions: {
      addPeer(peerId: string): void {
        if (!this.peers.includes(peerId)) {
          this.peers.push(peerId);
        }
      },
      removePeerById(peerId: string): void {
        const index = this.peers.indexOf(peerId);
        if (index > -1) {
          this.peers.splice(index, 1);
        }
        },
        removeAllPeers() {
            this.peers = [];
      }
    },
  });