<script setup lang="ts">
useSeoMeta({ title: 'Contests — CommonPub' });
</script>

<template>
  <div class="cpub-contests">
    <h1 class="cpub-page-title">Contests</h1>
    <div class="cpub-coming-soon">
      <i class="fa-solid fa-trophy cpub-coming-icon"></i>
      <h2 class="cpub-coming-heading">Coming Soon</h2>
      <p class="cpub-coming-text">Contests and challenges are being built. Check back later for community competitions, prizes, and leaderboards.</p>
    </div>
  </div>
</template>

<style scoped>
.cpub-contests { max-width: var(--content-max-width); }
.cpub-page-title { font-size: var(--text-xl); font-weight: var(--font-weight-bold); margin-bottom: var(--space-6); }
.cpub-coming-soon { text-align: center; padding: var(--space-12) 0; border: 2px solid var(--border2); background: var(--surface); }
.cpub-coming-icon { font-size: 40px; color: var(--text-faint); margin-bottom: var(--space-4); }
.cpub-coming-heading { font-size: var(--text-lg); font-weight: var(--font-weight-bold); margin-bottom: var(--space-2); color: var(--text-dim); }
.cpub-coming-text { font-size: var(--text-sm); color: var(--text-faint); max-width: 400px; margin: 0 auto; line-height: var(--leading-relaxed); }
</style>
