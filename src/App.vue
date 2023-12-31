<template>
  <div>
    <button @click="disconnect">Disconnect your peer</button>
    <button @click="connect">Connect to peer</button>
    <textarea height="100px" width="100px" v-model="inputText"></textarea>
    <button @click="sendMessage">sendMessage</button>
    <div class="list-container">
      Connected Peers:
      <ul>
        <li v-for="peer in connectedPeers" :key="peer">{{ peer }}</li>
      </ul>
    </div>
    <div class="list-container">
      Queue:
      <ul>
        <li v-for="item in queuedMessages" :key="item">{{ item }}</li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, computed, watch } from 'vue';
import { PeerConnector } from './peer/peerConnector';
import { ExampleP2PLibrary } from './peer/peerJs';
import { usePeerStore } from './peer/peerStore';
import { usePubSubStore } from '../src/bus/pubSubStore';

const inputText = ref('');
const connector = new PeerConnector(new ExampleP2PLibrary());
const peerStore = usePeerStore();
const queue = usePubSubStore();

onMounted(() => {
  connector.onConnect(() => {
    console.log('onconnect firing');
  });
  connector.onDisconnect(() => {
    console.log('disconnect firing');
  });

  connector.openConnection((data) => {
    connector.onData(data);
  })
  connect();
});


watch(
    () => peerStore.peers,
    (newPeers) => {
      console.log('Peers changed:', newPeers);
    }
  );

function disconnect() {
  connector.disconnect();
}

function connect() {
  if (window.location.port === '5173') {
    connector.connect('5174');
  } else {
    connector.connect('5173');
  }
}

function sendMessage() {
  let id;
  if (window.location.port === '5173') {
    id = '5174';
  } else {
    id = '5173'
  }
  const text = inputText.value;
  connector.send(id, text);
}

const connectedPeers = computed(() => {
  return peerStore.peers;
});
const queuedMessages = computed(() => {
  return queue.eventQueue;
});

</script>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
.list-container {
  border: 1px solid white;
  padding: 1em;
  margin: 1em;
}
.list-container ul {
  list-style: none;
}
</style>
./bus/pubSubStore