/**
 * DB-backed learning path operations.
 * Pure computation logic (progress, certificates, curriculum) lives in @commonpub/learning.
 */
export {
  listPaths,
  getPathBySlug,
  createPath,
  updatePath,
  deletePath,
  publishPath,
  createModule,
  updateModule,
  deleteModule,
  reorderModules,
  createLesson,
  updateLesson,
  deleteLesson,
  reorderLessons,
  enroll,
  unenroll,
  markLessonComplete,
  getEnrollment,
  getUserEnrollments,
  getUserCertificates,
  getCertificateByCode,
  getLessonBySlug,
  getCompletedLessonIds,
} from './learning.js';
