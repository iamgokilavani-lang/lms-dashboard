/**
 * Module 3: Course Details Page
 * Comprehensive course overview, curriculum syllabus, instructor bio, and interactive enrollment.
 */
import { Icons } from '../components/Icons.js';
import { state } from '../state.js';
import { toast } from '../components/Toast.js';

export function renderDetailsView(courseId) {
  const container = document.createElement('div');
  container.className = 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in';

  const course = state.getCourseById(courseId);

  if (!course) {
    container.innerHTML = `
      <div class="bg-white rounded-3xl p-12 text-center max-w-md mx-auto border border-gray-100 shadow-sm">
        <h2 class="text-xl font-bold text-gray-900 mb-2">Course Not Found</h2>
        <p class="text-xs text-gray-500 mb-6">The requested course could not be located in our database.</p>
        <a href="#catalogue" class="px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700">
          Back to Catalogue
        </a>
      </div>
    `;
    return container;
  }

  const isEnrolled = state.isEnrolled(course.id);
  const progress = state.getCourseProgress(course.id);
  const allLessons = state.getAllLessons(course);
  const firstLesson = allLessons[0];
  const targetLessonId = progress.lastLessonId || firstLesson?.id;

  container.innerHTML = `
    <!-- Breadcrumbs -->
    <nav class="flex items-center gap-2 text-xs text-gray-500">
      <a href="#catalogue" class="hover:text-indigo-600 transition-colors">Catalogue</a>
      <span>/</span>
      <span class="text-gray-700">${course.category}</span>
      <span>/</span>
      <span class="font-medium text-gray-900 truncate max-w-xs">${course.title}</span>
    </nav>

    <!-- Main Course Hero / Header -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
      
      <!-- Left Hero Details (8 cols) -->
      <div class="lg:col-span-8 space-y-6">
        
        <!-- Category & Badges -->
        <div class="flex flex-wrap items-center gap-2">
          <span class="px-3 py-1 text-xs font-bold rounded-full bg-indigo-100 text-indigo-700">
            ${course.category}
          </span>
          <span class="px-3 py-1 text-xs font-bold rounded-full bg-amber-100 text-amber-800">
            ★ ${course.badge}
          </span>
          <span class="px-3 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-700">
            ${course.level} Level
          </span>
        </div>

        <!-- Title & Subtitle -->
        <h1 class="text-2xl sm:text-4xl font-extrabold text-gray-900 leading-tight">
          ${course.title}
        </h1>
        <p class="text-sm sm:text-base text-gray-600 leading-relaxed">
          ${course.shortDescription}
        </p>

        <!-- Social Proof & Meta -->
        <div class="flex flex-wrap items-center gap-4 text-xs text-gray-600 pt-2">
          <div class="flex items-center gap-1 font-bold text-amber-500 text-sm">
            ${Icons.star('w-4 h-4 fill-amber-400')}
            <span>${course.rating.toFixed(1)}</span>
            <span class="text-gray-400 font-normal">(${course.reviewCount.toLocaleString()} ratings)</span>
          </div>
          <span>•</span>
          <span class="font-semibold text-gray-800">${course.studentsCount.toLocaleString()} learners enrolled</span>
          <span>•</span>
          <span class="flex items-center gap-1 text-gray-500">${Icons.clock('w-3.5 h-3.5')} ${course.duration}</span>
        </div>

        <!-- Instructor Quick Row -->
        <div class="flex items-center gap-3 pt-3 border-t border-gray-100">
          <img src="${course.instructor.avatar}" alt="${course.instructor.name}" class="w-11 h-11 rounded-full object-cover ring-2 ring-indigo-100" />
          <div>
            <p class="text-xs text-gray-400">Created by</p>
            <h4 class="text-sm font-bold text-gray-900">${course.instructor.name}</h4>
            <p class="text-[11px] text-gray-500">${course.instructor.role}</p>
          </div>
        </div>

        <!-- Learning Objectives (What you'll learn) -->
        <div class="bg-gradient-to-br from-indigo-50/50 via-white to-purple-50/40 p-6 rounded-3xl border border-indigo-100/70 shadow-xs">
          <h3 class="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span class="p-1 rounded-lg bg-indigo-600 text-white">${Icons.check('w-4 h-4')}</span>
            What You'll Learn in This Course
          </h3>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            ${course.learningObjectives.map(obj => `
              <div class="flex items-start gap-2.5 text-xs text-gray-700">
                <span class="text-emerald-600 flex-shrink-0 mt-0.5">${Icons.check('w-4 h-4')}</span>
                <span class="leading-relaxed">${obj}</span>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Course Curriculum / Syllabus -->
        <div class="space-y-4 pt-4">
          <div class="flex items-center justify-between">
            <div>
              <h2 class="text-xl font-bold text-gray-900">Curriculum Syllabus</h2>
              <p class="text-xs text-gray-500 mt-0.5">
                ${course.sections.length} Sections • ${allLessons.length} Lessons • Includes capstone quiz
              </p>
            </div>
            ${isEnrolled ? `
              <span class="text-xs font-semibold px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-lg">
                ${progress.completed} of ${allLessons.length} Completed
              </span>
            ` : ''}
          </div>

          <!-- Section List Accordion -->
          <div class="space-y-3">
            ${course.sections.map((sec, secIdx) => `
              <div class="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-xs">
                <!-- Section Header -->
                <div class="bg-gray-50/90 px-5 py-3.5 border-b border-gray-100 flex items-center justify-between">
                  <h4 class="font-bold text-xs text-gray-800 uppercase tracking-wider">${sec.sectionTitle}</h4>
                  <span class="text-[11px] font-semibold text-gray-500">${sec.lessons.length} lessons</span>
                </div>

                <!-- Lessons in Section -->
                <div class="divide-y divide-gray-50">
                  ${sec.lessons.map(lesson => {
                    const isDone = state.isLessonCompleted(course.id, lesson.id);
                    return `
                      <div class="px-5 py-3.5 flex items-center justify-between gap-4 hover:bg-indigo-50/30 transition-colors group">
                        <div class="flex items-center gap-3">
                          <span class="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs ${isDone ? 'bg-emerald-100 text-emerald-700 font-bold' : 'bg-gray-100 text-gray-500 group-hover:bg-indigo-100 group-hover:text-indigo-600'}">
                            ${isDone ? '✓' : Icons.play('w-3 h-3')}
                          </span>
                          <div>
                            <h5 class="text-xs font-semibold text-gray-800 group-hover:text-indigo-600 transition-colors">
                              ${lesson.title}
                            </h5>
                            <span class="text-[10px] text-gray-400 capitalize">${lesson.type} • ${lesson.duration}</span>
                          </div>
                        </div>

                        ${isEnrolled ? `
                          <a 
                            href="#learn/${course.id}/${lesson.id}" 
                            class="px-3 py-1 rounded-lg text-xs font-semibold ${isDone ? 'bg-gray-100 text-gray-600 hover:bg-gray-200' : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'}"
                          >
                            ${isDone ? 'Review' : 'Play'}
                          </a>
                        ` : `
                          <span class="text-[10px] font-medium text-gray-400 flex items-center gap-1">
                            ${Icons.lock('w-3 h-3')} Locked
                          </span>
                        `}
                      </div>
                    `;
                  }).join('')}
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Prerequisites & Description -->
        <div class="space-y-4 pt-4 border-t border-gray-100">
          <h3 class="text-lg font-bold text-gray-900">Requirements & Prerequisites</h3>
          <ul class="space-y-2 text-xs text-gray-600 list-disc list-inside">
            ${course.prerequisites.map(p => `<li>${p}</li>`).join('')}
          </ul>

          <h3 class="text-lg font-bold text-gray-900 pt-2">Detailed Description</h3>
          <p class="text-xs sm:text-sm text-gray-600 leading-relaxed whitespace-pre-line">
            ${course.fullDescription}
          </p>
        </div>

        <!-- Instructor Profile Details Card -->
        <div class="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm space-y-4">
          <h3 class="text-lg font-bold text-gray-900">About the Instructor</h3>
          <div class="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <img src="${course.instructor.avatar}" alt="${course.instructor.name}" class="w-16 h-16 rounded-2xl object-cover ring-2 ring-indigo-500/20" />
            <div>
              <h4 class="text-base font-bold text-gray-900">${course.instructor.name}</h4>
              <p class="text-xs text-indigo-600 font-semibold">${course.instructor.role}</p>
              <div class="flex items-center gap-3 text-xs text-gray-500 mt-1">
                <span>⭐ ${course.instructor.rating} Rating</span>
                <span>•</span>
                <span>👥 ${course.instructor.students} Students</span>
                <span>•</span>
                <span>📚 ${course.instructor.coursesCount} Courses</span>
              </div>
            </div>
          </div>
          <p class="text-xs text-gray-600 leading-relaxed">
            ${course.instructor.bio}
          </p>
        </div>

      </div>

      <!-- Right Enrollment Sidebar Card (4 cols) -->
      <div class="lg:col-span-4">
        <div class="sticky top-24 bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden p-6 space-y-6">
          
          <!-- Course Thumbnail Preview -->
          <div class="relative rounded-2xl overflow-hidden aspect-video bg-slate-900 shadow-inner">
            <img src="${course.thumbnail}" alt="${course.title}" class="w-full h-full object-cover" />
            <div class="absolute inset-0 bg-black/30 flex items-center justify-center">
              <a 
                href="${isEnrolled ? `#learn/${course.id}/${targetLessonId}` : 'javascript:void(0)'}" 
                id="btn-preview-play"
                class="w-12 h-12 rounded-full bg-white/90 text-indigo-600 flex items-center justify-center shadow-lg hover:scale-110 transition-transform pl-0.5"
              >
                ${Icons.play('w-5 h-5 fill-indigo-600')}
              </a>
            </div>
          </div>

          <!-- Enrollment Status Box -->
          ${isEnrolled ? `
            <div class="bg-indigo-50/70 rounded-2xl p-4 border border-indigo-100 space-y-3">
              <div class="flex items-center justify-between text-xs font-bold text-indigo-950">
                <span>Your Enrolled Progress</span>
                <span class="${progress.isCompleted ? 'text-emerald-700' : 'text-indigo-700'}">${progress.percent}%</span>
              </div>
              <div class="w-full bg-indigo-200/60 h-2.5 rounded-full overflow-hidden">
                <div class="h-full rounded-full transition-all duration-500 ${progress.isCompleted ? 'bg-emerald-500' : 'bg-indigo-600'}" style="width: ${progress.percent}%"></div>
              </div>
              <p class="text-[11px] text-gray-500">
                ${progress.completed} of ${progress.total} lessons marked as completed
              </p>
            </div>

            <!-- Primary Buttons -->
            <div class="space-y-2">
              <a 
                href="#learn/${course.id}/${targetLessonId}" 
                class="w-full py-3 px-4 rounded-xl font-bold text-sm text-center text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-500/20 transition-all flex items-center justify-center gap-2"
              >
                ${progress.isCompleted ? Icons.checkCircle('w-4 h-4') : Icons.play('w-4 h-4')}
                ${progress.isCompleted ? 'Review All Lessons' : (progress.completed > 0 ? 'Continue Current Lesson' : 'Start Lesson 1')}
              </a>

              <a 
                href="#quiz/${course.id}" 
                class="w-full py-2.5 px-4 rounded-xl font-semibold text-xs text-center text-indigo-700 bg-indigo-100/70 hover:bg-indigo-200 transition-colors flex items-center justify-center gap-1.5"
              >
                ${Icons.trophy('w-4 h-4')}
                ${progress.quizScore !== null ? `Retake Quiz (Best: ${progress.quizScore}%)` : 'Take Final Assessment Quiz'}
              </a>
            </div>

            <!-- Unenroll Button -->
            <div class="pt-2 text-center">
              <button id="btn-unenroll" class="text-xs text-gray-400 hover:text-rose-600 transition-colors font-medium">
                Unenroll from this course
              </button>
            </div>
          ` : `
            <!-- Not Enrolled CTA -->
            <div class="space-y-4">
              <div class="flex items-baseline gap-2">
                <span class="text-3xl font-black text-gray-900">Free</span>
                <span class="text-xs text-gray-400 line-through">\$149.00</span>
                <span class="text-xs font-bold text-emerald-600">100% Scholarship</span>
              </div>

              <button 
                id="btn-enroll-page" 
                class="w-full py-3.5 px-4 rounded-2xl font-bold text-sm text-center text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 shadow-xl shadow-indigo-500/25 transition-all hover:scale-[1.02] flex items-center justify-center gap-2"
              >
                ${Icons.plus('w-5 h-5')} Enroll in Course Now
              </button>
            </div>
          `}

          <!-- Value Perks Checklist -->
          <div class="space-y-3 pt-3 border-t border-gray-100 text-xs text-gray-600">
            <h5 class="font-bold text-gray-900 text-xs uppercase tracking-wider">This Course Includes:</h5>
            <div class="space-y-2">
              <div class="flex items-center gap-2.5">
                <span class="text-indigo-600">${Icons.play('w-4 h-4')}</span>
                <span>${course.duration} on-demand video & reading</span>
              </div>
              <div class="flex items-center gap-2.5">
                <span class="text-indigo-600">${Icons.book('w-4 h-4')}</span>
                <span>${allLessons.length} downloadable code & study modules</span>
              </div>
              <div class="flex items-center gap-2.5">
                <span class="text-indigo-600">${Icons.trophy('w-4 h-4')}</span>
                <span>Comprehensive graded quiz with explanations</span>
              </div>
              <div class="flex items-center gap-2.5">
                <span class="text-indigo-600">${Icons.academic('w-4 h-4')}</span>
                <span>Verified Certificate of Completion</span>
              </div>
            </div>
          </div>

        </div>
      </div>

    </div>
  `;

  // Attach Event Handlers
  const enrollBtn = container.querySelector('#btn-enroll-page');
  if (enrollBtn) {
    enrollBtn.addEventListener('click', () => {
      const ok = state.enrollCourse(course.id);
      if (ok) {
        toast.celebrate(`Welcome! You are enrolled in ${course.title}`, 'Course Enrolled!');
        // Reload details view to update buttons
        const appRoot = document.getElementById('app-root');
        if (appRoot) {
          appRoot.innerHTML = '';
          appRoot.appendChild(renderDetailsView(course.id));
        }
      }
    });
  }

  const unenrollBtn = container.querySelector('#btn-unenroll');
  if (unenrollBtn) {
    unenrollBtn.addEventListener('click', () => {
      if (confirm(`Are you sure you want to unenroll from "${course.title}"? Your completed lesson history for this course will be cleared.`)) {
        state.unenrollCourse(course.id);
        toast.info(`You have unenrolled from ${course.title}`, 'Unenrolled');
        const appRoot = document.getElementById('app-root');
        if (appRoot) {
          appRoot.innerHTML = '';
          appRoot.appendChild(renderDetailsView(course.id));
        }
      }
    });
  }

  return container;
}

