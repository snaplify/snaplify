<script setup lang="ts">
const route = useRoute();
const username = computed(() => route.params.username as string);

const { data: profile } = await useFetch(() => `/api/users/${username.value}`);
const { data: userContent } = await useFetch(() => `/api/users/${username.value}/content`);

useSeoMeta({
  title: () => profile.value ? `@${profile.value.username} — CommonPub` : 'User — CommonPub',
  description: () => profile.value?.bio || `Profile for ${username.value}`,
});

const { user } = useAuth();
const isOwn = computed(() => user.value?.username === username.value);
const activeTab = ref('projects');
const tabs = ['Projects', 'Articles', 'Explainers', 'About'] as const;

const filteredContent = computed(() => {
  if (!userContent.value) return [];
  const items = Array.isArray(userContent.value) ? userContent.value : userContent.value.items || [];
  if (activeTab.value === 'about') return items;
  return items.filter((i: { type: string }) => i.type === activeTab.value.toLowerCase().replace(/s$/, ''));
});
</script>

<template>
  <div class="cpub-profile" v-if="profile">
    <!-- Hero -->
    <header class="cpub-profile-hero">
      <div class="cpub-profile-hero-inner">
        <div class="cpub-profile-avatar">
          <img v-if="profile.avatar" :src="profile.avatar" :alt="profile.displayName || profile.username" />
          <span v-else class="cpub-profile-initials">{{ (profile.displayName || profile.username).charAt(0).toUpperCase() }}</span>
        </div>
        <div class="cpub-profile-info">
          <h1 class="cpub-profile-name">{{ profile.displayName || profile.username }}</h1>
          <p class="cpub-profile-handle">@{{ profile.username }}</p>
          <p class="cpub-profile-bio" v-if="profile.bio">{{ profile.bio }}</p>
          <div class="cpub-profile-meta">
            <span v-if="profile.location">{{ profile.location }}</span>
            <a v-if="profile.website" :href="profile.website" target="_blank" rel="noopener noreferrer" class="cpub-profile-website">{{ profile.website }}</a>
          </div>
          <div class="cpub-profile-actions" v-if="!isOwn">
            <button class="cpub-follow-btn">Follow</button>
          </div>
          <NuxtLink v-if="isOwn" to="/settings/profile" class="cpub-edit-profile-link">Edit Profile</NuxtLink>
        </div>
      </div>
    </header>

    <!-- Stats -->
    <div class="cpub-profile-stats-bar">
      <div class="cpub-stat">
        <span class="cpub-stat-value">{{ profile.stats?.projects ?? 0 }}</span>
        <span class="cpub-stat-label">Projects</span>
      </div>
      <div class="cpub-stat">
        <span class="cpub-stat-value">{{ profile.stats?.followers ?? 0 }}</span>
        <span class="cpub-stat-label">Followers</span>
      </div>
      <div class="cpub-stat">
        <span class="cpub-stat-value">{{ profile.stats?.following ?? 0 }}</span>
        <span class="cpub-stat-label">Following</span>
      </div>
      <div class="cpub-stat">
        <span class="cpub-stat-value">{{ profile.stats?.articles ?? 0 }}</span>
        <span class="cpub-stat-label">Articles</span>
      </div>
    </div>

    <!-- Tabs -->
    <nav class="cpub-profile-tabs" role="tablist" aria-label="Profile sections">
      <button
        v-for="tab in tabs"
        :key="tab"
        role="tab"
        :aria-selected="activeTab === tab.toLowerCase()"
        :class="['cpub-tab', { 'cpub-tab-active': activeTab === tab.toLowerCase() }]"
        @click="activeTab = tab.toLowerCase()"
      >{{ tab }}</button>
    </nav>

    <!-- Content -->
    <div class="cpub-profile-content">
      <template v-if="activeTab === 'about'">
        <div class="cpub-about-section">
          <p v-if="profile.bio">{{ profile.bio }}</p>
          <p v-else class="cpub-empty">No bio yet.</p>
        </div>
      </template>
      <template v-else>
        <div v-if="filteredContent.length" class="cpub-profile-grid">
          <ContentCard v-for="item in filteredContent" :key="item.id" :item="item" />
        </div>
        <p class="cpub-empty" v-else>No {{ activeTab }} yet.</p>
      </template>
    </div>
  </div>
  <div v-else class="cpub-not-found"><h1>User not found</h1></div>
