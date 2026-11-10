/**
 * Global State Manager with LocalStorage Persistence & Event Broadcasting
 */
import { INITIAL_COURSES, INITIAL_ENROLLMENTS, INITIAL_STUDENT_PROFILE } from './data/seedData.js';

const STORAGE_KEYS = {
  COURSES: 'lms_courses_v1',
  ENROLLMENTS: 'lms_enrollments_v1',
  PROFILE: 'lms_profile_v2',
  THEME: 'lms_theme_v1'
};

class StateManager {
  constructor() {
    this.subscribers = new Set();
    // Clean up deprecated v1 profile key if present in localStorage
    try {
      localStorage.removeItem('lms_profile_v1');
    } catch (e) {}

    this.courses = this.loadFromStorage(STORAGE_KEYS.COURSES, INITIAL_COURSES);
    this.enrollments = this.loadFromStorage(STORAGE_KEYS.ENROLLMENTS, INITIAL_ENROLLMENTS);
    this.profile = this.loadFromStorage(STORAGE_KEYS.PROFILE, INITIAL_STUDENT_PROFILE);
    if (!this.profile || !this.profile.name || this.profile.name.toLowerCase().includes('alex')) {
      this.profile = JSON.parse(JSON.stringify(INITIAL_STUDENT_PROFILE));
      this.saveProfile();
    }
    if (!this.profile || !this.profile.name || this.profile.name.toLowerCase().includes('alex')) {
      this.profile = JSON.parse(JSON.stringify(INITIAL_STUDENT_PROFILE));
      this.saveProfile();
    }
    this.theme = localStorage.getItem(STORAGE_KEYS.THEME) || 'light';
  }

  loadFromStorage(key, defaultValue) {
    try {
      const saved = localStorage.getItem(key);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn(`Failed reading ${key} from localStorage`, e);
    }
    // Save initial default
    localStorage.setItem(key, JSON.stringify(defaultValue));
    return JSON.parse(JSON.stringify(defaultValue));
  }

  saveCourses() {
    localStorage.setItem(STORAGE_KEYS.COURSES, JSON.stringify(this.courses));
    this.notify('courses');
  }

  saveEnrollments() {
    localStorage.setItem(STORAGE_KEYS.ENROLLMENTS, JSON.stringify(this.enrollments));
    this.notify('enrollments');
  }

