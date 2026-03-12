<script setup lang="ts">
const { user, isAuthenticated, isAdmin, signOut } = useAuth();
</script>

<template>
  <div class="app-layout">
    <header class="topbar">
      <div class="topbar-inner">
        <NuxtLink to="/" class="topbar-brand">
          <span class="topbar-logo">CommonPub</span>
        </NuxtLink>
        <nav class="topbar-nav" aria-label="Main navigation">
          <NuxtLink to="/dashboard" class="tl">Dashboard</NuxtLink>
          <NuxtLink to="/communities" class="tl">Communities</NuxtLink>
          <NuxtLink to="/learn" class="tl">Learn</NuxtLink>
          <NuxtLink to="/docs" class="tl">Docs</NuxtLink>
          <NuxtLink v-if="isAdmin" to="/admin" class="tl">Admin</NuxtLink>
        </nav>
        <div class="topbar-search">
          <NuxtLink to="/search" class="search-btn" aria-label="Search">
            <i class="fa-solid fa-magnifying-glass"></i>
            <span class="search-label">Search</span>
            <span class="kbd">&#8984;K</span>
          </NuxtLink>
        </div>
        <div class="topbar-right">
          <template v-if="isAuthenticated">
            <NuxtLink to="/create" class="btn btn-primary btn-sm">
              <i class="fa-solid fa-plus"></i> Create
            </NuxtLink>
            <NuxtLink to="/notifications" class="icon-btn" aria-label="Notifications" title="Notifications">
              <i class="fa-solid fa-bell"></i>
            </NuxtLink>
            <NuxtLink to="/messages" class="icon-btn" aria-label="Messages" title="Messages">
              <i class="fa-solid fa-envelope"></i>
            </NuxtLink>
            <NuxtLink :to="`/u/${(user as any)?.username}`" class="topbar-user">
              <span class="topbar-avatar">{{ ((user as any)?.displayName || (user as any)?.username || 'U').charAt(0).toUpperCase() }}</span>
            </NuxtLink>
            <button class="btn btn-ghost btn-sm" @click="signOut">Sign out</button>
          </template>
          <NuxtLink v-else to="/auth/login" class="btn btn-primary btn-sm">Log in</NuxtLink>
        </div>
      </div>
    </header>

    <div class="app-body">
      <aside class="sidebar" aria-label="Sidebar">
        <nav class="sidebar-nav">
          <NuxtLink to="/">
            <i class="fa-solid fa-house" style="width:14px;margin-right:4px"></i> Home
          </NuxtLink>
          <NuxtLink to="/feed">
            <i class="fa-solid fa-rss" style="width:14px;margin-right:4px"></i> Feed
          </NuxtLink>
          <NuxtLink to="/project">
            <i class="fa-solid fa-microchip" style="width:14px;margin-right:4px"></i> Projects
          </NuxtLink>
          <NuxtLink to="/article">
            <i class="fa-solid fa-file-lines" style="width:14px;margin-right:4px"></i> Articles
          </NuxtLink>
          <NuxtLink to="/guide">
            <i class="fa-solid fa-book" style="width:14px;margin-right:4px"></i> Guides
          </NuxtLink>
          <NuxtLink to="/blog">
            <i class="fa-solid fa-pen-nib" style="width:14px;margin-right:4px"></i> Blog
          </NuxtLink>
          <NuxtLink to="/explainer">
            <i class="fa-solid fa-lightbulb" style="width:14px;margin-right:4px"></i> Explainers
          </NuxtLink>
          <NuxtLink to="/search">
            <i class="fa-solid fa-magnifying-glass" style="width:14px;margin-right:4px"></i> Search
          </NuxtLink>
        </nav>
      </aside>

      <main class="main-content">
        <slot />
      </main>
    </div>
  </div>
</template>

<style scoped>
.app-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: var(--bg);
  color: var(--text);
  font-family: var(--font-sans);
}

/* -- Topbar -- */
.topbar {
  background: var(--surface);
  border-bottom: 2px solid var(--border);
  display: flex;
  align-items: center;
  padding: 0 var(--space-4);
  height: 48px;
  box-shadow: var(--shadow-sm);
  position: sticky;
  top: 0;
  z-index: var(--z-sticky);
}

