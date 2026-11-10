/**
 * Navbar Component with Active Link Tracking & Responsive Mobile Drawer
 */
import { Icons } from './Icons.js';
import { state } from '../state.js';

export function renderNavbar(activeRoute = 'dashboard') {
  const profile = state.getProfile();
  const enrolledCount = state.enrollments.length;

  const nav = document.createElement('header');
  nav.className = 'sticky top-0 z-40 w-full bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-xs transition-colors';

  nav.innerHTML = `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        
        <!-- Left: Logo & Brand -->
        <div class="flex items-center gap-8">
          <a href="#dashboard" class="flex items-center gap-2.5 group">
            <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-700 to-violet-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              ${Icons.academic('w-6 h-6')}
            </div>
            <div>
              <span class="text-lg font-black tracking-tight text-gray-900 group-hover:text-indigo-600 transition-colors">
                Moon <span class="text-indigo-600">Light</span>
              </span>
            </div>
          </a>

          <!-- Desktop Navigation Links -->
          <nav class="hidden md:flex items-center gap-1">
            <a href="#dashboard" class="nav-link px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${activeRoute === 'dashboard' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'}">
              Dashboard
            </a>
            <a href="#catalogue" class="nav-link px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${activeRoute === 'catalogue' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'}">
              Course Catalogue
            </a>
            <a href="#my-courses" class="nav-link px-3.5 py-2 rounded-xl text-xs font-semibold transition-all relative ${activeRoute === 'my-courses' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'}">
              My Courses
              ${enrolledCount > 0 ? `<span class="ml-1.5 px-1.5 py-0.2 rounded-full text-[10px] font-bold ${activeRoute === 'my-courses' ? 'bg-indigo-200 text-indigo-800' : 'bg-gray-200 text-gray-700'}">${enrolledCount}</span>` : ''}
            </a>
            <a href="#admin" class="nav-link px-3.5 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1 ${activeRoute === 'admin' ? 'bg-purple-50 text-purple-700 font-bold' : 'text-purple-600 hover:text-purple-800 hover:bg-purple-50/50'}">
              <span>Admin</span>
              <span class="px-1.5 py-0.2 text-[9px] bg-purple-100 text-purple-700 rounded-md uppercase font-bold">Manage</span>
            </a>
          </nav>
        </div>

        <!-- Right Side: Streak, Search Quick, Profile -->
        <div class="hidden md:flex items-center gap-4">
          <!-- Learning Streak Pill -->
          <div class="flex items-center gap-1.5 px-3 py-1 bg-amber-50 border border-amber-200/60 rounded-full text-xs font-semibold text-amber-800 shadow-xs" title="7-Day Learning Streak Active!">
            <span class="text-amber-500">${Icons.fire('w-4 h-4')}</span>
            <span>7 Days</span>
          </div>

          <!-- Student Profile Shortcut -->
          <a href="#profile" class="flex items-center gap-2.5 p-1.5 pr-3 rounded-full hover:bg-gray-100 transition-colors border border-transparent hover:border-gray-200">
            <img src="${profile.avatar}" alt="${profile.name}" class="w-8 h-8 rounded-full object-cover ring-2 ring-indigo-500/20" />
            <div class="text-left text-xs">
              <span class="font-bold text-gray-900 block leading-tight truncate max-w-[100px]">${profile.name}</span>
              <span class="text-[10px] text-gray-500 block leading-none">Student</span>
            </div>
          </a>
        </div>

        <!-- Mobile Menu Button -->
        <div class="flex md:hidden items-center gap-2">
          <a href="#profile" class="p-1">
            <img src="${profile.avatar}" alt="${profile.name}" class="w-7 h-7 rounded-full object-cover" />
          </a>
          <button id="mobile-menu-btn" class="p-2 text-gray-600 hover:text-gray-900 rounded-xl hover:bg-gray-100">
            ${Icons.menu('w-6 h-6')}
          </button>
        </div>

      </div>
    </div>

    <!-- Mobile Drawer / Dropdown -->
    <div id="mobile-menu" class="hidden md:hidden border-t border-gray-100 bg-white px-4 pt-3 pb-5 space-y-2 shadow-lg">
      <div class="flex items-center gap-3 p-2 bg-indigo-50/60 rounded-xl mb-3">
        <img src="${profile.avatar}" alt="${profile.name}" class="w-10 h-10 rounded-full object-cover ring-2 ring-indigo-500/20" />
        <div>
          <h4 class="font-bold text-sm text-gray-900">${profile.name}</h4>
          <p class="text-xs text-indigo-600 font-medium">🔥 7-Day Learning Streak</p>
        </div>
      </div>
      <a href="#dashboard" class="mobile-link block px-3 py-2.5 rounded-xl text-sm font-semibold ${activeRoute === 'dashboard' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-700 hover:bg-gray-50'}">
        Dashboard
      </a>
      <a href="#catalogue" class="mobile-link block px-3 py-2.5 rounded-xl text-sm font-semibold ${activeRoute === 'catalogue' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-700 hover:bg-gray-50'}">
        Course Catalogue
      </a>
      <a href="#my-courses" class="mobile-link flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold ${activeRoute === 'my-courses' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-700 hover:bg-gray-50'}">
        <span>My Courses</span>
        ${enrolledCount > 0 ? `<span class="px-2 py-0.5 rounded-full text-xs font-bold bg-indigo-100 text-indigo-800">${enrolledCount}</span>` : ''}
      </a>
      <a href="#profile" class="mobile-link block px-3 py-2.5 rounded-xl text-sm font-semibold ${activeRoute === 'profile' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-700 hover:bg-gray-50'}">
        Student Profile
      </a>
      <a href="#admin" class="mobile-link flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold ${activeRoute === 'admin' ? 'bg-purple-100 text-purple-800' : 'text-purple-700 hover:bg-purple-50'}">
        <span>Admin Management</span>
        <span class="px-1.5 py-0.5 text-[10px] bg-purple-200 text-purple-800 rounded font-bold uppercase">Admin</span>
      </a>
    </div>
  `;

  // Toggle mobile menu
  const mobileBtn = nav.querySelector('#mobile-menu-btn');
  const mobileMenu = nav.querySelector('#mobile-menu');
  if (mobileBtn && mobileMenu) {
    mobileBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
    });

    const mobileLinks = mobileMenu.querySelectorAll('.mobile-link');
    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
      });
    });
  }

  return nav;
}

