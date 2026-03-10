import { error, fail, redirect } from '@sveltejs/kit';
import { authGuard } from '@snaplify/auth';
import {
  getPathBySlug,
  updatePath,
  publishPath,
  deletePath,
  createModule,
  updateModule,
  deleteModule,
  reorderModules,
  createLesson,
  updateLesson,
  deleteLesson,
  reorderLessons,
} from '$lib/server/learning';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
  if (!event.locals.config.features.learning) {
    error(404, 'Learning system is not enabled');
  }

  const guard = authGuard(event);
  if (!guard.authorized) {
    redirect(guard.status ?? 303, guard.redirectTo ?? '/auth/sign-in');
  }

  const path = await getPathBySlug(event.locals.db, event.params.slug, event.locals.user!.id);
  if (!path) {
    error(404, 'Learning path not found');
  }

  if (path.author.id !== event.locals.user!.id) {
    error(403, 'Not authorized to edit this path');
  }

  return { path };
};

export const actions: Actions = {
  updatePath: async ({ request, locals, params }) => {
    if (!locals.user) return fail(401, { error: 'Not authenticated' });

    const path = await getPathBySlug(locals.db, params.slug, locals.user.id);
    if (!path || path.author.id !== locals.user.id) {
      return fail(403, { error: 'Not authorized' });
    }

    const data = await request.formData();
    const updated = await updatePath(locals.db, path.id, locals.user.id, {
      title: (data.get('title') as string)?.trim() || undefined,
      description: (data.get('description') as string)?.trim() || undefined,
      difficulty: (data.get('difficulty') as string) || undefined,
      estimatedHours: data.get('estimatedHours')
        ? Number(data.get('estimatedHours'))
        : undefined,
    });

    if (!updated) return fail(500, { error: 'Failed to update' });

    if (updated.slug !== params.slug) {
      redirect(303, `/learn/${updated.slug}/edit`);
    }

    return { pathUpdated: true };
  },

  publish: async ({ locals, params }) => {
    if (!locals.user) return fail(401, { error: 'Not authenticated' });

    const path = await getPathBySlug(locals.db, params.slug, locals.user.id);
    if (!path || path.author.id !== locals.user.id) {
      return fail(403, { error: 'Not authorized' });
    }

    await publishPath(locals.db, path.id, locals.user.id);
    return { published: true };
  },

  addModule: async ({ request, locals, params }) => {
    if (!locals.user) return fail(401, { error: 'Not authenticated' });

    const path = await getPathBySlug(locals.db, params.slug, locals.user.id);
    if (!path || path.author.id !== locals.user.id) {
      return fail(403, { error: 'Not authorized' });
    }

    const data = await request.formData();
    const title = data.get('title') as string;
    if (!title?.trim()) {
      return fail(400, { error: 'Module title is required' });
    }

    await createModule(locals.db, locals.user.id, {
      pathId: path.id,
      title: title.trim(),
      description: (data.get('description') as string)?.trim() || undefined,
    });

    return { moduleAdded: true };
  },

  updateModule: async ({ request, locals }) => {
    if (!locals.user) return fail(401, { error: 'Not authenticated' });

    const data = await request.formData();
    const moduleId = data.get('moduleId') as string;
    if (!moduleId) return fail(400, { error: 'Module ID required' });

    const updated = await updateModule(locals.db, moduleId, locals.user.id, {
      title: (data.get('title') as string)?.trim() || undefined,
      description: (data.get('description') as string)?.trim() || undefined,
    });

    if (!updated) return fail(403, { error: 'Not authorized' });
    return { moduleUpdated: true };
  },

  deleteModule: async ({ request, locals }) => {
    if (!locals.user) return fail(401, { error: 'Not authenticated' });

    const data = await request.formData();
    const moduleId = data.get('moduleId') as string;
    if (!moduleId) return fail(400, { error: 'Module ID required' });

    const deleted = await deleteModule(locals.db, moduleId, locals.user.id);
    if (!deleted) return fail(403, { error: 'Not authorized' });
    return { moduleDeleted: true };
  },

  reorderModules: async ({ request, locals, params }) => {
    if (!locals.user) return fail(401, { error: 'Not authenticated' });

    const path = await getPathBySlug(locals.db, params.slug, locals.user.id);
    if (!path || path.author.id !== locals.user.id) {
      return fail(403, { error: 'Not authorized' });
    }

    const data = await request.formData();
    const orderJson = data.get('order') as string;
    try {
      const order = JSON.parse(orderJson) as string[];
      await reorderModules(locals.db, path.id, locals.user.id, order);
    } catch {
      return fail(400, { error: 'Invalid order data' });
    }

    return { modulesReordered: true };
  },

  addLesson: async ({ request, locals }) => {
    if (!locals.user) return fail(401, { error: 'Not authenticated' });

    const data = await request.formData();
    const moduleId = data.get('moduleId') as string;
    const title = data.get('title') as string;
    const type = data.get('type') as string;

    if (!moduleId || !title?.trim() || !type) {
      return fail(400, { error: 'Module ID, title, and type are required' });
    }

    try {
      await createLesson(locals.db, locals.user.id, {
        moduleId,
        title: title.trim(),
        type,
        durationMinutes: data.get('duration') ? Number(data.get('duration')) : undefined,
      });
    } catch {
      return fail(403, { error: 'Not authorized' });
    }

    return { lessonAdded: true };
  },

  updateLesson: async ({ request, locals }) => {
    if (!locals.user) return fail(401, { error: 'Not authenticated' });

    const data = await request.formData();
    const lessonId = data.get('lessonId') as string;
    if (!lessonId) return fail(400, { error: 'Lesson ID required' });

    let content: unknown = undefined;
    const contentJson = data.get('content') as string | null;
    if (contentJson) {
      try {
        content = JSON.parse(contentJson);
      } catch {
        return fail(400, { error: 'Invalid content format' });
      }
    }

    const updated = await updateLesson(locals.db, lessonId, locals.user.id, {
      title: (data.get('title') as string)?.trim() || undefined,
      type: (data.get('type') as string) || undefined,
      content,
      durationMinutes: data.get('duration') ? Number(data.get('duration')) : undefined,
    });

    if (!updated) return fail(403, { error: 'Not authorized' });
    return { lessonUpdated: true };
  },

  deleteLesson: async ({ request, locals }) => {
    if (!locals.user) return fail(401, { error: 'Not authenticated' });

    const data = await request.formData();
    const lessonId = data.get('lessonId') as string;
    if (!lessonId) return fail(400, { error: 'Lesson ID required' });

    const deleted = await deleteLesson(locals.db, lessonId, locals.user.id);
    if (!deleted) return fail(403, { error: 'Not authorized' });
    return { lessonDeleted: true };
  },

  reorderLessons: async ({ request, locals }) => {
    if (!locals.user) return fail(401, { error: 'Not authenticated' });

    const data = await request.formData();
    const moduleId = data.get('moduleId') as string;
    const orderJson = data.get('order') as string;

    if (!moduleId || !orderJson) {
      return fail(400, { error: 'Module ID and order are required' });
    }

    try {
      const order = JSON.parse(orderJson) as string[];
      await reorderLessons(locals.db, moduleId, locals.user.id, order);
    } catch {
      return fail(400, { error: 'Invalid order data' });
    }

    return { lessonsReordered: true };
  },
};
