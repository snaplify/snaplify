import { describe, it, expect } from 'vitest';
import {
  getRoleWeight,
  canManageRole,
  hasPermission,
  canJoin,
} from '../lib/utils/community-permissions';

describe('Community Permissions', () => {
  describe('getRoleWeight', () => {
    it('should return correct weights for all roles', () => {
      expect(getRoleWeight('owner')).toBe(4);
      expect(getRoleWeight('admin')).toBe(3);
      expect(getRoleWeight('moderator')).toBe(2);
      expect(getRoleWeight('member')).toBe(1);
    });

    it('should return 0 for unknown roles', () => {
      expect(getRoleWeight('unknown')).toBe(0);
    });
  });

  describe('canManageRole', () => {
    it('should allow owner to manage all other roles', () => {
      expect(canManageRole('owner', 'admin')).toBe(true);
      expect(canManageRole('owner', 'moderator')).toBe(true);
      expect(canManageRole('owner', 'member')).toBe(true);
    });

    it('should allow admin to manage moderator and member', () => {
      expect(canManageRole('admin', 'moderator')).toBe(true);
      expect(canManageRole('admin', 'member')).toBe(true);
    });

    it('should not allow admin to manage owner or other admins', () => {
      expect(canManageRole('admin', 'owner')).toBe(false);
      expect(canManageRole('admin', 'admin')).toBe(false);
    });

    it('should not allow moderator to manage anyone', () => {
      expect(canManageRole('moderator', 'member')).toBe(true);
      expect(canManageRole('moderator', 'moderator')).toBe(false);
      expect(canManageRole('moderator', 'admin')).toBe(false);
    });

    it('should not allow member to manage anyone', () => {
      expect(canManageRole('member', 'member')).toBe(false);
    });
  });

  describe('hasPermission', () => {
    it('should grant owner all permissions', () => {
      expect(hasPermission('owner', 'editCommunity')).toBe(true);
      expect(hasPermission('owner', 'manageMembers')).toBe(true);
      expect(hasPermission('owner', 'pinPost')).toBe(true);
      expect(hasPermission('owner', 'lockPost')).toBe(true);
      expect(hasPermission('owner', 'banUser')).toBe(true);
      expect(hasPermission('owner', 'deleteCommunity')).toBe(true);
      expect(hasPermission('owner', 'kickMember')).toBe(true);
    });

    it('should grant admin all except deleteCommunity', () => {
      expect(hasPermission('admin', 'editCommunity')).toBe(true);
      expect(hasPermission('admin', 'manageMembers')).toBe(true);
      expect(hasPermission('admin', 'banUser')).toBe(true);
      expect(hasPermission('admin', 'deleteCommunity')).toBe(false);
    });

    it('should grant moderator pinPost, lockPost, and banUser (temp only enforced at server)', () => {
      expect(hasPermission('moderator', 'pinPost')).toBe(true);
      expect(hasPermission('moderator', 'lockPost')).toBe(true);
      expect(hasPermission('moderator', 'banUser')).toBe(true);
      expect(hasPermission('moderator', 'editCommunity')).toBe(false);
      expect(hasPermission('moderator', 'manageMembers')).toBe(false);
    });

    it('should grant member no permissions', () => {
      expect(hasPermission('member', 'editCommunity')).toBe(false);
      expect(hasPermission('member', 'pinPost')).toBe(false);
    });

    it('should return false for unknown role', () => {
      expect(hasPermission('unknown', 'editCommunity')).toBe(false);
    });

    it('should grant owner deletePost permission', () => {
      expect(hasPermission('owner', 'deletePost')).toBe(true);
    });

    it('should grant admin deletePost permission', () => {
      expect(hasPermission('admin', 'deletePost')).toBe(true);
    });

    it('should grant moderator deletePost permission', () => {
      expect(hasPermission('moderator', 'deletePost')).toBe(true);
    });

    it('should not grant member deletePost permission', () => {
      expect(hasPermission('member', 'deletePost')).toBe(false);
    });
  });

  describe('canJoin', () => {
    it('should allow joining open communities without token', () => {
      expect(canJoin('open', false)).toBe(true);
    });

    it('should allow joining open communities with token', () => {
      expect(canJoin('open', true)).toBe(true);
    });

    it('should require token for approval communities', () => {
      expect(canJoin('approval', false)).toBe(false);
      expect(canJoin('approval', true)).toBe(true);
    });

    it('should require token for invite communities', () => {
      expect(canJoin('invite', false)).toBe(false);
      expect(canJoin('invite', true)).toBe(true);
    });
  });
});
