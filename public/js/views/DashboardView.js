/**
 * Module 1: Student Dashboard View
 * Enrolled courses, dynamic progress tracking, continue learning hero, stats, and milestones.
 */
import { Icons } from '../components/Icons.js';
import { state } from '../state.js';
import { renderCourseCard } from '../components/CourseCard.js';

export function renderDashboardView() {
  const container = document.createElement('div');
  container.className = 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in';

  const profile = state.getProfile();
  const stats = state.getOverallStats();
  const enrolledCourses = state.getEnrolledCoursesWithProgress();
  const allCourses = state.getCourses();

  // Find most recent course to resume
  const activeCourse = enrolledCourses.find(c => !c.progress.isCompleted) || enrolledCourses[0] || null;
  let activeLesson = null;
  if (activeCourse) {
    const lessons = state.getAllLessons(activeCourse);
    activeLesson = lessons.find(l => l.id === activeCourse.progress.lastLessonId) || lessons[0];
  }

  // Recommended courses (courses user hasn't enrolled in yet)
  const recommendedCourses = allCourses
    .filter(c => !state.isEnrolled(c.id))
    .slice(0, 3);

  container.innerHTML = `
    <!-- Top Welcome Banner -->
    <div class="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-900 via-indigo-800 to-violet-900 text-white p-6 sm:p-10 shadow-xl">
      <div class="absolute -right-10 -bottom-10 w-80 h-80 bg-violet-500/20 rounded-full blur-3xl pointer-events-none"></div>
      <div class="absolute right-40 top-0 w-60 h-60 bg-indigo-400/20 rounded-full blur-2xl pointer-events-none"></div>

      <div class="relative z-10 max-w-3xl">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-indigo-200 text-xs font-semibold uppercase tracking-wider mb-3">
          <span>🚀</span> Learning Momentum Active
        </div>
        <h1 class="text-2xl sm:text-4xl font-extrabold tracking-tight">
          Welcome back, ${profile.name.split(' ')[0]}!
        </h1>
        <p class="mt-2 text-indigo-100 text-sm sm:text-base leading-relaxed">
          You're on track with your goals. You've completed <span class="font-bold text-white">${stats.totalCompletedLessons} lessons</span> and logged <span class="font-bold text-white">${stats.totalHoursLearned} hours</span> of focused learning.
        </p>

        <div class="mt-6 flex flex-wrap gap-3">
          ${activeCourse && activeLesson ? `
            <a 
              href="#learn/${activeCourse.id}/${activeLesson.id}" 
              class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-indigo-900 font-bold text-sm shadow-md hover:bg-indigo-50 transition-all hover:scale-105"
            >
              ${Icons.play('w-4 h-4 fill-indigo-900')} Resume: ${activeLesson.title.substring(0, 28)}...
            </a>
          ` : `
            <a 
              href="#catalogue" 
              class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-indigo-900 font-bold text-sm shadow-md hover:bg-indigo-50 transition-all"
            >
              ${Icons.book('w-4 h-4')} Explore Catalogue
            </a>
          `}
          <a 
            href="#my-courses" 
            class="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm backdrop-blur-md transition-colors"
          >
            My Enrolled Courses (${stats.totalEnrolled})
          </a>
        </div>
      </div>
    </div>

    <!-- Quick Stats Grid -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      <!-- Stat 1: Enrolled Courses -->
      <div class="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
        <div class="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center flex-shrink-0">
          ${Icons.book('w-6 h-6')}
        </div>
        <div>
          <p class="text-xs font-medium text-gray-500">Enrolled Courses</p>
          <h3 class="text-2xl font-black text-gray-900 mt-0.5">${stats.totalEnrolled}</h3>
          <p class="text-[11px] text-indigo-600 font-medium">${stats.inProgressCount} in progress</p>
        </div>
      </div>

      <!-- Stat 2: Overall Progress -->
      <div class="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
        <div class="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
          ${Icons.checkCircle('w-6 h-6')}
        </div>
        <div>
          <p class="text-xs font-medium text-gray-500">Curriculum Progress</p>
          <h3 class="text-2xl font-black text-gray-900 mt-0.5">${stats.overallProgress}%</h3>
          <p class="text-[11px] text-emerald-600 font-medium">${stats.totalCompletedLessons} lessons passed</p>
        </div>
      </div>

      <!-- Stat 3: Study Hours -->
      <div class="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
        <div class="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center flex-shrink-0">
          ${Icons.clock('w-6 h-6')}
        </div>
        <div>
          <p class="text-xs font-medium text-gray-500">Time Invested</p>
          <h3 class="text-2xl font-black text-gray-900 mt-0.5">${stats.totalHoursLearned}h</h3>
          <p class="text-[11px] text-amber-600 font-medium">Daily goal: ${profile.dailyGoalMinutes}m</p>
        </div>
      </div>

      <!-- Stat 4: Average Assessment Score -->
      <div class="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
        <div class="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center flex-shrink-0">
          ${Icons.trophy('w-6 h-6')}
        </div>
        <div>
          <p class="text-xs font-medium text-gray-500">Avg Quiz Score</p>
          <h3 class="text-2xl font-black text-gray-900 mt-0.5">${stats.avgQuizScore > 0 ? `${stats.avgQuizScore}%` : 'N/A'}</h3>
          <p class="text-[11px] text-purple-600 font-medium">${stats.certificatesEarned} certificates earned</p>
        </div>
      </div>
    </div>

    <!-- Active Resume Learning Hero Card (if user has active course) -->
    ${activeCourse && activeLesson ? `
      <div class="bg-white rounded-2xl border border-gray-200/80 p-5 sm:p-6 shadow-sm">
        <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-gray-100">
          <div class="flex items-center gap-3">
            <span class="p-2 rounded-xl bg-indigo-100 text-indigo-700">
              ${Icons.play('w-5 h-5')}
            </span>
            <div>
              <span class="text-xs font-bold uppercase tracking-wider text-indigo-600">Up Next In Your Schedule</span>
              <h2 class="text-lg font-bold text-gray-900 leading-tight">${activeCourse.title}</h2>
            </div>
          </div>
          <div class="flex items-center gap-3 w-full sm:w-auto">
            <div class="text-right hidden sm:block">
              <span class="text-xs font-bold text-gray-900">${activeCourse.progress.percent}% Completed</span>
              <p class="text-[11px] text-gray-500">${activeCourse.progress.completed} of ${activeCourse.progress.total} lessons</p>
            </div>
            <a 
              href="#learn/${activeCourse.id}/${activeLesson.id}" 
              class="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm text-center shadow-md transition-all flex items-center justify-center gap-2"
            >
              ${Icons.play('w-4 h-4')} Continue: ${activeLesson.title}
            </a>
          </div>
        </div>

        <!-- Progress bar line -->
        <div class="mt-4">
          <div class="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
            <div class="bg-indigo-600 h-full rounded-full transition-all duration-500" style="width: ${activeCourse.progress.percent}%"></div>
          </div>
        </div>
      </div>
    ` : ''}

    <!-- Enrolled Courses Section -->
    <div class="space-y-4">
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-xl font-bold text-gray-900">Enrolled Courses</h2>
          <p class="text-xs text-gray-500 mt-0.5">Track your ongoing courses, progress and upcoming lessons</p>
        </div>
        <a href="#my-courses" class="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1">
          View all (${enrolledCourses.length}) ${Icons.arrowRight('w-3.5 h-3.5')}
        </a>
      </div>

      ${enrolledCourses.length > 0 ? `
        <div id="enrolled-courses-grid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"></div>
      ` : `
        <div class="bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 p-8 text-center">
          <div class="w-12 h-12 mx-auto rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center mb-3">
            ${Icons.book('w-6 h-6')}
          </div>
          <h3 class="font-bold text-gray-800">No courses enrolled yet</h3>
          <p class="text-xs text-gray-500 max-w-sm mx-auto mt-1 mb-4">Explore our catalogue and pick from modern web development, AI, UI design, and cloud topics.</p>
          <a href="#catalogue" class="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-xs font-semibold rounded-xl hover:bg-indigo-700 transition-colors">
            ${Icons.search('w-4 h-4')} Browse Catalogue
          </a>
        </div>
      `}
    </div>

    <!-- Recommended Courses Section -->
    ${recommendedCourses.length > 0 ? `
      <div class="space-y-4 pt-6 border-t border-gray-100">
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-xl font-bold text-gray-900">Recommended For You</h2>
            <p class="text-xs text-gray-500 mt-0.5">Expand your repertoire with trending technology domains</p>
          </div>
          <a href="#catalogue" class="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1">
            See all catalogue ${Icons.arrowRight('w-3.5 h-3.5')}
          </a>
        </div>
        <div id="recommended-courses-grid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"></div>
      </div>
    ` : ''}
  `;

  // Populate Enrolled Courses
  const enrolledGrid = container.querySelector('#enrolled-courses-grid');
  if (enrolledGrid) {
    enrolledCourses.forEach(course => {
      const card = renderCourseCard(course, {
        onUpdate: () => {
          // Re-render dashboard
          const appRoot = document.getElementById('app-root');
          if (appRoot) {
            appRoot.innerHTML = '';
            appRoot.appendChild(renderDashboardView());
          }
        }
      });
      enrolledGrid.appendChild(card);
    });
  }

  // Populate Recommended Courses
  const recommendedGrid = container.querySelector('#recommended-courses-grid');
  if (recommendedGrid) {
    recommendedCourses.forEach(course => {
      const card = renderCourseCard(course, {
        onUpdate: () => {
          const appRoot = document.getElementById('app-root');
          if (appRoot) {
            appRoot.innerHTML = '';
            appRoot.appendChild(renderDashboardView());
          }
        }
      });
      recommendedGrid.appendChild(card);
    });
  }

  return container;
}

