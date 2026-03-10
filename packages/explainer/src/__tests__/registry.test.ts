import { describe, it, expect, beforeEach } from 'vitest';
import {
  registerSectionType,
  lookupSectionType,
  listSectionTypes,
  validateSection,
  clearRegistry,
  registerCoreSectionTypes,
} from '../sections/registry';
import { textSectionSchema } from '../schemas';
import type { ExplainerSection } from '../types';

beforeEach(() => {
  clearRegistry();
});

describe('registerSectionType', () => {
  it('registers a section type', () => {
    registerSectionType({ type: 'text', schema: textSectionSchema, label: 'Text' });
    expect(lookupSectionType('text')).toBeDefined();
  });

  it('throws on duplicate registration', () => {
    registerSectionType({ type: 'text', schema: textSectionSchema, label: 'Text' });
    expect(() =>
      registerSectionType({ type: 'text', schema: textSectionSchema, label: 'Text' }),
    ).toThrow('already registered');
  });
});

describe('lookupSectionType', () => {
  it('returns undefined for unregistered type', () => {
    expect(lookupSectionType('nonexistent')).toBeUndefined();
  });

  it('returns the registered definition', () => {
    registerSectionType({ type: 'text', schema: textSectionSchema, label: 'Text' });
    const def = lookupSectionType('text');
    expect(def?.type).toBe('text');
    expect(def?.label).toBe('Text');
  });
});

describe('listSectionTypes', () => {
  it('returns empty array when no types registered', () => {
    expect(listSectionTypes()).toEqual([]);
  });

  it('returns all registered types', () => {
    registerCoreSectionTypes();
    const types = listSectionTypes();
    expect(types).toHaveLength(4);
    expect(types.map((t) => t.type)).toContain('text');
    expect(types.map((t) => t.type)).toContain('quiz');
    expect(types.map((t) => t.type)).toContain('interactive');
    expect(types.map((t) => t.type)).toContain('checkpoint');
  });
});

describe('validateSection', () => {
  it('validates a valid section', () => {
    registerCoreSectionTypes();
    const section: ExplainerSection = {
      id: 's1',
      title: 'Test',
      anchor: 'test',
      type: 'text',
      content: [['text', { html: '<p>Hello</p>' }]],
    };
    expect(validateSection(section)).toEqual({ success: true });
  });

  it('returns error for unknown type', () => {
    registerCoreSectionTypes();
    const section = { id: 's1', title: 'Test', anchor: 'test', type: 'unknown', content: [] };
    const result = validateSection(section as unknown as ExplainerSection);
    expect(result.success).toBe(false);
    expect(result.error).toContain('Unknown section type');
  });
});

describe('registerCoreSectionTypes', () => {
  it('registers all 4 core types', () => {
    registerCoreSectionTypes();
    expect(listSectionTypes()).toHaveLength(4);
  });

  it('is idempotent', () => {
    registerCoreSectionTypes();
    registerCoreSectionTypes();
    expect(listSectionTypes()).toHaveLength(4);
  });
});