.topbar-inner {
  display: flex;
  align-items: center;
  width: 100%;
  max-width: var(--content-wide-max-width);
  margin: 0 auto;
  gap: var(--space-4);
}

.topbar-brand {
  text-decoration: none;
  margin-right: var(--space-2);
}

.topbar-logo {
  font-family: var(--font-mono);
  font-size: 13px;
  font-weight: 600;
  color: var(--text);
}

.topbar-nav {
  display: flex;
  gap: var(--space-1);
  flex: 1;
}

.tl {
  padding: 6px 10px;
  font-size: 13px;
  color: var(--text-dim);
  border-radius: var(--radius);
  text-decoration: none;
  transition: all 0.15s;
}

.tl:hover,
.tl.router-link-active {
  background: var(--surface2);
  color: var(--text);
}

/* -- Search -- */
.search-btn {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: 5px 12px;
  background: var(--surface2);
  border: 2px solid var(--border2);
  color: var(--text-dim);
  text-decoration: none;
  font-size: 12px;
  min-width: 160px;
  transition: all 0.15s;
}

.search-btn:hover {
  border-color: var(--border);
  color: var(--text);
}

.search-label { flex: 1; }
.kbd {
  font-family: var(--font-mono);
  font-size: 10px;
  color: var(--text-faint);
  background: var(--surface);
  padding: 1px 4px;
  border: 1px solid var(--border2);
}

.topbar-right {
  display: flex;
  gap: var(--space-2);
  align-items: center;
}

/* -- Icon Buttons -- */
.icon-btn {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: 2px solid transparent;
  color: var(--text-dim);
  font-size: 13px;
  text-decoration: none;
  transition: all 0.15s;
  position: relative;
}

.icon-btn:hover {
  background: var(--surface2);
  border-color: var(--border);
  color: var(--text);
}

.icon-btn:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 1px;
}

/* -- Avatar -- */
.topbar-avatar {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: var(--surface3);
  border: 2px solid var(--border);
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-mono);
  font-size: 11px;
  font-weight: 600;
  color: var(--text-dim);
}

.topbar-user {
  text-decoration: none;
}

.topbar-user:hover .topbar-avatar {
  border-color: var(--accent);
  color: var(--accent);
}

/* -- Buttons -- */
.btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  border-radius: var(--radius);
  border: 2px solid transparent;
  cursor: pointer;
  font-family: var(--font-sans);
  font-weight: 500;
  transition: all 0.15s;
  white-space: nowrap;
  text-decoration: none;
}

.btn-sm {
  padding: 4px 10px;
  font-size: 12px;
}

.btn-primary {
  background: var(--accent);
  color: #fff;
  border-color: var(--accent);
  box-shadow: var(--shadow-sm);
}

.btn-primary:hover {
  box-shadow: var(--shadow-md);
  transform: translate(-1px, -1px);
}

.btn-ghost {
  background: transparent;
  color: var(--text-dim);
  border-color: transparent;
}

.btn-ghost:hover {
  background: var(--surface2);
  color: var(--text);
}

/* -- Sidebar -- */
.app-body {
  display: flex;
  flex: 1;
}

.sidebar {
  width: 200px;
  flex-shrink: 0;
  background: var(--surface);
  border-right: 2px solid var(--border);
  padding: var(--space-4) 0;
}

.sidebar-nav {
  display: flex;
  flex-direction: column;
}

.sidebar-nav a {
  display: flex;
  align-items: center;
  padding: 6px var(--space-4);
  font-family: var(--font-mono);
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--text-faint);
  text-decoration: none;
  transition: color 0.15s;
}

.sidebar-nav a:hover {
  color: var(--accent);
  background: var(--surface2);
}

.sidebar-nav a.router-link-active {
  color: var(--accent);
  font-weight: 600;
}

/* -- Main -- */
.main-content {
  flex: 1;
  max-width: var(--content-max-width);
  padding: var(--space-8);
}

/* -- Focus -- */
.tl:focus-visible,
.sidebar-nav a:focus-visible,
.btn:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}
</style>
