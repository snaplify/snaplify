import { error, fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import {
  getLessonBySlug,
  getPathBySlug,
  markLessonComplete,
  getCompletedLessonIds,
  getEnrollment,
} from '$lib/server/learning';

export const load: PageServerLoad = async ({ params, locals }) => {
  if (!locals.config.features.learning) {
    error(404, 'Learning system is not enabled');
  }

  const result = await getLessonBySlug(locals.db, params.slug, params.lessonSlug);
  if (!result) {
    error(404, 'Lesson not found');
  }

  const path = await getPathBySlug(locals.db, params.slug, locals.user?.id);
  if (!path) {
    error(404, 'Learning path not found');
  }

  let completedIds = new Set<string>();
  let enrollment = null;
  if (locals.user) {
    completedIds = await getCompletedLessonIds(locals.db, locals.user.id, result.pathId);
    enrollment = await getEnrollment(locals.db, locals.user.id, result.pathId);
  }

  // Build flat lesson list for prev/next nav
  const allLessons = path.modules.flatMap((m) =>
    m.lessons.map((l) => ({ ...l, moduleTitle: m.title })),
  );
  const currentIndex = allLessons.findIndex((l) => l.slug === params.lessonSlug);
  const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null;
  const nextLesson = currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;

  return {
    lesson: result.lesson,
    module: result.module,
    path,
    completedIds: [...completedIds],
    enrollment,
    prevLesson,
    nextLesson,
  };
};

export const actions: Actions = {
  complete: async ({ locals, params }) => {
    if (!locals.user) {
      return fail(401, { error: 'Not authenticated' });
    }

    const result = await getLessonBySlug(locals.db, params.slug, params.lessonSlug);
    if (!result) {
      return fail(404, { error: 'Lesson not found' });
    }

    try {
      const { progress, certificateIssued } = await markLessonComplete(
        locals.db,
        locals.user.id,
        result.lesson.id,
      );
      return { completed: true, progress, certificateIssued };
    } catch (e) {
      return fail(400, { error: (e as Error).message });
    }
  },
};
