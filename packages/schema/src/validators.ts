import { z } from 'zod';

/** Optional URL field that also accepts empty strings (treated as undefined) */
const optionalUrl = (maxLen?: number) => {
  const base = maxLen ? z.string().url().max(maxLen) : z.string().url();
  return z.preprocess(
    (val) => (typeof val === 'string' && val.trim() === '' ? undefined : val),
    base.optional(),
  );
};

// --- Auth validators ---

export const usernameSchema = z
  .string()
  .min(3)
  .max(64)
  .regex(
    /^[a-zA-Z0-9_-]+$/,
    'Username can only contain letters, numbers, hyphens, and underscores',
  );

export const emailSchema = z.string().email().max(255);

export const displayNameSchema = z.string().min(1).max(128);

export const bioSchema = z.string().max(2000).optional();

export const socialLinksSchema = z
  .object({
    github: optionalUrl(),
    twitter: optionalUrl(),
    linkedin: optionalUrl(),
    youtube: optionalUrl(),
    instagram: optionalUrl(),
    mastodon: optionalUrl(),
    discord: optionalUrl(),
  })
  .optional();

export const createUserSchema = z.object({
  email: emailSchema,
  username: usernameSchema,
  displayName: displayNameSchema.optional(),
});

export const updateProfileSchema = z.object({
  displayName: displayNameSchema.optional(),
  bio: bioSchema,
  headline: z.string().max(255).optional(),
  location: z.string().max(128).optional(),
  website: optionalUrl(512),
  socialLinks: socialLinksSchema,
  skills: z.array(z.string().max(64)).max(50).optional(),
  pronouns: z.string().max(32).optional(),
  timezone: z.string().max(64).optional(),
  emailNotifications: z
    .object({
      digest: z.enum(['daily', 'weekly', 'none']).optional(),
      likes: z.boolean().optional(),
      comments: z.boolean().optional(),
      follows: z.boolean().optional(),
      mentions: z.boolean().optional(),
    })
    .optional(),
});

// --- Content validators ---

export const slugSchema = z
  .string()
  .min(1)
  .max(255)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be lowercase alphanumeric with hyphens');

export const contentTypeSchema = z.enum(['project', 'article', 'blog', 'explainer']);

export const contentStatusSchema = z.enum(['draft', 'published', 'archived']);

export const difficultySchema = z.enum(['beginner', 'intermediate', 'advanced']);

export const createContentSchema = z.object({
  type: contentTypeSchema,
  title: z.string().min(1).max(255),
  subtitle: z.string().max(255).optional(),
  description: z.string().max(2000).optional(),
  content: z.unknown().optional(),
  coverImageUrl: optionalUrl(),
  category: z.string().max(64).optional(),
  difficulty: difficultySchema.optional(),
  buildTime: z.string().max(64).optional(),
  estimatedCost: z.string().max(64).optional(),
  estimatedMinutes: z.preprocess(
    (val) => (val === '' || val === null ? undefined : val),
    z.number().int().positive().optional(),
  ),
  visibility: z.enum(['public', 'members', 'private']).optional(),
  seoDescription: z.preprocess(
    (val) => (typeof val === 'string' && val.trim() === '' ? undefined : val),
    z.string().max(320).optional(),
  ),
  licenseType: z.string().max(32).optional(),
  series: z.string().max(128).optional(),
  sections: z.unknown().optional(),
  tags: z.array(z.string().max(64)).max(20).optional(),
});

export const updateContentSchema = createContentSchema.partial().omit({ type: true });

// --- Social validators ---

export const likeTargetTypeSchema = z.enum([
  'project',
  'article',
  'blog',
  'comment',
  'post',
  'explainer',
]);
export const commentTargetTypeSchema = z.enum([
  'project',
  'article',
  'blog',
  'explainer',
  'post',
  'lesson',
]);

export const createCommentSchema = z.object({
  targetType: commentTargetTypeSchema,
  targetId: z.string().uuid(),
  parentId: z.string().uuid().optional(),
  content: z.string().min(1).max(10000),
});

// --- Hub validators ---

export const hubTypeSchema = z.enum(['community', 'product', 'company']);

