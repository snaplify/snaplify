import { z } from 'zod';

/** BlockTuple schema — [type, content] */
const blockTupleSchema = z.tuple([z.string(), z.record(z.unknown())]);

/** Visual config schema (Phase 5b) */
const visualConfigSchema = z.object({
  type: z.enum(['animation', 'diagram', 'code-demo']),
  config: z.record(z.unknown()),
});

/** Slider control schema */
const sliderControlSchema = z.object({
  type: z.literal('slider'),
  id: z.string().min(1),
  label: z.string().min(1),
  min: z.number(),
  max: z.number(),
  step: z.number().positive(),
  defaultValue: z.number(),
});

/** Toggle control schema */
const toggleControlSchema = z.object({
  type: z.literal('toggle'),
  id: z.string().min(1),
  label: z.string().min(1),
  defaultValue: z.boolean(),
});

/** Select control schema */
const selectControlSchema = z.object({
  type: z.literal('select'),
  id: z.string().min(1),
  label: z.string().min(1),
  options: z.array(z.object({ value: z.string(), label: z.string() })).min(1),
  defaultValue: z.string(),
});

/** Interactive control discriminated union */
const interactiveControlSchema = z.discriminatedUnion('type', [
  sliderControlSchema,
  toggleControlSchema,
  selectControlSchema,
]);

/** Quiz option schema */
const quizOptionSchema = z.object({
  id: z.string().min(1),
  text: z.string().min(1),
});

/** Quiz question schema */
const quizQuestionSchema = z.object({
  id: z.string().min(1),
  question: z.string().min(1),
  options: z.array(quizOptionSchema).min(2),
  correctOptionId: z.string().min(1),
  explanation: z.string().optional(),
});

/** Base section fields */
const sectionBaseSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  anchor: z.string().min(1),
});

/** Text section schema */
export const textSectionSchema = sectionBaseSchema.extend({
  type: z.literal('text'),
  content: z.array(blockTupleSchema),
  visualConfig: visualConfigSchema.optional(),
});

/** Interactive section schema */
export const interactiveSectionSchema = sectionBaseSchema.extend({
  type: z.literal('interactive'),
  content: z.array(blockTupleSchema),
  controls: z.array(interactiveControlSchema).min(1),
  visualConfig: visualConfigSchema,
});

/** Quiz section schema */
export const quizSectionSchema = sectionBaseSchema.extend({
  type: z.literal('quiz'),
  content: z.array(blockTupleSchema),
  questions: z.array(quizQuestionSchema).min(1),
  passingScore: z.number().min(0).max(100),
  isGate: z.boolean(),
});

/** Checkpoint section schema */
export const checkpointSectionSchema = sectionBaseSchema.extend({
  type: z.literal('checkpoint'),
  content: z.array(blockTupleSchema),
  requiresPrevious: z.boolean(),
});

/** Discriminated union of all section types */
export const explainerSectionSchema = z.discriminatedUnion('type', [
  textSectionSchema,
  interactiveSectionSchema,
  quizSectionSchema,
  checkpointSectionSchema,
]);

/** Array of explainer sections */
export const explainerSectionsSchema = z.array(explainerSectionSchema);

/** Explainer metadata schema */
export const explainerMetaSchema = z.object({
  estimatedMinutes: z.number().int().positive(),
  difficulty: z.enum(['beginner', 'intermediate', 'advanced']),
  prerequisites: z.array(z.string()).optional(),
  learningObjectives: z.array(z.string()).optional(),
});
