import { describe, it, expect } from 'vitest';
import { parseFrontmatter } from '../render/frontmatter';

describe('parseFrontmatter', () => {
  it('should parse valid YAML frontmatter', () => {
    const md = `---
title: Getting Started
description: A guide to getting started
sidebar_label: Start Here
sidebar_position: 1
---

# Hello World`;

    const { frontmatter, content } = parseFrontmatter(md);
    expect(frontmatter.title).toBe('Getting Started');
    expect(frontmatter.description).toBe('A guide to getting started');
    expect(frontmatter.sidebarLabel).toBe('Start Here');
    expect(frontmatter.sidebarPosition).toBe(1);
    expect(content).toBe('# Hello World');
  });

  it('should return empty frontmatter when none present', () => {
    const md = '# Just a heading\n\nSome content.';
    const { frontmatter, content } = parseFrontmatter(md);
    expect(frontmatter).toEqual({});
    expect(content).toBe(md);
  });

  it('should handle empty frontmatter block', () => {
    const md = `---
---

Content here.`;

    const { frontmatter, content } = parseFrontmatter(md);
    expect(frontmatter).toEqual({});
    expect(content).toBe('Content here.');
  });

  it('should gracefully handle malformed YAML', () => {
    const md = `---
: invalid: yaml: [
---

Content`;

    const { frontmatter, content } = parseFrontmatter(md);
    // Should not crash, returns empty frontmatter and original content
    expect(typeof frontmatter).toBe('object');
    expect(typeof content).toBe('string');
  });

  it('should only extract known fields', () => {
    const md = `---
title: My Page
unknown_field: should be ignored
---

Body text`;

    const { frontmatter } = parseFrontmatter(md);
    expect(frontmatter.title).toBe('My Page');
    expect('unknown_field' in frontmatter).toBe(false);
  });

  it('should handle frontmatter with only title', () => {
    const md = `---
title: Solo Title
---

Rest of doc`;

    const { frontmatter } = parseFrontmatter(md);
    expect(frontmatter.title).toBe('Solo Title');
    expect(frontmatter.description).toBeUndefined();
  });

  it('should not treat --- in content as frontmatter', () => {
    const md = 'Some text\n\n---\n\nMore text';
    const { frontmatter, content } = parseFrontmatter(md);
    expect(frontmatter).toEqual({});
    expect(content).toBe(md);
  });

  it('should handle Windows-style line endings', () => {
    const md = '---\r\ntitle: Windows\r\n---\r\n\r\nContent';
    const { frontmatter, content } = parseFrontmatter(md);
    expect(frontmatter.title).toBe('Windows');
    expect(content.includes('Content')).toBe(true);
  });
});
