<script>
  import FeatureCard from '$lib/components/FeatureCard.svelte';
</script>

<svelte:head>
  <title>Features — Snaplify</title>
  <meta
    name="description"
    content="Explore Snaplify features: content system, learning paths, communities, federation, docs, and more."
  />
  <meta property="og:title" content="Features — Snaplify" />
  <meta
    property="og:description"
    content="Explore Snaplify features: content, learning, communities, federation, docs."
  />
</svelte:head>

<section class="features-page">
  <div class="container">
    <h1>Features</h1>
    <p class="subtitle">Everything your maker community needs, built as modular packages.</p>

    <div class="feature-section">
      <h2>Content System</h2>
      <p>
        A rich block editor powered by TipTap with support for text, headings, code blocks, images,
        embeds, and custom block types. Every piece of content is SEO-optimized with JSON-LD
        structured data and OpenGraph meta tags.
      </p>
    </div>

    <div class="feature-section">
      <h2>Learning Paths</h2>
      <p>
        Create structured courses with modules and lessons. Support for article, video, quiz,
        project, and explainer lesson types. Automatic progress tracking with enrollment and
        certificate generation on completion.
      </p>
    </div>

    <div class="feature-section">
      <h2>Interactive Explainers</h2>
      <p>
        Build scroll-driven interactive explanations with section types including text, code, quiz,
        comparison, timeline, and checklist. Export as self-contained HTML files with embedded CSS
        and JavaScript.
      </p>
    </div>

    <div class="feature-section">
      <h2>Documentation Sites</h2>
      <p>
        Versioned documentation with a CodeMirror 6 editor, unified markdown rendering pipeline with
        syntax highlighting via Shiki, hierarchical navigation, and full-text search powered by
        Meilisearch or Postgres FTS.
      </p>
    </div>

    <div class="feature-section">
      <h2>Communities</h2>
      <p>
        Moderated spaces with role-based permissions (owner, admin, moderator, member). Support for
        posts, replies, pinned content, sharing, likes, and comprehensive ban management with
        temporary and permanent options.
      </p>
    </div>

    <div class="feature-section">
      <h2>ActivityPub Federation</h2>
      <p>
        Connect instances via the ActivityPub protocol. Follow actors across instances, federate
        content as Create/Update/Delete activities, and authenticate via AP Actor SSO. Built on the
        Fedify framework.
      </p>
    </div>

    <div class="feature-section">
      <h2>Theming Engine</h2>
      <p>
        Four built-in themes (Base, Deepwood, Hackbuild, Deveco) with CSS custom property switching.
        Per-user theme preferences with SSR flash prevention. Admin-configurable instance defaults.
      </p>
    </div>

    <div class="feature-section">
      <h2>Admin Panel</h2>
      <p>
        Instance administration with user management, role assignments, content moderation, audit
        logging, and configurable instance settings via key-value store.
      </p>
    </div>
  </div>
</section>

<style>
  .features-page {
    padding: var(--space-16, 4rem) 0;
  }

  .container {
    max-width: 48rem;
    margin: 0 auto;
    padding: 0 var(--space-4, 1rem);
  }

  h1 {
    font-family: var(--font-heading, system-ui, sans-serif);
    font-size: var(--text-4xl, 2.25rem);
    color: var(--ink-1, #1a1a2e);
    margin-bottom: var(--space-4, 1rem);
  }

  .subtitle {
    font-size: var(--text-lg, 1.125rem);
    color: var(--ink-2, #4a4a6a);
    margin-bottom: var(--space-12, 3rem);
  }

  .feature-section {
    margin-bottom: var(--space-10, 2.5rem);
  }

  .feature-section h2 {
    font-family: var(--font-heading, system-ui, sans-serif);
    font-size: var(--text-xl, 1.25rem);
    color: var(--ink-1, #1a1a2e);
    margin-bottom: var(--space-2, 0.5rem);
  }

  .feature-section p {
    color: var(--ink-2, #4a4a6a);
    line-height: 1.7;
  }
</style>
