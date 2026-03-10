type CommunityRole = 'owner' | 'admin' | 'moderator' | 'member';

type CommunityAction =
  | 'editCommunity'
  | 'manageMembers'
  | 'pinPost'
  | 'lockPost'
  | 'banUser'
  | 'deleteCommunity'
  | 'kickMember';

const ROLE_WEIGHTS: Record<CommunityRole, number> = {
  owner: 4,
  admin: 3,
  moderator: 2,
  member: 1,
};

const ROLE_PERMISSIONS: Record<CommunityRole, Set<CommunityAction>> = {
  owner: new Set([
    'editCommunity',
    'manageMembers',
    'pinPost',
    'lockPost',
    'banUser',
    'deleteCommunity',
    'kickMember',
  ]),
  admin: new Set([
    'editCommunity',
    'manageMembers',
    'pinPost',
    'lockPost',
    'banUser',
    'kickMember',
  ]),
  moderator: new Set(['pinPost', 'lockPost', 'banUser']),
  member: new Set(),
};

export function getRoleWeight(role: string): number {
  return ROLE_WEIGHTS[role as CommunityRole] ?? 0;
}

export function canManageRole(actorRole: string, targetRole: string): boolean {
  return getRoleWeight(actorRole) > getRoleWeight(targetRole);
}

export function hasPermission(role: string, action: CommunityAction): boolean {
  const perms = ROLE_PERMISSIONS[role as CommunityRole];
  if (!perms) return false;
  return perms.has(action);
}

export function canJoin(joinPolicy: string, hasInviteToken: boolean): boolean {
  if (joinPolicy === 'open') return true;
  return hasInviteToken;
}
