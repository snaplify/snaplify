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

<div class="section-editor">
  <div class="section-editor__header">
    <span class="section-editor__type-badge">{section.type}</span>
  </div>

  <div class="section-editor__field">
    <label for="section-title">Section Title</label>
    <input
      id="section-title"
      type="text"
      value={section.title}
      oninput={(e) => update('title', (e.target as HTMLInputElement).value)}
      placeholder="Section title"
      required
    />
  </div>

  <div class="section-editor__field">
    <label for="section-anchor">Anchor ID</label>
    <input
      id="section-anchor"
      type="text"
      value={section.anchor}
      oninput={(e) => update('anchor', (e.target as HTMLInputElement).value)}
      placeholder="url-safe-anchor"
    />
  </div>

  <div class="section-editor__field">
    <label for="section-content">Content</label>
    <ContentEditor content={section.content} onupdate={handleContentUpdate} />
  </div>

  {#if section.type === 'quiz'}
    <QuizEditor
      questions={section.questions}
      passingScore={section.passingScore}
      isGate={section.isGate}
      onquestionschange={handleQuestionsChange}
      onpassingscorechange={handlePassingScoreChange}
      onisgatechange={handleIsGateChange}
    />
  {/if}

  {#if section.type === 'checkpoint'}
    <div class="section-editor__field">
      <label>
        <input
          type="checkbox"
          checked={section.requiresPrevious}
          onchange={(e) => handleRequiresPreviousChange((e.target as HTMLInputElement).checked)}
        />
        Require all previous sections to be completed
      </label>
    </div>
  {/if}
</div>

<style>
  .section-editor {
    padding: var(--space-md, 1rem);
  }

  .section-editor__header {
    margin-bottom: var(--space-md, 1rem);
  }

  .section-editor__type-badge {
    display: inline-block;
    padding: var(--space-xs, 0.25rem) var(--space-sm, 0.5rem);
    background: var(--color-primary-light, #eff6ff);
    color: var(--color-primary, #2563eb);
    border-radius: var(--radius-sm, 4px);
    font-size: var(--font-size-xs, 0.75rem);
    font-weight: var(--font-weight-semibold, 600);
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .section-editor__field {
    margin-bottom: var(--space-md, 1rem);
  }

  .section-editor__field label {
    display: block;
    margin-bottom: var(--space-xs, 0.25rem);
    font-size: var(--font-size-sm, 0.875rem);
    font-weight: var(--font-weight-medium, 500);
    color: var(--color-text, #1a1a1a);
  }

  .section-editor__field input[type='text'] {
    width: 100%;
    padding: var(--space-sm, 0.5rem);
    border: 1px solid var(--color-border, #e5e5e5);
    border-radius: var(--radius-sm, 4px);
    font-size: var(--font-size-md, 1rem);
    background: var(--color-surface, #ffffff);
    color: var(--color-text, #1a1a1a);
    box-sizing: border-box;
  }
</style>
