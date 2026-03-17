<script setup lang="ts">
const route = useRoute();
const videoId = computed(() => route.params.id as string);

const { data: video } = await useFetch(() => `/api/videos/${videoId.value}`);

useSeoMeta({
  title: () => video.value?.title ? `${(video.value as Record<string, unknown>).title} — CommonPub` : 'Video — CommonPub',
  description: () => (video.value as Record<string, unknown>)?.description as string ?? '',
});

// Track view
onMounted(() => {
  if (videoId.value) {
    $fetch(`/api/videos/${videoId.value}`, { method: 'POST' }).catch(() => {});
  }
});

const v = computed(() => video.value as Record<string, unknown> | null);

function embedUrl(url: string): string | null {
  // YouTube
  const ytMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/);
  if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}`;
  // Vimeo
  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
  if (vimeoMatch) return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
  return null;
}

const videoEmbedUrl = computed(() => {
  const url = v.value?.url as string | undefined;
  return url ? embedUrl(url) : null;
});
</script>

<template>
  <div v-if="v" class="cpub-video-page">
    <!-- Video player -->
    <div class="cpub-video-player">
      <iframe
        v-if="videoEmbedUrl"
        :src="videoEmbedUrl"
        class="cpub-video-iframe"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen
        :title="(v.title as string) || 'Video'"
      />
      <div v-else class="cpub-video-placeholder">
        <i class="fa-solid fa-play"></i>
        <p>Video preview not available</p>
        <a v-if="v.url" :href="(v.url as string)" target="_blank" rel="noopener" class="cpub-link">Open video link</a>
      </div>
    </div>

    <!-- Video info -->
    <div class="cpub-video-info">
      <h1 class="cpub-video-title">{{ v.title }}</h1>
      <div class="cpub-video-meta">
        <span v-if="v.category"><i class="fa-solid fa-tag"></i> {{ (v.category as Record<string, unknown>)?.name ?? v.category }}</span>
        <span><i class="fa-regular fa-eye"></i> {{ ((v.viewCount as number) ?? 0).toLocaleString() }} views</span>
        <span v-if="v.duration"><i class="fa-regular fa-clock"></i> {{ v.duration }}</span>
        <span v-if="v.createdAt">{{ new Date(v.createdAt as string).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) }}</span>
      </div>
      <p v-if="v.description" class="cpub-video-desc">{{ v.description }}</p>

      <!-- Author -->
      <div v-if="v.author || v.createdBy" class="cpub-video-author">
        <div class="cpub-video-author-av">{{ ((v.author as Record<string, unknown>)?.displayName as string ?? (v.author as Record<string, unknown>)?.username as string ?? 'U').charAt(0).toUpperCase() }}</div>
        <div>
          <NuxtLink
            v-if="(v.author as Record<string, unknown>)?.username"
            :to="`/u/${(v.author as Record<string, unknown>).username}`"
            class="cpub-video-author-name"
          >
            {{ (v.author as Record<string, unknown>)?.displayName ?? (v.author as Record<string, unknown>)?.username }}
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
  <div v-else class="cpub-empty-state" style="padding: 64px">
    <p class="cpub-empty-state-title">Video not found</p>
  </div>
</template>

<style scoped>
.cpub-video-page {
  max-width: 960px;
}

.cpub-video-player {
  width: 100%;
  aspect-ratio: 16/9;
  background: var(--text);
  border: 2px solid var(--border);
  box-shadow: 4px 4px 0 var(--border);
  margin-bottom: 20px;
  overflow: hidden;
}

.cpub-video-iframe {
  width: 100%;
  height: 100%;
  border: none;
}

.cpub-video-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  color: var(--surface3);
}

.cpub-video-placeholder i {
  font-size: 48px;
}

.cpub-video-placeholder p {
  font-size: 13px;
}

.cpub-video-info {
  background: var(--surface);
  border: 2px solid var(--border);
  padding: 20px;
}

.cpub-video-title {
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 8px;
}

.cpub-video-meta {
  display: flex;
  align-items: center;
  gap: 16px;
  font-size: 11px;
  font-family: var(--font-mono);
  color: var(--text-faint);
  margin-bottom: 14px;
}

.cpub-video-meta i {
  margin-right: 4px;
}

.cpub-video-desc {
  font-size: 14px;
  color: var(--text-dim);
  line-height: 1.7;
  margin-bottom: 20px;
}

.cpub-video-author {
  display: flex;
  align-items: center;
  gap: 10px;
  padding-top: 14px;
  border-top: 2px solid var(--border);
}

.cpub-video-author-av {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: var(--surface3);
  border: 2px solid var(--border);
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-mono);
  font-size: 13px;
  font-weight: 600;
  color: var(--text-dim);
}

.cpub-video-author-name {
  font-size: 13px;
  font-weight: 600;
  color: var(--text);
  text-decoration: none;
}

.cpub-video-author-name:hover {
  color: var(--accent);
}

.cpub-link {
  color: var(--accent);
  text-decoration: none;
}

.cpub-link:hover {
  text-decoration: underline;
}
</style>
