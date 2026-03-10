import { describe, it, expect } from 'vitest';
import {
  textSectionSchema,
  interactiveSectionSchema,
  quizSectionSchema,
  checkpointSectionSchema,
  explainerSectionSchema,
  explainerSectionsSchema,
  explainerMetaSchema,
} from '../schemas';

const baseSection = { id: 'sec-1', title: 'Test Section', anchor: 'test-section' };
const sampleContent: [string, Record<string, unknown>][] = [['text', { html: '<p>Hello</p>' }]];

describe('textSectionSchema', () => {
  it('validates a valid text section', () => {
    const result = textSectionSchema.safeParse({
      ...baseSection,
      type: 'text',
      content: sampleContent,
    });
    expect(result.success).toBe(true);
  });

  it('accepts optional visualConfig', () => {
    const result = textSectionSchema.safeParse({
      ...baseSection,
      type: 'text',
      content: sampleContent,
      visualConfig: { type: 'diagram', config: {} },
    });
    expect(result.success).toBe(true);
  });

  it('rejects missing content', () => {
    const result = textSectionSchema.safeParse({
      ...baseSection,
      type: 'text',
    });
    expect(result.success).toBe(false);
  });

  it('rejects empty id', () => {
    const result = textSectionSchema.safeParse({
      ...baseSection,
      id: '',
      type: 'text',
      content: sampleContent,
    });
    expect(result.success).toBe(false);
  });
});

describe('quizSectionSchema', () => {
  const validQuiz = {
    ...baseSection,
    type: 'quiz',
    content: sampleContent,
    questions: [
      {
        id: 'q1',
        question: 'What is 1+1?',
        options: [
          { id: 'a', text: '1' },
          { id: 'b', text: '2' },
        ],
        correctOptionId: 'b',
      },
    ],
    passingScore: 70,
    isGate: true,
  };

  it('validates a valid quiz section', () => {
    const result = quizSectionSchema.safeParse(validQuiz);
    expect(result.success).toBe(true);
  });

  it('rejects empty questions array', () => {
    const result = quizSectionSchema.safeParse({
      ...validQuiz,
      questions: [],
    });
    expect(result.success).toBe(false);
  });

  it('rejects questions with less than 2 options', () => {
    const result = quizSectionSchema.safeParse({
      ...validQuiz,
      questions: [
        {
          id: 'q1',
          question: 'Only one option?',
          options: [{ id: 'a', text: 'Yes' }],
          correctOptionId: 'a',
        },
      ],
    });
    expect(result.success).toBe(false);
  });

  it('rejects passingScore above 100', () => {
    const result = quizSectionSchema.safeParse({
      ...validQuiz,
      passingScore: 101,
    });
    expect(result.success).toBe(false);
  });

  it('rejects passingScore below 0', () => {
    const result = quizSectionSchema.safeParse({
      ...validQuiz,
      passingScore: -1,
    });
    expect(result.success).toBe(false);
  });

  it('accepts passingScore of 0', () => {
    const result = quizSectionSchema.safeParse({
      ...validQuiz,
      passingScore: 0,
    });
    expect(result.success).toBe(true);
  });
});

describe('interactiveSectionSchema', () => {
  it('validates with slider control', () => {
    const result = interactiveSectionSchema.safeParse({
      ...baseSection,
      type: 'interactive',
      content: sampleContent,
      controls: [
        { type: 'slider', id: 's1', label: 'Speed', min: 0, max: 100, step: 1, defaultValue: 50 },
      ],
      visualConfig: { type: 'animation', config: {} },
    });
    expect(result.success).toBe(true);
  });

  it('rejects empty controls array', () => {
    const result = interactiveSectionSchema.safeParse({
      ...baseSection,
      type: 'interactive',
      content: sampleContent,
      controls: [],
      visualConfig: { type: 'animation', config: {} },
    });
    expect(result.success).toBe(false);
  });

  it('validates with toggle control', () => {
    const result = interactiveSectionSchema.safeParse({
      ...baseSection,
      type: 'interactive',
      content: sampleContent,
      controls: [{ type: 'toggle', id: 't1', label: 'Enable', defaultValue: true }],
      visualConfig: { type: 'diagram', config: {} },
    });
    expect(result.success).toBe(true);
  });

  it('validates with select control', () => {
    const result = interactiveSectionSchema.safeParse({
      ...baseSection,
      type: 'interactive',
      content: sampleContent,
      controls: [
        {
          type: 'select',
          id: 'sel1',
          label: 'Theme',
          options: [{ value: 'light', label: 'Light' }],
          defaultValue: 'light',
        },
      ],
      visualConfig: { type: 'code-demo', config: {} },
    });
    expect(result.success).toBe(true);
  });
});

describe('checkpointSectionSchema', () => {
  it('validates a valid checkpoint section', () => {
    const result = checkpointSectionSchema.safeParse({
      ...baseSection,
      type: 'checkpoint',
      content: sampleContent,
      requiresPrevious: true,
    });
    expect(result.success).toBe(true);
  });

  it('rejects missing requiresPrevious', () => {
    const result = checkpointSectionSchema.safeParse({
      ...baseSection,
      type: 'checkpoint',
      content: sampleContent,
    });
    expect(result.success).toBe(false);
  });
});

describe('explainerSectionSchema (discriminated union)', () => {
  it('accepts text sections', () => {
    const result = explainerSectionSchema.safeParse({
      ...baseSection,
      type: 'text',
      content: sampleContent,
    });
    expect(result.success).toBe(true);
  });

  it('rejects unknown section type', () => {
    const result = explainerSectionSchema.safeParse({
      ...baseSection,
      type: 'unknown',
      content: sampleContent,
    });
    expect(result.success).toBe(false);
  });
});

describe('explainerSectionsSchema', () => {
  it('validates an array of mixed sections', () => {
    const result = explainerSectionsSchema.safeParse([
      { ...baseSection, id: 's1', type: 'text', content: sampleContent },
      {
        ...baseSection,
        id: 's2',
        type: 'quiz',
        content: sampleContent,
        questions: [
          {
            id: 'q1',
            question: 'Q?',
            options: [
              { id: 'a', text: 'A' },
              { id: 'b', text: 'B' },
            ],
            correctOptionId: 'a',
          },
        ],
        passingScore: 50,
        isGate: false,
      },
    ]);
    expect(result.success).toBe(true);
  });

  it('accepts empty array', () => {
    const result = explainerSectionsSchema.safeParse([]);
    expect(result.success).toBe(true);
  });
});

describe('explainerMetaSchema', () => {
  it('validates valid metadata', () => {
    const result = explainerMetaSchema.safeParse({
      estimatedMinutes: 15,
      difficulty: 'intermediate',
    });
    expect(result.success).toBe(true);
  });

  it('accepts optional fields', () => {
    const result = explainerMetaSchema.safeParse({
      estimatedMinutes: 5,
      difficulty: 'beginner',
      prerequisites: ['JavaScript basics'],
      learningObjectives: ['Understand closures'],
    });
    expect(result.success).toBe(true);
  });

  it('rejects non-positive estimatedMinutes', () => {
    const result = explainerMetaSchema.safeParse({
      estimatedMinutes: 0,
      difficulty: 'beginner',
    });
    expect(result.success).toBe(false);
  });

  it('rejects non-integer estimatedMinutes', () => {
    const result = explainerMetaSchema.safeParse({
      estimatedMinutes: 5.5,
      difficulty: 'beginner',
    });
    expect(result.success).toBe(false);
  });
});
