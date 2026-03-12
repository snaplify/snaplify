import { Node, mergeAttributes } from '@tiptap/core';

export interface GalleryOptions {
  maxImages: number;
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    gallery: {
      setGallery: (attributes: { images: { src: string; alt: string; caption?: string }[] }) => ReturnType;
    };
  }
}

export const CommonPubGallery = Node.create<GalleryOptions>({
  name: 'gallery',
  group: 'block',
  atom: true,

  addOptions() {
    return {
      maxImages: 20,
    };
  },

  addAttributes() {
    return {
      images: {
        default: [],
        parseHTML: (element: HTMLElement) => {
          try {
            return JSON.parse(element.getAttribute('data-images') || '[]');
          } catch {
            return [];
          }
        },
        renderHTML: (attributes: Record<string, unknown>) => ({
          'data-images': JSON.stringify(attributes.images),
        }),
      },
    };
  },

  parseHTML() {
    return [{ tag: 'div.cpub-gallery' }];
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes, { class: 'cpub-gallery' })];
  },

  addCommands() {
    return {
      setGallery:
        (attributes) =>
        ({ commands }) => {
          return commands.insertContent({ type: this.name, attrs: attributes });
        },
    };
  },
});
