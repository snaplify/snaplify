<script setup lang="ts">
const route = useRoute();
const slug = computed(() => route.params.slug as string);

const { data: community } = await useFetch(() => `/api/communities/${slug.value}`);
const { data: posts } = await useFetch(() => `/api/communities/${slug.value}/posts`);

useSeoMeta({
  title: () => community.value ? `${community.value.name} — CommonPub` : 'Community — CommonPub',
  description: () => community.value?.description || '',
});

const { isAuthenticated, user } = useAuth();
const activeTab = ref('feed');
const tabs = ['Feed', 'Projects', 'Discussions', 'Learn', 'Members'] as const;
const newPostContent = ref('');
const posting = ref(false);

const isAdmin = computed(() => {
  const role = community.value?.currentUserRole;
  return role === 'owner' || role === 'admin';
});

async function handlePost(): Promise<void> {
  posting.value = true;
  try {
    await $fetch(`/api/communities/${slug.value}/posts`, {
      method: 'POST',
      body: { content: newPostContent.value, type: 'discussion' },
    });
    newPostContent.value = '';
    refreshNuxtData();
  } catch { /* silent */ } finally {
    posting.value = false;
  }
}

async function handleJoin(): Promise<void> {
  try {
    await $fetch(`/api/communities/${slug.value}/join`, { method: 'POST' });
    refreshNuxtData();
  } catch { /* silent */ }
}
</script>

<template>
  <div class="cpub-community" v-if="community">
    <!-- Hero banner -->
    <header class="cpub-community-hero">
      <div class="cpub-community-hero-inner">
        <div class="cpub-community-icon">{{ community.name.charAt(0).toUpperCase() }}</div>
        <div class="cpub-community-info">
          <h1 class="cpub-community-name">{{ community.name }}</h1>
          <p class="cpub-community-desc" v-if="community.description">{{ community.description }}</p>
          <div class="cpub-community-stats">
            <span><strong>{{ community.memberCount }}</strong> members</span>
            <span><strong>{{ community.postCount }}</strong> posts</span>
          </div>
        </div>
        <div class="cpub-community-actions">
          <button v-if="isAuthenticated && !community.currentUserRole" class="cpub-join-btn" @click="handleJoin">Join</button>
          <span v-else-if="community.currentUserRole" class="cpub-member-badge">Member</span>
          <NuxtLink v-if="isAdmin" :to="`/communities/${slug}/settings`" class="cpub-settings-link">Settings</NuxtLink>
        </div>
      </div>
    </header>

    <!-- Tabs -->
    <nav class="cpub-community-tabs" role="tablist" aria-label="Community sections">
      <button
        v-for="tab in tabs"
        :key="tab"
        role="tab"
        :aria-selected="activeTab === tab.toLowerCase()"
        :class="['cpub-tab', { 'cpub-tab-active': activeTab === tab.toLowerCase() }]"
        @click="activeTab = tab.toLowerCase()"
      >{{ tab }}</button>
    </nav>

    <div class="cpub-community-layout">
      <main class="cpub-community-main">
        <!-- Feed tab -->
        <template v-if="activeTab === 'feed'">
          <div v-if="isAuthenticated" class="cpub-post-composer">
            <textarea
              v-model="newPostContent"
              class="cpub-post-textarea"
              placeholder="Share something with the community..."
              rows="3"
              aria-label="New post content"
            />
            <button class="cpub-post-btn" :disabled="posting || !newPostContent" @click="handlePost">
              {{ posting ? 'Posting...' : 'Post' }}
            </button>
          </div>

          <template v-if="posts?.length">
            <div class="cpub-post-card" v-for="post in posts" :key="post.id">
              <div class="cpub-post-header">
                <AuthorRow
                  :author="post.author"
                  :date="post.createdAt"
                />
              </div>
              <p class="cpub-post-content">{{ post.content }}</p>
              <div class="cpub-post-footer">
                <span>{{ post.likeCount }} likes</span>
                <span>{{ post.replyCount }} replies</span>
              </div>
            </div>
          </template>
          <p class="cpub-empty" v-else>No posts yet. Be the first to start a discussion!</p>
        </template>

        <!-- Other tabs -->
        <template v-else>
          <p class="cpub-empty">{{ activeTab }} content coming soon.</p>
        </template>
      </main>

      <!-- Sidebar -->
      <aside class="cpub-community-sidebar">
        <div class="cpub-sidebar-card">
          <h3 class="cpub-sidebar-card-title">About</h3>
          <p class="cpub-sidebar-card-text">{{ community.description || 'No description.' }}</p>
        </div>
        <div v-if="isAdmin" class="cpub-sidebar-card">
          <h3 class="cpub-sidebar-card-title">Moderation</h3>
          <NuxtLink :to="`/communities/${slug}/members`" class="cpub-sidebar-link">Manage Members</NuxtLink>
          <NuxtLink :to="`/communities/${slug}/settings`" class="cpub-sidebar-link">Community Settings</NuxtLink>
        </div>
      </aside>
    </div>
  </div>
  <div v-else class="cpub-not-found"><h1>Community not found</h1></div>
</template>

