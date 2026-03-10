import { describe, it, expect } from 'vitest';
import {
  renderBlockTuples,
  renderQuizHtml,
  renderControlsHtml,
  renderCheckpointHtml,
  renderSection,
} from '../render/sectionRenderer';
import type { ExplainerSection, QuizQuestion } from '../types';

describe('renderBlockTuples', () => {
  it('renders text blocks', () => {
    const html = renderBlockTuples([['text', { html: '<p>Hello</p>' }]]);
    expect(html).toContain('<div class="block-text"><p>Hello</p></div>');
  });

  it('renders heading blocks', () => {
    const html = renderBlockTuples([['heading', { text: 'Title', level: 2 }]]);
    expect(html).toContain('<h2 class="block-heading">Title</h2>');
  });

  it('renders code blocks with language', () => {
    const html = renderBlockTuples([['code', { code: 'const x = 1;', language: 'typescript' }]]);
    expect(html).toContain('data-language="typescript"');
    expect(html).toContain('const x = 1;');
  });

  it('renders image blocks', () => {
    const html = renderBlockTuples([['image', { src: 'https://example.com/img.png', alt: 'Test' }]]);
    expect(html).toContain('src="https://example.com/img.png"');
    expect(html).toContain('alt="Test"');
    expect(html).toContain('loading="lazy"');
  });

  it('renders quote blocks with attribution', () => {
    const html = renderBlockTuples([['quote', { html: '<p>Words</p>', attribution: 'Author' }]]);
    expect(html).toContain('<blockquote class="block-quote">');
    expect(html).toContain('<footer>Author</footer>');
  });

  it('renders callout blocks with variant', () => {
    const html = renderBlockTuples([['callout', { html: '<p>Note</p>', variant: 'warning' }]]);
    expect(html).toContain('block-callout--warning');
    expect(html).toContain('role="note"');
  });

  it('escapes HTML in heading text', () => {
    const html = renderBlockTuples([['heading', { text: '<script>alert(1)</script>', level: 2 }]]);
    expect(html).not.toContain('<script>');
    expect(html).toContain('&lt;script&gt;');
  });

  it('renders unknown blocks as JSON', () => {
    const html = renderBlockTuples([['custom', { foo: 'bar' }]]);
    expect(html).toContain('block-unknown');
  });

  it('renders code blocks with filename', () => {
    const html = renderBlockTuples([['code', { code: 'x', language: 'js', filename: 'index.js' }]]);
    expect(html).toContain('code-filename');
    expect(html).toContain('index.js');
  });
});

describe('renderQuizHtml', () => {
  const questions: QuizQuestion[] = [
    {
      id: 'q1',
      question: 'What is 1+1?',
      options: [
        { id: 'a', text: '1' },
        { id: 'b', text: '2' },
      ],
      correctOptionId: 'b',
    },
  ];

  it('renders quiz form', () => {
    const html = renderQuizHtml(questions, 'sec-1');
    expect(html).toContain('quiz-form');
    expect(html).toContain('data-section-id="sec-1"');
    expect(html).toContain('aria-label="Quiz"');
  });

  it('renders question text', () => {
    const html = renderQuizHtml(questions, 'sec-1');
    expect(html).toContain('What is 1+1?');
  });

  it('renders radio inputs for options', () => {
    const html = renderQuizHtml(questions, 'sec-1');
    expect(html).toContain('type="radio"');
    expect(html).toContain('name="q-q1"');
  });
});

describe('renderControlsHtml', () => {
  it('renders slider control', () => {
    const html = renderControlsHtml(
      [{ type: 'slider', id: 's1', label: 'Speed', min: 0, max: 100, step: 1, defaultValue: 50 }],
      'sec-1',
    );
    expect(html).toContain('type="range"');
    expect(html).toContain('Speed');
  });

  it('renders toggle control', () => {
    const html = renderControlsHtml(
      [{ type: 'toggle', id: 't1', label: 'Enable', defaultValue: true }],
      'sec-1',
    );
    expect(html).toContain('type="checkbox"');
    expect(html).toContain('checked');
  });

  it('renders select control', () => {
    const html = renderControlsHtml(
      [{
        type: 'select',
        id: 'sel1',
        label: 'Theme',
        options: [{ value: 'light', label: 'Light' }, { value: 'dark', label: 'Dark' }],
        defaultValue: 'light',
      }],
      'sec-1',
    );
    expect(html).toContain('<select');
    expect(html).toContain('selected');
  });
});

describe('renderCheckpointHtml', () => {
  it('renders locked checkpoint', () => {
    const html = renderCheckpointHtml('sec-1', true);
    expect(html).toContain('checkpoint__locked');
    expect(html).toContain('disabled');
  });

  it('renders unlocked checkpoint', () => {
    const html = renderCheckpointHtml('sec-1', false);
    expect(html).toContain('checkpoint__ready');
    expect(html).not.toContain('disabled');
  });
});

describe('renderSection', () => {
  it('renders a text section', () => {
    const section: ExplainerSection = {
      id: 's1',
      title: 'Intro',
      anchor: 'intro',
      type: 'text',
      content: [['text', { html: '<p>Hello</p>' }]],
    };
    const html = renderSection(section);
    expect(html).toContain('id="intro"');
    expect(html).toContain('explainer-section--text');
    expect(html).toContain('Intro');
    expect(html).toContain('<p>Hello</p>');
  });

  it('renders a quiz section with form', () => {
    const section: ExplainerSection = {
      id: 's2',
      title: 'Quiz',
      anchor: 'quiz',
      type: 'quiz',
      content: [],
      questions: [
        { id: 'q1', question: 'Q?', options: [{ id: 'a', text: 'A' }, { id: 'b', text: 'B' }], correctOptionId: 'a' },
      ],
      passingScore: 70,
      isGate: true,
    };
    const html = renderSection(section);
    expect(html).toContain('explainer-section--quiz');
    expect(html).toContain('quiz-form');
  });
});
