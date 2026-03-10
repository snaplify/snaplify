import { describe, it, expect } from 'vitest';
import {
  flattenLessons,
  countLessons,
  calculateEstimatedDuration,
  formatDuration,
  buildCurriculumTree,
  reorderItems,
} from '../curriculum';
import type { LearningModule, Lesson } from '../types';

const makeModule = (id: string, sortOrder: number): LearningModule => ({
  id,
  pathId: 'path-1',
  title: `Module ${sortOrder + 1}`,
  description: null,
  sortOrder,
  createdAt: new Date(),
});

const makeLesson = (
  id: string,
  moduleId: string,
  sortOrder: number,
  duration: number | null = 10,
): Lesson => ({
  id,
  moduleId,
  title: `Lesson ${id}`,
  slug: `lesson-${id}`,
  type: 'article',
  content: null,
  duration,
  sortOrder,
  createdAt: new Date(),
  updatedAt: new Date(),
});

describe('flattenLessons', () => {
  it('should return lessons in module sort order then lesson sort order', () => {
    const modules = [makeModule('m2', 1), makeModule('m1', 0)];
    const lessons = [
      makeLesson('l3', 'm2', 0),
      makeLesson('l1', 'm1', 0),
      makeLesson('l2', 'm1', 1),
    ];
    const flat = flattenLessons(modules, lessons);
    expect(flat.map((l) => l.id)).toEqual(['l1', 'l2', 'l3']);
  });

  it('should return empty array for no lessons', () => {
    const modules = [makeModule('m1', 0)];
    expect(flattenLessons(modules, [])).toEqual([]);
  });

  it('should return empty array for no modules', () => {
    const lessons = [makeLesson('l1', 'm1', 0)];
    expect(flattenLessons([], lessons)).toEqual([]);
  });
});

describe('countLessons', () => {
  it('should count lessons belonging to given modules', () => {
    const modules = [makeModule('m1', 0)];
    const lessons = [
      makeLesson('l1', 'm1', 0),
      makeLesson('l2', 'm1', 1),
      makeLesson('l3', 'm2', 0), // orphan — different module
    ];
    expect(countLessons(modules, lessons)).toBe(2);
  });

  it('should return 0 for empty arrays', () => {
    expect(countLessons([], [])).toBe(0);
  });
});

describe('calculateEstimatedDuration', () => {
  it('should sum durations', () => {
    const lessons = [makeLesson('l1', 'm1', 0, 15), makeLesson('l2', 'm1', 1, 30)];
    expect(calculateEstimatedDuration(lessons)).toBe(45);
  });

  it('should treat null durations as 0', () => {
    const lessons = [makeLesson('l1', 'm1', 0, null), makeLesson('l2', 'm1', 1, 20)];
    expect(calculateEstimatedDuration(lessons)).toBe(20);
  });

  it('should return 0 for empty array', () => {
    expect(calculateEstimatedDuration([])).toBe(0);
  });
});

describe('formatDuration', () => {
  it('should format minutes only', () => {
    expect(formatDuration(45)).toBe('45m');
  });

  it('should format hours only', () => {
    expect(formatDuration(120)).toBe('2h');
  });

  it('should format hours and minutes', () => {
    expect(formatDuration(150)).toBe('2h 30m');
  });

  it('should return 0m for zero', () => {
    expect(formatDuration(0)).toBe('0m');
  });

  it('should return 0m for negative', () => {
    expect(formatDuration(-5)).toBe('0m');
  });

  it('should format 1h correctly', () => {
    expect(formatDuration(60)).toBe('1h');
  });
});

describe('buildCurriculumTree', () => {
  const modules = [makeModule('m1', 0), makeModule('m2', 1)];
  const lessons = [makeLesson('l1', 'm1', 0), makeLesson('l2', 'm1', 1), makeLesson('l3', 'm2', 0)];

  it('should build tree with correct structure', () => {
    const tree = buildCurriculumTree(modules, lessons);
    expect(tree).toHaveLength(2);
    expect(tree[0].module.id).toBe('m1');
    expect(tree[0].lessons).toHaveLength(2);
    expect(tree[1].module.id).toBe('m2');
    expect(tree[1].lessons).toHaveLength(1);
  });

  it('should mark first lesson as current when no progress', () => {
    const tree = buildCurriculumTree(modules, lessons);
    expect(tree[0].lessons[0].status).toBe('current');
    expect(tree[0].lessons[1].status).toBe('locked');
    expect(tree[1].lessons[0].status).toBe('locked');
  });

  it('should track completion percentage per module', () => {
    const tree = buildCurriculumTree(modules, lessons, new Set(['l1']));
    expect(tree[0].completionPercentage).toBe(50);
    expect(tree[1].completionPercentage).toBe(0);
  });

  it('should handle empty lessons', () => {
    const tree = buildCurriculumTree(modules, []);
    expect(tree[0].lessons).toHaveLength(0);
    expect(tree[0].completionPercentage).toBe(0);
  });
});

describe('reorderItems', () => {
  const items = [
    { id: 'a', sortOrder: 0 },
    { id: 'b', sortOrder: 1 },
    { id: 'c', sortOrder: 2 },
  ];

  it('should move item forward', () => {
    const result = reorderItems(items, 0, 2);
    expect(result.map((i) => i.id)).toEqual(['b', 'c', 'a']);
    expect(result.map((i) => i.sortOrder)).toEqual([0, 1, 2]);
  });

  it('should move item backward', () => {
    const result = reorderItems(items, 2, 0);
    expect(result.map((i) => i.id)).toEqual(['c', 'a', 'b']);
    expect(result.map((i) => i.sortOrder)).toEqual([0, 1, 2]);
  });

  it('should return same array for same index', () => {
    const result = reorderItems(items, 1, 1);
    expect(result).toEqual(items);
  });

  it('should return same array for out of bounds', () => {
    expect(reorderItems(items, -1, 1)).toEqual(items);
    expect(reorderItems(items, 0, 5)).toEqual(items);
  });
});
