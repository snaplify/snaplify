// Types
export type {
  LessonType,
  Difficulty,
  PathStatus,
  LearningPath,
  LearningModule,
  Lesson,
  Enrollment,
  LessonProgressRecord,
  Certificate,
  CreatePathInput,
  UpdatePathInput,
  CreateModuleInput,
  UpdateModuleInput,
  CreateLessonInput,
  UpdateLessonInput,
  ArticleLessonContent,
  VideoLessonContent,
  QuizLessonContent,
  ProjectLessonContent,
  ExplainerLessonContent,
  LessonContent,
  LessonStatus,
  CurriculumNode,
  CertificateData,
} from './types';

// Validators
export {
  updateLearningPathSchema,
  createModuleSchema,
  updateModuleSchema,
  updateLessonSchema,
  lessonContentSchema,
} from './validators';

// Progress
export {
  calculatePathProgress,
  isPathComplete,
  getNextLesson,
  getLessonStatus,
  getCompletionPercentageByModule,
} from './progress';

// Certificate
export {
  generateVerificationCode,
  formatCertificateData,
  buildVerificationUrl,
} from './certificate';

// Curriculum
export {
  flattenLessons,
  countLessons,
  calculateEstimatedDuration,
  formatDuration,
  buildCurriculumTree,
  reorderItems,
} from './curriculum';
