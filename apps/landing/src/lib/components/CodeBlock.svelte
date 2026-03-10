<script lang="ts">
  let {
    code,
    lang = 'bash',
    class: className = '',
  }: {
    code: string;
    lang?: string;
    class?: string;
  } = $props();
</script>

<div class="code-block {className}" role="region" aria-label="Code example">
  <pre><code class="language-{lang}">{code}</code></pre>
</div>

<style>
  .code-block {
    background-color: var(--paper-4, #1e1e2e);
    color: var(--ink-inverse, #e0e0e0);
    border-radius: var(--radius-md, 0.5rem);
    overflow-x: auto;
    margin: var(--space-3, 0.75rem) 0;
  }

  pre {
    padding: var(--space-4, 1rem);
    margin: 0;
    font-family: var(--font-mono, 'SF Mono', 'Fira Code', monospace);
    font-size: var(--text-sm, 0.875rem);
    line-height: 1.6;
    white-space: pre;
  }

  code {
    font-family: inherit;
  }
</style>
