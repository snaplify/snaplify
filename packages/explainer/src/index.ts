// Types
export type {
  ExplainerSectionType,
  ExplainerDifficulty,
  VisualConfig,
  SliderControl,
  ToggleControl,
  SelectControl,
  InteractiveControl,
  QuizOption,
  QuizQuestion,
  ExplainerSectionBase,
  TextSection,
  InteractiveSection,
  QuizSection,
  CheckpointSection,
  ExplainerSection,
  ExplainerMeta,
  SectionDefinition,
  SectionProgress,
  ExplainerProgressState,
  TocItem,
  ExportOptions,
  AnswerResult,
  QuizResult,
} from './types';

// Schemas
export {
  textSectionSchema,
  interactiveSectionSchema,
  quizSectionSchema,
  checkpointSectionSchema,
  explainerSectionSchema,
  explainerSectionsSchema,
  explainerMetaSchema,
} from './schemas';

// Section registry
export {
  registerSectionType,
  lookupSectionType,
  listSectionTypes,
  validateSection,
  clearRegistry,
  registerCoreSectionTypes,
} from './sections/registry';

// Quiz engine
export {
  checkAnswer,
  scoreQuiz,
  isQuizPassed,
  validateQuizAnswers,
  shuffleOptions,
} from './quiz/engine';

// Progress tracker
export {
  createProgressState,
  markSectionCompleted,
  canAccessSection,
  getCompletionPercentage,
  getNextIncompleteSection,
  isExplainerComplete,
} from './progress/tracker';

// TOC generator
export { generateToc } from './render/tocGenerator';

// Section renderer
export {
  renderBlockTuples,
  renderQuizHtml,
  renderControlsHtml,
  renderCheckpointHtml,
  renderSection,
} from './render/sectionRenderer';

// HTML exporter
export { generateExplainerHtml } from './export/htmlExporter';
