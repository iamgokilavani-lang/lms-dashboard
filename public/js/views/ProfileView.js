/**
 * Module 7: Student Profile Page
 * Profile editing, badges showcase, certificates gallery, learning analytics, and state resets.
 */
import { Icons } from '../components/Icons.js';
import { state } from '../state.js';
import { toast } from '../components/Toast.js';
import { CertificateModal } from '../components/Certificate.js';

export function renderProfileView() {
  const container = document.createElement('div');
  container.className = 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in';

  const profile = state.getProfile();
  const stats = state.getOverallStats();
  const enrolledCourses = state.getEnrolledCoursesWithProgress();
  const completedWithCert = enrolledCourses.filter(c => c.progress.isCompleted && c.progress.quizPassed);

  container.innerHTML = `
    <!-- Profile Hero Card -->
    <div class="relative overflow-hidden bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 shadow-sm">
      <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        
        <div class="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
          <div class="relative">
            <img 
              src="${profile.avatar}" 
              alt="${profile.name}" 
              class="w-24 h-24 rounded-3xl object-cover ring-4 ring-indigo-50 shadow-md"
            />
            <span class="absolute -bottom-1 -right-1 p-1.5 bg-emerald-500 rounded-full text-white ring-2 ring-white" title="Active Scholar">
              ${Icons.check('w-3.5 h-3.5')}
            </span>
          </div>

          <div class="space-y-1">
            <div class="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h1 class="text-2xl font-black text-gray-900">${profile.name}</h1>
              <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-700 font-mono">
                ${profile.studentId}
              </span>
            </div>
            <p class="text-xs font-semibold text-indigo-600">${profile.headline}</p>
            <p class="text-xs text-gray-500 max-w-xl leading-relaxed">${profile.bio}</p>
            
            <div class="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-gray-500 pt-2">
              <span>📍 ${profile.location}</span>
              <span>•</span>
              <span>📅 Joined ${profile.joinedDate}</span>
              <span>•</span>
              <span class="text-amber-600 font-semibold flex items-center gap-1">${Icons.fire('w-3.5 h-3.5')} 7-Day Streak</span>
            </div>
          </div>
        </div>

        <button 
          id="btn-scroll-edit" 
          class="self-center md:self-start px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold transition-colors flex items-center gap-1.5"
        >
          ${Icons.edit('w-3.5 h-3.5')} Edit Profile
        </button>

      </div>
    </div>

    <!-- Stats Matrix Grid -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div class="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs">
        <p class="text-xs font-medium text-gray-400">Total Hours Studied</p>
        <p class="text-2xl font-black text-gray-900 mt-1">${stats.totalHoursLearned}h</p>
        <p class="text-[11px] text-emerald-600 font-semibold mt-0.5">Top 10% this month</p>
      </div>

      <div class="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs">
        <p class="text-xs font-medium text-gray-400">Courses Enrolled</p>
        <p class="text-2xl font-black text-gray-900 mt-1">${stats.totalEnrolled}</p>
        <p class="text-[11px] text-indigo-600 font-semibold mt-0.5">${stats.completedCount} completed</p>
      </div>

      <div class="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs">
        <p class="text-xs font-medium text-gray-400">Lessons Completed</p>
        <p class="text-2xl font-black text-gray-900 mt-1">${stats.totalCompletedLessons}</p>
        <p class="text-[11px] text-purple-600 font-semibold mt-0.5">${stats.overallProgress}% overall</p>
      </div>

      <div class="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs">
        <p class="text-xs font-medium text-gray-400">Certificates Earned</p>
        <p class="text-2xl font-black text-gray-900 mt-1">${stats.certificatesEarned}</p>
        <p class="text-[11px] text-amber-600 font-semibold mt-0.5">Verified on blockchain</p>
      </div>
    </div>

    <!-- Main Content Tabs / Two Columns -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
      
      <!-- Left Column: Badges & Certificates (7 cols) -->
      <div class="lg:col-span-7 space-y-6">
        
        <!-- Badges & Achievements -->
        <div class="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
          <div class="flex items-center justify-between border-b border-gray-100 pb-3">
            <h3 class="text-base font-bold text-gray-900 flex items-center gap-2">
              <span class="p-1 rounded-lg bg-amber-100 text-amber-800">${Icons.trophy('w-4 h-4')}</span>
              Badges & Achievements (${profile.badges.length})
            </h3>
            <span class="text-xs text-gray-400 font-medium">Auto-unlocked with progress</span>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            ${profile.badges.map(b => `
              <div class="flex items-center gap-3.5 p-3.5 rounded-2xl bg-gradient-to-r from-gray-50 to-indigo-50/30 border border-gray-100 hover:border-indigo-200 transition-colors">
                <span class="text-2xl p-2 rounded-xl bg-white shadow-xs border border-gray-100">${b.icon}</span>
                <div>
                  <h4 class="text-xs font-bold text-gray-900">${b.name}</h4>
                  <p class="text-[11px] text-gray-500 leading-tight mt-0.5">${b.description}</p>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Earned Verified Certificates -->
        <div class="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
          <div class="flex items-center justify-between border-b border-gray-100 pb-3">
            <h3 class="text-base font-bold text-gray-900 flex items-center gap-2">
              <span class="p-1 rounded-lg bg-indigo-100 text-indigo-800">${Icons.academic('w-4 h-4')}</span>
              Verified Certificates (${completedWithCert.length})
            </h3>
            <span class="text-xs text-gray-400">Official Graduation Credentials</span>
          </div>

          ${completedWithCert.length > 0 ? `
            <div class="space-y-3">
              ${completedWithCert.map(c => `
                <div class="flex items-center justify-between p-4 rounded-2xl border border-emerald-100 bg-emerald-50/20 hover:bg-emerald-50/40 transition-colors">
                  <div class="flex items-center gap-3">
                    <span class="text-2xl">🎓</span>
                    <div>
                      <h4 class="text-xs font-bold text-gray-900">${c.title}</h4>
                      <p class="text-[11px] text-emerald-700 font-medium">Passed with ${c.progress.quizScore}% Distinction</p>
                    </div>
                  </div>
                  <button 
                    data-action="view-certificate" 
                    data-course-id="${c.id}"
                    class="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-colors"
                  >
                    View Certificate
                  </button>
                </div>
              `).join('')}
            </div>
          ` : `
            <div class="p-8 text-center bg-gray-50 rounded-2xl border border-dashed border-gray-200">
              <div class="text-2xl mb-1">📜</div>
              <p class="text-xs font-bold text-gray-700">No certificates earned yet</p>
              <p class="text-[11px] text-gray-400 mt-0.5 mb-3">Complete all lessons in a course and pass the quiz to unlock your first verified certificate!</p>
              <a href="#catalogue" class="text-xs font-bold text-indigo-600 hover:underline">Explore Courses</a>
            </div>
          `}
        </div>

      </div>

      <!-- Right Column: Edit Profile Form & Settings (5 cols) -->
      <div class="lg:col-span-5 space-y-6" id="edit-profile-section">
        
        <!-- Edit Profile Form -->
        <div class="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
          <h3 class="text-base font-bold text-gray-900 border-b border-gray-100 pb-3">Edit Profile Information</h3>

          <form id="form-edit-profile" class="space-y-3.5">
            <div>
              <label class="block text-xs font-bold text-gray-700 mb-1">Full Name</label>
              <input 
                type="text" 
                id="prof-name" 
                value="${profile.name}" 
                class="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-800 focus:bg-white focus:ring-2 focus:ring-indigo-500 transition-all"
                required 
              />
            </div>

            <div>
              <label class="block text-xs font-bold text-gray-700 mb-1">Email Address</label>
              <input 
                type="email" 
                id="prof-email" 
                value="${profile.email}" 
                class="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-800 focus:bg-white focus:ring-2 focus:ring-indigo-500 transition-all"
                required 
              />
            </div>

            <div>
              <label class="block text-xs font-bold text-gray-700 mb-1">Headline</label>
              <input 
                type="text" 
                id="prof-headline" 
                value="${profile.headline}" 
                class="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-800 focus:bg-white focus:ring-2 focus:ring-indigo-500 transition-all"
              />
            </div>

            <div>
              <label class="block text-xs font-bold text-gray-700 mb-1">Bio</label>
              <textarea 
                id="prof-bio" 
                rows="3" 
                class="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-800 focus:bg-white focus:ring-2 focus:ring-indigo-500 transition-all"
              >${profile.bio}</textarea>
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-xs font-bold text-gray-700 mb-1">Location</label>
                <input 
                  type="text" 
                  id="prof-location" 
                  value="${profile.location}" 
                  class="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-800 focus:bg-white focus:ring-2 focus:ring-indigo-500 transition-all"
                />
              </div>
              <div>
                <label class="block text-xs font-bold text-gray-700 mb-1">Daily Goal (mins)</label>
                <input 
                  type="number" 
                  id="prof-goal" 
                  value="${profile.dailyGoalMinutes}" 
                  class="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-800 focus:bg-white focus:ring-2 focus:ring-indigo-500 transition-all"
                />
              </div>
            </div>

            <div>
              <label class="block text-xs font-bold text-gray-700 mb-1">Avatar Image URL</label>
              <input 
                type="url" 
                id="prof-avatar" 
                value="${profile.avatar}" 
                class="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-800 focus:bg-white focus:ring-2 focus:ring-indigo-500 transition-all"
              />
            </div>

            <div class="pt-2">
              <button 
                type="submit" 
                class="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all"
              >
                Save Profile Changes
              </button>
            </div>
          </form>
        </div>

        <!-- Data Reset / Danger Zone -->
        <div class="bg-white p-6 rounded-3xl border border-rose-100 shadow-sm space-y-3">
          <h4 class="text-xs font-bold uppercase tracking-wider text-rose-700">Data Management</h4>
          <p class="text-xs text-gray-500">Reset course enrollments, quiz results, and custom admin changes back to seed default state.</p>
          <button 
            id="btn-reset-demo" 
            class="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-bold transition-colors"
          >
            Reset All LMS Data to Default
          </button>
        </div>

      </div>

    </div>
  `;

  // Attach Certificate clicks
  const certBtns = container.querySelectorAll('[data-action="view-certificate"]');
  certBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const cId = btn.dataset.courseId;
      const targetCourse = state.getCourseById(cId);
      if (targetCourse) {
        const prog = state.getCourseProgress(cId);
        CertificateModal.show(targetCourse, prog.quizScore || 100);
      }
    });
  });

  // Scroll to edit
  const scrollEditBtn = container.querySelector('#btn-scroll-edit');
  if (scrollEditBtn) {
    scrollEditBtn.addEventListener('click', () => {
      const editSec = container.querySelector('#edit-profile-section');
      if (editSec) editSec.scrollIntoView({ behavior: 'smooth' });
    });
  }

  // Profile Form Submit
  const form = container.querySelector('#form-edit-profile');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const updated = {
      name: container.querySelector('#prof-name').value.trim(),
      email: container.querySelector('#prof-email').value.trim(),
      headline: container.querySelector('#prof-headline').value.trim(),
      bio: container.querySelector('#prof-bio').value.trim(),
      location: container.querySelector('#prof-location').value.trim(),
      dailyGoalMinutes: parseInt(container.querySelector('#prof-goal').value, 10) || 30,
      avatar: container.querySelector('#prof-avatar').value.trim()
    };

    state.updateProfile(updated);
    toast.success('Your profile details have been successfully updated!', 'Profile Saved');

    // Re-render
    const appRoot = document.getElementById('app-root');
    if (appRoot) {
      appRoot.innerHTML = '';
      appRoot.appendChild(renderProfileView());
    }
  });

  // Reset demo data
  const resetBtn = container.querySelector('#btn-reset-demo');
  resetBtn.addEventListener('click', () => {
    if (confirm('Are you sure you want to reset all data back to the default seed courses, enrollments, and profiles?')) {
      state.resetAllData();
      toast.info('All data reset to defaults.', 'Reset Complete');
      window.location.hash = '#dashboard';
    }
  });

  return container;
}

