import { Node, mergeAttributes } from '@tiptap/core';

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    markdown: {
      setMarkdown: (attributes: { source: string }) => ReturnType;
    };
  }
}

export const CommonPubMarkdown = Node.create({
  name: 'markdown',
  group: 'block',
  atom: true,

  addAttributes() {
    return {
      source: { default: '' },
    };
  },

  parseHTML() {
    return [{ tag: 'div.cpub-markdown' }];
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes, { class: 'cpub-markdown' }), ['pre', {}, HTMLAttributes.source || '']];
  },

  addCommands() {
    return {
      setMarkdown:
        (attributes) =>
        ({ commands }) => {
          return commands.insertContent({ type: this.name, attrs: attributes });
        },
    };
  },
});
