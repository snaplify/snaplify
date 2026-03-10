import { error } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import { getDocsSiteBySlug, getDocsNav, listDocsPages } from '$lib/server/docs';
import { buildPageTree } from '@snaplify/docs';
import type { DocsPage, VersionInfo } from '@snaplify/docs';

export const load: LayoutServerLoad = async ({ params, locals, url }) => {
  if (!locals.config.features.docs) {
    error(404, 'Documentation system is not enabled');
  }

  const result = await getDocsSiteBySlug(locals.db, params.siteSlug);
  if (!result) {
    error(404, 'Documentation site not found');
  }

  const { site, versions } = result;

  // Select version
  const requestedVersion = url.searchParams.get('v');
  let activeVersion = versions.find((v) => v.isDefault === 1) ?? versions[0];

  if (requestedVersion) {
    const found = versions.find((v) => v.version === requestedVersion);
    if (found) activeVersion = found;
  }

  if (!activeVersion) {
    error(404, 'No versions available');
  }

  // Load nav and pages
  const [nav, pages] = await Promise.all([
    getDocsNav(locals.db, activeVersion.id),
    listDocsPages(locals.db, activeVersion.id),
  ]);

  const pagesAsDocsPage: DocsPage[] = pages.map((p) => ({
    id: p.id,
    versionId: p.versionId,
    title: p.title,
    slug: p.slug,
    content: p.content,
    sortOrder: p.sortOrder,
    parentId: p.parentId,
    createdAt: p.createdAt,
    updatedAt: p.updatedAt,
  }));

  const pageTree = buildPageTree(pagesAsDocsPage);

  const versionInfos: VersionInfo[] = versions.map((v) => ({
    id: v.id,
    version: v.version,
    isDefault: v.isDefault === 1,
    createdAt: v.createdAt,
    pageCount: pages.filter((p) => p.versionId === v.id).length,
  }));

  return {
    site,
    versions: versionInfos,
    activeVersion: {
      id: activeVersion.id,
      version: activeVersion.version,
    },
    nav: nav?.structure ?? [],
    pages: pagesAsDocsPage,
    pageTree,
    isOwner: locals.user?.id === site.ownerId,
  };
};
