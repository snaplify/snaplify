import { describe, it, expect } from 'vitest';
import {
  remoteActors,
  activities,
  followRelationships,
  actorKeypairs,
  actorKeypairsRelations,
} from '../federation';
import { activityDirectionEnum, activityStatusEnum, followRelationshipStatusEnum } from '../enums';
import {
  createRemoteActorSchema,
  createActivitySchema,
  createFollowRelationshipSchema,
  actorUriSchema,
  activityDirectionSchema,
  activityStatusSchema,
  followRelationshipStatusSchema,
} from '../validators';

describe('federation enums', () => {
  it('should define activityDirectionEnum with inbound and outbound', () => {
    expect(activityDirectionEnum).toBeDefined();
    expect(activityDirectionEnum.enumValues).toEqual(['inbound', 'outbound']);
  });

  it('should define activityStatusEnum with all statuses', () => {
    expect(activityStatusEnum).toBeDefined();
    expect(activityStatusEnum.enumValues).toEqual(['pending', 'delivered', 'failed', 'processed']);
  });

  it('should define followRelationshipStatusEnum', () => {
    expect(followRelationshipStatusEnum).toBeDefined();
    expect(followRelationshipStatusEnum.enumValues).toEqual(['pending', 'accepted', 'rejected']);
  });
});

describe('federation tables', () => {
  it('should export remoteActors table with expected columns', () => {
    expect(remoteActors).toBeDefined();
    const cols = Object.keys(remoteActors);
    expect(cols).toContain('id');
    expect(cols).toContain('actorUri');
    expect(cols).toContain('inbox');
    expect(cols).toContain('outbox');
    expect(cols).toContain('publicKeyPem');
    expect(cols).toContain('preferredUsername');
    expect(cols).toContain('displayName');
    expect(cols).toContain('avatarUrl');
    expect(cols).toContain('instanceDomain');
    expect(cols).toContain('lastFetchedAt');
  });

  it('should export activities table with expected columns', () => {
    expect(activities).toBeDefined();
    const cols = Object.keys(activities);
    expect(cols).toContain('id');
    expect(cols).toContain('type');
    expect(cols).toContain('actorUri');
    expect(cols).toContain('objectUri');
    expect(cols).toContain('payload');
    expect(cols).toContain('direction');
    expect(cols).toContain('status');
    expect(cols).toContain('attempts');
    expect(cols).toContain('error');
  });

  it('should export followRelationships table with expected columns', () => {
    expect(followRelationships).toBeDefined();
    const cols = Object.keys(followRelationships);
    expect(cols).toContain('id');
    expect(cols).toContain('followerActorUri');
    expect(cols).toContain('followingActorUri');
    expect(cols).toContain('status');
  });

  it('should export actorKeypairs table with expected columns', () => {
    expect(actorKeypairs).toBeDefined();
    const cols = Object.keys(actorKeypairs);
    expect(cols).toContain('id');
    expect(cols).toContain('userId');
    expect(cols).toContain('publicKeyPem');
    expect(cols).toContain('privateKeyPem');
  });
});

describe('federation relations', () => {
  it('should export actorKeypairs relations', () => {
    expect(actorKeypairsRelations).toBeDefined();
  });
});

describe('federation validators', () => {
  it('should validate actor URIs', () => {
    expect(actorUriSchema.safeParse('https://example.com/users/alice').success).toBe(true);
    expect(actorUriSchema.safeParse('not-a-url').success).toBe(false);
  });

  it('should validate activity directions', () => {
    expect(activityDirectionSchema.safeParse('inbound').success).toBe(true);
    expect(activityDirectionSchema.safeParse('outbound').success).toBe(true);
    expect(activityDirectionSchema.safeParse('sideways').success).toBe(false);
  });

  it('should validate activity statuses', () => {
    expect(activityStatusSchema.safeParse('pending').success).toBe(true);
    expect(activityStatusSchema.safeParse('delivered').success).toBe(true);
    expect(activityStatusSchema.safeParse('unknown').success).toBe(false);
  });

  it('should validate follow relationship statuses', () => {
    expect(followRelationshipStatusSchema.safeParse('pending').success).toBe(true);
    expect(followRelationshipStatusSchema.safeParse('accepted').success).toBe(true);
    expect(followRelationshipStatusSchema.safeParse('invalid').success).toBe(false);
  });

  it('should validate createRemoteActorSchema', () => {
    const valid = createRemoteActorSchema.safeParse({
      actorUri: 'https://remote.example.com/users/bob',
      inbox: 'https://remote.example.com/users/bob/inbox',
      instanceDomain: 'remote.example.com',
    });
    expect(valid.success).toBe(true);

    const invalid = createRemoteActorSchema.safeParse({
      actorUri: 'not-a-url',
      inbox: 'also-not-a-url',
      instanceDomain: '',
    });
    expect(invalid.success).toBe(false);
  });

  it('should validate createActivitySchema', () => {
    const valid = createActivitySchema.safeParse({
      type: 'Create',
      actorUri: 'https://example.com/users/alice',
      payload: { '@context': 'https://www.w3.org/ns/activitystreams' },
      direction: 'outbound',
    });
    expect(valid.success).toBe(true);

    const invalid = createActivitySchema.safeParse({
      type: '',
      actorUri: 'not-url',
      payload: {},
      direction: 'invalid',
    });
    expect(invalid.success).toBe(false);
  });

  it('should validate createFollowRelationshipSchema', () => {
    const valid = createFollowRelationshipSchema.safeParse({
      followerActorUri: 'https://a.example.com/users/alice',
      followingActorUri: 'https://b.example.com/users/bob',
    });
    expect(valid.success).toBe(true);

    const invalid = createFollowRelationshipSchema.safeParse({
      followerActorUri: 'not-url',
      followingActorUri: 'also-not-url',
    });
    expect(invalid.success).toBe(false);
  });
});
