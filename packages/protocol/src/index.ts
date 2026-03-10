// Types
export type {
  WebFingerResponse,
  WebFingerLink,
  NodeInfoResponse,
  NodeInfoSoftware,
  NodeInfoUsage,
  SnaplifyActor,
  ParsedResource,
} from './types';

// WebFinger
export { parseWebFingerResource, buildWebFingerResponse } from './webfinger';
export type { BuildWebFingerOptions } from './webfinger';

// NodeInfo
export { buildNodeInfoResponse, buildNodeInfoWellKnown } from './nodeinfo';
export type { BuildNodeInfoOptions } from './nodeinfo';

// Federation
export { createFederation } from './federation';
export type { FederationHandlers, CreateFederationOptions } from './federation';

// OAuth
export { validateAuthorizeRequest, validateTokenRequest } from './oauth';
export type {
  OAuthAuthorizeRequest,
  OAuthTokenRequest,
  OAuthClient,
  OAuthValidationError,
} from './oauth';

// Activity Types
export { AP_CONTEXT, AP_PUBLIC } from './activityTypes';
export type {
  APArticle,
  APNote,
  APTombstone,
  APObject,
  APCreate,
  APUpdate,
  APDelete,
  APFollow,
  APAccept,
  APReject,
  APUndo,
  APLike,
  APAnnounce,
  APActivity,
  APAttachment,
  APTag,
  APOrderedCollection,
  APOrderedCollectionPage,
} from './activityTypes';

// Activity Builders
export {
  buildCreateActivity,
  buildUpdateActivity,
  buildDeleteActivity,
  buildFollowActivity,
  buildAcceptActivity,
  buildRejectActivity,
  buildUndoActivity,
  buildLikeActivity,
  buildAnnounceActivity,
} from './activities';

// Content Mapper
export { contentToArticle, contentToNote, articleToContent, noteToComment } from './contentMapper';
export type { ContentItemInput, AuthorInput, CommentInput } from './contentMapper';

// Actor Resolution
export {
  validateActorResponse,
  extractInbox,
  extractSharedInbox,
  resolveActor,
  resolveActorViaWebFinger,
} from './actorResolver';
export type { ResolvedActor, FetchFn } from './actorResolver';

// Keypair Management
export { generateKeypair, exportPublicKeyPem, exportPrivateKeyPem, buildKeyId } from './keypairs';
export type { ActorKeypair } from './keypairs';

// Inbox Processing
export { processInboxActivity } from './inbox';
export type { InboxCallbacks, InboxResult } from './inbox';

// Outbox Generation
export { generateOutboxCollection, generateOutboxPage } from './outbox';