</template>

<style scoped>
.cpub-profile { max-width: 100%; }
.cpub-profile-hero { background: var(--surface); border-bottom: var(--border-width-default) solid var(--border); padding: var(--space-8) var(--space-6); }
.cpub-profile-hero-inner { max-width: var(--content-max-width); margin: 0 auto; display: flex; gap: var(--space-6); align-items: flex-start; }
.cpub-profile-avatar { width: 80px; height: 80px; border-radius: var(--radius-full); background: var(--surface3); border: var(--border-width-default) solid var(--border); display: flex; align-items: center; justify-content: center; overflow: hidden; flex-shrink: 0; }
.cpub-profile-avatar img { width: 100%; height: 100%; object-fit: cover; }
.cpub-profile-initials { font-family: var(--font-mono); font-size: var(--text-2xl); font-weight: var(--font-weight-bold); color: var(--text-dim); }
.cpub-profile-info { flex: 1; }
.cpub-profile-name { font-size: var(--text-2xl); font-weight: var(--font-weight-bold); margin-bottom: var(--space-1); }
.cpub-profile-handle { font-size: var(--text-sm); color: var(--text-faint); margin-bottom: var(--space-2); }
.cpub-profile-bio { font-size: var(--text-sm); color: var(--text-dim); line-height: var(--leading-relaxed); margin-bottom: var(--space-3); }
.cpub-profile-meta { display: flex; gap: var(--space-4); font-size: var(--text-xs); color: var(--text-faint); margin-bottom: var(--space-3); }
.cpub-profile-website { color: var(--accent); text-decoration: none; }
.cpub-profile-website:hover { text-decoration: underline; }
.cpub-profile-actions { display: flex; gap: var(--space-3); }
.cpub-follow-btn { padding: var(--space-2) var(--space-5); background: var(--accent); color: #fff; border: var(--border-width-default) solid var(--border); font-size: var(--text-sm); cursor: pointer; font-family: var(--font-sans); box-shadow: var(--shadow-sm); }
.cpub-follow-btn:hover { background: var(--color-primary-hover); }
.cpub-edit-profile-link { font-size: var(--text-sm); color: var(--text-dim); text-decoration: none; border: 1px solid var(--border2); padding: var(--space-1) var(--space-3); }
.cpub-edit-profile-link:hover { border-color: var(--border); }
.cpub-profile-stats-bar { display: flex; gap: var(--space-8); padding: var(--space-4) var(--space-6); border-bottom: 1px solid var(--border2); max-width: var(--content-max-width); margin: 0 auto; }
.cpub-stat { display: flex; flex-direction: column; align-items: center; gap: 2px; }
.cpub-stat-value { font-size: var(--text-lg); font-weight: var(--font-weight-bold); }
.cpub-stat-label { font-size: var(--text-xs); color: var(--text-faint); }
.cpub-profile-tabs { display: flex; gap: 0; border-bottom: var(--border-width-default) solid var(--border); padding: 0 var(--space-6); max-width: var(--content-max-width); margin: 0 auto; }
.cpub-tab { padding: var(--space-3) var(--space-4); border: none; background: none; font-family: var(--font-mono); font-size: 11px; font-weight: var(--font-weight-semibold); text-transform: uppercase; letter-spacing: var(--tracking-wide); color: var(--text-dim); cursor: pointer; border-bottom: 2px solid transparent; margin-bottom: -2px; }
.cpub-tab:hover { color: var(--text); }
.cpub-tab-active { color: var(--text); border-bottom-color: var(--accent); }
.cpub-profile-content { max-width: var(--content-max-width); margin: 0 auto; padding: var(--space-6); }
.cpub-profile-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: var(--space-4); }
.cpub-about-section { font-size: var(--text-sm); color: var(--text-dim); line-height: var(--leading-relaxed); }
.cpub-empty { color: var(--text-faint); text-align: center; padding: var(--space-8) 0; font-size: var(--text-sm); }
.cpub-not-found { text-align: center; padding: var(--space-10) 0; color: var(--text-dim); }
</style>
