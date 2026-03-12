<script setup lang="ts">
useSeoMeta({
  title: 'Learn — CommonPub',
  description: 'Browse learning paths and grow your skills.',
});

const { data } = await useFetch('/api/learn');
const { isAuthenticated } = useAuth();
const activeDifficulty = ref('all');
const difficulties = ['all', 'beginner', 'intermediate', 'advanced'] as const;

const filteredPaths = computed(() => {
  const items = data.value?.items || [];
  if (activeDifficulty.value === 'all') return items;
  return items.filter((p: { difficulty?: string }) => p.difficulty === activeDifficulty.value);
});
</script>

<template>
  <div class="cpub-learn">
    <div class="cpub-learn-header">
      <h1 class="cpub-learn-title">Learning Paths</h1>
      <div class="cpub-learn-controls">
        <div class="cpub-difficulty-filters">
          <button
            v-for="d in difficulties"
            :key="d"
            :class="['cpub-diff-chip', { 'cpub-diff-active': activeDifficulty === d }]"
            @click="activeDifficulty = d"
          >{{ d }}</button>
        </div>
        <NuxtLink v-if="isAuthenticated" to="/learn/create" class="cpub-create-btn">+ Create Path</NuxtLink>
      </div>
    </div>

    <div class="cpub-path-grid" v-if="filteredPaths.length">
      <article class="cpub-path-card" v-for="path in filteredPaths" :key="path.id">
        <div class="cpub-path-card-cover" />
        <div class="cpub-path-card-body">
          <span v-if="path.difficulty" class="cpub-path-difficulty" :data-difficulty="path.difficulty">{{ path.difficulty }}</span>
          <h2 class="cpub-path-card-title">
            <NuxtLink :to="`/learn/${path.slug}`">{{ path.title }}</NuxtLink>
          </h2>
          <p class="cpub-path-card-desc" v-if="path.description">{{ path.description }}</p>
          <div class="cpub-path-card-meta">
            <span v-if="path.estimatedHours">{{ path.estimatedHours }}h</span>
            <span>{{ path.enrollmentCount ?? 0 }} enrolled</span>
            <span v-if="path.moduleCount">{{ path.moduleCount }} modules</span>
          </div>
          <div class="cpub-path-progress" v-if="path.userProgress">
            <div class="cpub-progress-bar">
              <div class="cpub-progress-fill" :style="{ width: `${path.userProgress}%` }" />
            </div>
            <span class="cpub-progress-label">{{ path.userProgress }}%</span>
          </div>
        </div>
      </article>
    </div>
    <p class="cpub-empty" v-else>No learning paths found.</p>
  </div>
</template>

<style scoped>
.cpub-learn { max-width: var(--content-max-width); }
.cpub-learn-header { margin-bottom: var(--space-6); }
.cpub-learn-title { font-size: var(--text-xl); font-weight: var(--font-weight-bold); margin-bottom: var(--space-4); }
.cpub-learn-controls { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: var(--space-3); }
.cpub-difficulty-filters { display: flex; gap: var(--space-2); }
.cpub-diff-chip { padding: var(--space-1) var(--space-3); background: var(--surface2); border: 1px solid var(--border2); color: var(--text-dim); font-family: var(--font-mono); font-size: 10px; font-weight: var(--font-weight-semibold); text-transform: uppercase; letter-spacing: var(--tracking-wide); cursor: pointer; }
.cpub-diff-chip:hover { border-color: var(--border); color: var(--text); }
.cpub-diff-active { background: var(--accent-bg); border-color: var(--accent-border); color: var(--accent); }
.cpub-create-btn { padding: var(--space-2) var(--space-4); background: var(--accent); color: #fff; border: var(--border-width-default) solid var(--border); text-decoration: none; font-size: var(--text-xs); font-weight: var(--font-weight-medium); }
.cpub-create-btn:hover { background: var(--color-primary-hover); }
.cpub-path-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: var(--space-4); }
.cpub-path-card { border: var(--border-width-default) solid var(--border); background: var(--surface); overflow: hidden; }
.cpub-path-card:hover { box-shadow: var(--shadow-sm); }
.cpub-path-card-cover { height: 120px; background: var(--surface2); background-image: linear-gradient(135deg, var(--accent-bg), var(--purple-bg)); }
.cpub-path-card-body { padding: var(--space-4); }
.cpub-path-difficulty { font-family: var(--font-mono); font-size: 10px; font-weight: var(--font-weight-semibold); text-transform: uppercase; letter-spacing: var(--tracking-wide); padding: 2px 8px; border: 1px solid var(--accent-border); color: var(--accent); background: var(--accent-bg); }
[data-difficulty="beginner"] { color: var(--green); border-color: var(--green-border); background: var(--green-bg); }
[data-difficulty="intermediate"] { color: var(--yellow); border-color: var(--yellow-border); background: var(--yellow-bg); }
[data-difficulty="advanced"] { color: var(--red); border-color: var(--red-border); background: var(--red-bg); }
.cpub-path-card-title { font-size: var(--text-md); font-weight: var(--font-weight-semibold); margin: var(--space-2) 0; }
.cpub-path-card-title a { color: var(--text); text-decoration: none; }
.cpub-path-card-title a:hover { color: var(--accent); }
.cpub-path-card-desc { font-size: var(--text-sm); color: var(--text-dim); line-height: var(--leading-relaxed); margin-bottom: var(--space-3); display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.cpub-path-card-meta { display: flex; gap: var(--space-3); font-size: var(--text-xs); color: var(--text-faint); }
.cpub-path-progress { display: flex; align-items: center; gap: var(--space-2); margin-top: var(--space-3); }
.cpub-progress-bar { flex: 1; height: 4px; background: var(--surface3); overflow: hidden; }
.cpub-progress-fill { height: 100%; background: var(--accent); }
.cpub-progress-label { font-family: var(--font-mono); font-size: 10px; color: var(--text-faint); }
.cpub-empty { color: var(--text-faint); text-align: center; padding: var(--space-10) 0; font-size: var(--text-sm); }
</style>
