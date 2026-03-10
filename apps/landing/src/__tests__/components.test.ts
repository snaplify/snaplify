import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import Hero from '../lib/components/Hero.svelte';
import FeatureCard from '../lib/components/FeatureCard.svelte';
import CodeBlock from '../lib/components/CodeBlock.svelte';
import Nav from '../lib/components/Nav.svelte';
import Footer from '../lib/components/Footer.svelte';

describe('Hero', () => {
  it('renders the title', () => {
    render(Hero, {
      props: {
        title: 'Test Title',
        subtitle: 'Test subtitle text',
        primaryCta: { label: 'Primary', href: '/primary' },
      },
    });
    expect(screen.getByText('Test Title')).toBeInTheDocument();
  });

  it('renders the subtitle', () => {
    render(Hero, {
      props: {
        title: 'Title',
        subtitle: 'A descriptive subtitle',
        primaryCta: { label: 'Go', href: '/go' },
      },
    });
    expect(screen.getByText('A descriptive subtitle')).toBeInTheDocument();
  });

  it('renders the primary CTA link', () => {
    render(Hero, {
      props: {
        title: 'Title',
        subtitle: 'Subtitle',
        primaryCta: { label: 'Get Started', href: '/start' },
      },
    });
    const link = screen.getByText('Get Started');
    expect(link).toBeInTheDocument();
    expect(link.closest('a')).toHaveAttribute('href', '/start');
  });

  it('renders the secondary CTA when provided', () => {
    render(Hero, {
      props: {
        title: 'Title',
        subtitle: 'Subtitle',
        primaryCta: { label: 'Primary', href: '/primary' },
        secondaryCta: { label: 'Secondary', href: '/secondary' },
      },
    });
    const link = screen.getByText('Secondary');
    expect(link).toBeInTheDocument();
    expect(link.closest('a')).toHaveAttribute('href', '/secondary');
  });

  it('does not render secondary CTA when not provided', () => {
    render(Hero, {
      props: {
        title: 'Title',
        subtitle: 'Subtitle',
        primaryCta: { label: 'Primary', href: '/primary' },
      },
    });
    expect(screen.queryByText('Secondary')).not.toBeInTheDocument();
  });

  it('has an accessible section label', () => {
    render(Hero, {
      props: {
        title: 'Title',
        subtitle: 'Subtitle',
        primaryCta: { label: 'Go', href: '/' },
      },
    });
    expect(screen.getByRole('region', { name: 'Introduction' })).toBeInTheDocument();
  });
});

describe('FeatureCard', () => {
  it('renders the title', () => {
    render(FeatureCard, {
      props: { title: 'Feature Name', description: 'Feature details here.' },
    });
    expect(screen.getByText('Feature Name')).toBeInTheDocument();
  });

  it('renders the description', () => {
    render(FeatureCard, {
      props: { title: 'Feature', description: 'This is the description.' },
    });
    expect(screen.getByText('This is the description.')).toBeInTheDocument();
  });

  it('renders as an article element', () => {
    render(FeatureCard, {
      props: { title: 'Feature', description: 'Desc' },
    });
    expect(screen.getByRole('article')).toBeInTheDocument();
  });
});

describe('CodeBlock', () => {
  it('renders the code content', () => {
    render(CodeBlock, {
      props: { code: 'npm install snaplify' },
    });
    expect(screen.getByText('npm install snaplify')).toBeInTheDocument();
  });

  it('has an accessible region label', () => {
    render(CodeBlock, {
      props: { code: 'echo hello' },
    });
    expect(screen.getByRole('region', { name: 'Code example' })).toBeInTheDocument();
  });

  it('renders multiline code', () => {
    const code = 'line one\nline two';
    render(CodeBlock, {
      props: { code },
    });
    const codeEl = screen.getByRole('region', { name: 'Code example' }).querySelector('code');
    expect(codeEl?.textContent).toBe(code);
  });
});

describe('Nav', () => {
  it('renders the brand link', () => {
    render(Nav);
    const brand = screen.getByText('Snaplify');
    expect(brand).toBeInTheDocument();
    expect(brand.closest('a')).toHaveAttribute('href', '/');
  });

  it('renders navigation links', () => {
    render(Nav);
    expect(screen.getByText('Features')).toBeInTheDocument();
    expect(screen.getByText('Get Started')).toBeInTheDocument();
    expect(screen.getByText('GitHub')).toBeInTheDocument();
  });

  it('has an accessible navigation label', () => {
    render(Nav);
    expect(screen.getByRole('navigation', { name: 'Main navigation' })).toBeInTheDocument();
  });

  it('features link points to /features', () => {
    render(Nav);
    const link = screen.getByText('Features').closest('a');
    expect(link).toHaveAttribute('href', '/features');
  });

  it('get started link points to /getting-started', () => {
    render(Nav);
    const link = screen.getByText('Get Started').closest('a');
    expect(link).toHaveAttribute('href', '/getting-started');
  });
});

describe('Footer', () => {
  it('renders copyright text', () => {
    render(Footer);
    const year = new Date().getFullYear().toString();
    expect(screen.getByText(new RegExp(year))).toBeInTheDocument();
  });

  it('renders footer navigation links', () => {
    render(Footer);
    expect(screen.getByRole('navigation', { name: 'Footer navigation' })).toBeInTheDocument();
  });

  it('has GitHub link', () => {
    render(Footer);
    const links = screen.getAllByText('GitHub');
    const footerLink = links.find((el) => el.closest('footer'));
    expect(footerLink).toBeInTheDocument();
  });

  it('has Features link', () => {
    render(Footer);
    const links = screen.getAllByText('Features');
    const footerLink = links.find((el) => el.closest('footer'));
    expect(footerLink?.closest('a')).toHaveAttribute('href', '/features');
  });

  it('has Get Started link', () => {
    render(Footer);
    const links = screen.getAllByText('Get Started');
    const footerLink = links.find((el) => el.closest('footer'));
    expect(footerLink?.closest('a')).toHaveAttribute('href', '/getting-started');
  });
});
