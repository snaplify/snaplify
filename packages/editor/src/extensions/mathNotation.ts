import { Node, mergeAttributes } from '@tiptap/core';

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    mathNotation: {
      setMathNotation: (attributes: { expression: string; display?: boolean }) => ReturnType;
    };
  }
}

export const CommonPubMathNotation = Node.create({
  name: 'mathNotation',
  group: 'block',
  atom: true,

  addAttributes() {
    return {
      expression: { default: '' },
      display: { default: false },
    };
  },

  parseHTML() {
    return [{ tag: 'div.cpub-math' }];
  },

  renderHTML({ node, HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes, {
      class: `cpub-math ${node.attrs.display ? 'cpub-math-display' : 'cpub-math-inline'}`,
    }), ['code', {}, node.attrs.expression]];
  },

  addCommands() {
    return {
      setMathNotation:
        (attributes) =>
        ({ commands }) => {
          return commands.insertContent({ type: this.name, attrs: attributes });
        },
    };
  },
});
