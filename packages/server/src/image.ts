import type { StorageAdapter } from './storage.js';
import { generateStorageKey } from './storage.js';

/** Image variant sizes */
export const IMAGE_VARIANTS = {
  thumb: 150,
  small: 300,
  medium: 600,
  large: 1200,
} as const;

export type ImageVariantName = keyof typeof IMAGE_VARIANTS;

export interface ImageVariant {
  name: ImageVariantName;
  width: number;
  key: string;
  url: string;
}

export interface ProcessedImage {
  /** Original image key */
  originalKey: string;
  /** Original image URL */
  originalUrl: string;
  /** Original dimensions */
  width: number;
  height: number;
  /** Generated variants (WebP) */
  variants: ImageVariant[];
}

/**
 * Process an uploaded image: resize to standard variants and convert to WebP.
 * Uses sharp for image processing.
 *
 * @param data - Original image buffer
 * @param originalName - Original filename (used to derive storage key)
 * @param purpose - Storage purpose (avatar, cover, content, etc.)
 * @param storage - Storage adapter to write variants to
 * @returns ProcessedImage with all variant URLs
 */
export async function processImage(
  data: Buffer,
  originalName: string,
  purpose: string,
  storage: StorageAdapter,
): Promise<ProcessedImage> {
  const sharp = (await import('sharp')).default;

  // Get original metadata
  const metadata = await sharp(data).metadata();
  const originalWidth = metadata.width ?? 0;
  const originalHeight = metadata.height ?? 0;

  // Upload original
  const originalKey = generateStorageKey(originalName, purpose);
  const originalUrl = await storage.upload(originalKey, data, `image/${metadata.format ?? 'jpeg'}`);

  // Generate variants — only create variants smaller than the original
  const variants: ImageVariant[] = [];
  const variantEntries = Object.entries(IMAGE_VARIANTS) as [ImageVariantName, number][];

  for (const [name, maxWidth] of variantEntries) {
    // Skip variants larger than original
    if (originalWidth > 0 && maxWidth >= originalWidth) continue;

    const resized = await sharp(data)
      .resize(maxWidth, undefined, {
        fit: 'inside',
        withoutEnlargement: true,
      })
      .webp({ quality: 80 })
      .toBuffer();

    const variantKey = generateStorageKey(`${name}.webp`, `${purpose}/variants`);
    const url = await storage.upload(variantKey, resized, 'image/webp');

    variants.push({ name, width: maxWidth, key: variantKey, url });
  }

  return {
    originalKey,
    originalUrl,
    width: originalWidth,
    height: originalHeight,
    variants,
  };
}

/**
 * Get the best variant URL for a given display width.
 * Falls back to the original if no variant is suitable.
 */
export function getBestVariant(
  processed: ProcessedImage,
  displayWidth: number,
): string {
  // Find the smallest variant that's >= displayWidth
  const sorted = [...processed.variants].sort((a, b) => a.width - b.width);
  const match = sorted.find((v) => v.width >= displayWidth);
  return match?.url ?? processed.originalUrl;
}
