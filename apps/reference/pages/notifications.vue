<script setup lang="ts">
definePageMeta({ middleware: 'auth' });

useSeoMeta({ title: 'Notifications — CommonPub' });

const notifications = ref<{ id: string; type: string; message: string; read: boolean; createdAt: string }[]>([]);

const iconMap: Record<string, string> = {
  like: 'fa-solid fa-heart',
  comment: 'fa-solid fa-comment',
  follow: 'fa-solid fa-user-plus',
  mention: 'fa-solid fa-at',
  community: 'fa-solid fa-people-group',
  certificate: 'fa-solid fa-certificate',
  system: 'fa-solid fa-bell',
};
</script>

<template>
  <div class="cpub-notifications">
    <h1 class="cpub-page-title">Notifications</h1>

    <template v-if="notifications.length">
      <div
        v-for="notif in notifications"
        :key="notif.id"
        :class="['cpub-notif', { 'cpub-notif-unread': !notif.read }]"
      >
        <span class="cpub-notif-icon">
          <i :class="iconMap[notif.type] || 'fa-solid fa-bell'"></i>
        </span>
        <div class="cpub-notif-content">
          <p class="cpub-notif-message">{{ notif.message }}</p>
          <time class="cpub-notif-time">{{ new Date(notif.createdAt).toLocaleDateString() }}</time>
        </div>
      </div>
    </template>
    <div class="cpub-empty-state" v-else>
      <i class="fa-regular fa-bell cpub-empty-icon"></i>
      <p class="cpub-empty-text">No notifications yet.</p>
    </div>
  </div>
</template>

<style scoped>
.cpub-notifications { max-width: var(--content-max-width); }
.cpub-page-title { font-size: var(--text-xl); font-weight: var(--font-weight-bold); margin-bottom: var(--space-6); }
.cpub-notif { display: flex; gap: var(--space-3); padding: var(--space-3) var(--space-4); border-bottom: 1px solid var(--border2); transition: background 0.15s; }
.cpub-notif:hover { background: var(--surface2); }
.cpub-notif-unread { background: var(--surface2); border-left: 3px solid var(--accent); }
.cpub-notif-icon { width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; background: var(--surface2); border: 1px solid var(--border2); color: var(--text-dim); font-size: 13px; flex-shrink: 0; }
.cpub-notif-message { font-size: var(--text-sm); color: var(--text); }
.cpub-notif-time { font-size: var(--text-xs); color: var(--text-faint); }
.cpub-empty-state { text-align: center; padding: var(--space-12) 0; }
.cpub-empty-icon { font-size: 32px; color: var(--text-faint); margin-bottom: var(--space-3); }
.cpub-empty-text { color: var(--text-faint); font-size: var(--text-sm); }
</style>
