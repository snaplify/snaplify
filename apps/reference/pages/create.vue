<script setup lang="ts">
definePageMeta({ middleware: 'auth' });

useSeoMeta({
  title: 'Create — CommonPub',
  description: 'Create new content on CommonPub.',
});

const contentTypes = [
  { type: 'article', label: 'Article', description: 'Write an article or tutorial', icon: 'fa-solid fa-file-lines', color: 'teal' },
  { type: 'blog', label: 'Blog Post', description: 'Share your thoughts and updates', icon: 'fa-solid fa-pen-nib', color: 'pink' },
  { type: 'project', label: 'Project', description: 'Showcase a maker project with parts and build steps', icon: 'fa-solid fa-microchip', color: 'accent' },
  { type: 'explainer', label: 'Explainer', description: 'Create an interactive explainer with quizzes and sliders', icon: 'fa-solid fa-lightbulb', color: 'yellow' },
  { type: 'guide', label: 'Guide', description: 'Write a step-by-step how-to guide', icon: 'fa-solid fa-book', color: 'purple' },
] as const;
</script>

<template>
  <div class="create-page">
    <h1 class="create-title">Create New Content</h1>
    <div class="type-grid">
      <button
        v-for="ct in contentTypes"
        :key="ct.type"
        class="type-card"
        :data-color="ct.color"
        @click="navigateTo(`/${ct.type}/new/edit`)"
        :aria-label="`Create new ${ct.label}`"
      >
        <i :class="[ct.icon, 'type-card-icon']"></i>
        <h2 class="type-card-title">{{ ct.label }}</h2>
        <p class="type-card-desc">{{ ct.description }}</p>
      </button>
    </div>
  </div>
</template>

<style scoped>
.create-page {
  max-width: var(--content-max-width);
}

.create-title {
  font-size: var(--text-xl);
  font-weight: var(--font-weight-bold);
  margin-bottom: var(--space-6);
}

.type-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: var(--space-4);
}

.type-card {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: var(--space-5);
  background: var(--surface);
  border: 2px solid var(--border);
  cursor: pointer;
  text-align: left;
  font-family: var(--font-sans);
  transition: all 0.15s;
}

.type-card:hover {
  border-color: var(--accent);
  transform: translate(-2px, -2px);
  box-shadow: 4px 4px 0 var(--border);
}

.type-card:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}

.type-card-icon {
  font-size: var(--text-xl);
  margin-bottom: var(--space-3);
  color: var(--text-dim);
}

[data-color="accent"] .type-card-icon { color: var(--accent); }
[data-color="teal"] .type-card-icon { color: var(--teal); }
[data-color="purple"] .type-card-icon { color: var(--purple); }
[data-color="pink"] .type-card-icon { color: var(--pink); }
[data-color="yellow"] .type-card-icon { color: var(--yellow); }

.type-card-title {
  font-size: var(--text-md);
  font-weight: var(--font-weight-semibold);
  color: var(--text);
  margin-bottom: var(--space-2);
}

.type-card-desc {
  font-size: var(--text-sm);
  color: var(--text-dim);
  line-height: var(--leading-relaxed);
}
</style>
