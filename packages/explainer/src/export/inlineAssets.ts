/** Minify CSS by removing comments, collapsing whitespace */
export function minifyCss(css: string): string {
  return css
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\s+/g, ' ')
    .replace(/\s*([{}:;,])\s*/g, '$1')
    .replace(/;}/g, '}')
    .trim();
}

/** Minify JS by removing single-line comments and collapsing whitespace (basic) */
export function minifyJs(js: string): string {
  return js
    .replace(/\/\/.*$/gm, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Wrap CSS in a style tag */
export function wrapStyle(css: string): string {
  return `<style>${css}</style>`;
}

/** Wrap JS in a script tag */
export function wrapScript(js: string): string {
  return `<script>${js}</script>`;
}
