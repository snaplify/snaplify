import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getDocsPage } from '$lib/server/docs';
import { renderMarkdown, buildBreadcrumbs, getPrevNextLinks } from '@snaplify/docs';
import type { DocsPage, NavItem } from '@snaplify/docs';

export const load: PageServerLoad = async ({ params, locals, parent }) => {
  if (!locals.config.features.docs) {
    error(404, 'Documentation system is not enabled');
  }

  const parentData = await parent();
  const activeVersionId = parentData.activeVersion.id;

  const page = await getDocsPage(locals.db, activeVersionId, params.pagePath);
  if (!page) {
    error(404, 'Page not found');
  }

  const pages: DocsPage[] = parentData.pages;
  const { html, toc, frontmatter } = await renderMarkdown(page.content);

  const breadcrumbs = buildBreadcrumbs(pages, page.id);
  const prevNext = getPrevNextLinks(parentData.nav as NavItem[], page.id, pages);

  return {
    page: {
      id: page.id,
      title: frontmatter.title ?? page.title,
      slug: page.slug,
    },
    html,
    toc,
    frontmatter,
    breadcrumbs,
    prevNext,
  };
};
