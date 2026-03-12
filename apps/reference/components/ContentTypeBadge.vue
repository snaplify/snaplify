<script setup lang="ts">
defineProps<{
  type: string;
}>();

const iconMap: Record<string, string> = {
  project: 'fa-solid fa-microchip',
  article: 'fa-solid fa-file-lines',
  guide: 'fa-solid fa-book',
  blog: 'fa-solid fa-pen-nib',
  explainer: 'fa-solid fa-lightbulb',
};
</script>

<template>
  <span class="cpub-type-badge" :data-content-type="type">
    <i :class="iconMap[type] || 'fa-solid fa-file'" class="cpub-badge-icon"></i>
    {{ type }}
  </span>
</template>

<style scoped>
.cpub-type-badge {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-family: var(--font-mono);
  font-size: 10px;
  font-weight: var(--font-weight-semibold);
  text-transform: uppercase;
  letter-spacing: 0.06em;
  padding: 3px 10px;
  border: 2px solid var(--border);
  box-shadow: 3px 3px 0 var(--border);
}

.cpub-badge-icon {
  font-size: 9px;
}

[data-content-type="project"] {
  background: rgba(91, 156, 246, 0.08);
  color: var(--accent);
}

[data-content-type="article"] {
  background: rgba(20, 184, 166, 0.08);
  color: var(--teal);
}

[data-content-type="guide"] {
  background: rgba(139, 92, 246, 0.08);
  color: var(--purple);
}

[data-content-type="blog"] {
  background: rgba(236, 72, 153, 0.08);
  color: var(--pink);
}

[data-content-type="explainer"] {
  background: rgba(245, 158, 11, 0.08);
  color: var(--yellow);
}
</style>
