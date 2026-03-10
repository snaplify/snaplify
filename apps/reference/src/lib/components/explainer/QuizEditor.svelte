<script lang="ts">
  import type { QuizQuestion } from '@snaplify/explainer';

  let {
    questions = [],
    passingScore = 70,
    isGate = false,
    onquestionschange,
    onpassingscorechange,
    onisgatechange,
  }: {
    questions: QuizQuestion[];
    passingScore: number;
    isGate: boolean;
    onquestionschange?: (questions: QuizQuestion[]) => void;
    onpassingscorechange?: (score: number) => void;
    onisgatechange?: (isGate: boolean) => void;
  } = $props();

  function addQuestion() {
    const id = `q-${Date.now()}`;
    const updated = [
      ...questions,
      {
        id,
        question: '',
        options: [
          { id: `${id}-a`, text: '' },
          { id: `${id}-b`, text: '' },
        ],
        correctOptionId: `${id}-a`,
      },
    ];
    onquestionschange?.(updated);
  }

  function removeQuestion(index: number) {
    const updated = questions.filter((_, i) => i !== index);
    onquestionschange?.(updated);
  }

  function updateQuestion(index: number, field: string, value: string) {
    const updated = questions.map((q, i) => (i === index ? { ...q, [field]: value } : q));
    onquestionschange?.(updated);
  }

  function addOption(questionIndex: number) {
    const q = questions[questionIndex]!;
    const optionId = `${q.id}-${String.fromCharCode(97 + q.options.length)}`;
    const updatedOptions = [...q.options, { id: optionId, text: '' }];
    const updated = questions.map((qq, i) => (i === questionIndex ? { ...qq, options: updatedOptions } : qq));
    onquestionschange?.(updated);
  }

  function removeOption(questionIndex: number, optionIndex: number) {
    const q = questions[questionIndex]!;
    if (q.options.length <= 2) return; // Minimum 2 options
    const removedOption = q.options[optionIndex]!;
    const updatedOptions = q.options.filter((_, i) => i !== optionIndex);
    const correctId = q.correctOptionId === removedOption.id ? updatedOptions[0]!.id : q.correctOptionId;
    const updated = questions.map((qq, i) =>
      i === questionIndex ? { ...qq, options: updatedOptions, correctOptionId: correctId } : qq,
    );
    onquestionschange?.(updated);
  }

  function updateOptionText(questionIndex: number, optionIndex: number, text: string) {
    const q = questions[questionIndex]!;
    const updatedOptions = q.options.map((o, i) => (i === optionIndex ? { ...o, text } : o));
    const updated = questions.map((qq, i) => (i === questionIndex ? { ...qq, options: updatedOptions } : qq));
    onquestionschange?.(updated);
  }

  function setCorrectOption(questionIndex: number, optionId: string) {
    const updated = questions.map((q, i) =>
      i === questionIndex ? { ...q, correctOptionId: optionId } : q,
    );
    onquestionschange?.(updated);
  }
</script>

