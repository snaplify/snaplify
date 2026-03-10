import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/svelte';
import axe from 'axe-core';
import Hero from '../lib/components/Hero.svelte';
import FeatureCard from '../lib/components/FeatureCard.svelte';
import CodeBlock from '../lib/components/CodeBlock.svelte';
import Nav from '../lib/components/Nav.svelte';
import Footer from '../lib/components/Footer.svelte';

async function expectNoA11yViolations(container: HTMLElement): Promise<void> {
  const results = await axe.run(container);
  const violations = results.violations.map(
    (v) => `${v.id}: ${v.description} (${v.nodes.length} nodes)`,
  );
  expect(violations).toEqual([]);
}

describe('Accessibility', () => {
  it('Hero has no a11y violations', async () => {
    const { container } = render(Hero, {
      props: {
        title: 'Test Title',
        subtitle: 'Test subtitle',
        primaryCta: { label: 'Get Started', href: '/start' },
        secondaryCta: { label: 'Learn More', href: '/learn' },
      },
    });
    await expectNoA11yViolations(container);
  });

  it('FeatureCard has no a11y violations', async () => {
    const { container } = render(FeatureCard, {
      props: {
        title: 'Feature Title',
        description: 'Feature description text.',
      },
    });
    await expectNoA11yViolations(container);
  });

  it('CodeBlock has no a11y violations', async () => {
    const { container } = render(CodeBlock, {
      props: {
        code: 'npm install snaplify',
        lang: 'bash',
      },
    });
    await expectNoA11yViolations(container);
  });

  it('Nav has no a11y violations', async () => {
    const { container } = render(Nav);
    await expectNoA11yViolations(container);
  });

  it('Footer has no a11y violations', async () => {
    const { container } = render(Footer);
    await expectNoA11yViolations(container);
  });
});
