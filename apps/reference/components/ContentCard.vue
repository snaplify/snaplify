<script setup lang="ts">
defineProps<{
  item: {
    type: string;
    slug: string;
    title: string;
    description?: string;
    coverImage?: string;
    author: { username: string; displayName?: string };
    publishedAt?: string;
    createdAt: string;
    viewCount?: number;
    likeCount?: number;
    commentCount?: number;
  };
}>();

const thumbIcons: Record<string, { icon: string; colorClass: string }> = {
  project: { icon: 'fa-solid fa-microchip', colorClass: 'thumb-accent' },
  article: { icon: 'fa-solid fa-file-lines', colorClass: 'thumb-teal' },
  guide: { icon: 'fa-solid fa-book', colorClass: 'thumb-purple' },
  blog: { icon: 'fa-solid fa-pen-nib', colorClass: 'thumb-pink' },
  explainer: { icon: 'fa-solid fa-lightbulb', colorClass: 'thumb-yellow' },
};
</script>

<template>
  <article class="cpub-content-card" :data-content-type="item.type">
    <div class="cpub-card-cover" v-if="item.coverImage">
      <img :src="item.coverImage" :alt="item.title" loading="lazy" />
    </div>
    <div class="cpub-card-thumb" v-else>
      <i :class="[thumbIcons[item.type]?.icon || 'fa-solid fa-file', 'cpub-card-thumb-icon', thumbIcons[item.type]?.colorClass || 'thumb-accent']"></i>
    </div>
    <div class="cpub-card-body">
      <ContentTypeBadge :type="item.type" />
      <h3 class="cpub-card-title">
        <NuxtLink :to="`/${item.type}/${item.slug}`">{{ item.title }}</NuxtLink>
      </h3>
      <p v-if="item.description" class="cpub-card-desc">{{ item.description }}</p>
      <div class="cpub-card-meta">
        <NuxtLink :to="`/u/${item.author.username}`" class="cpub-card-author">
          {{ item.author.displayName || item.author.username }}
        </NuxtLink>
        <span class="cpub-card-sep" aria-hidden="true">&middot;</span>
        <time>{{ new Date(item.publishedAt || item.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) }}</time>
      </div>
      <div class="cpub-card-stats">
        <span v-if="item.viewCount" class="cpub-stat-item"><i class="fa-solid fa-eye"></i> {{ item.viewCount }}</span>
        <span v-if="item.likeCount" class="cpub-stat-item"><i class="fa-solid fa-heart"></i> {{ item.likeCount }}</span>
        <span v-if="item.commentCount" class="cpub-stat-item"><i class="fa-solid fa-comment"></i> {{ item.commentCount }}</span>
      </div>
    </div>
  </article>
</template>

<style scoped>
.cpub-content-card {
  background: var(--surface);
  border: 2px solid var(--border);
  overflow: hidden;
  transition: all 0.15s;
}

.cpub-content-card:hover {
  transform: translate(-2px, -2px);
  box-shadow: 4px 4px 0 var(--border);
}

.cpub-card-cover {
  height: 160px;
  overflow: hidden;
  border-bottom: 2px solid var(--border);
}

.cpub-card-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.cpub-card-thumb {
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--surface2);
  border-bottom: 2px solid var(--border);
}

.cpub-card-thumb-icon {
  font-size: 32px;
  opacity: 0.2;
}

.thumb-accent { color: var(--accent); }
.thumb-teal { color: var(--teal); }
.thumb-purple { color: var(--purple); }
.thumb-pink { color: var(--pink); }
.thumb-yellow { color: var(--yellow); }

.cpub-card-body {
  padding: var(--space-4);
}

.cpub-card-title {
  font-size: var(--text-md);
  font-weight: var(--font-weight-semibold);
  margin-top: var(--space-2);
  margin-bottom: var(--space-2);
  line-height: var(--leading-tight);
}

.cpub-card-title a {
  color: var(--text);
  text-decoration: none;
}

.cpub-card-title a:hover {
  color: var(--accent);
}

.cpub-card-desc {
  font-size: var(--text-sm);
  color: var(--text-dim);
  line-height: var(--leading-relaxed);
  margin-bottom: var(--space-3);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.cpub-card-meta {
  display: flex;
  gap: var(--space-2);
  font-size: var(--text-xs);
  color: var(--text-faint);
}

.cpub-card-author {
  color: var(--text-dim);
  text-decoration: none;
  font-weight: var(--font-weight-medium);
}

.cpub-card-author:hover {
  color: var(--accent);
}

.cpub-card-stats {
  display: flex;
  gap: var(--space-3);
  margin-top: var(--space-2);
  font-size: var(--text-xs);
  color: var(--text-faint);
}

.cpub-stat-item {
  display: flex;
  align-items: center;
  gap: 4px;
}
</style>
