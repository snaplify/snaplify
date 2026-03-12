import { Node, mergeAttributes } from '@tiptap/core';

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    toolList: {
      setToolList: (attributes: { tools: { name: string; url?: string; required?: boolean }[] }) => ReturnType;
    };
  }
}

export const CommonPubToolList = Node.create({
  name: 'toolList',
  group: 'block',
  atom: true,

  addAttributes() {
    return {
      tools: {
        default: [],
        parseHTML: (element: HTMLElement) => {
          try {
            return JSON.parse(element.getAttribute('data-tools') || '[]');
          } catch {
            return [];
          }
        },
        renderHTML: (attributes: Record<string, unknown>) => ({
          'data-tools': JSON.stringify(attributes.tools),
        }),
      },
    };
  },

  parseHTML() {
    return [{ tag: 'div.cpub-tool-list' }];
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes, { class: 'cpub-tool-list' })];
  },

  addCommands() {
    return {
      setToolList:
        (attributes) =>
        ({ commands }) => {
          return commands.insertContent({ type: this.name, attrs: attributes });
        },
    };
  },
});
