// Auth plugin — fetches session on app init
import type { ClientAuthUser, ClientAuthSession } from '~/composables/useAuth';

export default defineNuxtPlugin(async () => {
  const user = useState<ClientAuthUser | null>('auth-user', () => null);
  const session = useState<ClientAuthSession | null>('auth-session', () => null);

  if (import.meta.server) {
    const event = useRequestEvent();
    if (event?.context?.auth) {
      user.value = (event.context.auth.user as ClientAuthUser) ?? null;
      session.value = (event.context.auth.session as ClientAuthSession) ?? null;
    }
    return;
  }

  // On client, fetch session from the auth API
  try {
    const data = await $fetch<{ user: ClientAuthUser | null; session: ClientAuthSession | null }>('/api/auth/get-session', {
      credentials: 'include',
    });
    user.value = data?.user ?? null;
    session.value = data?.session ?? null;
  } catch {
    user.value = null;
    session.value = null;
  }
});
