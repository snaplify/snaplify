import { Node, mergeAttributes } from '@tiptap/core';

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    downloads: {
      setDownloads: (attributes: { files: { name: string; url: string; size?: string; type?: string }[] }) => ReturnType;
    };
  }
}

export const CommonPubDownloads = Node.create({
  name: 'downloads',
  group: 'block',
  atom: true,

  addAttributes() {
    return {
      files: {
        default: [],
        parseHTML: (element: HTMLElement) => {
          try {
            return JSON.parse(element.getAttribute('data-files') || '[]');
          } catch {
            return [];
          }
        },
        renderHTML: (attributes: Record<string, unknown>) => ({
          'data-files': JSON.stringify(attributes.files),
        }),
      },
    };
  },

  parseHTML() {
    return [{ tag: 'div.cpub-downloads' }];
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes, { class: 'cpub-downloads' })];
  },

  addCommands() {
    return {
      setDownloads:
        (attributes) =>
        ({ commands }) => {
          return commands.insertContent({ type: this.name, attrs: attributes });
        },
    };
  },
});
