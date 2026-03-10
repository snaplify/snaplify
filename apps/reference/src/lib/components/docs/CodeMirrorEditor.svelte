<script lang="ts">
  import { onMount } from 'svelte';

  let {
    content = $bindable(''),
    class: className = '',
    onchange,
  }: {
    content?: string;
    class?: string;
    onchange?: (value: string) => void;
  } = $props();

  let editorElement: HTMLDivElement;
  let view: import('@codemirror/view').EditorView | null = null;

  onMount(async () => {
    const { EditorState } = await import('@codemirror/state');
    const { EditorView, keymap, lineNumbers, highlightActiveLine, drawSelection } = await import('@codemirror/view');
    const { defaultKeymap, history, historyKeymap } = await import('@codemirror/commands');
    const { markdown } = await import('@codemirror/lang-markdown');
    const { syntaxHighlighting, defaultHighlightStyle, bracketMatching } = await import('@codemirror/language');

    const updateListener = EditorView.updateListener.of((update) => {
      if (update.docChanged) {
        const value = update.state.doc.toString();
        content = value;
        onchange?.(value);
      }
    });

    const theme = EditorView.theme({
      '&': {
        height: '100%',
        fontSize: 'var(--text-sm, 0.875rem)',
        fontFamily: 'var(--font-mono, monospace)',
      },
      '.cm-content': {
        padding: 'var(--space-3, 0.75rem)',
      },
      '.cm-gutters': {
        background: 'var(--bg-muted, #f9fafb)',
        borderRight: '1px solid var(--border-default, #e5e7eb)',
        color: 'var(--text-muted, #9ca3af)',
      },
      '.cm-activeLineGutter': {
        background: 'var(--bg-hover, #f3f4f6)',
      },
    });

    const state = EditorState.create({
      doc: content,
      extensions: [
        lineNumbers(),
        highlightActiveLine(),
        drawSelection(),
        bracketMatching(),
        history(),
        syntaxHighlighting(defaultHighlightStyle),
        markdown(),
        keymap.of([...defaultKeymap, ...historyKeymap]),
        theme,
        updateListener,
      ],
    });

    view = new EditorView({
      state,
      parent: editorElement,
    });

    return () => {
      view?.destroy();
    };
  });

  $effect(() => {
    if (view && content !== view.state.doc.toString()) {
      view.dispatch({
        changes: {
          from: 0,
          to: view.state.doc.length,
          insert: content,
        },
      });
    }
  });
</script>

<div
  class="codemirror-editor {className}"
  bind:this={editorElement}
  role="textbox"
  aria-label="Markdown editor"
  aria-multiline="true"
></div>

<style>
  .codemirror-editor {
    border: 1px solid var(--border-default, #e5e7eb);
    border-radius: var(--radius-md, 0.375rem);
    overflow: hidden;
    min-height: 20rem;
  }
</style>