<div class="quiz-editor">
  <div class="quiz-editor__settings">
    <div class="quiz-editor__field">
      <label for="passingScore">Passing score (%)</label>
      <input
        id="passingScore"
        type="number"
        min="0"
        max="100"
        value={passingScore}
        onchange={(e) => onpassingscorechange?.(Number((e.target as HTMLInputElement).value))}
      />
    </div>
    <div class="quiz-editor__field">
      <label>
        <input
          type="checkbox"
          checked={isGate}
          onchange={(e) => onisgatechange?.((e.target as HTMLInputElement).checked)}
        />
        Gate (blocks progress until passed)
      </label>
    </div>
  </div>

  {#each questions as question, qi}
    <fieldset class="quiz-editor__question">
      <legend>Question {qi + 1}</legend>
      <div class="quiz-editor__field">
        <label for="q-{qi}-text">Question text</label>
        <input
          id="q-{qi}-text"
          type="text"
          value={question.question}
          oninput={(e) => updateQuestion(qi, 'question', (e.target as HTMLInputElement).value)}
          placeholder="Enter question"
        />
      </div>
      <div class="quiz-editor__field">
        <label for="q-{qi}-explanation">Explanation <span class="optional">(optional)</span></label>
        <input
          id="q-{qi}-explanation"
          type="text"
          value={question.explanation ?? ''}
          oninput={(e) => updateQuestion(qi, 'explanation', (e.target as HTMLInputElement).value)}
          placeholder="Shown after answering"
        />
      </div>

      <div class="quiz-editor__options">
        <p class="quiz-editor__options-label">Options (select the correct answer):</p>
        {#each question.options as option, oi}
          <div class="quiz-editor__option">
            <input
              type="radio"
              name="correct-{qi}"
              checked={question.correctOptionId === option.id}
              onchange={() => setCorrectOption(qi, option.id)}
              aria-label="Mark as correct answer"
            />
            <input
              type="text"
              value={option.text}
              oninput={(e) => updateOptionText(qi, oi, (e.target as HTMLInputElement).value)}
              placeholder="Option {oi + 1}"
            />
            <button
              type="button"
              class="quiz-editor__remove-option"
              onclick={() => removeOption(qi, oi)}
              disabled={question.options.length <= 2}
              aria-label="Remove option"
            >&times;</button>
          </div>
        {/each}
        <button type="button" class="quiz-editor__add-option" onclick={() => addOption(qi)}>
          + Add Option
        </button>
      </div>

      <button type="button" class="quiz-editor__remove-question" onclick={() => removeQuestion(qi)}>
        Remove Question
      </button>
    </fieldset>
  {/each}

  <button type="button" class="quiz-editor__add-question" onclick={addQuestion}>
    + Add Question
  </button>
</div>

<style>
  .quiz-editor {
    margin-top: var(--space-md, 1rem);
  }

  .quiz-editor__settings {
    display: flex;
    gap: var(--space-md, 1rem);
    align-items: center;
    margin-bottom: var(--space-md, 1rem);
    padding: var(--space-sm, 0.5rem);
    background: var(--color-surface-secondary, #f5f5f5);
    border-radius: var(--radius-sm, 4px);
  }

  .quiz-editor__field {
    margin-bottom: var(--space-sm, 0.5rem);
  }

  .quiz-editor__field label {
    display: block;
    font-size: var(--font-size-sm, 0.875rem);
    font-weight: var(--font-weight-medium, 500);
    color: var(--color-text, #1a1a1a);
    margin-bottom: var(--space-xs, 0.25rem);
  }

  .quiz-editor__field input[type="text"],
  .quiz-editor__field input[type="number"] {
    width: 100%;
    padding: var(--space-xs, 0.25rem) var(--space-sm, 0.5rem);
    border: 1px solid var(--color-border, #e5e5e5);
    border-radius: var(--radius-sm, 4px);
    font-size: var(--font-size-sm, 0.875rem);
    background: var(--color-surface, #ffffff);
    color: var(--color-text, #1a1a1a);
  }

  .quiz-editor__settings input[type="number"] {
    width: 80px;
  }

  .optional {
    font-weight: var(--font-weight-normal, 400);
    color: var(--color-text-secondary, #666);
  }

  .quiz-editor__question {
    border: 1px solid var(--color-border, #e5e5e5);
    border-radius: var(--radius-md, 6px);
    padding: var(--space-md, 1rem);
    margin-bottom: var(--space-md, 1rem);
  }

  .quiz-editor__question legend {
    font-weight: var(--font-weight-semibold, 600);
    color: var(--color-text, #1a1a1a);
  }

  .quiz-editor__options-label {
    font-size: var(--font-size-sm, 0.875rem);
    color: var(--color-text-secondary, #666);
    margin-bottom: var(--space-xs, 0.25rem);
  }

  .quiz-editor__option {
    display: flex;
    align-items: center;
    gap: var(--space-sm, 0.5rem);
    margin-bottom: var(--space-xs, 0.25rem);
  }

  .quiz-editor__option input[type="text"] {
    flex: 1;
    padding: var(--space-xs, 0.25rem) var(--space-sm, 0.5rem);
    border: 1px solid var(--color-border, #e5e5e5);
    border-radius: var(--radius-sm, 4px);
    font-size: var(--font-size-sm, 0.875rem);
    background: var(--color-surface, #ffffff);
    color: var(--color-text, #1a1a1a);
  }

  .quiz-editor__remove-option,
  .quiz-editor__remove-question {
    background: none;
    border: 1px solid var(--color-error, #dc2626);
    color: var(--color-error, #dc2626);
    border-radius: var(--radius-sm, 4px);
    cursor: pointer;
    font-size: var(--font-size-sm, 0.875rem);
    padding: var(--space-xs, 0.25rem) var(--space-sm, 0.5rem);
  }

  .quiz-editor__remove-option:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }

  .quiz-editor__add-option,
  .quiz-editor__add-question {
    background: var(--color-surface-secondary, #f5f5f5);
    border: 1px dashed var(--color-border, #e5e5e5);
    border-radius: var(--radius-sm, 4px);
    padding: var(--space-xs, 0.25rem) var(--space-sm, 0.5rem);
    cursor: pointer;
    font-size: var(--font-size-sm, 0.875rem);
    color: var(--color-text, #1a1a1a);
  }

  .quiz-editor__add-question {
    width: 100%;
    padding: var(--space-sm, 0.5rem);
  }
</style>
