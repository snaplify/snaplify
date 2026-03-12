<script setup lang="ts">
useSeoMeta({
  title: 'CommonPub — Self-hosted maker community',
  description: 'An open ActivityPub federation protocol for self-hosted maker communities.',
});

const { user } = useAuth();

const { data: feed } = await useFetch('/api/content', {
  query: { status: 'published', sort: 'recent', limit: 20 },
});

const { data: trending } = await useFetch('/api/content', {
  query: { status: 'published', sort: 'popular', limit: 5 },
});

const { data: projects } = await useFetch('/api/content', {
  query: { status: 'published', type: 'project', sort: 'popular', limit: 4 },
});
</script>

<template>
  <div class="cpub-home">
    <div class="cpub-home-main">
      <!-- Hero -->
      <section class="cpub-hero">
        <template v-if="user">
          <h1 class="cpub-hero-title">Welcome back, {{ user.displayName || user.username }}</h1>
          <p class="cpub-hero-subtitle">Here's what's new in your community.</p>
        </template>
        <template v-else>
          <h1 class="cpub-hero-title">CommonPub</h1>
          <p class="cpub-hero-subtitle">An open platform for maker communities. Share projects, write articles, create explainers, and learn together.</p>
          <div class="cpub-hero-actions">
            <NuxtLink to="/auth/register" class="cpub-hero-btn cpub-hero-btn-primary">Get Started</NuxtLink>
            <NuxtLink to="/search" class="cpub-hero-btn">Explore</NuxtLink>
          </div>
        </template>
      </section>

      <!-- Trending projects -->
      <section v-if="projects?.items?.length" class="cpub-section">
        <h2 class="cpub-section-title">Trending Projects</h2>
        <div class="cpub-grid cpub-grid-4">
          <ContentCard v-for="item in projects.items" :key="item.id" :item="item" />
        </div>
      </section>

      <!-- For You / Latest feed -->
      <section class="cpub-section">
        <h2 class="cpub-section-title">{{ user ? 'For You' : 'Latest' }}</h2>
        <template v-if="feed?.items?.length">
          <div class="cpub-feed-list">
            <ContentCard v-for="item in feed.items" :key="item.id" :item="item" />
          </div>
        </template>
        <p class="cpub-empty" v-else>No published content yet. Be the first to create something!</p>
      </section>
    </div>

    <aside class="cpub-home-sidebar" aria-label="Sidebar">
      <!-- Create -->
      <div v-if="user" class="cpub-sidebar-section">
        <NuxtLink to="/create" class="cpub-sidebar-create">
          + Create
        </NuxtLink>
      </div>

      <!-- Trending -->
      <div class="cpub-sidebar-section">
        <h3 class="cpub-sidebar-heading">Trending</h3>
        <ul class="cpub-trending-list">
          <template v-if="trending?.items?.length">
            <li v-for="(item, i) in trending.items" :key="item.id" class="cpub-trending-item">
              <span class="cpub-trending-rank">{{ i + 1 }}</span>
              <div>
                <NuxtLink :to="`/${item.type}/${item.slug}`" class="cpub-trending-link">
                  {{ item.title }}
                </NuxtLink>
                <span class="cpub-trending-type">{{ item.type }}</span>
              </div>
            </li>
          </template>
          <li v-else class="cpub-trending-empty">Nothing trending yet.</li>
        </ul>
      </div>

      <!-- Quick links -->
      <div class="cpub-sidebar-section">
        <h3 class="cpub-sidebar-heading">Explore</h3>
        <nav class="cpub-sidebar-nav">
          <NuxtLink to="/article" class="cpub-sidebar-link">Articles</NuxtLink>
          <NuxtLink to="/project" class="cpub-sidebar-link">Projects</NuxtLink>
          <NuxtLink to="/explainer" class="cpub-sidebar-link">Explainers</NuxtLink>
          <NuxtLink to="/learn" class="cpub-sidebar-link">Learning Paths</NuxtLink>
          <NuxtLink to="/communities" class="cpub-sidebar-link">Communities</NuxtLink>
        </nav>
      </div>
    </aside>
  </div>
</template>

<style scoped>
.cpub-home {
  display: grid;
  grid-template-columns: 1fr 280px;
  gap: var(--space-6);
}

