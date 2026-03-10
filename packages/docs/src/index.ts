// Types
export type {
  NavItem,
  PageTreeNode,
  BreadcrumbItem,
  PrevNextLinks,
  TocEntry,
  RenderOptions,
  RenderResult,
  PageFrontmatter,
  SearchDocument,
  VersionInfo,
  DocsPage,
  DocsSite,
} from './types';

// Validators
export {
  createDocsSiteSchema,
  updateDocsSiteSchema,
  createDocsVersionSchema,
  createDocsPageSchema,
  updateDocsPageSchema,
  docsNavStructureSchema,
  updateDocsNavSchema,
} from './validators';

// Rendering
export { parseFrontmatter } from './render/frontmatter';
export { extractHeadings, generateHeadingId } from './render/headings';
export { renderMarkdown } from './render/pipeline';

// Navigation
export {
  buildPageTree,
  buildBreadcrumbs,
  buildPagePath,
  flattenNav,
  getPrevNextLinks,
} from './navigation/tree';

// Versioning
export {
  validateVersionString,
  compareVersions,
  selectDefaultVersion,
  prepareVersionCopy,
} from './versioning/manager';

// Search
export {
  stripMarkdown,
  buildSearchDocument,
  buildSearchQuery,
} from './search/indexer';
