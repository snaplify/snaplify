<script lang="ts">
  import type {
    ExplainerSection,
    TextSection,
    QuizSection,
    CheckpointSection,
  } from '@snaplify/explainer';
  import SectionEditor from './SectionEditor.svelte';

  let {
    sections = [],
    onsectionschange,
  }: {
    sections: ExplainerSection[];
    onsectionschange?: (sections: ExplainerSection[]) => void;
  } = $props();

  let activeIndex = $state(0);
  let activeSection = $derived(sections[activeIndex]);

  function generateAnchor(title: string): string {
    return (
      title
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '') || `section-${Date.now()}`
    );
  }

  function handleAdd(type: string) {
    const id = `sec-${Date.now()}`;
    let newSection: ExplainerSection;

    switch (type) {
      case 'quiz':
        newSection = {
          id,
          title: 'New Quiz',
          anchor: `quiz-${Date.now()}`,
          type: 'quiz',
          content: [],
          questions: [],
          passingScore: 70,
          isGate: false,
        } satisfies QuizSection;
        break;
      case 'checkpoint':
        newSection = {
          id,
          title: 'Checkpoint',
          anchor: `checkpoint-${Date.now()}`,
          type: 'checkpoint',
          content: [],
          requiresPrevious: true,
        } satisfies CheckpointSection;
        break;
      default:
        newSection = {
          id,
          title: 'New Section',
          anchor: `section-${Date.now()}`,
          type: 'text',
          content: [],
        } satisfies TextSection;
    }

    const updated = [...sections, newSection];
    onsectionschange?.(updated);
    activeIndex = updated.length - 1;
  }

  export function addSection(type: string): void {
    handleAdd(type);
  }

  export function selectSection(index: number): void {
    activeIndex = index;
  }

  export function removeSection(index: number): void {
    const updated = sections.filter((_, i) => i !== index);
    onsectionschange?.(updated);
    if (activeIndex >= updated.length) {
      activeIndex = Math.max(0, updated.length - 1);
    }
  }

  export function moveSectionUp(index: number): void {
    if (index === 0) return;
    const updated = [...sections];
    [updated[index - 1], updated[index]] = [updated[index]!, updated[index - 1]!];
    onsectionschange?.(updated);
    activeIndex = index - 1;
  }

  export function moveSectionDown(index: number): void {
    if (index >= sections.length - 1) return;
    const updated = [...sections];
    [updated[index], updated[index + 1]] = [updated[index + 1]!, updated[index]!];
    onsectionschange?.(updated);
    activeIndex = index + 1;
  }

  function handleSectionChange(updated: ExplainerSection) {
    if (updated.title !== sections[activeIndex]?.title) {
      updated = { ...updated, anchor: generateAnchor(updated.title) };
    }
    const updatedSections = sections.map((s, i) => (i === activeIndex ? updated : s));
    onsectionschange?.(updatedSections);
  }
</script>