export const createHubSchema = z.object({
  name: z.string().min(1).max(128),
  description: z.string().max(2000).optional(),
  rules: z.string().max(10000).optional(),
  hubType: hubTypeSchema.default('community'),
  joinPolicy: z.enum(['open', 'approval', 'invite']).default('open'),
  privacy: z.enum(['public', 'unlisted', 'private']).default('public'),
  website: optionalUrl(512),
  categories: z.array(z.string().max(64)).max(20).optional(),
  parentHubId: z.string().uuid().optional(),
});

export const updateHubSchema = createHubSchema.partial();

export const createPostSchema = z.object({
  hubId: z.string().uuid(),
  type: z.enum(['text', 'link', 'share', 'poll']).default('text'),
  content: z.string().min(1).max(10000),
  sharedContentId: z.string().uuid().optional(),
  pollOptions: z.array(z.string().min(1).max(200)).min(2).max(10).optional(),
  pollMultiSelect: z.boolean().optional(),
});

export const createReplySchema = z.object({
  postId: z.string().uuid(),
  content: z.string().min(1).max(10000),
  parentId: z.string().uuid().optional(),
});

export const createInviteSchema = z.object({
  maxUses: z.number().int().positive().optional(),
  expiresAt: z.string().datetime().optional(),
});

export const banUserSchema = z.object({
  userId: z.string().uuid(),
  reason: z.string().max(2000).optional(),
  expiresAt: z.string().datetime().optional(),
});

export const changeRoleSchema = z.object({
  role: z.enum(['admin', 'moderator', 'member']),
});

// --- Product validators ---

export const createProductSchema = z.object({
  name: z.string().min(1).max(255),
  description: z.string().max(5000).optional(),
  category: z
    .enum([
      'microcontroller',
      'sbc',
      'sensor',
      'actuator',
      'display',
      'communication',
      'power',
      'mechanical',
      'software',
      'tool',
      'other',
    ])
    .optional(),
  specs: z.record(z.string(), z.string()).optional(),
  imageUrl: optionalUrl(),
  purchaseUrl: optionalUrl(),
  datasheetUrl: optionalUrl(),
  pricing: z
    .object({
      min: z.number().optional(),
      max: z.number().optional(),
      currency: z.string().max(3).optional(),
    })
    .optional(),
  status: z.enum(['active', 'discontinued', 'preview']).default('active'),
});

export const updateProductSchema = createProductSchema.partial();

export const addContentProductSchema = z.object({
  productId: z.string().uuid(),
  quantity: z.number().int().positive().default(1),
  role: z.string().max(64).optional(),
  notes: z.string().max(500).optional(),
  required: z.boolean().default(true),
});

// --- Contest validators ---

export const createContestSchema = z.object({
  title: z.string().min(1).max(255),
  description: z.string().max(10000).optional(),
  rules: z.string().max(10000).optional(),
  bannerUrl: optionalUrl(),
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
  judgingEndDate: z.string().datetime().optional(),
  prizes: z
    .array(
      z.object({
        place: z.number().int().positive(),
        title: z.string().max(255),
        description: z.string().max(1000).optional(),
        value: z.string().max(128).optional(),
      }),
    )
    .optional(),
  judges: z.array(z.string().uuid()).optional(),
});

export const updateContestSchema = createContestSchema.partial();

export const judgeEntrySchema = z.object({
  entryId: z.string().uuid(),
  score: z.number().int().min(0).max(100),
  feedback: z.string().max(2000).optional(),
});

export const contestTransitionSchema = z.object({
  status: z.enum(['upcoming', 'active', 'judging', 'completed']),
});

// --- Video validators ---

export const createVideoSchema = z.object({
  title: z.string().min(1).max(255),
  description: z.string().max(5000).optional(),
  url: z.string().url(),
  embedUrl: optionalUrl(),
  platform: z.enum(['youtube', 'vimeo', 'other']).default('other'),
  thumbnailUrl: optionalUrl(),
  duration: z.string().max(16).optional(),
});

export const createVideoCategorySchema = z.object({
  name: z.string().min(1).max(64),
  description: z.string().max(500).optional(),
  sortOrder: z.number().int().min(0).optional(),
});

