<script>
  import CodeBlock from '$lib/components/CodeBlock.svelte';
</script>

<svelte:head>
  <title>Getting Started — Snaplify</title>
  <meta
    name="description"
    content="Get started with Snaplify. Install the CLI, create your instance, and deploy."
  />
  <meta property="og:title" content="Getting Started — Snaplify" />
  <meta property="og:description" content="Install the CLI, create your instance, and deploy." />
</svelte:head>

<section class="getting-started">
  <div class="container">
    <h1>Getting Started</h1>
    <p class="subtitle">Set up your Snaplify instance in minutes.</p>

    <div class="step">
      <h2>1. Install the CLI</h2>
      <p>Install the <code>create-snaplify</code> CLI tool:</p>
      <CodeBlock code="cargo install create-snaplify" lang="bash" />
    </div>

    <div class="step">
      <h2>2. Create a New Instance</h2>
      <p>Scaffold a new Snaplify project with all configuration files:</p>
      <CodeBlock code={`create-snaplify new my-community\ncd my-community`} lang="bash" />
      <p>
        This generates your project structure with <code>.env</code>,
        <code>snaplify.config.ts</code>, <code>package.json</code>, and
        <code>docker-compose.yml</code>.
      </p>
    </div>

    <div class="step">
      <h2>3. Start Infrastructure</h2>
      <p>Bring up PostgreSQL, Redis, and Meilisearch:</p>
      <CodeBlock code="docker compose up -d" lang="bash" />
    </div>

    <div class="step">
      <h2>4. Install and Run</h2>
      <p>Install dependencies and start the dev server:</p>
      <CodeBlock code={`pnpm install\npnpm dev`} lang="bash" />
      <p>Your instance is now running at <code>http://localhost:5173</code>.</p>
    </div>

    <div class="step">
      <h2>5. Deploy</h2>
      <p>Build and deploy with Docker:</p>
      <CodeBlock
        code={`docker build -t my-community .\ndocker compose -f docker-compose.prod.yml up -d`}
        lang="bash"
      />
      <p>
        See the <a href="https://github.com/snaplify/snaplify">deployment documentation</a> for DigitalOcean
        App Platform, VPS, and other deployment options.
      </p>
    </div>
  </div>
</section>

<style>
  .getting-started {
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

  .step {
    margin-bottom: var(--space-10, 2.5rem);
  }

  .step h2 {
    font-family: var(--font-heading, system-ui, sans-serif);
    font-size: var(--text-xl, 1.25rem);
    color: var(--ink-1, #1a1a2e);
    margin-bottom: var(--space-2, 0.5rem);
  }

  .step p {
    color: var(--ink-2, #4a4a6a);
    line-height: 1.7;
    margin-bottom: var(--space-3, 0.75rem);
  }

  code {
    font-family: var(--font-mono, 'SF Mono', monospace);
    background-color: var(--paper-3, #e9ecef);
    padding: 0.15em 0.4em;
    border-radius: 0.25rem;
    font-size: 0.9em;
  }
</style>