<div class="ee-canvas">
  {#each sections as section, i}
    <div
      class="ee-section-card"
      class:ee-section-card-active={i === activeIndex}
      role="button"
      tabindex="0"
      onclick={() => { activeIndex = i; }}
      onkeydown={(e) => { if (e.key === 'Enter') activeIndex = i; }}
    >
      <div class="ee-card-header">
        <span class="ee-card-num">{String(i + 1).padStart(2, '0')}</span>
        <span class="ee-card-type">{section.type}</span>
        {#if i === activeIndex}
          <span class="ee-card-editing">editing</span>
        {/if}
      </div>

      {#if i === activeIndex}
        <SectionEditor {section} onchange={handleSectionChange} />
      {:else}
        <div class="ee-card-preview">
          <h3 class="ee-card-title">{section.title || 'Untitled'}</h3>
          {#if section.type === 'quiz'}
            <span class="ee-card-meta">{section.questions?.length ?? 0} questions</span>
          {:else if section.type === 'checkpoint'}
            <span class="ee-card-meta">Progress gate</span>
          {/if}
        </div>
      {/if}
    </div>

    <!-- Insert zone between sections -->
    {#if i < sections.length - 1}
      <div class="ee-insert-zone">
        <div class="ee-insert-line"></div>
      </div>
    {/if}
  {/each}

  {#if sections.length === 0}
    <div class="ee-empty">
      <p class="ee-empty-title">No sections</p>
      <p class="ee-empty-hint">Add sections from the sidebar to build your explainer.</p>
    </div>
  {/if}

  <!-- Add section zone at bottom -->
  <div class="ee-add-zone">
    <div class="ee-add-line"></div>
    <div class="ee-add-buttons">
      <button class="ee-add-btn" onclick={() => handleAdd('text')}>+ Text</button>
      <button class="ee-add-btn" onclick={() => handleAdd('quiz')}>+ Quiz</button>
      <button class="ee-add-btn" onclick={() => handleAdd('checkpoint')}>+ Checkpoint</button>
    </div>
    <div class="ee-add-line"></div>
  </div>
</div>

<style>
  .ee-canvas {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  /* Section card */
  .ee-section-card {
    border: 1.5px solid transparent;
    border-radius: var(--radius-md, 6px);
    padding: var(--space-4, 1rem);
    cursor: pointer;
    transition: border-color 0.12s ease, background 0.12s ease;
  }

  .ee-section-card:hover:not(.ee-section-card-active) {
    border-color: var(--color-border, #272725);
  }

  .ee-section-card-active {
    border-color: var(--color-primary, #5b9cf6);
    background: rgba(91, 156, 246, 0.02);
    cursor: default;
  }

  .ee-card-header {
    display: flex;
    align-items: center;
    gap: var(--space-2, 0.5rem);
    margin-bottom: var(--space-2, 0.5rem);
  }

  .ee-card-num {
    font-family: var(--font-mono, monospace);
    font-size: 10px;
    color: var(--color-text-muted, #444440);
  }

  .ee-card-type {
    font-family: var(--font-mono, monospace);
    font-size: 9px;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--color-primary, #5b9cf6);
    background: rgba(91, 156, 246, 0.08);
    padding: 1px 6px;
    border-radius: 2px;
  }

  .ee-card-editing {
    font-family: var(--font-mono, monospace);
    font-size: 9px;
    color: var(--color-success, #4ade80);
    margin-left: auto;
  }

  .ee-card-preview {
    padding-left: var(--space-4, 1rem);
  }

  .ee-card-title {
    font-size: var(--text-sm, 0.875rem);
    font-weight: var(--font-weight-medium, 500);
    color: var(--color-text, #d8d5cf);
    margin: 0;
  }

  .ee-card-meta {
    font-size: var(--text-xs, 0.75rem);
    color: var(--color-text-muted, #444440);
    font-family: var(--font-mono, monospace);
  }

  /* Insert zone */
  .ee-insert-zone {
    display: flex;
    align-items: center;
    padding: 2px 0;
    opacity: 0;
    transition: opacity 0.15s ease;
  }

  .ee-section-card:hover + .ee-insert-zone,
  .ee-insert-zone:hover {
    opacity: 1;
  }

  .ee-insert-line {
    flex: 1;
    height: 1px;
    background: var(--color-border, #272725);
  }

  /* Add zone */
  .ee-add-zone {
    display: flex;
    align-items: center;
    gap: var(--space-2, 0.5rem);
    padding: var(--space-4, 1rem) 0;
  }

  .ee-add-line {
    flex: 1;
    height: 1px;
    background: var(--color-border, #272725);
  }

  .ee-add-buttons {
    display: flex;
    gap: 4px;
  }

  .ee-add-btn {
    font-family: var(--font-mono, monospace);
    font-size: 10px;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    padding: 3px 10px;
    border: 1px solid var(--color-border, #272725);
    border-radius: var(--radius-sm, 4px);
    background: transparent;
    color: var(--color-text-muted, #444440);
    cursor: pointer;
  }

  .ee-add-btn:hover {
    color: var(--color-primary, #5b9cf6);
    border-color: var(--color-primary, #5b9cf6);
    background: rgba(91, 156, 246, 0.06);
  }

  /* Empty state */
  .ee-empty {
    text-align: center;
    padding: var(--space-12, 4rem) var(--space-4, 1rem);
  }

  .ee-empty-title {
    font-size: var(--text-sm, 0.875rem);
    font-weight: var(--font-weight-medium, 500);
    color: var(--color-text-secondary, #888884);
    margin: 0 0 var(--space-1, 0.25rem);
  }

  .ee-empty-hint {
    font-size: var(--text-xs, 0.75rem);
    color: var(--color-text-muted, #444440);
    margin: 0;
  }
</style>
