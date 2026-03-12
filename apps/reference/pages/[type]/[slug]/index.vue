<script setup lang="ts">
import type { BlockTuple } from '@commonpub/editor';

const route = useRoute();
const contentType = computed(() => route.params.type as string);
const slug = computed(() => route.params.slug as string);

const { data: content } = await useFetch(() => `/api/content/${slug.value}`);

useSeoMeta({
  title: () => content.value?.title ? `${content.value.title} — CommonPub` : 'CommonPub',
  description: () => content.value?.seoDescription || content.value?.description || '',
});

const { user } = useAuth();
const isOwner = computed(() => user.value?.id === content.value?.author?.id);

// Estimate reading time (~200 words per minute)
const readTime = computed(() => {
  if (!content.value?.content) return undefined;
  const blocks = content.value.content as BlockTuple[];
  let words = 0;
  for (const [type, data] of blocks) {
    if (type === 'text' && typeof data.html === 'string') words += data.html.split(/\s+/).length;
    if (type === 'heading' && typeof data.text === 'string') words += data.text.split(/\s+/).length;
  }
  const minutes = Math.max(1, Math.round(words / 200));
  return `${minutes} min read`;
});

// Related content
const { data: related } = await useFetch('/api/content', {
  query: { status: 'published', type: contentType.value, limit: 3, sort: 'recent' },
});

// Track view
onMounted(() => {
  if (content.value?.id) {
    $fetch(`/api/content/${content.value.id}/view`, { method: 'POST' }).catch(() => {});
  }
});
</script>

<template>
  <article class="cpub-view" v-if="content">
    <!-- Cover image -->
    <div class="cpub-cover" v-if="content.coverImage">
      <img :src="content.coverImage" :alt="content.title" />
    </div>
    <div class="cpub-cover cpub-cover-placeholder" v-else>
      <span class="cpub-cover-label">{{ contentType }}</span>
    </div>

    <div class="cpub-view-container">
      <!-- Header -->
      <header class="cpub-view-header">
        <ContentTypeBadge :type="content.type" />
        <h1 class="cpub-view-title">{{ content.title }}</h1>
        <p class="cpub-view-subtitle" v-if="content.subtitle || content.description">
          {{ content.subtitle || content.description }}
        </p>

        <div class="cpub-view-author-row">
          <AuthorRow
            :author="content.author"
            :date="content.publishedAt || content.createdAt"
            :read-time="readTime"
          />
          <NuxtLink v-if="isOwner" :to="`/${content.type}/${content.slug}/edit`" class="cpub-edit-btn" aria-label="Edit">
            <i class="fa-solid fa-pen"></i> Edit
          </NuxtLink>
        </div>

        <EngagementBar
          :content-id="content.id"
          :like-count="content.likeCount ?? 0"
          :comment-count="content.commentCount ?? 0"
        />
      </header>

      <!-- Content body -->
      <div class="cpub-view-body">
        <template v-if="content.content && Array.isArray(content.content) && content.content.length > 0">
          <ClientOnly>
            <CpubEditor :model-value="content.content as BlockTuple[]" :editable="false" />
          </ClientOnly>
        </template>
        <p v-else class="cpub-view-empty">No content body yet.</p>
      </div>

      <!-- Tags -->
      <div class="cpub-view-tags" v-if="content.tags?.length">
        <span class="cpub-view-tag" v-for="tag in content.tags" :key="tag.id || tag.name">{{ tag.name || tag }}</span>
      </div>

      <!-- Author card -->
      <AuthorCard :author="content.author" />

      <!-- Related content -->
      <section class="cpub-view-related" v-if="related?.items?.length">
        <h2 class="cpub-view-related-title">Related {{ contentType }}s</h2>
        <div class="cpub-view-related-grid">
          <ContentCard
            v-for="item in related.items.filter((i: any) => i.id !== content.id).slice(0, 3)"
            :key="item.id"
            :item="item"
          />
        </div>
      </section>
    </div>
  </article>
  <div v-else class="cpub-not-found">
    <h1>Content not found</h1>
    <p>The requested content could not be found.</p>
  </div>
</template>

<style scoped>
.cpub-view {
  max-width: 100%;
}

.cpub-cover {
  width: 100%;
  height: 300px;
  position: relative;
  overflow: hidden;
  border-bottom: var(--border-width-default) solid var(--border);
}

.cpub-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.cpub-cover-placeholder {
  background: var(--surface2);
  display: flex;
  align-items: center;
  justify-content: center;
  background-image:
    linear-gradient(var(--border2) 1px, transparent 1px),
    linear-gradient(90deg, var(--border2) 1px, transparent 1px);
  background-size: 40px 40px;
}

.cpub-cover-label {
  font-family: var(--font-mono);
  font-size: var(--text-sm);
  text-transform: uppercase;
  letter-spacing: var(--tracking-widest);
  color: var(--text-faint);
  background: var(--surface);
  padding: var(--space-2) var(--space-4);
  border: var(--border-width-default) solid var(--border);
}

.cpub-view-container {
  max-width: var(--content-max-width);
  margin: 0 auto;
  padding: var(--space-8) var(--space-6);
}

.cpub-view-header {
  margin-bottom: var(--space-6);
}

.cpub-view-title {
  font-size: var(--text-2xl);
  font-weight: var(--font-weight-bold);
  margin-top: var(--space-3);
  margin-bottom: var(--space-2);
  line-height: var(--leading-tight);
}

.cpub-view-subtitle {
  font-size: var(--text-md);
  color: var(--text-dim);
  margin-bottom: var(--space-4);
  line-height: var(--leading-relaxed);
}

.cpub-view-author-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--space-4);
}

.cpub-edit-btn {
  padding: var(--space-1) var(--space-3);
  border: var(--border-width-default) solid var(--border);
  font-size: var(--text-xs);
  color: var(--text);
  text-decoration: none;
}

.cpub-edit-btn:hover {
  background: var(--surface2);
}

.cpub-view-body {
  margin-bottom: var(--space-8);
}

.cpub-view-empty {
  color: var(--text-faint);
  font-style: italic;
  padding: var(--space-10) 0;
  text-align: center;
}

.cpub-view-tags {
  display: flex;
  gap: var(--space-2);
  flex-wrap: wrap;
  margin-bottom: var(--space-8);
}

.cpub-view-tag {
  padding: var(--space-1) var(--space-3);
  background: var(--surface2);
  font-family: var(--font-mono);
  font-size: 10px;
  font-weight: var(--font-weight-medium);
  color: var(--text-dim);
  text-transform: lowercase;
}

.cpub-view-related {
  margin-top: var(--space-10);
  padding-top: var(--space-8);
  border-top: var(--border-width-default) solid var(--border2);
}

.cpub-view-related-title {
  font-size: var(--text-lg);
  font-weight: var(--font-weight-bold);
  margin-bottom: var(--space-5);
  text-transform: capitalize;
}

.cpub-view-related-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-4);
}

.cpub-not-found {
  text-align: center;
  padding: var(--space-16) 0;
  color: var(--text-dim);
}

@media (max-width: 768px) {
  .cpub-view-related-grid {
    grid-template-columns: 1fr;
  }
}
</style>
