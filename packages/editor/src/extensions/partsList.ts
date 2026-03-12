import { Node, mergeAttributes } from '@tiptap/core';

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    partsList: {
      setPartsList: (attributes: { parts: { name: string; qty: number; price?: number; url?: string; category?: string; required?: boolean }[] }) => ReturnType;
    };
  }
}

export const CommonPubPartsList = Node.create({
  name: 'partsList',
  group: 'block',
  atom: true,

  addAttributes() {
    return {
      parts: {
        default: [],
        parseHTML: (element: HTMLElement) => {
          try {
            return JSON.parse(element.getAttribute('data-parts') || '[]');
          } catch {
            return [];
          }
        },
        renderHTML: (attributes: Record<string, unknown>) => ({
          'data-parts': JSON.stringify(attributes.parts),
        }),
      },
    };
  },

  parseHTML() {
    return [{ tag: 'div.cpub-parts-list' }];
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes, { class: 'cpub-parts-list' })];
  },

  addCommands() {
    return {
      setPartsList:
        (attributes) =>
        ({ commands }) => {
          return commands.insertContent({ type: this.name, attrs: attributes });
        },
    };
  },
});
