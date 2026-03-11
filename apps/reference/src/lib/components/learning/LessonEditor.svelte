<script lang="ts">
  import { enhance } from '$app/forms';

  let {
    moduleId,
    lessons,
  }: {
    moduleId: string;
    lessons: Array<{
      id: string;
      title: string;
      slug: string;
      type: string;
      duration: number | null;
      sortOrder: number;
    }>;
  } = $props();

  let newLessonTitle = $state('');
  let newLessonType = $state('article');
  let newLessonDuration = $state('');
  let editingLessonId = $state<string | null>(null);
  let editingDuration = $state('');
  let deleteConfirmId = $state<string | null>(null);

  const lessonTypes = ['article', 'video', 'quiz', 'project', 'explainer'];

  function startEditing(lesson: { id: string; duration: number | null }): void {
    editingLessonId = lesson.id;
    editingDuration = lesson.duration != null ? String(lesson.duration) : '';
  }

  function buildReorderPayload(lessonId: string, direction: 'up' | 'down'): string {
    const ids = lessons.map((l) => l.id);
    const idx = ids.indexOf(lessonId);
    if (direction === 'up' && idx > 0) {
      [ids[idx - 1], ids[idx]] = [ids[idx]!, ids[idx - 1]!];
    } else if (direction === 'down' && idx < ids.length - 1) {
      [ids[idx], ids[idx + 1]] = [ids[idx + 1]!, ids[idx]!];
    }
    return JSON.stringify(ids);
  }
</script>