  saveProfile() {
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(this.profile));
    this.notify('profile');
  }

  subscribe(callback) {
    this.subscribers.add(callback);
    return () => this.subscribers.delete(callback);
  }

  notify(event, payload) {
    this.subscribers.forEach(cb => {
      try {
        cb(event, payload);
      } catch (err) {
        console.error('Error in state subscriber', err);
      }
    });
  }

  // ---- COURSES ----
  getCourses() {
    return [...this.courses];
  }

  getCourseById(courseId) {
    return this.courses.find(c => c.id === courseId) || null;
  }

  getAllLessons(course) {
    if (!course || !course.sections) return [];
    return course.sections.flatMap(sec => sec.lessons || []);
  }

  // ---- ENROLLMENT ----
  isEnrolled(courseId) {
    return this.enrollments.some(e => e.courseId === courseId);
  }

  getEnrollment(courseId) {
    return this.enrollments.find(e => e.courseId === courseId) || null;
  }

  enrollCourse(courseId) {
    if (this.isEnrolled(courseId)) return false;

    const course = this.getCourseById(courseId);
    if (!course) return false;

    const allLessons = this.getAllLessons(course);
    const firstLessonId = allLessons.length > 0 ? allLessons[0].id : null;

    const newEnrollment = {
      courseId,
      enrolledAt: new Date().toISOString(),
      completedLessonIds: [],
      lastAccessedLessonId: firstLessonId,
      quizScore: null,
      quizPassed: false
    };

    this.enrollments.unshift(newEnrollment);
    this.saveEnrollments();
    return true;
  }

  unenrollCourse(courseId) {
    const prevCount = this.enrollments.length;
    this.enrollments = this.enrollments.filter(e => e.courseId !== courseId);
    if (this.enrollments.length !== prevCount) {
      this.saveEnrollments();
      return true;
    }
    return false;
  }

  // ---- LESSON TRACKING ----
  isLessonCompleted(courseId, lessonId) {
    const enrollment = this.getEnrollment(courseId);
    if (!enrollment) return false;
    return (enrollment.completedLessonIds || []).includes(lessonId);
  }

  toggleLessonCompleted(courseId, lessonId) {
    let enrollment = this.getEnrollment(courseId);
    if (!enrollment) {
      this.enrollCourse(courseId);
      enrollment = this.getEnrollment(courseId);
    }

    if (!enrollment.completedLessonIds) {
      enrollment.completedLessonIds = [];
    }

    const index = enrollment.completedLessonIds.indexOf(lessonId);
    let completed = false;

    if (index > -1) {
      enrollment.completedLessonIds.splice(index, 1);
      completed = false;
    } else {
      enrollment.completedLessonIds.push(lessonId);
      completed = true;
    }

    enrollment.lastAccessedLessonId = lessonId;
    this.saveEnrollments();
    return completed;
  }

  markLessonCompleted(courseId, lessonId) {
    let enrollment = this.getEnrollment(courseId);
    if (!enrollment) {
      this.enrollCourse(courseId);
      enrollment = this.getEnrollment(courseId);
    }

    if (!enrollment.completedLessonIds) {
      enrollment.completedLessonIds = [];
    }

    if (!enrollment.completedLessonIds.includes(lessonId)) {
      enrollment.completedLessonIds.push(lessonId);
    }
    enrollment.lastAccessedLessonId = lessonId;
    this.saveEnrollments();
  }

  setLastAccessedLesson(courseId, lessonId) {
    const enrollment = this.getEnrollment(courseId);
    if (enrollment) {
      enrollment.lastAccessedLessonId = lessonId;
      this.saveEnrollments();
    }
  }

  // ---- COURSE PROGRESS COMPUTATION ----
  getCourseProgress(courseId) {
    const course = this.getCourseById(courseId);
    if (!course) return { percent: 0, completed: 0, total: 0, isCompleted: false, lastLesson: null };

    const allLessons = this.getAllLessons(course);
    const total = allLessons.length;
    if (total === 0) return { percent: 0, completed: 0, total: 0, isCompleted: false, lastLesson: null };

    const enrollment = this.getEnrollment(courseId);
    if (!enrollment) return { percent: 0, completed: 0, total, isCompleted: false, lastLesson: allLessons[0]?.id };

    const completed = (enrollment.completedLessonIds || []).length;
    const percent = Math.min(100, Math.round((completed / total) * 100));
    const isCompleted = percent === 100;

    // Find next uncompleted lesson or last accessed
    let nextLesson = allLessons[0];
    if (enrollment.lastAccessedLessonId) {
      const found = allLessons.find(l => l.id === enrollment.lastAccessedLessonId);
      if (found) nextLesson = found;
    }

    return {
      percent,
      completed,
      total,
      isCompleted,
      lastLessonId: nextLesson?.id,
      quizScore: enrollment.quizScore,
      quizPassed: enrollment.quizPassed
    };
  }

  getEnrolledCoursesWithProgress() {
    return this.enrollments
      .map(enrollment => {
        const course = this.getCourseById(enrollment.courseId);
        if (!course) return null;
        const progress = this.getCourseProgress(course.id);
        return {
          ...course,
          enrollment,
          progress
        };
      })
      .filter(Boolean);
  }

  // ---- QUIZ RESULTS ----
  saveQuizResult(courseId, score, answers, passed) {
    let enrollment = this.getEnrollment(courseId);
    if (!enrollment) {
      this.enrollCourse(courseId);
      enrollment = this.getEnrollment(courseId);
    }

    enrollment.quizScore = score;
    enrollment.quizPassed = passed;
    enrollment.quizAnswers = answers;
    enrollment.quizCompletedAt = new Date().toISOString();

    // Check if score is 100% and award Quiz Ace badge if not present
    if (score === 100) {
      const hasAce = this.profile.badges.some(b => b.id === 'badge-quiz-ace');
      if (!hasAce) {
        this.profile.badges.push({
          id: 'badge-quiz-ace',
          name: 'Quiz Ace',
          icon: '🏆',
          description: 'Scored 100% on a course final assessment'
        });
        this.saveProfile();
      }
    }

    this.saveEnrollments();
    return enrollment;
  }

  getQuizResult(courseId) {
    const enrollment = this.getEnrollment(courseId);
    if (!enrollment || enrollment.quizScore === null) return null;
    return {
      score: enrollment.quizScore,
      passed: enrollment.quizPassed,
      completedAt: enrollment.quizCompletedAt,
      answers: enrollment.quizAnswers
    };
  }

  // ---- OVERALL AGGREGATED STATS ----
  getOverallStats() {
    const enrolledCourses = this.getEnrolledCoursesWithProgress();
    const totalEnrolled = enrolledCourses.length;
    const completedCourses = enrolledCourses.filter(c => c.progress.isCompleted);
    const inProgressCourses = enrolledCourses.filter(c => !c.progress.isCompleted);

    let totalLessonsCount = 0;
    let totalCompletedLessons = 0;
    let quizScoresSum = 0;
    let quizCount = 0;

    enrolledCourses.forEach(c => {
      totalLessonsCount += c.progress.total;
      totalCompletedLessons += c.progress.completed;
      if (c.progress.quizScore !== null && c.progress.quizScore !== undefined) {
        quizScoresSum += c.progress.quizScore;
        quizCount++;
      }
    });

    const overallProgress = totalLessonsCount > 0 
      ? Math.round((totalCompletedLessons / totalLessonsCount) * 100) 
      : 0;

    const avgQuizScore = quizCount > 0 ? Math.round(quizScoresSum / quizCount) : 0;
    const estimatedMinutesLearned = totalCompletedLessons * 18; // approx 18 mins per lesson
    const totalHoursLearned = (estimatedMinutesLearned / 60).toFixed(1);

    return {
      totalEnrolled,
      inProgressCount: inProgressCourses.length,
      completedCount: completedCourses.length,
      totalCompletedLessons,
      overallProgress,
      avgQuizScore,
      totalHoursLearned,
      currentStreakDays: 7, // Demo streak
      certificatesEarned: completedCourses.filter(c => c.progress.quizPassed).length
    };
  }

  // ---- PROFILE ----
  getProfile() {
    return { ...this.profile };
  }

  updateProfile(data) {
    this.profile = { ...this.profile, ...data };
    this.saveProfile();
    return this.profile;
  }

  // ---- ADMIN OPERATIONS ----
  addCourse(courseData) {
    const newCourse = {
      ...courseData,
      id: courseData.id || `course-${Date.now()}`,
      rating: courseData.rating || 5.0,
      reviewCount: courseData.reviewCount || 1,
      studentsCount: courseData.studentsCount || 0,
      badge: courseData.badge || 'New',
      thumbnail: courseData.thumbnail || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80',
      colorTheme: courseData.colorTheme || 'from-indigo-600 to-violet-700',
      sections: courseData.sections && courseData.sections.length > 0 ? courseData.sections : [
        {
          sectionTitle: "Section 1: Getting Started",
          lessons: [
            {
              id: `lesson-${Date.now()}-1`,
              title: "Introduction and Course Overview",
              duration: "10:00",
              type: "video",
              videoEmbed: "https://www.youtube-nocookie.com/embed/SqcY0GlETPk",
              summary: "Welcome to the course. Here is what we will build and learn.",
              notes: "Welcome! Take your time to review the curriculum and prepare your development environment.",
              resources: []
            }
          ]
        }
      ],
      quiz: courseData.quiz || {
        id: `quiz-${Date.now()}`,
        title: `${courseData.title} Quiz`,
        passingScore: 70,
        questions: [
          {
            id: 'q1',
            question: `What is the core focus of ${courseData.title}?`,
            options: ["Mastering the fundamentals and practice", "Memorizing jargon", "Skipping tests", "None of the above"],
            correctIndex: 0,
            explanation: "Practical mastery and solid fundamentals are the core principles."
          }
        ]
      }
    };

    this.courses.unshift(newCourse);
    this.saveCourses();
    return newCourse;
  }

  updateCourse(courseId, updatedData) {
    const index = this.courses.findIndex(c => c.id === courseId);
    if (index === -1) return false;
    this.courses[index] = { ...this.courses[index], ...updatedData };
    this.saveCourses();
    return this.courses[index];
  }

  deleteCourse(courseId) {
    this.courses = this.courses.filter(c => c.id !== courseId);
    this.enrollments = this.enrollments.filter(e => e.courseId !== courseId);
    this.saveCourses();
    this.saveEnrollments();
    return true;
  }

  // Reset to default seed data
  resetAllData() {
    this.courses = JSON.parse(JSON.stringify(INITIAL_COURSES));
    this.enrollments = JSON.parse(JSON.stringify(INITIAL_ENROLLMENTS));
    this.profile = JSON.parse(JSON.stringify(INITIAL_STUDENT_PROFILE));
    this.saveCourses();
    this.saveEnrollments();
    this.saveProfile();
  }
}

export const state = new StateManager();

