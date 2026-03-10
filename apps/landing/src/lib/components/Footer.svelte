<script lang="ts">
  let { class: className = '' }: { class?: string } = $props();
</script>

<footer class="footer {className}">
  <div class="footer-inner">
    <p class="footer-text">&copy; {new Date().getFullYear()} Snaplify. Open source under MIT license.</p>
    <nav aria-label="Footer navigation">
      <ul class="footer-links" role="list">
        <li><a href="https://github.com/snaplify/snaplify" rel="noopener noreferrer">GitHub</a></li>
        <li><a href="/features">Features</a></li>
        <li><a href="/getting-started">Get Started</a></li>
      </ul>
    </nav>
  </div>
</footer>

<style>
  .footer {
    border-top: 1px solid var(--border-1, #e2e8f0);
    padding: var(--space-8, 2rem) var(--space-4, 1rem);
    background-color: var(--paper-2, #f8f9fa);
  }

  .footer-inner {
    max-width: 72rem;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: var(--space-4, 1rem);
  }

  .footer-text {
    color: var(--ink-3, #6b7280);
    font-size: var(--text-sm, 0.875rem);
  }

  .footer-links {
    display: flex;
    gap: var(--space-4, 1rem);
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .footer-links a {
    color: var(--ink-3, #6b7280);
    font-size: var(--text-sm, 0.875rem);
    text-decoration: none;
  }

  .footer-links a:hover {
    color: var(--ink-1, #1a1a2e);
  }
</style>
