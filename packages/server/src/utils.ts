/** Generate a URL-safe slug from a string */
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 100);
}

// --- Hub Permission Helpers ---

const ROLE_HIERARCHY: Record<string, number> = {
  owner: 4,
  admin: 3,
  moderator: 2,
  member: 1,
};

const PERMISSION_MAP: Record<string, number> = {
  editHub: 3,          // admin+
  manageMembers: 3,    // admin+
  banUser: 2,          // moderator+
  kickMember: 2,       // moderator+
  deletePost: 2,       // moderator+
  pinPost: 2,          // moderator+
  lockPost: 2,         // moderator+
};

/** Check if a role has a specific permission */
export function hasPermission(role: string, permission: string): boolean {
  const roleLevel = ROLE_HIERARCHY[role] ?? 0;
  const requiredLevel = PERMISSION_MAP[permission] ?? Infinity;
  return roleLevel >= requiredLevel;
}

/** Check if actorRole can manage targetRole */
export function canManageRole(actorRole: string, targetRole: string): boolean {
  const actorLevel = ROLE_HIERARCHY[actorRole] ?? 0;
  const targetLevel = ROLE_HIERARCHY[targetRole] ?? 0;
  return actorLevel > targetLevel;
}
