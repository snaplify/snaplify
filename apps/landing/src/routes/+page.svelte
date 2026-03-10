<script>
  import Hero from '$lib/components/Hero.svelte';
  import FeatureCard from '$lib/components/FeatureCard.svelte';
</script>

<svelte:head>
  <title>Snaplify — Open Federation for Maker Communities</title>
  <meta name="description" content="Self-hosted ActivityPub platform for maker communities. Content, learning, docs, and federation — all open source." />
  <meta property="og:title" content="Snaplify — Open Federation for Maker Communities" />
  <meta property="og:description" content="Self-hosted ActivityPub platform for maker communities." />
  <meta property="og:type" content="website" />
</svelte:head>

<Hero
  title="Build your maker community"
  subtitle="An open ActivityPub federation protocol for self-hosted maker communities. Content, learning paths, docs, and more — all connected."
  primaryCta={{ label: 'Get Started', href: '/getting-started' }}
  secondaryCta={{ label: 'View Features', href: '/features' }}
/>

<section class="features" aria-label="Key features">
  <div class="container">
    <h2 class="features-title">Everything you need</h2>
    <div class="feature-grid">
      <FeatureCard
        title="Content System"
        description="Rich block editor with articles, tutorials, and project showcases. SEO-optimized with JSON-LD."
      />
      <FeatureCard
        title="Learning Paths"
        description="Structured courses with modules, lessons, quizzes, and auto-generated certificates."
      />
      <FeatureCard
        title="Documentation"
        description="Versioned docs sites with CodeMirror editor, markdown rendering, and full-text search."
      />
      <FeatureCard
        title="Communities"
        description="Moderated spaces with feeds, membership roles, and content sharing."
      />
      <FeatureCard
        title="Federation"
        description="ActivityPub protocol for cross-instance content sharing and discovery."
      />
      <FeatureCard
        title="Self-Hosted"
        description="Deploy anywhere with Docker. Your data, your rules, your community."
      />
    </div>
  </div>
</section>

<style>
  .features {
    padding: var(--space-16, 4rem) 0;
    background-color: var(--paper-2, #f8f9fa);
  }

  .features-title {
    font-family: var(--font-heading, system-ui, sans-serif);
    font-size: var(--text-3xl, 1.875rem);
    text-align: center;
    margin-bottom: var(--space-12, 3rem);
    color: var(--ink-1, #1a1a2e);
  }

  .feature-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(18rem, 1fr));
    gap: var(--space-6, 1.5rem);
    max-width: 72rem;
    margin: 0 auto;
    padding: 0 var(--space-4, 1rem);
  }
</style>