<div class="lesson-editor">
  {#if lessons.length === 0}
    <div class="empty-lessons">
      <p>No lessons in this module yet.</p>
    </div>
  {/if}

  <ul class="lesson-list" role="list">
    {#each lessons as lesson, idx (lesson.id)}
      <li class="lesson-item">
        {#if editingLessonId === lesson.id}
          <form
            method="POST"
            action="?/updateLesson"
            use:enhance={() => {
              return async ({ update }) => {
                editingLessonId = null;
                await update();
              };
            }}
            class="lesson-edit-form"
          >
            <input type="hidden" name="lessonId" value={lesson.id} />
            <input
              name="title"
              type="text"
              value={lesson.title}
              required
              maxlength="255"
              class="lesson-input"
              placeholder="Lesson title"
            />
            <select name="type" class="lesson-select">
              {#each lessonTypes as t}
                <option value={t} selected={lesson.type === t}>{t}</option>
              {/each}
            </select>
            <input
              name="duration"
              type="number"
              min="1"
              max="999"
              bind:value={editingDuration}
              class="lesson-duration-input"
              placeholder="min"
              title="Duration in minutes"
            />
            <button type="submit" class="btn btn-small btn-save">Save</button>
            <button type="button" class="btn btn-small" onclick={() => (editingLessonId = null)}>Cancel</button>
          </form>
        {:else}
          <div class="lesson-row">
            <span class="lesson-order">{idx + 1}.</span>
            <span class="lesson-type-badge">{lesson.type}</span>
            <span class="lesson-title">{lesson.title}</span>
            {#if lesson.duration}
              <span class="lesson-duration">{lesson.duration}m</span>
            {/if}
            <div class="lesson-actions">
              <!-- Reorder -->
              {#if idx > 0}
                <form method="POST" action="?/reorderLessons" use:enhance class="inline-form">
                  <input type="hidden" name="moduleId" value={moduleId} />
                  <input type="hidden" name="order" value={buildReorderPayload(lesson.id, 'up')} />
                  <button type="submit" class="btn btn-small btn-icon" aria-label="Move lesson up" title="Move up">&#9650;</button>
                </form>
              {/if}
              {#if idx < lessons.length - 1}
                <form method="POST" action="?/reorderLessons" use:enhance class="inline-form">
                  <input type="hidden" name="moduleId" value={moduleId} />
                  <input type="hidden" name="order" value={buildReorderPayload(lesson.id, 'down')} />
                  <button type="submit" class="btn btn-small btn-icon" aria-label="Move lesson down" title="Move down">&#9660;</button>
                </form>
              {/if}
              <button class="btn btn-small" onclick={() => startEditing(lesson)}>Edit</button>
              {#if deleteConfirmId === lesson.id}
                <form method="POST" action="?/deleteLesson" use:enhance class="inline-form">
                  <input type="hidden" name="lessonId" value={lesson.id} />
                  <button type="submit" class="btn btn-small btn-danger">Confirm</button>
                  <button type="button" class="btn btn-small" onclick={() => (deleteConfirmId = null)}>Cancel</button>
                </form>
              {:else}
                <button class="btn btn-small btn-danger-outline" onclick={() => (deleteConfirmId = lesson.id)}>Delete</button>
              {/if}
            </div>
          </div>
        {/if}
      </li>
    {/each}
  </ul>

  <form
    method="POST"
    action="?/addLesson"
    use:enhance={() => {
      return async ({ update, result }) => {
        if (result.type === 'success') {
          newLessonTitle = '';
          newLessonType = 'article';
          newLessonDuration = '';
        }
        await update();
      };
    }}
    class="add-lesson-form"
  >
    <input type="hidden" name="moduleId" value={moduleId} />
    <input
      name="title"
      type="text"
      placeholder="New lesson title..."
      bind:value={newLessonTitle}
      required
      maxlength="255"
      class="lesson-input"
    />
    <select name="type" bind:value={newLessonType} class="lesson-select">
      {#each lessonTypes as t}
        <option value={t}>{t}</option>
      {/each}
    </select>
    <input
      name="duration"
      type="number"
      min="1"
      max="999"
      bind:value={newLessonDuration}
      class="lesson-duration-input"
      placeholder="min"
      title="Duration in minutes"
    />
    <button type="submit" class="btn btn-add" disabled={!newLessonTitle.trim()}>Add</button>
  </form>
</div>

<style>
  .lesson-editor {
    padding: var(--space-3, 0.75rem) var(--space-4, 1rem);
  }

  .empty-lessons {
    padding: var(--space-4, 1rem) 0;
    text-align: center;
    color: var(--color-text-secondary, #888884);
    font-size: var(--text-sm, 0.875rem);
  }

  .lesson-list {
    list-style: none;
    margin: 0;
    padding: 0;
  }

  .lesson-item {
    padding: var(--space-2, 0.5rem) 0;
    border-bottom: 1px solid var(--color-border, #272725);
  }

  .lesson-item:last-child {
    border-bottom: none;
  }

  .lesson-row {
    display: flex;
    align-items: center;
    gap: var(--space-2, 0.5rem);
  }

  .lesson-order {
    font-size: var(--text-xs, 0.75rem);
    color: var(--color-text-secondary, #888884);
    min-width: 1.5em;
    text-align: right;
  }

  .lesson-type-badge {
    font-size: var(--text-xs, 0.75rem);
    padding: var(--space-1, 0.25rem) var(--space-2, 0.5rem);
    background: var(--color-surface-alt, #1c1c1a);
    border-radius: var(--radius-sm, 4px);
    color: var(--color-text-secondary, #888884);
    text-transform: capitalize;
    flex-shrink: 0;
  }

  .lesson-title {
    flex: 1;
    font-size: var(--text-sm, 0.875rem);
    color: var(--color-text, #d8d5cf);
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .lesson-duration {
    font-size: var(--text-xs, 0.75rem);
    color: var(--color-text-secondary, #888884);
    flex-shrink: 0;
  }

  .lesson-actions {
    display: flex;
    gap: var(--space-1, 0.25rem);
    flex-shrink: 0;
  }

  .lesson-edit-form {
    display: flex;
    gap: var(--space-1, 0.25rem);
    align-items: center;
    flex-wrap: wrap;
  }

  .lesson-input {
    flex: 1;
    min-width: 120px;
    padding: var(--space-1, 0.25rem) var(--space-2, 0.5rem);
    border: 1px solid var(--color-border, #272725);
    border-radius: var(--radius-sm, 4px);
    font-size: var(--text-sm, 0.875rem);
    background: var(--color-surface, #0c0c0b);
    color: var(--color-text, #d8d5cf);
    box-sizing: border-box;
  }

  .lesson-select {
    padding: var(--space-1, 0.25rem);
    border: 1px solid var(--color-border, #272725);
    border-radius: var(--radius-sm, 4px);
    font-size: var(--text-xs, 0.75rem);
    background: var(--color-surface, #0c0c0b);
    color: var(--color-text, #d8d5cf);
  }

  .lesson-duration-input {
    width: 60px;
    padding: var(--space-1, 0.25rem) var(--space-2, 0.5rem);
    border: 1px solid var(--color-border, #272725);
    border-radius: var(--radius-sm, 4px);
    font-size: var(--text-xs, 0.75rem);
    background: var(--color-surface, #0c0c0b);
    color: var(--color-text, #d8d5cf);
    box-sizing: border-box;
  }

  .add-lesson-form {
    display: flex;
    gap: var(--space-1, 0.25rem);
    margin-top: var(--space-3, 0.75rem);
    align-items: center;
  }

  .inline-form {
    display: flex;
    gap: var(--space-1, 0.25rem);
  }

  .btn {
    padding: var(--space-1, 0.25rem) var(--space-2, 0.5rem);
    border: 1px solid var(--color-border, #272725);
    border-radius: var(--radius-sm, 4px);
    font-size: var(--text-xs, 0.75rem);
    cursor: pointer;
    background: var(--color-surface-alt, #1c1c1a);
    color: var(--color-text, #d8d5cf);
  }

  .btn-small {
    padding: var(--space-1, 0.25rem) var(--space-2, 0.5rem);
  }

  .btn-icon {
    padding: var(--space-1, 0.25rem);
    line-height: 1;
    font-size: var(--text-xs, 0.75rem);
  }

  .btn-save {
    background: var(--color-primary, #2563eb);
    color: var(--color-on-primary, #ffffff);
    border-color: var(--color-primary, #2563eb);
  }

  .btn-add {
    background: var(--color-primary, #2563eb);
    color: var(--color-on-primary, #ffffff);
    border: none;
  }

  .btn-add:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .btn-danger {
    background: var(--color-error, #dc2626);
    color: var(--color-on-primary, #ffffff);
    border: none;
  }

  .btn-danger-outline {
    color: var(--color-error, #dc2626);
    border-color: var(--color-error, #dc2626);
    background: transparent;
  }
</style>
