<script lang="ts">
  import ContentEditor from '$lib/components/ContentEditor.svelte';
  import QuizEditor from './QuizEditor.svelte';
  import type { ExplainerSection, QuizQuestion } from '@snaplify/explainer';

  let {
    section,
    onchange,
  }: {
    section: ExplainerSection;
    onchange?: (updated: ExplainerSection) => void;
  } = $props();

  function update(field: string, value: unknown) {
    onchange?.({ ...section, [field]: value } as ExplainerSection);
  }

  function handleContentUpdate(blocks: unknown[]) {
    update('content', blocks);
  }

  function handleQuestionsChange(questions: QuizQuestion[]) {
    onchange?.({ ...section, questions } as ExplainerSection);
  }

  function handlePassingScoreChange(score: number) {
    onchange?.({ ...section, passingScore: score } as ExplainerSection);
  }

  function handleIsGateChange(isGate: boolean) {
    onchange?.({ ...section, isGate } as ExplainerSection);
  }

  function handleRequiresPreviousChange(requiresPrevious: boolean) {
    onchange?.({ ...section, requiresPrevious } as ExplainerSection);
  }
</script>

<div class="se">
  <!-- Inline title editing -->
  <input
    class="se-title"
    type="text"
    value={section.title}
    oninput={(e) => update('title', (e.target as HTMLInputElement).value)}
    placeholder="Section title..."
  />

  <!-- Anchor (small, below title) -->
  <div class="se-anchor-row">
    <span class="se-anchor-label">anchor</span>
    <input
      class="se-anchor"
      type="text"
      value={section.anchor}
      oninput={(e) => update('anchor', (e.target as HTMLInputElement).value)}
      placeholder="url-safe-anchor"
    />
  </div>

  <!-- Rich content editor -->
  <div class="se-content">
    <ContentEditor content={section.content} onupdate={handleContentUpdate} />
  </div>

  <!-- Quiz-specific controls -->
  {#if section.type === 'quiz'}
    <div class="se-type-controls">
      <QuizEditor
        questions={section.questions}
        passingScore={section.passingScore}
        isGate={section.isGate}
        onquestionschange={handleQuestionsChange}
        onpassingscorechange={handlePassingScoreChange}
        onisgatechange={handleIsGateChange}
      />
    </div>
  {/if}

  <!-- Checkpoint-specific controls -->
  {#if section.type === 'checkpoint'}
    <div class="se-type-controls">
      <label class="se-checkbox">
        <input
          type="checkbox"
          checked={section.requiresPrevious}
          onchange={(e) => handleRequiresPreviousChange((e.target as HTMLInputElement).checked)}
        />
        <span class="se-checkbox-text">Require previous sections completed</span>
      </label>
    </div>
  {/if}
</div>

<style>
  .se {
    padding: var(--space-2, 0.5rem) 0 0;
  }

  /* Inline title — looks like editable heading, not a form field */
  .se-title {
    display: block;
    width: 100%;
    padding: 0;
    margin: 0 0 var(--space-1, 0.25rem);
    border: none;
    background: transparent;
    color: var(--color-text, #d8d5cf);
    font-size: var(--text-md, 1rem);
    font-weight: var(--font-weight-medium, 500);
    outline: none;
    box-sizing: border-box;
  }

  .se-title::placeholder {
    color: var(--color-text-muted, #444440);
  }

  .se-title:focus {
    border-bottom: 1px solid var(--color-primary, #5b9cf6);
  }

  /* Anchor row */
  .se-anchor-row {
    display: flex;
    align-items: center;
    gap: var(--space-2, 0.5rem);
    margin-bottom: var(--space-3, 0.75rem);
  }

  .se-anchor-label {
    font-family: var(--font-mono, monospace);
    font-size: 9px;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: var(--color-text-muted, #444440);
    flex-shrink: 0;
  }

  .se-anchor {
    flex: 1;
    padding: 2px var(--space-2, 0.5rem);
    border: 1px solid transparent;
    border-radius: var(--radius-sm, 4px);
    background: transparent;
    color: var(--color-text-secondary, #888884);
    font-family: var(--font-mono, monospace);
    font-size: var(--text-xs, 0.75rem);
    outline: none;
  }

  .se-anchor:focus {
    border-color: var(--color-border, #272725);
    background: var(--color-surface-alt, #141413);
  }

  /* Content editor area */
  .se-content {
    border: 1px solid var(--color-border, #272725);
    border-radius: var(--radius-sm, 4px);
    padding: var(--space-2, 0.5rem);
    min-height: 80px;
    background: var(--color-surface-alt, #141413);
  }

  /* Type-specific controls */
  .se-type-controls {
    margin-top: var(--space-3, 0.75rem);
    padding-top: var(--space-3, 0.75rem);
    border-top: 1px solid var(--color-border, #272725);
  }

  /* Checkbox styling */
  .se-checkbox {
    display: flex;
    align-items: center;
    gap: var(--space-2, 0.5rem);
    cursor: pointer;
  }

  .se-checkbox input[type='checkbox'] {
    width: 14px;
    height: 14px;
    accent-color: var(--color-primary, #5b9cf6);
  }

  .se-checkbox-text {
    font-size: var(--text-xs, 0.75rem);
    color: var(--color-text-secondary, #888884);
  }
</style>
