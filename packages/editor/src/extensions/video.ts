import { Node, mergeAttributes } from '@tiptap/core';

export interface VideoOptions {
  allowedPlatforms: string[];
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    video: {
      setVideo: (attributes: { url: string; platform?: string; caption?: string }) => ReturnType;
    };
  }
}

export const CommonPubVideo = Node.create<VideoOptions>({
  name: 'video',
  group: 'block',
  atom: true,

  addOptions() {
    return {
      allowedPlatforms: ['youtube', 'vimeo', 'twitch', 'other'],
    };
  },

  addAttributes() {
    return {
      url: { default: '' },
      platform: { default: 'other' },
      caption: { default: null },
    };
  },

  parseHTML() {
    return [{ tag: 'div.cpub-video' }];
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes, { class: 'cpub-video' }), ['span', {}, HTMLAttributes.caption || '']];
  },

  addCommands() {
    return {
      setVideo:
        (attributes) =>
        ({ commands }) => {
          return commands.insertContent({ type: this.name, attrs: attributes });
        },
    };
  },
});
