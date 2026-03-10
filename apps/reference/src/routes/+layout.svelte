<script lang="ts">
  import Nav from '$lib/components/Nav.svelte';
  import Footer from '$lib/components/Footer.svelte';
  import { validateTokenOverrides } from '@snaplify/ui';
  import type { LayoutData } from './$types';

  let { data, children } = $props<{ data: LayoutData; children: import('svelte').Snippet }>();

  $effect(() => {
    const html = document.documentElement;
    if (data.theme && data.theme !== 'base') {
      html.setAttribute('data-theme', data.theme);
    } else {
      html.removeAttribute('data-theme');
    }

    if (data.customTokens) {
      const { valid } = validateTokenOverrides(data.customTokens);
      for (const [key, value] of Object.entries(valid)) {
        html.style.setProperty(`--${key}`, value);
      }
    }
  });
</script>

<div class="app">
  <Nav user={data.user} />
  <main class="main">
    {@render children()}
  </main>
  <Footer />
</div>

<style>
  :global(html) {
    font-family: var(--font-sans, system-ui, -apple-system, sans-serif);
    color: var(--color-text, #1a1a1a);
    background: var(--color-bg, #ffffff);
  }

  :global(body) {
    margin: 0;
  }

  .app {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
  }

  .main {
    flex: 1;
    width: 100%;
    max-width: var(--layout-max-width, 1200px);
    margin: 0 auto;
    padding: var(--space-md, 1rem);
  }
</style>
