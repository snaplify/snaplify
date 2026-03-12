<script setup lang="ts">
useSeoMeta({ title: 'Videos — CommonPub' });
</script>

<template>
  <div class="cpub-videos">
    <h1 class="cpub-page-title">Video Hub</h1>
    <div class="cpub-coming-soon">
      <i class="fa-solid fa-video cpub-coming-icon"></i>
      <h2 class="cpub-coming-heading">Coming Soon</h2>
      <p class="cpub-coming-text">The video hub is being built. Soon you'll be able to browse tutorials, livestreams, and talks from the community.</p>
    </div>
  </div>
</template>

<style scoped>
.cpub-videos { max-width: var(--content-max-width); }
.cpub-page-title { font-size: var(--text-xl); font-weight: var(--font-weight-bold); margin-bottom: var(--space-6); }
.cpub-coming-soon { text-align: center; padding: var(--space-12) 0; border: 2px solid var(--border2); background: var(--surface); }
.cpub-coming-icon { font-size: 40px; color: var(--text-faint); margin-bottom: var(--space-4); }
.cpub-coming-heading { font-size: var(--text-lg); font-weight: var(--font-weight-bold); margin-bottom: var(--space-2); color: var(--text-dim); }
.cpub-coming-text { font-size: var(--text-sm); color: var(--text-faint); max-width: 400px; margin: 0 auto; line-height: var(--leading-relaxed); }
</style>
