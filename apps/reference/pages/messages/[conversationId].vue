<script setup lang="ts">
definePageMeta({ middleware: 'auth' });

const route = useRoute();
const conversationId = computed(() => route.params.conversationId as string);

useSeoMeta({ title: 'Message — CommonPub' });

const messages = ref<{ id: string; content: string; fromMe: boolean; createdAt: string }[]>([]);
const newMessage = ref('');

async function sendMessage(): Promise<void> {
  if (!newMessage.value.trim()) return;
  // Placeholder: would POST to /api/messages
  newMessage.value = '';
}
</script>

<template>
  <div class="cpub-thread">
    <header class="cpub-thread-header">
      <NuxtLink to="/messages" class="cpub-thread-back" aria-label="Back to messages"><i class="fa-solid fa-arrow-left"></i></NuxtLink>
      <span class="cpub-thread-title">Conversation</span>
    </header>

    <div class="cpub-thread-messages">
      <template v-if="messages.length">
        <div v-for="msg in messages" :key="msg.id" :class="['cpub-msg', { 'cpub-msg-mine': msg.fromMe }]">
          <p class="cpub-msg-content">{{ msg.content }}</p>
          <time class="cpub-msg-time">{{ new Date(msg.createdAt).toLocaleTimeString() }}</time>
        </div>
      </template>
      <p class="cpub-empty" v-else>No messages yet. Start the conversation!</p>
    </div>

    <div class="cpub-thread-composer">
      <input
        v-model="newMessage"
        type="text"
        class="cpub-thread-input"
        placeholder="Type a message..."
        aria-label="Message input"
        @keyup.enter="sendMessage"
      />
      <button class="cpub-thread-send" :disabled="!newMessage.trim()" @click="sendMessage"><i class="fa-solid fa-paper-plane"></i> Send</button>
    </div>
  </div>
</template>

<style scoped>
.cpub-thread { max-width: var(--content-max-width); display: flex; flex-direction: column; height: calc(100vh - 48px - var(--space-12)); }
.cpub-thread-header { display: flex; align-items: center; gap: var(--space-3); padding: var(--space-3) 0; border-bottom: 1px solid var(--border2); }
.cpub-thread-back { color: var(--text-dim); text-decoration: none; font-size: var(--text-md); }
.cpub-thread-title { font-weight: var(--font-weight-semibold); }
.cpub-thread-messages { flex: 1; overflow-y: auto; padding: var(--space-4) 0; }
.cpub-msg { max-width: 70%; padding: var(--space-2) var(--space-3); margin-bottom: var(--space-2); background: var(--surface2); border: 1px solid var(--border2); }
.cpub-msg-mine { margin-left: auto; background: var(--accent-bg); border-color: var(--accent-border); }
.cpub-msg-content { font-size: var(--text-sm); }
.cpub-msg-time { font-size: 10px; color: var(--text-faint); }
.cpub-thread-composer { display: flex; gap: var(--space-2); padding: var(--space-3) 0; border-top: 1px solid var(--border2); }
.cpub-thread-input { flex: 1; padding: var(--space-2) var(--space-3); border: var(--border-width-default) solid var(--border); background: var(--surface); color: var(--text); font-family: var(--font-sans); font-size: var(--text-sm); }
.cpub-thread-input:focus { outline: none; border-color: var(--accent); }
.cpub-thread-send { padding: var(--space-2) var(--space-4); background: var(--accent); color: #fff; border: var(--border-width-default) solid var(--border); font-size: var(--text-sm); cursor: pointer; font-family: var(--font-sans); }
.cpub-thread-send:disabled { opacity: 0.5; cursor: not-allowed; }
.cpub-empty { color: var(--text-faint); text-align: center; padding: var(--space-8) 0; }
</style>
