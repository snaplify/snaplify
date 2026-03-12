import { Node, mergeAttributes } from '@tiptap/core';

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    checkpoint: {
      setCheckpoint: (attributes: { message: string }) => ReturnType;
    };
  }
}

export const CommonPubCheckpoint = Node.create({
  name: 'checkpoint',
  group: 'block',
  atom: true,

  addAttributes() {
    return {
      message: { default: '' },
    };
  },

  parseHTML() {
    return [{ tag: 'div.cpub-checkpoint' }];
  },

  renderHTML({ node, HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes, { class: 'cpub-checkpoint' }),
      ['span', {}, node.attrs.message],
    ];
  },

  addCommands() {
    return {
      setCheckpoint:
        (attributes) =>
        ({ commands }) => {
          return commands.insertContent({ type: this.name, attrs: attributes });
        },
    };
  },
});
