<script lang="ts">
  interface CtaLink {
    label: string;
    href: string;
  }

  let {
    title,
    subtitle,
    primaryCta,
    secondaryCta,
    class: className = '',
  }: {
    title: string;
    subtitle: string;
    primaryCta: CtaLink;
    secondaryCta?: CtaLink;
    class?: string;
  } = $props();
</script>

<section class="hero {className}" aria-label="Introduction">
  <div class="hero-content">
    <h1 class="hero-title">{title}</h1>
    <p class="hero-subtitle">{subtitle}</p>
    <div class="hero-actions">
      <a href={primaryCta.href} class="btn btn-primary">{primaryCta.label}</a>
      {#if secondaryCta}
        <a href={secondaryCta.href} class="btn btn-secondary">{secondaryCta.label}</a>
      {/if}
    </div>
  </div>
</section>

<style>
  .hero {
    padding: var(--space-20, 5rem) var(--space-4, 1rem);
    text-align: center;
    background-color: var(--paper-1, #ffffff);
  }

  .hero-content {
    max-width: 48rem;
    margin: 0 auto;
  }

  .hero-title {
    font-family: var(--font-heading, system-ui, sans-serif);
    font-size: var(--text-5xl, 3rem);
    font-weight: 800;
    color: var(--ink-1, #1a1a2e);
    margin-bottom: var(--space-4, 1rem);
    line-height: 1.1;
  }

  .hero-subtitle {
    font-size: var(--text-xl, 1.25rem);
    color: var(--ink-2, #4a4a6a);
    margin-bottom: var(--space-8, 2rem);
    max-width: 36rem;
    margin-left: auto;
    margin-right: auto;
    line-height: 1.6;
  }

  .hero-actions {
    display: flex;
    gap: var(--space-4, 1rem);
    justify-content: center;
    flex-wrap: wrap;
  }

  .btn {
    display: inline-flex;
    align-items: center;
    padding: var(--space-3, 0.75rem) var(--space-6, 1.5rem);
    border-radius: var(--radius-md, 0.5rem);
    font-weight: 600;
    font-size: var(--text-base, 1rem);
    text-decoration: none;
    transition: opacity 0.15s ease;
  }

  .btn:hover {
    opacity: 0.9;
    text-decoration: none;
  }

  .btn-primary {
    background-color: var(--accent-1, #6366f1);
    color: var(--paper-1, #ffffff);
  }

  .btn-secondary {
    background-color: var(--paper-3, #e9ecef);
    color: var(--ink-1, #1a1a2e);
  }
</style>
