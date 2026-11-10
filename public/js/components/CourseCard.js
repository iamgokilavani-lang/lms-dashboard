/**
 * Reusable Course Card Component
 */
import { Icons } from './Icons.js';
import { state } from '../state.js';
import { toast } from './Toast.js';

export function renderCourseCard(course, options = {}) {
  const isEnrolled = state.isEnrolled(course.id);
  const progress = state.getCourseProgress(course.id);
  const lessons = state.getAllLessons(course);

  const card = document.createElement('div');
  card.className = 'group flex flex-col bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden hover:-translate-y-1 relative';

  const badgeColor = {
    'Bestseller': 'bg-amber-500 text-white',
    'Popular': 'bg-indigo-600 text-white',
    'Trending': 'bg-rose-500 text-white',
    'New': 'bg-emerald-600 text-white'
  }[course.badge] || 'bg-gray-800 text-white';

  card.innerHTML = `
    <!-- Thumbnail Container -->
    <div class="relative aspect-video w-full overflow-hidden bg-slate-900 cursor-pointer" data-action="view-details">
      <img 
        src="${course.thumbnail}" 
        alt="${course.title}" 
        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        loading="lazy"
      />
      <div class="absolute inset-0 bg-gradient-to-t from-gray-950/80 via-transparent to-black/20"></div>

      <!-- Badge -->
      <span class="absolute top-3 left-3 px-2.5 py-0.5 text-[11px] font-bold rounded-md uppercase tracking-wider ${badgeColor} shadow-md">
        ${course.badge || 'Course'}
      </span>

      <!-- Category Pill -->
      <span class="absolute top-3 right-3 px-2.5 py-0.5 text-xs font-medium rounded-full bg-black/50 text-white backdrop-blur-md border border-white/20">
        ${course.category}
      </span>

      <!-- Duration & Level on bottom of image -->
      <div class="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-white/90">
        <span class="flex items-center gap-1 font-medium bg-black/40 px-2 py-0.5 rounded-md backdrop-blur-sm">
          ${Icons.clock('w-3.5 h-3.5 text-amber-400')}
          ${course.duration}
        </span>
        <span class="bg-black/40 px-2 py-0.5 rounded-md backdrop-blur-sm font-medium">
          ${course.level}
        </span>
      </div>
    </div>

    <!-- Body -->
    <div class="p-5 flex-1 flex flex-col justify-between">
      <div>
        <!-- Rating & Reviews -->
        <div class="flex items-center gap-1.5 text-xs text-gray-500 mb-2">
          <span class="flex items-center text-amber-500 font-bold gap-0.5">
            ${Icons.star('w-3.5 h-3.5 fill-amber-400')}
            ${course.rating.toFixed(1)}
          </span>
          <span class="text-gray-400">(${course.reviewCount.toLocaleString()} reviews)</span>
          <span class="text-gray-300">•</span>
          <span class="text-gray-500">${course.studentsCount.toLocaleString()} learners</span>
        </div>

        <!-- Title -->
        <h3 class="font-bold text-gray-900 text-base leading-snug group-hover:text-indigo-600 transition-colors cursor-pointer line-clamp-2" data-action="view-details">
          ${course.title}
        </h3>

        <!-- Description -->
        <p class="text-xs text-gray-600 mt-2 line-clamp-2 leading-relaxed">
          ${course.shortDescription}
        </p>
      </div>

      <div class="mt-4 pt-4 border-t border-gray-100">
        <!-- Instructor -->
        <div class="flex items-center gap-2 mb-3">
          <img src="${course.instructor.avatar}" alt="${course.instructor.name}" class="w-6 h-6 rounded-full object-cover border border-gray-200" />
          <span class="text-xs text-gray-700 font-medium truncate">${course.instructor.name}</span>
        </div>

        <!-- Progress Bar (if enrolled) -->
        ${isEnrolled ? `
          <div class="mb-3 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
            <div class="flex items-center justify-between text-xs mb-1">
              <span class="font-semibold text-gray-700">Course Progress</span>
              <span class="font-bold ${progress.isCompleted ? 'text-emerald-600' : 'text-indigo-600'}">${progress.percent}%</span>
            </div>
            <div class="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
              <div class="h-full rounded-full transition-all duration-500 ${progress.isCompleted ? 'bg-emerald-500' : 'bg-gradient-to-r from-indigo-500 to-violet-600'}" style="width: ${progress.percent}%"></div>
            </div>
            <div class="flex items-center justify-between text-[11px] text-gray-500 mt-1">
              <span>${progress.completed} of ${progress.total} lessons</span>
              ${progress.quizScore !== null ? `<span class="text-emerald-600 font-semibold">Quiz: ${progress.quizScore}%</span>` : ''}
            </div>
          </div>
        ` : ''}

        <!-- Actions -->
        <div class="flex items-center gap-2">
          ${isEnrolled ? `
            <button 
              class="flex-1 py-2 px-3 text-xs font-semibold rounded-xl text-white ${progress.isCompleted ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-indigo-600 hover:bg-indigo-700'} shadow-sm transition-all flex items-center justify-center gap-1.5"
              data-action="continue-learning"
            >
              ${progress.isCompleted ? Icons.checkCircle('w-4 h-4') : Icons.play('w-3.5 h-3.5')}
              ${progress.isCompleted ? 'Review Course' : (progress.completed > 0 ? 'Resume Lesson' : 'Start Learning')}
            </button>
            <a 
              href="#course/${course.id}" 
              class="p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors"
              title="Course Details"
            >
              ${Icons.external('w-4 h-4')}
            </a>
          ` : `
            <button 
              class="flex-1 py-2 px-3 text-xs font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm hover:shadow-indigo-500/20 transition-all flex items-center justify-center gap-1.5"
              data-action="enroll"
            >
              ${Icons.plus('w-4 h-4')} Enroll Now
            </button>
            <a 
              href="#course/${course.id}" 
              class="py-2 px-3 text-xs font-semibold rounded-xl text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              Details
            </a>
          `}
        </div>
      </div>
    </div>
  `;

  // Attach event listeners
  const viewDetailElements = card.querySelectorAll('[data-action="view-details"]');
  viewDetailElements.forEach(el => {
    el.addEventListener('click', () => {
      window.location.hash = `#course/${course.id}`;
    });
  });

  const enrollBtn = card.querySelector('[data-action="enroll"]');
  if (enrollBtn) {
    enrollBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const success = state.enrollCourse(course.id);
      if (success) {
        toast.celebrate(`You have successfully enrolled in "${course.title}"!`, 'Enrolled!');
        if (options.onUpdate) {
          options.onUpdate();
        } else {
          window.location.hash = `#learn/${course.id}/${lessons[0]?.id || ''}`;
        }
      }
    });
  }

  const continueBtn = card.querySelector('[data-action="continue-learning"]');
  if (continueBtn) {
    continueBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const targetLessonId = progress.lastLessonId || lessons[0]?.id;
      window.location.hash = `#learn/${course.id}/${targetLessonId}`;
    });
  }

  return card;
}

