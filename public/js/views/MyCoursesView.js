/**
 * Module 4: My Courses Page
 * Filter by All / In Progress / Completed, search, progress metrics, and direct resume actions.
 */
import { Icons } from '../components/Icons.js';
import { state } from '../state.js';
import { toast } from '../components/Toast.js';
import { CertificateModal } from '../components/Certificate.js';

export function renderMyCoursesView() {
  const container = document.createElement('div');
  container.className = 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-fade-in';

  let currentTab = 'all'; // 'all', 'in-progress', 'completed'
  let searchQuery = '';

  container.innerHTML = `
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-gray-100">
      <div>
        <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold mb-2">
          ${Icons.academic('w-3.5 h-3.5')}
          <span>Enrolled Learning Dashboard</span>
        </div>
        <h1 class="text-3xl font-extrabold text-gray-900 tracking-tight">My Courses</h1>
        <p class="text-sm text-gray-500 mt-1">Manage your active studies, track lesson completions, and review earned certificates.</p>
      </div>

      <a href="#catalogue" class="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-sm transition-colors self-start md:self-auto">
        ${Icons.plus('w-4 h-4')} Enroll in More Courses
      </a>
    </div>

    <!-- Navigation Tabs & Search Row -->
    <div class="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
      
      <!-- Tabs -->
      <div class="flex items-center gap-1 bg-gray-100/80 p-1 rounded-xl w-full md:w-auto" id="course-tabs">
        <button data-tab="all" class="tab-btn flex-1 md:flex-none px-4 py-2 rounded-lg text-xs font-bold transition-all bg-white text-indigo-700 shadow-xs">
          All Courses <span id="count-all" class="ml-1 text-[11px] px-1.5 py-0.2 rounded-full bg-indigo-100 text-indigo-800">0</span>
        </button>
        <button data-tab="in-progress" class="tab-btn flex-1 md:flex-none px-4 py-2 rounded-lg text-xs font-bold transition-all text-gray-600 hover:text-gray-900">
          In Progress <span id="count-in-progress" class="ml-1 text-[11px] px-1.5 py-0.2 rounded-full bg-gray-200 text-gray-700">0</span>
        </button>
        <button data-tab="completed" class="tab-btn flex-1 md:flex-none px-4 py-2 rounded-lg text-xs font-bold transition-all text-gray-600 hover:text-gray-900">
          Completed <span id="count-completed" class="ml-1 text-[11px] px-1.5 py-0.2 rounded-full bg-gray-200 text-gray-700">0</span>
        </button>
      </div>

      <!-- Search Input within enrolled -->
      <div class="relative w-full md:w-72">
        <span class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
          ${Icons.search('w-4 h-4')}
        </span>
        <input 
          type="text" 
          id="my-courses-search" 
          placeholder="Filter your courses..."
          class="w-full pl-9 pr-8 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-800 placeholder-gray-400 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500 transition-all"
        />
        <button id="clear-my-search" class="hidden absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600">
          &times;
        </button>
      </div>

    </div>

    <!-- Courses Grid -->
    <div id="my-courses-grid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"></div>

    <!-- Empty State -->
    <div id="my-courses-empty" class="hidden bg-white rounded-3xl border border-gray-100 p-12 text-center max-w-md mx-auto shadow-sm">
      <div class="w-14 h-14 mx-auto rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-3">
        ${Icons.book('w-6 h-6')}
      </div>
      <h3 id="empty-title" class="text-base font-bold text-gray-900">No courses found</h3>
      <p id="empty-desc" class="text-xs text-gray-500 mt-1 mb-5">You haven't enrolled in any courses yet.</p>
      <a href="#catalogue" class="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-xs font-bold rounded-xl hover:bg-indigo-700 transition-colors">
        ${Icons.search('w-4 h-4')} Browse Catalogue
      </a>
    </div>
  `;

  const searchInput = container.querySelector('#my-courses-search');
  const clearSearchBtn = container.querySelector('#clear-my-search');
  const tabsContainer = container.querySelector('#course-tabs');
  const coursesGrid = container.querySelector('#my-courses-grid');
  const emptyState = container.querySelector('#my-courses-empty');
  const emptyTitle = container.querySelector('#empty-title');
  const emptyDesc = container.querySelector('#empty-desc');

  const countAll = container.querySelector('#count-all');
  const countInProgress = container.querySelector('#count-in-progress');
  const countCompleted = container.querySelector('#count-completed');

  function renderList() {
    const allEnrolled = state.getEnrolledCoursesWithProgress();

    // Tab counts
    const inProgressList = allEnrolled.filter(c => !c.progress.isCompleted);
    const completedList = allEnrolled.filter(c => c.progress.isCompleted);

    countAll.textContent = allEnrolled.length;
    countInProgress.textContent = inProgressList.length;
    countCompleted.textContent = completedList.length;

    let filtered = allEnrolled;
    if (currentTab === 'in-progress') filtered = inProgressList;
    if (currentTab === 'completed') filtered = completedList;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(c => 
        c.title.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q) ||
        c.instructor.name.toLowerCase().includes(q)
      );
    }

    coursesGrid.innerHTML = '';

    if (filtered.length === 0) {
      coursesGrid.classList.add('hidden');
      emptyState.classList.remove('hidden');

      if (allEnrolled.length === 0) {
        emptyTitle.textContent = 'No Courses Enrolled';
        emptyDesc.textContent = 'Explore our curated course catalogue and begin your learning journey!';
      } else if (currentTab === 'completed') {
        emptyTitle.textContent = 'No Completed Courses Yet';
        emptyDesc.textContent = 'Finish all lessons in an enrolled course and pass the quiz to earn your certificate.';
      } else if (currentTab === 'in-progress') {
        emptyTitle.textContent = 'No Active Courses In Progress';
        emptyDesc.textContent = 'All your enrolled courses are either completed or you have not enrolled yet.';
      } else {
        emptyTitle.textContent = 'No Matching Courses';
        emptyDesc.textContent = 'No enrolled courses match your current search criteria.';
      }
    } else {
      coursesGrid.classList.remove('hidden');
      emptyState.classList.add('hidden');

      filtered.forEach(course => {
        const card = createEnrolledCard(course);
        coursesGrid.appendChild(card);
      });
    }
  }

  function createEnrolledCard(course) {
    const card = document.createElement('div');
    card.className = 'group flex flex-col bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden';

    const allLessons = state.getAllLessons(course);
    const targetLessonId = course.progress.lastLessonId || allLessons[0]?.id;
    const targetLesson = allLessons.find(l => l.id === targetLessonId) || allLessons[0];

    card.innerHTML = `
      <!-- Thumbnail & Header Banner -->
      <div class="relative aspect-video w-full overflow-hidden bg-slate-900">
        <img src="${course.thumbnail}" alt="${course.title}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        <div class="absolute inset-0 bg-gradient-to-t from-gray-950/80 via-transparent to-black/20"></div>

        <span class="absolute top-3 left-3 px-2.5 py-0.5 text-xs font-semibold rounded-full bg-black/50 text-white backdrop-blur-md">
          ${course.category}
        </span>

        ${course.progress.isCompleted ? `
          <span class="absolute top-3 right-3 px-2.5 py-0.5 text-xs font-bold rounded-md bg-emerald-500 text-white shadow-md flex items-center gap-1">
            ${Icons.checkCircle('w-3.5 h-3.5')} Completed
          </span>
        ` : `
          <span class="absolute top-3 right-3 px-2.5 py-0.5 text-xs font-semibold rounded-md bg-indigo-600 text-white shadow-md">
            In Progress
          </span>
        `}

        <div class="absolute bottom-3 left-3 right-3 text-white text-xs font-medium">
          <p class="truncate font-semibold text-gray-200">Next: ${targetLesson ? targetLesson.title : 'Course Completed'}</p>
        </div>
      </div>

      <!-- Card Body -->
      <div class="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <h3 class="font-bold text-gray-900 text-base leading-snug group-hover:text-indigo-600 transition-colors line-clamp-2">
            ${course.title}
          </h3>
          <p class="text-xs text-gray-500 mt-1">Instructor: ${course.instructor.name}</p>

          <!-- Progress Section -->
          <div class="mt-4 bg-slate-50 p-3 rounded-xl border border-slate-100">
            <div class="flex items-center justify-between text-xs mb-1.5">
              <span class="font-bold text-gray-700">Curriculum Progress</span>
              <span class="font-extrabold ${course.progress.isCompleted ? 'text-emerald-600' : 'text-indigo-600'}">
                ${course.progress.percent}%
              </span>
            </div>
            <div class="w-full bg-gray-200 h-2.5 rounded-full overflow-hidden">
              <div class="h-full rounded-full transition-all duration-500 ${course.progress.isCompleted ? 'bg-emerald-500' : 'bg-indigo-600'}" style="width: ${course.progress.percent}%"></div>
            </div>
            <div class="flex items-center justify-between text-[11px] text-gray-500 mt-1.5">
              <span>${course.progress.completed} of ${course.progress.total} lessons</span>
              ${course.progress.quizScore !== null 
                ? `<span class="text-emerald-600 font-bold">Quiz: ${course.progress.quizScore}% ${course.progress.quizPassed ? '✓' : ''}</span>`
                : `<span class="text-amber-600 font-medium">Quiz Pending</span>`}
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div class="space-y-2 pt-2 border-t border-gray-100">
          <div class="flex items-center gap-2">
            <a 
              href="#learn/${course.id}/${targetLessonId}" 
              class="flex-1 py-2.5 px-3 text-xs font-bold rounded-xl text-white ${course.progress.isCompleted ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-indigo-600 hover:bg-indigo-700'} shadow-sm transition-all flex items-center justify-center gap-1.5"
            >
              ${course.progress.isCompleted ? Icons.checkCircle('w-4 h-4') : Icons.play('w-4 h-4')}
              ${course.progress.isCompleted ? 'Review Lessons' : 'Resume Learning'}
            </a>

            <a 
              href="#course/${course.id}" 
              class="p-2.5 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors"
              title="Course Details"
            >
              ${Icons.external('w-4 h-4')}
            </a>
          </div>

          <div class="flex items-center justify-between text-xs pt-1">
            <a 
              href="#quiz/${course.id}" 
              class="text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1"
            >
              ${Icons.trophy('w-3.5 h-3.5')}
              ${course.progress.quizScore !== null ? `Retake Quiz (${course.progress.quizScore}%)` : 'Take Final Quiz'}
            </a>

            ${course.progress.quizPassed ? `
              <button 
                class="btn-cert-modal text-emerald-600 hover:text-emerald-800 font-bold flex items-center gap-1"
              >
                ${Icons.download('w-3.5 h-3.5')} View Certificate
              </button>
            ` : ''}
          </div>
        </div>
      </div>
    `;

    const certBtn = card.querySelector('.btn-cert-modal');
    if (certBtn) {
      certBtn.addEventListener('click', () => {
        CertificateModal.show(course, course.progress.quizScore || 100);
      });
    }

    return card;
  }

  // Event handlers
  searchInput.addEventListener('input', (e) => {
    searchQuery = e.target.value;
    clearSearchBtn.classList.toggle('hidden', !searchQuery);
    renderList();
  });

  clearSearchBtn.addEventListener('click', () => {
    searchInput.value = '';
    searchQuery = '';
    clearSearchBtn.classList.add('hidden');
    renderList();
  });

  const tabButtons = tabsContainer.querySelectorAll('.tab-btn');
  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      tabButtons.forEach(b => {
        b.classList.remove('bg-white', 'text-indigo-700', 'shadow-xs');
        b.classList.add('text-gray-600');
      });
      btn.classList.add('bg-white', 'text-indigo-700', 'shadow-xs');
      btn.classList.remove('text-gray-600');

      currentTab = btn.dataset.tab;
      renderList();
    });
  });

  // Initial render
  renderList();

  return container;
}

