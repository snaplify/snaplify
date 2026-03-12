import { Node, mergeAttributes } from '@tiptap/core';

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    embed: {
      setEmbed: (attributes: { url: string; type?: string; html?: string }) => ReturnType;
    };
  }
}

export const CommonPubEmbed = Node.create({
  name: 'embed',
  group: 'block',
  atom: true,

  addAttributes() {
    return {
      url: { default: '' },
      type: { default: 'generic' },
      html: { default: null },
    };
  },

  parseHTML() {
    return [{ tag: 'div.cpub-embed' }];
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes, { class: 'cpub-embed' })];
  },

  addCommands() {
    return {
      setEmbed:
        (attributes) =>
        ({ commands }) => {
          return commands.insertContent({ type: this.name, attrs: attributes });
        },
    };
  },
});
