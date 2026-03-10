<script lang="ts">
  let { class: className = '' }: { class?: string } = $props();
</script>

<header class="nav {className}">
  <nav class="nav-inner" aria-label="Main navigation">
    <a href="/" class="nav-brand">Snaplify</a>
    <ul class="nav-links" role="list">
      <li><a href="/features">Features</a></li>
      <li><a href="/getting-started">Get Started</a></li>
      <li><a href="https://github.com/snaplify/snaplify" rel="noopener noreferrer">GitHub</a></li>
    </ul>
  </nav>
</header>

<style>
  .nav {
    border-bottom: 1px solid var(--border-1, #e2e8f0);
    background-color: var(--paper-1, #ffffff);
  }

  .nav-inner {
    max-width: 72rem;
    margin: 0 auto;
    padding: var(--space-4, 1rem);
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .nav-brand {
    font-family: var(--font-heading, system-ui, sans-serif);
    font-size: var(--text-xl, 1.25rem);
    font-weight: 700;
    color: var(--ink-1, #1a1a2e);
    text-decoration: none;
  }

  .nav-links {
    display: flex;
    gap: var(--space-6, 1.5rem);
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .nav-links a {
    color: var(--ink-2, #4a4a6a);
    font-size: var(--text-sm, 0.875rem);
    text-decoration: none;
  }

  .nav-links a:hover {
    color: var(--ink-1, #1a1a2e);
  }
</style>
