import { fail } from '@sveltejs/kit';
import { listUsers, updateUserRole, updateUserStatus, deleteUser } from '$lib/server/admin';
import { updateUserRoleSchema, updateUserStatusSchema } from '@snaplify/schema';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
  const search = event.url.searchParams.get('search') ?? undefined;
  const role = event.url.searchParams.get('role') ?? undefined;
  const status = event.url.searchParams.get('status') ?? undefined;
  const page = parseInt(event.url.searchParams.get('page') ?? '1', 10);
  const limit = 20;
  const offset = (page - 1) * limit;

  const { items, total } = await listUsers(event.locals.db, {
    search,
    role,
    status,
    limit,
    offset,
  });

  return { users: items, total, page, search, role, status };
};

export const actions: Actions = {
  updateRole: async ({ request, locals, getClientAddress }) => {
    if (!locals.user) return fail(401, { error: 'Not authenticated' });
    if (locals.user.role !== 'admin' && locals.user.role !== 'staff') return fail(403, { error: 'Forbidden' });

    const formData = await request.formData();
    const parsed = updateUserRoleSchema.safeParse({
      userId: formData.get('userId'),
      role: formData.get('role'),
    });

    if (!parsed.success) return fail(400, { error: 'Invalid input' });

    await updateUserRole(
      locals.db,
      parsed.data.userId,
      parsed.data.role,
      locals.user.id,
      getClientAddress(),
    );

    return { success: true };
  },

  updateStatus: async ({ request, locals, getClientAddress }) => {
    if (!locals.user) return fail(401, { error: 'Not authenticated' });
    if (locals.user.role !== 'admin' && locals.user.role !== 'staff') return fail(403, { error: 'Forbidden' });

    const formData = await request.formData();
    const parsed = updateUserStatusSchema.safeParse({
      userId: formData.get('userId'),
      status: formData.get('status'),
    });

    if (!parsed.success) return fail(400, { error: 'Invalid input' });

    await updateUserStatus(
      locals.db,
      parsed.data.userId,
      parsed.data.status,
      locals.user.id,
      getClientAddress(),
    );

    return { success: true };
  },

  deleteUser: async ({ request, locals, getClientAddress }) => {
    if (!locals.user) return fail(401, { error: 'Not authenticated' });
    if (locals.user.role !== 'admin') return fail(403, { error: 'Only admins can delete users' });

    const formData = await request.formData();
    const userId = formData.get('userId') as string;
    const confirm = formData.get('confirm') as string;

    if (!userId) return fail(400, { error: 'User ID is required' });
    if (confirm !== 'DELETE') return fail(400, { error: 'Confirmation required: type DELETE to confirm' });
    if (userId === locals.user.id) return fail(400, { error: 'Cannot delete your own account' });

    try {
      await deleteUser(locals.db, userId, locals.user.id, getClientAddress());
      return { success: true, deleted: true };
    } catch (err) {
      return fail(500, { error: err instanceof Error ? err.message : 'Failed to delete user' });
    }
  },
};
