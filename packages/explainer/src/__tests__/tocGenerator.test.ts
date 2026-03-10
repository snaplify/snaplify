import { describe, it, expect } from 'vitest';
import { generateToc } from '../render/tocGenerator';
import { createProgressState, markSectionCompleted } from '../progress/tracker';
import type { ExplainerSection } from '../types';

const sections: ExplainerSection[] = [
  { id: 's1', title: 'Introduction', anchor: 'intro', type: 'text', content: [] },
  {
    id: 's2',
    title: 'Quiz Time',
    anchor: 'quiz',
    type: 'quiz',
    content: [],
    questions: [
      { id: 'q1', question: 'Q?', options: [{ id: 'a', text: 'A' }, { id: 'b', text: 'B' }], correctOptionId: 'a' },
    ],
    passingScore: 70,
    isGate: true,
  },
  { id: 's3', title: 'Advanced', anchor: 'advanced', type: 'text', content: [] },
];

describe('generateToc', () => {
  it('generates TOC items with correct fields', () => {
    const state = createProgressState(sections);
    const toc = generateToc(sections, state);
    expect(toc).toHaveLength(3);
    expect(toc[0]).toEqual({
      id: 's1',
      title: 'Introduction',
      anchor: 'intro',
      completed: false,
      active: false,
      locked: false,
    });
  });

  it('marks active section', () => {
    const state = createProgressState(sections);
    const toc = generateToc(sections, state, 's2');
    expect(toc[1].active).toBe(true);
    expect(toc[0].active).toBe(false);
  });

  it('marks locked sections behind gates', () => {
    const state = createProgressState(sections);
    const toc = generateToc(sections, state);
    // s3 is behind quiz gate s2
    expect(toc[2].locked).toBe(true);
  });

  it('marks completed sections', () => {
    let state = createProgressState(sections);
    state = markSectionCompleted(state, 's1');
    const toc = generateToc(sections, state);
    expect(toc[0].completed).toBe(true);
    expect(toc[1].completed).toBe(false);
  });

  it('unlocks sections when gate is passed', () => {
    let state = createProgressState(sections);
    state = markSectionCompleted(state, 's2', 80);
    const toc = generateToc(sections, state);
    expect(toc[2].locked).toBe(false);
  });

  it('handles empty sections', () => {
    const state = createProgressState([]);
    const toc = generateToc([], state);
    expect(toc).toEqual([]);
  });
});
