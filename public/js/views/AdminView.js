/**
 * Module 8: Admin Course Management Page
 * Course creation, editing, deletion, curriculum builder, metrics, and persistence.
 */
import { Icons } from '../components/Icons.js';
import { state } from '../state.js';
import { toast } from '../components/Toast.js';

export function renderAdminView() {
  const container = document.createElement('div');
  container.className = 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in';

  let searchQuery = '';
  let editingCourseId = null;

  function renderView() {
    container.innerHTML = '';

    const courses = state.getCourses();
    let filteredCourses = courses;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      filteredCourses = filteredCourses.filter(c => 
        c.title.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q) ||
        c.instructor.name.toLowerCase().includes(q)
      );
    }

    // Compute admin stats
    let totalLessons = 0;
    let totalLearners = 0;
    const categoriesSet = new Set();

    courses.forEach(c => {
      const allL = state.getAllLessons(c);
      totalLessons += allL.length;
      totalLearners += c.studentsCount || 0;
      categoriesSet.add(c.category);
    });

    const wrapper = document.createElement('div');
    wrapper.className = 'space-y-6';

    wrapper.innerHTML = `
      <!-- Admin Top Banner -->
      <div class="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-gray-100">
        <div>
          <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 text-purple-800 text-xs font-bold mb-2">
            ${Icons.admin('w-3.5 h-3.5')}
            <span>Academy Administration & Curriculum Control</span>
          </div>
          <h1 class="text-3xl font-extrabold text-gray-900 tracking-tight">Admin Course Management</h1>
          <p class="text-sm text-gray-500 mt-1">Publish new courses, edit existing curriculums, and manage instructor catalogs.</p>
        </div>

        <button 
          id="btn-open-create-modal" 
          class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md shadow-purple-600/20 transition-all hover:scale-105 self-start md:self-auto"
        >
          ${Icons.plus('w-4 h-4')} Create New Course
        </button>
      </div>

      <!-- Admin Metrics Matrix -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div class="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs">
          <p class="text-xs font-medium text-gray-400">Total Courses</p>
          <p class="text-2xl font-black text-gray-900 mt-1">${courses.length}</p>
          <p class="text-[11px] text-purple-600 font-semibold mt-0.5">${filteredCourses.length} active in view</p>
        </div>

        <div class="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs">
          <p class="text-xs font-medium text-gray-400">Curriculum Lessons</p>
          <p class="text-2xl font-black text-gray-900 mt-1">${totalLessons}</p>
          <p class="text-[11px] text-indigo-600 font-semibold mt-0.5">Across all modules</p>
        </div>

        <div class="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs">
          <p class="text-xs font-medium text-gray-400">Global Enrolled Learners</p>
          <p class="text-2xl font-black text-gray-900 mt-1">${totalLearners.toLocaleString()}</p>
          <p class="text-[11px] text-emerald-600 font-semibold mt-0.5">Active students</p>
        </div>

        <div class="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs">
          <p class="text-xs font-medium text-gray-400">Categories</p>
          <p class="text-2xl font-black text-gray-900 mt-1">${categoriesSet.size}</p>
          <p class="text-[11px] text-amber-600 font-semibold mt-0.5">Domain areas</p>
        </div>
      </div>

      <!-- Search & Filters -->
      <div class="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between gap-4">
        <div class="relative flex-1 max-w-md">
          <span class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
            ${Icons.search('w-4 h-4')}
          </span>
          <input 
            type="text" 
            id="admin-search-input" 
            value="${searchQuery}" 
            placeholder="Search courses by title, category, or instructor..."
            class="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-800 placeholder-gray-400 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-purple-500 transition-all"
          />
        </div>
        <span class="text-xs font-semibold text-gray-400 hidden sm:block">${filteredCourses.length} items</span>
      </div>

      <!-- Course Table -->
      <div class="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs">
            <thead class="bg-gray-50/80 border-b border-gray-100 text-[11px] font-bold uppercase tracking-wider text-gray-500">
              <tr>
                <th class="py-4 px-6">Course</th>
                <th class="py-4 px-4">Category</th>
                <th class="py-4 px-4">Instructor</th>
                <th class="py-4 px-4">Lessons</th>
                <th class="py-4 px-4">Rating</th>
                <th class="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100 text-gray-700">
              ${filteredCourses.map(course => {
                const lessonsCount = state.getAllLessons(course).length;
                return `
                  <tr class="hover:bg-purple-50/30 transition-colors">
                    <td class="py-4 px-6">
                      <div class="flex items-center gap-3">
                        <img src="${course.thumbnail}" alt="" class="w-12 h-8 rounded-lg object-cover flex-shrink-0 shadow-xs" />
                        <div>
                          <a href="#course/${course.id}" class="font-bold text-gray-900 hover:text-purple-600 transition-colors line-clamp-1">
                            ${course.title}
                          </a>
                          <span class="text-[10px] text-gray-400 font-mono">${course.id} • ${course.duration}</span>
                        </div>
                      </div>
                    </td>
                    <td class="py-4 px-4 whitespace-nowrap">
                      <span class="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-gray-100 text-gray-700">
                        ${course.category}
                      </span>
                    </td>
                    <td class="py-4 px-4 whitespace-nowrap">
                      <div class="flex items-center gap-2">
                        <img src="${course.instructor.avatar}" alt="" class="w-5 h-5 rounded-full object-cover" />
                        <span class="font-medium text-gray-800">${course.instructor.name}</span>
                      </div>
                    </td>
                    <td class="py-4 px-4 whitespace-nowrap font-medium">
                      ${lessonsCount} lessons
                    </td>
                    <td class="py-4 px-4 whitespace-nowrap">
                      <span class="text-amber-500 font-bold">★ ${course.rating.toFixed(1)}</span>
                    </td>
                    <td class="py-4 px-6 text-right whitespace-nowrap">
                      <div class="flex items-center justify-end gap-1.5">
                        <a 
                          href="#course/${course.id}" 
                          class="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                          title="View Course"
                        >
                          ${Icons.external('w-4 h-4')}
                        </a>
                        <button 
                          data-action="edit-course" 
                          data-course-id="${course.id}"
                          class="p-1.5 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                          title="Edit Course"
                        >
                          ${Icons.edit('w-4 h-4')}
                        </button>
                        <button 
                          data-action="delete-course" 
                          data-course-id="${course.id}"
                          class="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          title="Delete Course"
                        >
                          ${Icons.trash('w-4 h-4')}
                        </button>
                      </div>
                    </td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;

    container.appendChild(wrapper);

    // Search input
    const searchInput = wrapper.querySelector('#admin-search-input');
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value;
      renderView();
    });

    // Create Course Button
    const createBtn = wrapper.querySelector('#btn-open-create-modal');
    createBtn.addEventListener('click', () => {
      openCourseModal();
    });

    // Edit Buttons
    const editBtns = wrapper.querySelectorAll('[data-action="edit-course"]');
    editBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.courseId;
        const target = state.getCourseById(id);
        if (target) {
          openCourseModal(target);
        }
      });
    });

    // Delete Buttons
    const deleteBtns = wrapper.querySelectorAll('[data-action="delete-course"]');
    deleteBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.courseId;
        const target = state.getCourseById(id);
        if (target) {
          if (confirm(`Are you sure you want to delete "${target.title}"? This cannot be undone.`)) {
            state.deleteCourse(id);
            toast.info(`Deleted course "${target.title}"`, 'Course Deleted');
            renderView();
          }
        }
      });
    });
  }

  function openCourseModal(existingCourse = null) {
    const isEdit = !!existingCourse;
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in';

    modal.innerHTML = `
      <div class="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100 max-h-[90vh] flex flex-col">
        <!-- Modal Header -->
        <div class="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/80">
          <h3 class="text-sm font-bold text-gray-900 flex items-center gap-2">
            <span class="p-1 rounded-lg bg-purple-100 text-purple-700">${Icons.admin('w-4 h-4')}</span>
            ${isEdit ? 'Edit Course Details' : 'Create New Course'}
          </h3>
          <button id="modal-close-btn" class="p-1 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-200">
            ${Icons.x('w-5 h-5')}
          </button>
        </div>

        <!-- Modal Body Form -->
        <form id="course-admin-form" class="p-6 overflow-y-auto space-y-4">
          <div>
            <label class="block text-xs font-bold text-gray-700 mb-1">Course Title *</label>
            <input 
              type="text" 
              id="c-title" 
              value="${isEdit ? existingCourse.title : ''}" 
              placeholder="e.g. Next.js 15 Full-Stack Architecture"
              class="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 focus:bg-white focus:ring-2 focus:ring-purple-500 transition-all"
              required 
            />
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-bold text-gray-700 mb-1">Category *</label>
              <select 
                id="c-category" 
                class="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 focus:bg-white focus:ring-2 focus:ring-purple-500"
              >
                ${['Web Development', 'Data Science & AI', 'Design & UX', 'Cloud & DevOps', 'Mobile Dev', 'Cybersecurity', 'Business & Tech']
                  .map(cat => `<option value="${cat}" ${isEdit && existingCourse.category === cat ? 'selected' : ''}>${cat}</option>`).join('')}
              </select>
            </div>

            <div>
              <label class="block text-xs font-bold text-gray-700 mb-1">Difficulty Level *</label>
              <select 
                id="c-level" 
                class="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 focus:bg-white focus:ring-2 focus:ring-purple-500"
              >
                <option value="Beginner" ${isEdit && existingCourse.level === 'Beginner' ? 'selected' : ''}>Beginner</option>
                <option value="Intermediate" ${isEdit && existingCourse.level === 'Intermediate' ? 'selected' : ''}>Intermediate</option>
                <option value="Advanced" ${isEdit && existingCourse.level === 'Advanced' ? 'selected' : ''}>Advanced</option>
              </select>
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-bold text-gray-700 mb-1">Duration (e.g. 10 hours)</label>
              <input 
                type="text" 
                id="c-duration" 
                value="${isEdit ? existingCourse.duration : '12 hours'}" 
                class="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 focus:bg-white focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label class="block text-xs font-bold text-gray-700 mb-1">Badge</label>
              <select 
                id="c-badge" 
                class="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 focus:bg-white focus:ring-2 focus:ring-purple-500"
              >
                <option value="New" ${isEdit && existingCourse.badge === 'New' ? 'selected' : ''}>New</option>
                <option value="Popular" ${isEdit && existingCourse.badge === 'Popular' ? 'selected' : ''}>Popular</option>
                <option value="Bestseller" ${isEdit && existingCourse.badge === 'Bestseller' ? 'selected' : ''}>Bestseller</option>
                <option value="Trending" ${isEdit && existingCourse.badge === 'Trending' ? 'selected' : ''}>Trending</option>
              </select>
            </div>
          </div>

          <div>
            <label class="block text-xs font-bold text-gray-700 mb-1">Instructor Name</label>
            <input 
              type="text" 
              id="c-instructor-name" 
              value="${isEdit ? existingCourse.instructor.name : 'Dr. Angela Wu'}" 
              class="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 focus:bg-white focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div>
            <label class="block text-xs font-bold text-gray-700 mb-1">Thumbnail Image URL</label>
            <input 
              type="url" 
              id="c-thumb" 
              value="${isEdit ? existingCourse.thumbnail : 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80'}" 
              class="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 focus:bg-white focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div>
            <label class="block text-xs font-bold text-gray-700 mb-1">Short Description *</label>
            <textarea 
              id="c-short-desc" 
              rows="2" 
              placeholder="1-2 sentences summarizing the course..."
              class="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 focus:bg-white focus:ring-2 focus:ring-purple-500"
              required
            >${isEdit ? existingCourse.shortDescription : ''}</textarea>
          </div>

          <div>
            <label class="block text-xs font-bold text-gray-700 mb-1">Full Description</label>
            <textarea 
              id="c-full-desc" 
              rows="3" 
              placeholder="In-depth overview and learning outcomes..."
              class="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 focus:bg-white focus:ring-2 focus:ring-purple-500"
            >${isEdit ? existingCourse.fullDescription : ''}</textarea>
          </div>

          <!-- Action Footer -->
          <div class="pt-4 border-t border-gray-100 flex items-center justify-end gap-3">
            <button 
              type="button" 
              id="modal-cancel-btn"
              class="px-4 py-2.5 text-xs font-bold text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              class="px-6 py-2.5 text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 rounded-xl shadow-md shadow-purple-600/20 transition-all"
            >
              ${isEdit ? 'Save Changes' : 'Publish Course'}
            </button>
          </div>
        </form>
      </div>
    `;

    document.body.appendChild(modal);

    const closeModal = () => {
      if (modal.parentNode) modal.parentNode.removeChild(modal);
    };

    modal.querySelector('#modal-close-btn').addEventListener('click', closeModal);
    modal.querySelector('#modal-cancel-btn').addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });

    const form = modal.querySelector('#course-admin-form');
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const courseData = {
        title: modal.querySelector('#c-title').value.trim(),
        category: modal.querySelector('#c-category').value,
        level: modal.querySelector('#c-level').value,
        duration: modal.querySelector('#c-duration').value.trim() || '10 hours',
        badge: modal.querySelector('#c-badge').value,
        thumbnail: modal.querySelector('#c-thumb').value.trim(),
        shortDescription: modal.querySelector('#c-short-desc').value.trim(),
        fullDescription: modal.querySelector('#c-full-desc').value.trim(),
        instructor: {
          name: modal.querySelector('#c-instructor-name').value.trim() || 'Dr. Angela Wu',
          role: 'Course Instructor',
          avatar: isEdit ? existingCourse.instructor.avatar : 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=256&h=256&q=80',
          bio: 'Experienced industry educator specializing in cutting-edge technology mastery.',
          rating: 4.95,
          students: '120k+',
          coursesCount: 5
        },
        learningObjectives: [
          `Master core principles of ${modal.querySelector('#c-title').value.trim()}`,
          'Build end-to-end practical real world projects',
          'Deploy and optimize according to industry standards'
        ],
        prerequisites: ['Basic familiarity with standard modern development workflows']
      };

      if (isEdit) {
        state.updateCourse(existingCourse.id, courseData);
        toast.success(`Updated "${courseData.title}"!`, 'Course Updated');
      } else {
        state.addCourse(courseData);
        toast.celebrate(`Published new course "${courseData.title}"!`, 'Course Created');
      }

      closeModal();
      renderView();
    });
  }

  // Initial render
  renderView();

  return container;
}

