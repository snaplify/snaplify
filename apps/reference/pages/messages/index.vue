<script setup lang="ts">
definePageMeta({ middleware: 'auth' });
useSeoMeta({ title: 'Messages — CommonPub' });

const conversations = ref<{ id: string; participant: { username: string; displayName?: string }; lastMessage: string; updatedAt: string }[]>([]);
</script>

<template>
  <div class="cpub-messages">
    <h1 class="cpub-page-title">Messages</h1>

    <template v-if="conversations.length">
      <NuxtLink
        v-for="conv in conversations"
        :key="conv.id"
        :to="`/messages/${conv.id}`"
        class="cpub-conv-item"
      >
        <div class="cpub-conv-avatar">{{ (conv.participant.displayName || conv.participant.username).charAt(0).toUpperCase() }}</div>
        <div class="cpub-conv-info">
          <span class="cpub-conv-name">{{ conv.participant.displayName || conv.participant.username }}</span>
          <p class="cpub-conv-preview">{{ conv.lastMessage }}</p>
        </div>
        <time class="cpub-conv-time">{{ new Date(conv.updatedAt).toLocaleDateString() }}</time>
      </NuxtLink>
    </template>
    <p class="cpub-empty" v-else>No conversations yet.</p>
  </div>
</template>

<style scoped>
.cpub-messages { max-width: var(--content-max-width); }
.cpub-page-title { font-size: var(--text-xl); font-weight: var(--font-weight-bold); margin-bottom: var(--space-6); }
.cpub-conv-item { display: flex; gap: var(--space-3); padding: var(--space-3) var(--space-4); border-bottom: 1px solid var(--border2); text-decoration: none; color: var(--text); }
.cpub-conv-item:hover { background: var(--surface2); }
.cpub-conv-avatar { width: 36px; height: 36px; border-radius: var(--radius-full); background: var(--surface3); border: var(--border-width-default) solid var(--border); display: flex; align-items: center; justify-content: center; font-family: var(--font-mono); font-size: var(--text-xs); font-weight: var(--font-weight-semibold); color: var(--text-dim); flex-shrink: 0; }
.cpub-conv-info { flex: 1; min-width: 0; }
.cpub-conv-name { font-weight: var(--font-weight-medium); font-size: var(--text-sm); }
.cpub-conv-preview { font-size: var(--text-xs); color: var(--text-dim); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.cpub-conv-time { font-size: var(--text-xs); color: var(--text-faint); flex-shrink: 0; }
.cpub-empty { color: var(--text-faint); text-align: center; padding: var(--space-10) 0; }
</style>
