<script setup lang="ts">
useSeoMeta({
  title: 'Search — CommonPub',
  description: 'Search for projects, tutorials, and community content.',
});

const query = ref('');
const activeFilter = ref('all');
const sortBy = ref('relevance');
const filters = ['all', 'project', 'article', 'blog', 'explainer', 'guide'] as const;
const sortOptions = ['relevance', 'recent', 'popular'] as const;

const searchQuery = computed(() => ({
  q: query.value,
  type: activeFilter.value === 'all' ? undefined : activeFilter.value,
  sort: sortBy.value,
  limit: 20,
}));

const { data: results, status } = await useFetch('/api/search', {
  query: searchQuery,
  watch: [searchQuery],
  lazy: true,
});
</script>

<template>
  <div class="cpub-search">
    <h1 class="cpub-search-title">Search</h1>

    <div class="cpub-search-bar">
      <input
        v-model="query"
        type="search"
        class="cpub-search-input"
        placeholder="Search projects, articles, creators..."
        aria-label="Search content"
      />
    </div>

    <div class="cpub-search-controls">
      <div class="cpub-search-filters" role="tablist" aria-label="Content type filters">
        <button
          v-for="filter in filters"
          :key="filter"
          role="tab"
          :aria-selected="activeFilter === filter"
          :class="['cpub-filter-chip', { 'cpub-filter-active': activeFilter === filter }]"
          @click="activeFilter = filter"
        >
          {{ filter }}
        </button>
      </div>

      <div class="cpub-search-sort">
        <label for="search-sort" class="cpub-sort-label">Sort:</label>
        <select id="search-sort" v-model="sortBy" class="cpub-sort-select">
          <option v-for="opt in sortOptions" :key="opt" :value="opt">{{ opt }}</option>
        </select>
      </div>
    </div>

    <div class="cpub-search-results">
      <p class="cpub-search-hint" v-if="!query">
        Enter a search term to find content across the community.
      </p>
      <p class="cpub-search-loading" v-else-if="status === 'pending'">Searching...</p>
      <template v-else-if="results?.items?.length">
        <div class="cpub-results-grid">
          <ContentCard v-for="item in results.items" :key="item.id" :item="item" />
        </div>
      </template>
      <p class="cpub-search-hint" v-else>
        No results found for "{{ query }}".
      </p>
    </div>
  </div>
</template>

<style scoped>
.cpub-search {
  max-width: var(--content-max-width);
}

.cpub-search-title {
  font-size: var(--text-xl);
  font-weight: var(--font-weight-bold);
  margin-bottom: var(--space-4);
}

.cpub-search-bar {
  margin-bottom: var(--space-4);
}

.cpub-search-input {
  width: 100%;
  padding: var(--space-3) var(--space-4);
  border: var(--border-width-default) solid var(--border);
  background: var(--surface);
  color: var(--text);
  font-size: var(--text-base);
  font-family: var(--font-sans);
}

.cpub-search-input:focus {
  outline: none;
  border-color: var(--accent);
  box-shadow: var(--focus-ring);
}

.cpub-search-controls {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--space-6);
  flex-wrap: wrap;
  gap: var(--space-3);
}

.cpub-search-filters {
  display: flex;
  gap: var(--space-2);
  flex-wrap: wrap;
}

.cpub-filter-chip {
  padding: var(--space-1) var(--space-3);
  background: var(--surface2);
  border: 1px solid var(--border2);
  color: var(--text-dim);
  font-family: var(--font-mono);
  font-size: 10px;
  font-weight: var(--font-weight-semibold);
  text-transform: uppercase;
  letter-spacing: var(--tracking-wide);
  cursor: pointer;
}

.cpub-filter-chip:hover {
  border-color: var(--border);
  color: var(--text);
}

.cpub-filter-active {
  background: var(--accent-bg);
  border-color: var(--accent-border);
  color: var(--accent);
}

.cpub-search-sort {
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.cpub-sort-label {
  font-size: var(--text-xs);
  color: var(--text-faint);
}

.cpub-sort-select {
  padding: var(--space-1) var(--space-2);
  border: 1px solid var(--border2);
  background: var(--surface);
  font-family: var(--font-mono);
  font-size: 10px;
  text-transform: capitalize;
  color: var(--text-dim);
  cursor: pointer;
}

.cpub-results-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: var(--space-4);
}

.cpub-search-hint,
.cpub-search-loading {
  color: var(--text-faint);
  font-size: var(--text-sm);
  text-align: center;
  padding: var(--space-10) 0;
}
</style>
