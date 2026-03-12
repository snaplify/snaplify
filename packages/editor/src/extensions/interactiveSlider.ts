import { Node, mergeAttributes } from '@tiptap/core';

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    interactiveSlider: {
      setInteractiveSlider: (attributes: {
        label: string;
        min: number;
        max: number;
        step: number;
        defaultValue: number;
        states: { range: [number, number]; label: string; color?: string }[];
      }) => ReturnType;
    };
  }
}

export const CommonPubInteractiveSlider = Node.create({
  name: 'interactiveSlider',
  group: 'block',
  atom: true,

  addAttributes() {
    return {
      label: { default: '' },
      min: { default: 0 },
      max: { default: 100 },
      step: { default: 1 },
      defaultValue: { default: 50 },
      states: {
        default: [],
        parseHTML: (element: HTMLElement) => {
          try {
            return JSON.parse(element.getAttribute('data-states') || '[]');
          } catch {
            return [];
          }
        },
        renderHTML: (attributes: Record<string, unknown>) => ({
          'data-states': JSON.stringify(attributes.states),
        }),
      },
    };
  },

  parseHTML() {
    return [{ tag: 'div.cpub-interactive-slider' }];
  },

  renderHTML({ node, HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes, { class: 'cpub-interactive-slider' }),
      ['span', {}, node.attrs.label],
    ];
  },

  addCommands() {
    return {
      setInteractiveSlider:
        (attributes) =>
        ({ commands }) => {
          return commands.insertContent({ type: this.name, attrs: attributes });
        },
    };
  },
});
