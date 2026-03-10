import { describe, it, expect } from 'vitest';
import {
  calculatePathProgress,
  isPathComplete,
  getNextLesson,
  getLessonStatus,
  getCompletionPercentageByModule,
} from '../progress';
import type { LearningModule, Lesson } from '../types';

const makeModule = (id: string, sortOrder: number): LearningModule => ({
  id,
  pathId: 'path-1',
  title: `Module ${sortOrder + 1}`,
  description: null,
  sortOrder,
  createdAt: new Date(),
});

const makeLesson = (id: string, moduleId: string, sortOrder: number): Lesson => ({
  id,
  moduleId,
  title: `Lesson ${sortOrder + 1}`,
  slug: `lesson-${id}`,
  type: 'article',
  content: null,
  duration: 10,
  sortOrder,
  createdAt: new Date(),
  updatedAt: new Date(),
});

describe('calculatePathProgress', () => {
  it('should return 0 for no lessons', () => {
    expect(calculatePathProgress(0, 0)).toBe(0);
  });

  it('should return 0 when nothing completed', () => {
    expect(calculatePathProgress(10, 0)).toBe(0);
  });

  it('should return 100 when all completed', () => {
    expect(calculatePathProgress(5, 5)).toBe(100);
  });

  it('should return correct percentage', () => {
    expect(calculatePathProgress(3, 1)).toBe(33.33);
  });

  it('should cap at 100 if completed exceeds total', () => {
    expect(calculatePathProgress(3, 5)).toBe(100);
  });

  it('should handle 50% correctly', () => {
    expect(calculatePathProgress(4, 2)).toBe(50);
  });
});

describe('isPathComplete', () => {
  it('should return true at 100', () => {
    expect(isPathComplete(100)).toBe(true);
  });

  it('should return false below 100', () => {
    expect(isPathComplete(99.99)).toBe(false);
  });

  it('should return true above 100', () => {
    expect(isPathComplete(100.01)).toBe(true);
  });
});

describe('getNextLesson', () => {
  const modules = [makeModule('m1', 0), makeModule('m2', 1)];
  const lessons = [
    makeLesson('l1', 'm1', 0),
    makeLesson('l2', 'm1', 1),
    makeLesson('l3', 'm2', 0),
  ];

  it('should return first lesson when none completed', () => {
    const next = getNextLesson(modules, lessons, new Set());
    expect(next?.id).toBe('l1');
  });

  it('should return second lesson when first completed', () => {
    const next = getNextLesson(modules, lessons, new Set(['l1']));
    expect(next?.id).toBe('l2');
  });

  it('should cross module boundary', () => {
    const next = getNextLesson(modules, lessons, new Set(['l1', 'l2']));
    expect(next?.id).toBe('l3');
  });

  it('should return null when all completed', () => {
    const next = getNextLesson(modules, lessons, new Set(['l1', 'l2', 'l3']));
    expect(next).toBeNull();
  });

  it('should handle empty lessons', () => {
    const next = getNextLesson(modules, [], new Set());
    expect(next).toBeNull();
  });
});

describe('getLessonStatus', () => {
  const modules = [makeModule('m1', 0)];
  const lessons = [
    makeLesson('l1', 'm1', 0),
    makeLesson('l2', 'm1', 1),
    makeLesson('l3', 'm1', 2),
  ];

  it('should return completed for completed lesson', () => {
    expect(getLessonStatus('l1', modules, lessons, new Set(['l1']))).toBe('completed');
  });

  it('should return current for next lesson', () => {
    expect(getLessonStatus('l2', modules, lessons, new Set(['l1']))).toBe('current');
  });

  it('should return locked for future lesson', () => {
    expect(getLessonStatus('l3', modules, lessons, new Set(['l1']))).toBe('locked');
  });

  it('should return current for first lesson when none completed', () => {
    expect(getLessonStatus('l1', modules, lessons, new Set())).toBe('current');
  });
});

describe('getCompletionPercentageByModule', () => {
  const modules = [makeModule('m1', 0), makeModule('m2', 1)];
  const lessons = [
    makeLesson('l1', 'm1', 0),
    makeLesson('l2', 'm1', 1),
    makeLesson('l3', 'm2', 0),
  ];

  it('should return 0 for all modules when none completed', () => {
    const result = getCompletionPercentageByModule(modules, lessons, new Set());
    expect(result.get('m1')).toBe(0);
    expect(result.get('m2')).toBe(0);
  });

  it('should return correct per-module percentages', () => {
    const result = getCompletionPercentageByModule(modules, lessons, new Set(['l1']));
    expect(result.get('m1')).toBe(50);
    expect(result.get('m2')).toBe(0);
  });

  it('should return 100 for fully completed module', () => {
    const result = getCompletionPercentageByModule(modules, lessons, new Set(['l1', 'l2']));
    expect(result.get('m1')).toBe(100);
    expect(result.get('m2')).toBe(0);
  });
});
