import { Node, mergeAttributes } from '@tiptap/core';

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    buildStep: {
      setBuildStep: (attributes: { stepNumber: number; instructions: string; image?: string; time?: string; partsUsed?: string[] }) => ReturnType;
    };
  }
}

export const CommonPubBuildStep = Node.create({
  name: 'buildStep',
  group: 'block',
  atom: true,

  addAttributes() {
    return {
      stepNumber: { default: 1 },
      image: { default: null },
      instructions: { default: '' },
      time: { default: null },
      partsUsed: {
        default: [],
        parseHTML: (element: HTMLElement) => {
          try {
            return JSON.parse(element.getAttribute('data-parts-used') || '[]');
          } catch {
            return [];
          }
        },
        renderHTML: (attributes: Record<string, unknown>) => ({
          'data-parts-used': JSON.stringify(attributes.partsUsed),
        }),
      },
    };
  },

  parseHTML() {
    return [{ tag: 'div.cpub-build-step' }];
  },

  renderHTML({ node, HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes, { class: 'cpub-build-step' }),
      ['span', { class: 'cpub-build-step-number' }, `Step ${node.attrs.stepNumber}`],
      ['p', {}, node.attrs.instructions],
    ];
  },

  addCommands() {
    return {
      setBuildStep:
        (attributes) =>
        ({ commands }) => {
          return commands.insertContent({ type: this.name, attrs: attributes });
        },
    };
  },
});
