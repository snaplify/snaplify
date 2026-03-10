import { describe, it, expect } from 'vitest';
import {
  checkAnswer,
  scoreQuiz,
  isQuizPassed,
  validateQuizAnswers,
  shuffleOptions,
} from '../quiz/engine';
import type { QuizQuestion } from '../types';

const questions: QuizQuestion[] = [
  {
    id: 'q1',
    question: 'What is 2+2?',
    options: [
      { id: 'a', text: '3' },
      { id: 'b', text: '4' },
      { id: 'c', text: '5' },
    ],
    correctOptionId: 'b',
    explanation: 'Basic arithmetic',
  },
  {
    id: 'q2',
    question: 'What is the capital of France?',
    options: [
      { id: 'a', text: 'London' },
      { id: 'b', text: 'Paris' },
    ],
    correctOptionId: 'b',
  },
  {
    id: 'q3',
    question: 'Is TypeScript a superset of JavaScript?',
    options: [
      { id: 'a', text: 'Yes' },
      { id: 'b', text: 'No' },
    ],
    correctOptionId: 'a',
    explanation: 'TypeScript extends JavaScript',
  },
];

describe('checkAnswer', () => {
  it('returns correct for right answer', () => {
    const result = checkAnswer(questions[0], 'b');
    expect(result.correct).toBe(true);
    expect(result.explanation).toBe('Basic arithmetic');
  });

  it('returns incorrect for wrong answer', () => {
    const result = checkAnswer(questions[0], 'a');
    expect(result.correct).toBe(false);
  });

  it('includes explanation when available', () => {
    const result = checkAnswer(questions[0], 'a');
    expect(result.explanation).toBe('Basic arithmetic');
  });

  it('returns undefined explanation when not set', () => {
    const result = checkAnswer(questions[1], 'a');
    expect(result.explanation).toBeUndefined();
  });
});

describe('scoreQuiz', () => {
  it('scores all correct as 100', () => {
    const result = scoreQuiz(questions, { q1: 'b', q2: 'b', q3: 'a' });
    expect(result.score).toBe(100);
    expect(result.correct).toBe(3);
    expect(result.total).toBe(3);
  });

  it('scores all wrong as 0', () => {
    const result = scoreQuiz(questions, { q1: 'a', q2: 'a', q3: 'b' });
    expect(result.score).toBe(0);
    expect(result.correct).toBe(0);
  });

  it('scores partial correctly', () => {
    const result = scoreQuiz(questions, { q1: 'b', q2: 'a', q3: 'a' });
    expect(result.score).toBe(67); // 2/3 rounded
    expect(result.correct).toBe(2);
  });

  it('handles missing answers as wrong', () => {
    const result = scoreQuiz(questions, { q1: 'b' });
    expect(result.score).toBe(33); // 1/3 rounded
    expect(result.correct).toBe(1);
  });

  it('handles empty questions array', () => {
    const result = scoreQuiz([], {});
    expect(result.score).toBe(0);
    expect(result.total).toBe(0);
  });

  it('handles empty answers', () => {
    const result = scoreQuiz(questions, {});
    expect(result.score).toBe(0);
    expect(result.correct).toBe(0);
    expect(result.total).toBe(3);
  });
});

describe('isQuizPassed', () => {
  it('returns true when score meets threshold', () => {
    expect(isQuizPassed(70, 70)).toBe(true);
  });

  it('returns true when score exceeds threshold', () => {
    expect(isQuizPassed(80, 70)).toBe(true);
  });

  it('returns false when score below threshold', () => {
    expect(isQuizPassed(69, 70)).toBe(false);
  });

  it('returns true when threshold is 0', () => {
    expect(isQuizPassed(0, 0)).toBe(true);
  });

  it('returns true when threshold is 100 and score is 100', () => {
    expect(isQuizPassed(100, 100)).toBe(true);
  });
});

describe('validateQuizAnswers', () => {
  it('returns valid when all questions answered', () => {
    const result = validateQuizAnswers(questions, { q1: 'a', q2: 'b', q3: 'a' });
    expect(result.valid).toBe(true);
    expect(result.unanswered).toEqual([]);
  });

  it('returns invalid with unanswered questions', () => {
    const result = validateQuizAnswers(questions, { q1: 'a' });
    expect(result.valid).toBe(false);
    expect(result.unanswered).toEqual(['q2', 'q3']);
  });

  it('returns valid for empty questions', () => {
    const result = validateQuizAnswers([], {});
    expect(result.valid).toBe(true);
  });

  it('identifies single unanswered question', () => {
    const result = validateQuizAnswers(questions, { q1: 'a', q3: 'a' });
    expect(result.unanswered).toEqual(['q2']);
  });
});

describe('shuffleOptions', () => {
  const items = [1, 2, 3, 4, 5];

  it('returns array of same length', () => {
    const result = shuffleOptions(items);
    expect(result).toHaveLength(5);
  });

  it('contains all original items', () => {
    const result = shuffleOptions(items);
    expect(result.sort()).toEqual([1, 2, 3, 4, 5]);
  });

  it('does not modify original array', () => {
    const original = [...items];
    shuffleOptions(items);
    expect(items).toEqual(original);
  });

  it('produces deterministic results with same seed', () => {
    const result1 = shuffleOptions(items, 42);
    const result2 = shuffleOptions(items, 42);
    expect(result1).toEqual(result2);
  });

  it('produces different results with different seeds', () => {
    const result1 = shuffleOptions(items, 42);
    const result2 = shuffleOptions(items, 99);
    // Extremely unlikely to produce the same order
    expect(result1).not.toEqual(result2);
  });

  it('handles single item array', () => {
    const result = shuffleOptions([1], 42);
    expect(result).toEqual([1]);
  });

  it('handles empty array', () => {
    const result = shuffleOptions([], 42);
    expect(result).toEqual([]);
  });
});
