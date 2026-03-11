<script lang="ts">
  import { enhance } from '$app/forms';
  import { Button } from '@snaplify/ui';
  import PathEditor from '$lib/components/learning/PathEditor.svelte';
  import ModuleEditor from '$lib/components/learning/ModuleEditor.svelte';
  import EditorLayout from '$lib/components/editor/EditorLayout.svelte';
  import type { PageData, ActionData } from './$types';

  let { data, form }: { data: PageData; form: ActionData } = $props();

  let title = $state(data.path.title);

  let totalLessons = $derived(
    data.path.modules.reduce((sum: number, m: { lessons: unknown[] }) => sum + m.lessons.length, 0),
  );
</script>

<svelte:head>
  <title>Edit: {data.path.title} — Snaplify</title>
</svelte:head>

<EditorLayout
  bind:title
  type="learning path"
  status={data.path.status === 'published' ? 'published' : 'draft'}
  backHref="/learn/{data.path.slug}"
>
  {#snippet leftPanel()}
    <div class="module-nav">
      <div class="mn-header">
        <span class="mn-title">Curriculum</span>
        <span class="mn-count">{data.path.modules.length}M · {totalLessons}L</span>
      </div>
      <div class="mn-list">
        {#each data.path.modules as mod, mi}
          <div class="mn-module">
            <span class="mn-module-num">{mi + 1}</span>
            <span class="mn-module-name">{mod.title || 'Untitled Module'}</span>
          </div>
          {#each mod.lessons as lesson, li}
            <div class="mn-lesson">
              <span class="mn-lesson-num">{mi + 1}.{li + 1}</span>
              <span class="mn-lesson-name">{lesson.title || 'Untitled'}</span>
              <span class="mn-lesson-type">{lesson.type}</span>
            </div>
          {/each}
        {/each}
      </div>
    </div>
  {/snippet}

  <div class="learn-canvas">
    {#if form?.error}
      <div class="form-message form-error" role="alert">{form.error}</div>
    {/if}
    {#if form?.published}
      <div class="form-message form-success" role="status">Published successfully.</div>
    {/if}

    <section class="edit-section">
      <h2 class="section-title">Path Details</h2>
      <PathEditor path={data.path} />
    </section>

    <section class="edit-section">
      <div class="section-header">
        <h2 class="section-title">Modules & Lessons</h2>
        <p class="section-desc">Build your learning path curriculum.</p>
      </div>
      <ModuleEditor modules={data.path.modules} pathSlug={data.path.slug} />
    </section>
  </div>

  {#snippet rightPanel()}
    <div class="learn-props">
      <div class="lp-section">
        <span class="lp-label">Status</span>
        <span class="lp-value">{data.path.status ?? 'draft'}</span>
      </div>
      <div class="lp-section">
        <span class="lp-label">Stats</span>
        <div class="lp-stat">{data.path.modules.length} modules</div>
        <div class="lp-stat">{totalLessons} lessons</div>
      </div>
      {#if data.path.status !== 'published'}
        <div class="lp-section">
          <form method="POST" action="?/publish" use:enhance>
            <Button variant="primary" type="submit" size="sm">Publish Path</Button>
          </form>
        </div>
      {/if}
    </div>
  {/snippet}
</EditorLayout>

<style>
  /* Left panel: module tree */
  .module-nav {
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  .mn-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: var(--space-3, 0.75rem);
    border-bottom: 1px solid var(--color-border, #272725);
  }

  .mn-title {
    font-family: var(--font-mono, monospace);
    font-size: 10px;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: var(--color-text-secondary, #888884);
  }

  .mn-count {
    font-family: var(--font-mono, monospace);
    font-size: 10px;
    color: var(--color-text-muted, #444440);
  }

  .mn-list {
    flex: 1;
    overflow-y: auto;
    padding: var(--space-2, 0.5rem);
  }

  .mn-module {
    display: flex;
    align-items: center;
    gap: var(--space-2, 0.5rem);
    padding: var(--space-2, 0.5rem);
    font-size: var(--text-xs, 0.75rem);
    font-weight: var(--font-weight-medium, 500);
    color: var(--color-text, #d8d5cf);
    border-radius: var(--radius-sm, 4px);
    cursor: pointer;
  }

  .mn-module:hover {
    background: var(--color-surface-alt, #141413);
  }

  .mn-module-num {
    font-family: var(--font-mono, monospace);
    font-size: 10px;
    color: var(--color-primary, #5b9cf6);
    min-width: 16px;
  }

  .mn-module-name {
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .mn-lesson {
    display: flex;
    align-items: center;
    gap: var(--space-2, 0.5rem);
    padding: var(--space-1, 0.25rem) var(--space-2, 0.5rem) var(--space-1, 0.25rem) var(--space-6, 1.5rem);
    font-size: 11px;
    color: var(--color-text-secondary, #888884);
    border-radius: var(--radius-sm, 4px);
    cursor: pointer;
  }

  .mn-lesson:hover {
    background: var(--color-surface-alt, #141413);
    color: var(--color-text, #d8d5cf);
  }

  .mn-lesson-num {
    font-family: var(--font-mono, monospace);
    font-size: 9px;
    color: var(--color-text-muted, #444440);
    min-width: 24px;
  }

  .mn-lesson-name {
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .mn-lesson-type {
    font-family: var(--font-mono, monospace);
    font-size: 8px;
    text-transform: uppercase;
    color: var(--color-text-muted, #444440);
  }

  /* Center canvas */
  .learn-canvas {
    min-height: 100%;
  }

  .form-message {
    padding: var(--space-2, 0.5rem) var(--space-3, 0.75rem);
    margin-bottom: var(--space-4, 1rem);
    border-radius: var(--radius-sm, 4px);
    font-size: var(--text-xs, 0.75rem);
  }

  .form-error {
    background: rgba(248, 113, 113, 0.08);
    border: 1px solid var(--color-error, #f87171);
    color: var(--color-error, #f87171);
  }

  .form-success {
    background: rgba(74, 222, 128, 0.08);
    border: 1px solid var(--color-success, #4ade80);
    color: var(--color-success, #4ade80);
  }

  .edit-section {
    margin-bottom: var(--space-8, 2rem);
    padding: var(--space-4, 1rem);
    border: 1px solid var(--color-border, #272725);
    border-radius: var(--radius-md, 6px);
  }

  .section-header {
    margin-bottom: var(--space-3, 0.75rem);
  }

  .section-title {
    font-size: var(--text-md, 1rem);
    font-weight: var(--font-weight-semibold, 600);
    color: var(--color-text, #d8d5cf);
    margin: 0 0 var(--space-1, 0.25rem);
  }

  .section-desc {
    margin: 0;
    font-size: var(--text-xs, 0.75rem);
    color: var(--color-text-secondary, #888884);
  }

  /* Right panel */
  .learn-props {
    padding: var(--space-3, 0.75rem);
    display: flex;
    flex-direction: column;
    gap: var(--space-3, 0.75rem);
  }

  .lp-section {
    display: flex;
    flex-direction: column;
    gap: var(--space-1, 0.25rem);
  }

  .lp-label {
    font-family: var(--font-mono, monospace);
    font-size: 10px;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: var(--color-text-secondary, #888884);
  }

  .lp-value {
    font-size: var(--text-xs, 0.75rem);
    color: var(--color-text, #d8d5cf);
    text-transform: capitalize;
  }

  .lp-stat {
    font-size: var(--text-xs, 0.75rem);
    color: var(--color-text-muted, #444440);
    font-family: var(--font-mono, monospace);
  }
</style>
