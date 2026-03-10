import DOMPurify from 'isomorphic-dompurify';

/**
 * Sanitize HTML content to prevent XSS.
 * Allows safe HTML tags (headings, paragraphs, lists, code, images, links)
 * but strips scripts, event handlers, and dangerous attributes.
 */
export function sanitizeHtml(html: string): string {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: [
      'p', 'br', 'strong', 'em', 'code', 'pre', 'a', 'ul', 'ol', 'li',
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'img', 'figure',
      'figcaption', 'div', 'span', 'table', 'thead', 'tbody', 'tr', 'th', 'td',
      'mark', 'del', 's', 'sub', 'sup', 'hr',
    ],
    ALLOWED_ATTR: [
      'href', 'src', 'alt', 'title', 'class', 'id', 'target', 'rel',
      'width', 'height', 'loading', 'data-language', 'data-filename',
    ],
    ALLOW_DATA_ATTR: false,
  });
}

/**
 * Escape a string for safe use in JSON-LD script tags.
 * Prevents script tag injection within JSON-LD.
 */
export function escapeJsonLd(text: string): string {
  return text.replace(/</g, '\\u003c').replace(/>/g, '\\u003e');
}
