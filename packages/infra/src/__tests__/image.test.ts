import { describe, it, expect } from 'vitest';
import { getBestVariant, IMAGE_VARIANTS } from '../image.js';
import type { ProcessedImage } from '../image.js';

describe('IMAGE_VARIANTS', () => {
  it('defines thumb, small, medium, large sizes', () => {
    expect(IMAGE_VARIANTS.thumb).toBe(150);
    expect(IMAGE_VARIANTS.small).toBe(300);
    expect(IMAGE_VARIANTS.medium).toBe(600);
    expect(IMAGE_VARIANTS.large).toBe(1200);
  });

  it('sizes are in ascending order', () => {
    expect(IMAGE_VARIANTS.thumb).toBeLessThan(IMAGE_VARIANTS.small);
    expect(IMAGE_VARIANTS.small).toBeLessThan(IMAGE_VARIANTS.medium);
    expect(IMAGE_VARIANTS.medium).toBeLessThan(IMAGE_VARIANTS.large);
  });
});

describe('getBestVariant', () => {
  const mockProcessed: ProcessedImage = {
    originalKey: 'content/original.jpg',
    originalUrl: 'https://cdn.example.com/content/original.jpg',
    width: 2000,
    height: 1500,
    variants: [
      { name: 'thumb', width: 150, key: 'v/thumb.webp', url: 'https://cdn.example.com/v/thumb.webp' },
      { name: 'small', width: 300, key: 'v/small.webp', url: 'https://cdn.example.com/v/small.webp' },
      { name: 'medium', width: 600, key: 'v/medium.webp', url: 'https://cdn.example.com/v/medium.webp' },
      { name: 'large', width: 1200, key: 'v/large.webp', url: 'https://cdn.example.com/v/large.webp' },
    ],
  };

  it('returns thumb for very small display width', () => {
    expect(getBestVariant(mockProcessed, 100)).toBe('https://cdn.example.com/v/thumb.webp');
  });

  it('returns exact match when display width matches variant', () => {
    expect(getBestVariant(mockProcessed, 300)).toBe('https://cdn.example.com/v/small.webp');
  });

  it('returns next larger variant when between sizes', () => {
    expect(getBestVariant(mockProcessed, 400)).toBe('https://cdn.example.com/v/medium.webp');
  });

  it('returns large for display width up to 1200', () => {
    expect(getBestVariant(mockProcessed, 1000)).toBe('https://cdn.example.com/v/large.webp');
  });

  it('falls back to original when display width exceeds all variants', () => {
    expect(getBestVariant(mockProcessed, 2000)).toBe('https://cdn.example.com/content/original.jpg');
  });

  it('falls back to original when no variants exist', () => {
    const noVariants: ProcessedImage = {
      ...mockProcessed,
      variants: [],
    };
    expect(getBestVariant(noVariants, 300)).toBe('https://cdn.example.com/content/original.jpg');
  });

  it('handles unsorted variants correctly', () => {
    const unordered: ProcessedImage = {
      ...mockProcessed,
      variants: [
        { name: 'large', width: 1200, key: 'v/large.webp', url: 'https://cdn.example.com/v/large.webp' },
        { name: 'thumb', width: 150, key: 'v/thumb.webp', url: 'https://cdn.example.com/v/thumb.webp' },
      ],
    };
    // Should still find thumb for small widths
    expect(getBestVariant(unordered, 100)).toBe('https://cdn.example.com/v/thumb.webp');
  });
});