<style scoped>
.cpub-community { max-width: 100%; }
.cpub-community-hero { background: var(--surface); border-bottom: var(--border-width-default) solid var(--border); padding: var(--space-8) var(--space-6); }
.cpub-community-hero-inner { max-width: var(--content-max-width); margin: 0 auto; display: flex; gap: var(--space-5); align-items: flex-start; }
.cpub-community-icon { width: 64px; height: 64px; background: var(--accent-bg); border: var(--border-width-default) solid var(--border); display: flex; align-items: center; justify-content: center; font-family: var(--font-mono); font-size: var(--text-2xl); font-weight: var(--font-weight-bold); color: var(--accent); flex-shrink: 0; }
.cpub-community-info { flex: 1; }
.cpub-community-name { font-size: var(--text-2xl); font-weight: var(--font-weight-bold); margin-bottom: var(--space-2); }
.cpub-community-desc { font-size: var(--text-sm); color: var(--text-dim); line-height: var(--leading-relaxed); margin-bottom: var(--space-3); }
.cpub-community-stats { display: flex; gap: var(--space-5); font-size: var(--text-sm); color: var(--text-dim); }
.cpub-community-stats strong { color: var(--text); font-weight: var(--font-weight-semibold); }
.cpub-community-actions { display: flex; gap: var(--space-3); align-items: center; }
.cpub-join-btn { padding: var(--space-2) var(--space-5); background: var(--accent); color: #fff; border: var(--border-width-default) solid var(--border); font-size: var(--text-sm); font-weight: var(--font-weight-medium); cursor: pointer; box-shadow: var(--shadow-sm); font-family: var(--font-sans); }
.cpub-join-btn:hover { background: var(--color-primary-hover); }
.cpub-member-badge { font-family: var(--font-mono); font-size: 10px; text-transform: uppercase; letter-spacing: var(--tracking-wide); color: var(--green); background: var(--green-bg); padding: var(--space-1) var(--space-3); border: 1px solid var(--green-border); }
.cpub-settings-link { color: var(--text-dim); font-size: var(--text-sm); text-decoration: none; }
.cpub-settings-link:hover { color: var(--accent); }
.cpub-community-tabs { display: flex; gap: 0; border-bottom: var(--border-width-default) solid var(--border); background: var(--surface); padding: 0 var(--space-6); position: sticky; top: 48px; z-index: var(--z-sticky); }
.cpub-tab { padding: var(--space-3) var(--space-4); border: none; background: none; font-family: var(--font-mono); font-size: 11px; font-weight: var(--font-weight-semibold); text-transform: uppercase; letter-spacing: var(--tracking-wide); color: var(--text-dim); cursor: pointer; border-bottom: 2px solid transparent; margin-bottom: -2px; }
.cpub-tab:hover { color: var(--text); }
.cpub-tab-active { color: var(--text); border-bottom-color: var(--accent); }
.cpub-community-layout { display: grid; grid-template-columns: 1fr 280px; gap: var(--space-6); max-width: var(--content-max-width); margin: 0 auto; padding: var(--space-6); }
.cpub-community-main { min-width: 0; }
.cpub-post-composer { margin-bottom: var(--space-6); }
.cpub-post-textarea { width: 100%; padding: var(--space-3); border: var(--border-width-default) solid var(--border); background: var(--surface); color: var(--text); font-family: var(--font-sans); font-size: var(--text-sm); resize: vertical; margin-bottom: var(--space-2); }
.cpub-post-textarea:focus { outline: none; border-color: var(--accent); }
.cpub-post-btn { padding: var(--space-2) var(--space-4); background: var(--accent); color: #fff; border: var(--border-width-default) solid var(--border); font-size: var(--text-sm); font-family: var(--font-sans); cursor: pointer; }
.cpub-post-btn:disabled { opacity: 0.5; cursor: not-allowed; }
.cpub-post-card { padding: var(--space-4); border: var(--border-width-default) solid var(--border); background: var(--surface); margin-bottom: var(--space-3); }
.cpub-post-content { font-size: var(--text-sm); line-height: var(--leading-relaxed); margin: var(--space-3) 0; }
.cpub-post-footer { display: flex; gap: var(--space-4); font-size: var(--text-xs); color: var(--text-faint); }
.cpub-community-sidebar { }
.cpub-sidebar-card { padding: var(--space-4); border: var(--border-width-default) solid var(--border); background: var(--surface); margin-bottom: var(--space-4); }
.cpub-sidebar-card-title { font-family: var(--font-mono); font-size: var(--text-label); font-weight: var(--font-weight-semibold); text-transform: uppercase; letter-spacing: var(--tracking-widest); color: var(--text-faint); margin-bottom: var(--space-3); }
.cpub-sidebar-card-text { font-size: var(--text-sm); color: var(--text-dim); line-height: var(--leading-relaxed); }
.cpub-sidebar-link { display: block; font-size: var(--text-sm); color: var(--accent); text-decoration: none; padding: var(--space-1) 0; }
.cpub-sidebar-link:hover { text-decoration: underline; }
.cpub-empty { color: var(--text-faint); text-align: center; padding: var(--space-8) 0; font-size: var(--text-sm); }
.cpub-not-found { text-align: center; padding: var(--space-10) 0; color: var(--text-dim); }
</style>
