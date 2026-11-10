/**
 * Module 5: Lesson Viewer
 * Full distraction-free course player, collapsible syllabus sidebar, previous/next navigation, 
 * interactive completion tracking with localStorage.
 */
import { Icons } from '../components/Icons.js';
import { state } from '../state.js';
import { toast } from '../components/Toast.js';

export function renderLessonView(courseId, lessonId) {
  const container = document.createElement('div');
  container.className = 'min-h-[calc(100vh-4rem)] flex flex-col bg-slate-900 text-slate-100 animate-fade-in';

  const course = state.getCourseById(courseId);

  if (!course) {
    container.innerHTML = `
      <div class="m-auto bg-slate-800 p-8 rounded-2xl text-center max-w-md border border-slate-700">
        <h2 class="text-lg font-bold text-white mb-2">Course Not Found</h2>
        <a href="#catalogue" class="text-xs text-indigo-400 font-bold hover:underline">Return to Catalogue</a>
      </div>
    `;
    return container;
  }

  // Ensure enrolled
  if (!state.isEnrolled(courseId)) {
    state.enrollCourse(courseId);
  }

  const allLessons = state.getAllLessons(course);
  let activeLessonIndex = allLessons.findIndex(l => l.id === lessonId);
  if (activeLessonIndex === -1) {
    activeLessonIndex = 0;
  }
  const currentLesson = allLessons[activeLessonIndex];

  // Set last accessed lesson in state
  state.setLastAccessedLesson(courseId, currentLesson.id);

  const prevLesson = activeLessonIndex > 0 ? allLessons[activeLessonIndex - 1] : null;
  const nextLesson = activeLessonIndex < allLessons.length - 1 ? allLessons[activeLessonIndex + 1] : null;
  const isCompleted = state.isLessonCompleted(courseId, currentLesson.id);
  const progress = state.getCourseProgress(courseId);

  // Find section for current lesson
  let currentSectionTitle = "Curriculum Section";
  for (const sec of course.sections) {
    if (sec.lessons.some(l => l.id === currentLesson.id)) {
      currentSectionTitle = sec.sectionTitle;
      break;
    }
  }

  container.innerHTML = `
    <!-- Top Distraction-free Header Bar -->
    <header class="h-14 border-b border-slate-800 bg-slate-950/90 backdrop-blur-md px-4 flex items-center justify-between sticky top-0 z-30">
      <div class="flex items-center gap-3">
        <a 
          href="#course/${course.id}" 
          class="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white px-2.5 py-1.5 rounded-lg hover:bg-slate-800 transition-colors"
          title="Exit to Course Details"
        >
          ${Icons.arrowLeft('w-4 h-4')}
          <span class="hidden sm:inline">Course Overview</span>
        </a>

        <div class="h-4 w-px bg-slate-800 hidden sm:block"></div>

        <div>
          <h2 class="text-xs sm:text-sm font-bold text-white truncate max-w-[200px] sm:max-w-md">
            ${course.title}
          </h2>
          <p class="text-[10px] text-slate-400 truncate hidden md:block">
            ${currentSectionTitle} • Lesson ${activeLessonIndex + 1} of ${allLessons.length}
          </p>
        </div>
      </div>

      <!-- Right controls: Progress & Toggle Sidebar -->
      <div class="flex items-center gap-4">
        <!-- Progress Bar Indicator -->
        <div class="hidden sm:flex items-center gap-2 text-xs">
          <div class="w-24 bg-slate-800 h-2 rounded-full overflow-hidden">
            <div class="h-full rounded-full bg-emerald-500 transition-all duration-300" style="width: ${progress.percent}%"></div>
          </div>
          <span class="text-xs font-bold text-emerald-400">${progress.percent}%</span>
        </div>

        <!-- Quiz Link Shortcut -->
        <a 
          href="#quiz/${course.id}" 
          class="text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-indigo-950/80 text-indigo-300 border border-indigo-800/60 hover:bg-indigo-900 transition-colors flex items-center gap-1"
        >
          ${Icons.trophy('w-3.5 h-3.5')}
          <span class="hidden sm:inline">Course Quiz</span>
        </a>

        <!-- Sidebar Toggle -->
        <button id="toggle-sidebar-btn" class="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors">
          ${Icons.menu('w-5 h-5')}
        </button>
      </div>
    </header>

    <!-- Main Workspace Layout: Sidebar + Lesson Content -->
    <div class="flex-1 flex overflow-hidden relative">

      <!-- Left Curriculum Sidebar (Collapsible) -->
      <aside id="lesson-sidebar" class="w-80 border-r border-slate-800 bg-slate-950 flex flex-col transition-all duration-300 absolute inset-y-0 left-0 z-20 md:static md:translate-x-0 -translate-x-full shadow-2xl md:shadow-none">
        
        <div class="p-4 border-b border-slate-800 flex items-center justify-between">
          <div class="flex items-center gap-2">
            <span class="text-xs font-bold uppercase tracking-wider text-slate-400">Course Syllabus</span>
            <span class="text-[11px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono">${progress.completed}/${allLessons.length}</span>
          </div>
          <button id="close-sidebar-mobile" class="md:hidden text-slate-400 hover:text-white p-1">
            ${Icons.x('w-5 h-5')}
          </button>
        </div>

        <!-- Sections & Lessons List -->
        <div class="flex-1 overflow-y-auto p-3 space-y-4">
          ${course.sections.map((section, sIdx) => `
            <div class="space-y-1">
              <h4 class="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2 py-1">
                ${section.sectionTitle}
              </h4>
              <div class="space-y-0.5">
                ${section.lessons.map(l => {
                  const isActive = l.id === currentLesson.id;
                  const isDone = state.isLessonCompleted(course.id, l.id);
                  return `
                    <a 
                      href="#learn/${course.id}/${l.id}" 
                      class="flex items-center justify-between p-2.5 rounded-xl text-xs transition-colors group ${isActive ? 'bg-indigo-600 text-white font-bold shadow-md shadow-indigo-600/20' : 'text-slate-300 hover:bg-slate-800/80'}"
                    >
                      <div class="flex items-center gap-2.5 truncate">
                        <!-- Completion icon -->
                        <button 
                          data-action="toggle-complete-sidebar" 
                          data-lesson-id="${l.id}"
                          class="w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center border transition-all ${isDone ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-600 hover:border-slate-400'}"
                          title="${isDone ? 'Completed' : 'Mark as completed'}"
                        >
                          ${isDone ? '✓' : ''}
                        </button>
                        <span class="truncate ${isActive ? 'text-white' : 'group-hover:text-white'}">${l.title}</span>
                      </div>
                      <span class="text-[10px] ${isActive ? 'text-indigo-200' : 'text-slate-500'} flex-shrink-0 ml-2">${l.duration}</span>
                    </a>
                  `;
                }).join('')}
              </div>
            </div>
          `).join('')}

          <!-- Capstone Quiz Sidebar Shortcut -->
          <div class="pt-3 border-t border-slate-800">
            <a 
              href="#quiz/${course.id}" 
              class="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-purple-950/80 to-indigo-950/80 border border-purple-800/50 hover:border-purple-600 text-purple-200 text-xs font-bold transition-all shadow-sm group"
            >
              <div class="flex items-center gap-2">
                <span class="text-base group-hover:scale-110 transition-transform">🏆</span>
                <span>Capstone Final Quiz</span>
              </div>
              <span class="text-[10px] bg-purple-900/80 px-2 py-0.5 rounded-full text-purple-300">
                ${progress.quizScore !== null ? `${progress.quizScore}%` : 'Required'}
              </span>
            </a>
          </div>
        </div>
      </aside>

      <!-- Main Lesson Content Body -->
      <main class="flex-1 overflow-y-auto p-4 sm:p-8 space-y-8 bg-slate-900">
        
        <!-- Video Player or Header Banner -->
        ${currentLesson.type === 'video' && currentLesson.videoEmbed ? `
          <div class="relative w-full aspect-video max-w-4xl mx-auto rounded-2xl overflow-hidden shadow-2xl bg-black border border-slate-800">
            <iframe 
              src="${currentLesson.videoEmbed}?autoplay=0&rel=0&modestbranding=1" 
              title="${currentLesson.title}" 
              class="w-full h-full border-0" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowfullscreen
            ></iframe>
          </div>
        ` : `
          <!-- Article / Interactive Lesson Hero -->
          <div class="max-w-4xl mx-auto p-8 rounded-3xl bg-gradient-to-br from-slate-800 to-indigo-950/60 border border-slate-700/80 shadow-xl text-center space-y-3">
            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold">
              ${Icons.book('w-4 h-4')} Comprehensive Study Module
            </div>
            <h1 class="text-2xl sm:text-3xl font-extrabold text-white">${currentLesson.title}</h1>
            <p class="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto">${currentLesson.summary}</p>
          </div>
        `}

        <!-- Lesson Meta & Completion Action Bar -->
        <div class="max-w-4xl mx-auto bg-slate-950 p-4 sm:p-5 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div class="flex items-center gap-2 mb-1">
              <span class="px-2 py-0.5 text-[10px] font-bold uppercase rounded-md ${currentLesson.type === 'video' ? 'bg-indigo-900 text-indigo-300' : 'bg-emerald-900 text-emerald-300'}">
                ${currentLesson.type}
              </span>
              <span class="text-xs text-slate-400">• ${currentLesson.duration} read/watch</span>
            </div>
            <h2 class="text-lg font-bold text-white">${currentLesson.title}</h2>
          </div>

          <!-- Interactive Complete/Incomplete Toggle -->
          <button 
            id="btn-toggle-complete-main" 
            class="px-4 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center gap-2 shadow-sm ${isCompleted ? 'bg-emerald-600 hover:bg-emerald-700 text-white' : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'}"
          >
            ${isCompleted ? `${Icons.checkCircle('w-4 h-4')} Lesson Completed` : 'Mark as Completed'}
          </button>
        </div>

        <!-- Lesson Reading Notes & Code Content -->
        <div class="max-w-4xl mx-auto bg-slate-950 p-6 sm:p-8 rounded-2xl border border-slate-800/80 text-slate-200 space-y-6">
          <div class="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 class="text-sm font-bold uppercase tracking-wider text-indigo-400">Lesson Material & Notes</h3>
            <span class="text-xs text-slate-500">Instructor Approved</span>
          </div>

          <!-- Notes prose -->
          <div class="prose prose-invert max-w-none text-xs sm:text-sm leading-relaxed space-y-4">
            ${formatLessonNotes(currentLesson.notes || currentLesson.summary)}
          </div>

          <!-- Resources Section -->
          ${currentLesson.resources && currentLesson.resources.length > 0 ? `
            <div class="pt-6 border-t border-slate-800">
              <h4 class="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Downloadable Resources & Links</h4>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                ${currentLesson.resources.map(res => `
                  <a 
                    href="${res.url}" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    class="p-3 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 flex items-center justify-between text-xs text-slate-300 hover:text-white transition-colors group"
                  >
                    <span class="font-medium truncate">${res.title}</span>
                    <span class="text-indigo-400 group-hover:translate-x-0.5 transition-transform">${Icons.external('w-3.5 h-3.5')}</span>
                  </a>
                `).join('')}
              </div>
            </div>
          ` : ''}
        </div>

        <!-- Navigation Footer (Previous / Next Lesson) -->
        <div class="max-w-4xl mx-auto pt-4 pb-12 flex items-center justify-between gap-4">
          <!-- Previous Button -->
          ${prevLesson ? `
            <a 
              href="#learn/${course.id}/${prevLesson.id}" 
              class="px-4 sm:px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs sm:text-sm transition-colors flex items-center gap-2 border border-slate-700"
            >
              ${Icons.arrowLeft('w-4 h-4')}
              <span class="hidden sm:inline">Previous: ${prevLesson.title.substring(0, 20)}...</span>
              <span class="sm:hidden">Previous</span>
            </a>
          ` : `
            <div class="opacity-30 cursor-not-allowed px-4 py-2.5 rounded-xl bg-slate-800 text-slate-500 text-xs sm:text-sm flex items-center gap-2">
              ${Icons.arrowLeft('w-4 h-4')} First Lesson
            </div>
          `}

          <!-- Mark Complete & Next / Take Quiz Button -->
          ${nextLesson ? `
            <button 
              id="btn-next-lesson" 
              class="px-5 sm:px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm transition-all flex items-center gap-2 shadow-lg shadow-indigo-600/30"
            >
              <span>Next Lesson</span>
              ${Icons.arrowRight('w-4 h-4')}
            </button>
          ` : `
            <a 
              href="#quiz/${course.id}" 
              class="px-5 sm:px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs sm:text-sm transition-all flex items-center gap-2 shadow-lg shadow-emerald-600/30"
            >
              <span>Complete Course & Take Final Quiz</span>
              ${Icons.trophy('w-4 h-4')}
            </a>
          `}
        </div>

      </main>
    </div>
  `;

  // Toggle Sidebar
  const sidebar = container.querySelector('#lesson-sidebar');
  const toggleBtn = container.querySelector('#toggle-sidebar-btn');
  const closeMobileBtn = container.querySelector('#close-sidebar-mobile');

  toggleBtn.addEventListener('click', () => {
    sidebar.classList.toggle('-translate-x-full');
  });

  if (closeMobileBtn) {
    closeMobileBtn.addEventListener('click', () => {
      sidebar.classList.add('-translate-x-full');
    });
  }

  // Toggle completion on main button
  const toggleCompleteBtn = container.querySelector('#btn-toggle-complete-main');
  toggleCompleteBtn.addEventListener('click', () => {
    const newlyDone = state.toggleLessonCompleted(course.id, currentLesson.id);
    if (newlyDone) {
      toast.success(`Marked "${currentLesson.title}" as completed!`, 'Great work!');
    } else {
      toast.info(`Marked "${currentLesson.title}" as incomplete`, 'Updated');
    }
    // Re-render view
    const appRoot = document.getElementById('app-root');
    if (appRoot) {
      appRoot.innerHTML = '';
      appRoot.appendChild(renderLessonView(course.id, currentLesson.id));
    }
  });

  // Next button: mark complete and navigate
  const nextBtn = container.querySelector('#btn-next-lesson');
  if (nextBtn && nextLesson) {
    nextBtn.addEventListener('click', () => {
      state.markLessonCompleted(course.id, currentLesson.id);
      toast.success(`Lesson completed! Progress updated.`, 'Progress Saved');
      window.location.hash = `#learn/${course.id}/${nextLesson.id}`;
    });
  }

  // Sidebar checkmark buttons
  const sidebarCheckBtns = container.querySelectorAll('[data-action="toggle-complete-sidebar"]');
  sidebarCheckBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const targetId = btn.dataset.lessonId;
      state.toggleLessonCompleted(course.id, targetId);
      const appRoot = document.getElementById('app-root');
      if (appRoot) {
        appRoot.innerHTML = '';
        appRoot.appendChild(renderLessonView(course.id, currentLesson.id));
      }
    });
  });

  return container;
}

// Helper to format markdown code blocks & bolding in reading notes
function formatLessonNotes(text) {
  if (!text) return '<p class="text-slate-400">No notes provided for this lesson.</p>';

  // Replace ```code``` blocks
  let html = text.replace(/```([\s\S]*?)```/g, (match, code) => {
    return `<div class="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-xs text-indigo-300 overflow-x-auto my-3"><pre><code>${escapeHtml(code.trim())}</code></pre></div>`;
  });

  // Replace `inline code`
  html = html.replace(/`([^`]+)`/g, '<code class="px-1.5 py-0.5 rounded bg-slate-800 text-indigo-300 font-mono text-xs">$1</code>');

  // Replace ### Headers
  html = html.replace(/### (.*?)\n/g, '<h4 class="text-sm font-bold text-white mt-4 mb-2">$1</h4>');

  // Replace - bullet items
  html = html.replace(/- (.*?)\n/g, '<li class="text-slate-300 ml-4 list-disc">$1</li>');

  // Replace **bold**
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-bold">$1</strong>');

  return html;
}

function escapeHtml(string) {
  return String(string)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

