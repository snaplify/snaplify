<script setup lang="ts">
const route = useRoute();
const slug = computed(() => route.params.slug as string);
const lessonSlug = computed(() => route.params.lessonSlug as string);

const { data: lesson } = await useFetch(() => `/api/learn/${slug.value}/${lessonSlug.value}`);

useSeoMeta({
  title: () => lesson.value ? `${lesson.value.title} — CommonPub` : 'Lesson — CommonPub',
});

const { isAuthenticated } = useAuth();
const toast = useToast();
const completing = ref(false);
const completed = ref(false);

async function markComplete(): Promise<void> {
  completing.value = true;
  try {
    await $fetch(`/api/learn/${slug.value}/${lessonSlug.value}/complete`, { method: 'POST' });
    completed.value = true;
    toast.success('Lesson completed!');
  } catch {
    toast.error('Failed to mark as complete');
  } finally {
    completing.value = false;
  }
}
</script>

<template>
  <div class="lesson-page" v-if="lesson">
    <NuxtLink :to="`/learn/${slug}`" class="cpub-back-link">Back to path</NuxtLink>

    <header class="lesson-header">
      <span class="lesson-type">{{ lesson.type }}</span>
      <h1 class="lesson-title">{{ lesson.title }}</h1>
      <span v-if="lesson.duration" class="lesson-duration">{{ lesson.duration }} min</span>
    </header>

    <div class="lesson-content">
      <!-- Render markdown content if available -->
      <div v-if="lesson.content" class="cpub-prose" v-html="lesson.content" />
      <!-- Video embed if lesson has a videoUrl -->
      <div v-else-if="lesson.videoUrl" class="lesson-video">
        <iframe :src="lesson.videoUrl" frameborder="0" allowfullscreen style="width: 100%; aspect-ratio: 16/9;" />
      </div>
      <div v-else class="lesson-empty">
        <i class="fa-solid fa-book-open" style="font-size: 24px; color: var(--text-faint);"></i>
        <p>This lesson has no content yet.</p>
      </div>
    </div>

    <footer class="lesson-footer" v-if="isAuthenticated">
      <button v-if="!completed" class="cpub-btn-primary" @click="markComplete" :disabled="completing">
        {{ completing ? 'Marking...' : 'Mark as Complete' }}
      </button>
      <div v-else class="lesson-completed-badge">
        <i class="fa-solid fa-check-circle"></i> Completed
      </div>
      <NuxtLink :to="`/learn/${slug}`" class="cpub-btn-secondary">Back to Path</NuxtLink>
    </footer>
  </div>
  <div v-else class="not-found"><h1>Lesson not found</h1></div>
</template>

<style scoped>
.lesson-page { max-width: var(--content-max-width); }
.cpub-back-link { color: var(--accent); text-decoration: none; font-size: var(--text-sm); display: inline-block; margin-bottom: var(--space-4); }
.cpub-back-link:hover { text-decoration: underline; }
.lesson-header { margin-bottom: var(--space-6); }
.lesson-type { font-size: var(--text-xs); color: var(--accent); text-transform: capitalize; font-weight: var(--font-weight-medium); }
.lesson-title { font-size: var(--text-2xl); font-weight: var(--font-weight-bold); margin: var(--space-2) 0; }
.lesson-duration { font-size: var(--text-sm); color: var(--text-faint); }
.lesson-content { min-height: 200px; }
.lesson-empty { color: var(--text-faint); font-size: 13px; text-align: center; padding: 48px 0; display: flex; flex-direction: column; align-items: center; gap: 8px; }
.lesson-video { margin: 16px 0; }
.lesson-completed-badge { display: inline-flex; align-items: center; gap: 6px; color: var(--green); font-size: 13px; font-weight: 600; }
.cpub-btn-secondary { display: inline-block; padding: 6px 14px; border: 2px solid var(--border); background: var(--surface); color: var(--text); font-size: 12px; text-decoration: none; cursor: pointer; margin-left: 8px; }
.cpub-btn-secondary:hover { background: var(--surface2); }
.lesson-footer { margin-top: var(--space-6); padding-top: var(--space-4); border-top: 1px solid var(--border); }
.cpub-btn-primary { padding: var(--space-2) var(--space-4); background: var(--accent); color: var(--color-on-primary); border: 1px solid var(--border); font-size: var(--text-sm); font-weight: var(--font-weight-medium); font-family: var(--font-sans); cursor: pointer; }
.cpub-btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }
.cpub-btn-primary:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }
.not-found { text-align: center; padding: var(--space-10) 0; color: var(--text-dim); }
</style>
