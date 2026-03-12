import { Node, mergeAttributes } from '@tiptap/core';

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    quiz: {
      setQuiz: (attributes: { question: string; options: { text: string; correct: boolean }[]; feedback?: string }) => ReturnType;
    };
  }
}

export const CommonPubQuiz = Node.create({
  name: 'quiz',
  group: 'block',
  atom: true,

  addAttributes() {
    return {
      question: { default: '' },
      options: {
        default: [],
        parseHTML: (element: HTMLElement) => {
          try {
            return JSON.parse(element.getAttribute('data-options') || '[]');
          } catch {
            return [];
          }
        },
        renderHTML: (attributes: Record<string, unknown>) => ({
          'data-options': JSON.stringify(attributes.options),
        }),
      },
      feedback: { default: null },
    };
  },

  parseHTML() {
    return [{ tag: 'div.cpub-quiz' }];
  },

  renderHTML({ node, HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes, { class: 'cpub-quiz' }),
      ['p', { class: 'cpub-quiz-question' }, node.attrs.question],
    ];
  },

  addCommands() {
    return {
      setQuiz:
        (attributes) =>
        ({ commands }) => {
          return commands.insertContent({ type: this.name, attrs: attributes });
        },
    };
  },
});
