<script setup lang="ts">
definePageMeta({ layout: 'admin' });
useSeoMeta({ title: 'Content Management — Admin — CommonPub' });

const { data } = await useFetch('/api/content', {
  query: { limit: 50, sort: 'recent' },
});
</script>

<template>
  <div class="cpub-admin-content">
    <h1 class="cpub-admin-title">Content Management</h1>

    <div class="cpub-admin-table-wrap" v-if="data?.items?.length">
      <table class="cpub-admin-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Type</th>
            <th>Author</th>
            <th>Status</th>
            <th>Created</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in data.items" :key="item.id">
            <td>
              <NuxtLink :to="`/${item.type}/${item.slug}`" class="cpub-admin-link">{{ item.title }}</NuxtLink>
            </td>
            <td><ContentTypeBadge :type="item.type" /></td>
            <td>{{ item.author?.displayName || item.author?.username || 'Unknown' }}</td>
            <td>
              <span :class="['cpub-status-badge', `cpub-status-${item.status}`]">{{ item.status }}</span>
            </td>
            <td>{{ new Date(item.createdAt).toLocaleDateString() }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <p class="cpub-empty" v-else>No content found.</p>
  </div>
</template>

<style scoped>
.cpub-admin-title { font-size: var(--text-xl); font-weight: var(--font-weight-bold); margin-bottom: var(--space-6); }
.cpub-admin-table-wrap { overflow-x: auto; }
.cpub-admin-table { width: 100%; border-collapse: collapse; }
.cpub-admin-table th { font-family: var(--font-mono); font-size: 10px; font-weight: var(--font-weight-semibold); text-transform: uppercase; letter-spacing: var(--tracking-wide); color: var(--text-dim); text-align: left; padding: var(--space-2) var(--space-3); border-bottom: var(--border-width-default) solid var(--border); }
.cpub-admin-table td { padding: var(--space-2) var(--space-3); border-bottom: 1px solid var(--border2); font-size: var(--text-sm); }
.cpub-admin-link { color: var(--text); text-decoration: none; font-weight: var(--font-weight-medium); }
.cpub-admin-link:hover { color: var(--accent); }
.cpub-status-badge { font-family: var(--font-mono); font-size: 10px; text-transform: uppercase; padding: 2px 8px; }
.cpub-status-published { color: var(--green); background: var(--green-bg); border: 1px solid var(--green-border); }
.cpub-status-draft { color: var(--text-dim); background: var(--surface2); border: 1px solid var(--border2); }
.cpub-empty { color: var(--text-faint); text-align: center; padding: var(--space-10) 0; }
</style>