.cpub-hero {
  padding: var(--space-8) 0;
  border-bottom: var(--border-width-default) solid var(--border2);
  margin-bottom: var(--space-6);
}

.cpub-hero-title {
  font-size: var(--text-2xl);
  font-weight: var(--font-weight-bold);
  margin-bottom: var(--space-2);
  line-height: var(--leading-tight);
}

.cpub-hero-subtitle {
  font-size: var(--text-md);
  color: var(--text-dim);
  line-height: var(--leading-relaxed);
  margin-bottom: var(--space-4);
}

.cpub-hero-actions {
  display: flex;
  gap: var(--space-3);
}

.cpub-hero-btn {
  padding: var(--space-2) var(--space-5);
  border: var(--border-width-default) solid var(--border);
  font-size: var(--text-sm);
  font-weight: var(--font-weight-medium);
  color: var(--text);
  text-decoration: none;
}

.cpub-hero-btn:hover {
  background: var(--surface2);
}

.cpub-hero-btn-primary {
  background: var(--accent);
  color: #fff;
  box-shadow: var(--shadow-md);
}

.cpub-hero-btn-primary:hover {
  background: var(--color-primary-hover);
}

.cpub-section {
  margin-bottom: var(--space-8);
}

.cpub-section-title {
  font-size: var(--text-lg);
  font-weight: var(--font-weight-bold);
  margin-bottom: var(--space-4);
}

.cpub-grid-4 {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--space-4);
}

.cpub-feed-list {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-4);
}

.cpub-empty {
  color: var(--text-faint);
  font-size: var(--text-sm);
  text-align: center;
  padding: var(--space-10) 0;
}

.cpub-home-sidebar {
  border-left: 1px solid var(--border2);
  padding-left: var(--space-5);
}

.cpub-sidebar-section {
  margin-bottom: var(--space-6);
  padding-bottom: var(--space-6);
  border-bottom: 1px solid var(--border2);
}

.cpub-sidebar-section:last-child {
  border-bottom: none;
}

.cpub-sidebar-create {
  display: block;
  padding: var(--space-3);
  background: var(--accent);
  color: #fff;
  text-align: center;
  text-decoration: none;
  font-weight: var(--font-weight-medium);
  font-size: var(--text-sm);
  border: var(--border-width-default) solid var(--border);
  box-shadow: var(--shadow-sm);
}

.cpub-sidebar-create:hover {
  background: var(--color-primary-hover);
}

.cpub-sidebar-heading {
  font-family: var(--font-mono);
  font-size: var(--text-label);
  font-weight: var(--font-weight-semibold);
  text-transform: uppercase;
  letter-spacing: var(--tracking-widest);
  color: var(--text-faint);
  margin-bottom: var(--space-3);
}

.cpub-trending-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.cpub-trending-item {
  display: flex;
  align-items: flex-start;
  gap: var(--space-2);
  padding: var(--space-2) 0;
}

.cpub-trending-rank {
  font-family: var(--font-mono);
  font-size: var(--text-xs);
  color: var(--text-faint);
  min-width: 16px;
}

.cpub-trending-link {
  color: var(--text);
  text-decoration: none;
  font-size: var(--text-sm);
  font-weight: var(--font-weight-medium);
  display: block;
}

.cpub-trending-link:hover {
  color: var(--accent);
}

.cpub-trending-type {
  font-size: var(--text-xs);
  color: var(--text-faint);
  text-transform: capitalize;
}

.cpub-trending-empty {
  color: var(--text-faint);
  font-size: var(--text-sm);
}

.cpub-sidebar-nav {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

.cpub-sidebar-link {
  font-size: var(--text-sm);
  color: var(--text-dim);
  text-decoration: none;
  padding: var(--space-1) 0;
}

.cpub-sidebar-link:hover {
  color: var(--accent);
}

@media (max-width: 1024px) {
  .cpub-home { grid-template-columns: 1fr; }
  .cpub-home-sidebar { border-left: none; padding-left: 0; border-top: 1px solid var(--border2); padding-top: var(--space-5); }
  .cpub-grid-4 { grid-template-columns: repeat(2, 1fr); }
  .cpub-feed-list { grid-template-columns: repeat(2, 1fr); }
}

@media (max-width: 640px) {
  .cpub-grid-4, .cpub-feed-list { grid-template-columns: 1fr; }
}
</style>