// --- Learning validators ---

export const createLearningPathSchema = z.object({
  title: z.string().min(1).max(255),
  description: z.string().max(2000).optional(),
  difficulty: difficultySchema.optional(),
  estimatedHours: z.number().positive().max(9999).optional(),
  coverImageUrl: optionalUrl(),
});

export const updateLearningPathSchema = createLearningPathSchema.partial();

export const createModuleSchema = z.object({
  title: z.string().min(1).max(255),
  description: z.string().max(2000).optional(),
});

export const updateModuleSchema = createModuleSchema.partial();

export const lessonTypeSchema = z.enum(['article', 'video', 'quiz', 'project', 'explainer']);

export const createLessonSchema = z.object({
  moduleId: z.string().uuid(),
  title: z.string().min(1).max(255),
  type: lessonTypeSchema,
  content: z.unknown().optional(),
  duration: z.number().int().positive().max(9999).optional(),
});

export const updateLessonSchema = createLessonSchema.partial().omit({ moduleId: true });

// --- Messaging validators ---

export const createConversationSchema = z.object({
  participants: z.array(z.string().uuid()).min(1).max(50),
});

export const sendMessageSchema = z.object({
  body: z.string().min(1).max(10000),
});

// --- Docs validators ---

export const createDocsSiteSchema = z.object({
  name: z.string().min(1).max(128),
  description: z.string().max(2000).optional(),
});

export const updateDocsSiteSchema = createDocsSiteSchema.partial();

export const createDocsPageSchema = z.object({
  versionId: z.string().uuid().optional(),
  title: z.string().min(1).max(255),
  content: z.string(),
  sortOrder: z.number().int().min(0).optional(),
  parentId: z.string().uuid().optional(),
});

export const updateDocsPageSchema = createDocsPageSchema.partial();

export const createDocsVersionSchema = z.object({
  version: z.string().min(1).max(32),
  isDefault: z.boolean().optional(),
  copyFromVersionId: z.string().uuid().optional(),
});

// --- Report validators ---

export const createReportSchema = z.object({
  targetType: z.enum(['project', 'article', 'blog', 'post', 'comment', 'user', 'explainer']),
  targetId: z.string().uuid(),
  reason: z.enum(['spam', 'harassment', 'inappropriate', 'copyright', 'other']),
  description: z.string().max(2000).optional(),
});

// --- Admin validators ---

export const adminSettingSchema = z.object({
  key: z.string().min(1).max(128),
  value: z.unknown(),
});

export const adminUpdateRoleSchema = z.object({
  role: z.enum(['member', 'pro', 'verified', 'staff', 'admin']),
});

export const adminUpdateStatusSchema = z.object({
  status: z.enum(['active', 'suspended', 'deleted']),
});

export const resolveReportSchema = z.object({
  status: z.enum(['resolved', 'dismissed']),
  resolution: z.string().min(1).max(2000),
});

// --- Federation validators ---

export const actorUriSchema = z.string().url().max(2048);

export const activityDirectionSchema = z.enum(['inbound', 'outbound']);
export const activityStatusSchema = z.enum(['pending', 'delivered', 'failed', 'processed']);
export const followRelationshipStatusSchema = z.enum(['pending', 'accepted', 'rejected']);

export const createRemoteActorSchema = z.object({
  actorUri: actorUriSchema,
  inbox: z.string().url(),
  outbox: optionalUrl(),
  publicKeyPem: z.string().optional(),
  preferredUsername: z.string().max(64).optional(),
  displayName: z.string().max(128).optional(),
  avatarUrl: optionalUrl(),
  instanceDomain: z.string().min(1).max(255),
});

export const createActivitySchema = z.object({
  type: z.string().min(1).max(64),
  actorUri: actorUriSchema,
  objectUri: actorUriSchema.optional(),
  payload: z.record(z.string(), z.unknown()),
  direction: activityDirectionSchema,
});

export const createFollowRelationshipSchema = z.object({
  followerActorUri: actorUriSchema,
  followingActorUri: actorUriSchema,
});
