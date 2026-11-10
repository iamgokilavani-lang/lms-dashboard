/**
 * Module 2: Course Catalogue View
 * Search, category tabs, difficulty filter, sorting, and reusable course cards.
 */
import { Icons } from '../components/Icons.js';
import { state } from '../state.js';
import { renderCourseCard } from '../components/CourseCard.js';

export function renderCatalogueView() {
  const container = document.createElement('div');
  container.className = 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-fade-in';

  let currentCategory = 'All';
  let currentLevel = 'All';
  let currentSort = 'popular';
  let searchQuery = '';

  const categories = [
    'All',
    'Web Development',
    'Data Science & AI',
    'Design & UX',
    'Cloud & DevOps',
    'Mobile Dev',
    'Cybersecurity',
    'Business & Tech'
  ];

  container.innerHTML = `
    <!-- Catalogue Header -->
    <div class="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-gray-100">
      <div>
        <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold mb-2">
          ${Icons.academic('w-3.5 h-3.5')}
          <span>Comprehensive Tech & Design Curriculum</span>
        </div>
        <h1 class="text-3xl font-extrabold text-gray-900 tracking-tight">Course Catalogue</h1>
        <p class="text-sm text-gray-500 mt-1">Discover expert-led courses with verified certificates and hands-on projects.</p>
      </div>

      <!-- Live Results Counter -->
      <div id="results-count" class="text-xs font-semibold text-gray-500 bg-gray-50 px-3.5 py-1.5 rounded-xl border border-gray-100">
        Showing all courses
      </div>
    </div>

    <!-- Filter & Search Controls Bar -->
    <div class="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm space-y-4">
      <div class="grid grid-cols-1 md:grid-cols-12 gap-3">
        
        <!-- Search Input -->
        <div class="md:col-span-6 relative">
          <span class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
            ${Icons.search('w-4 h-4')}
          </span>
          <input 
            type="text" 
            id="catalogue-search" 
            placeholder="Search by course title, skills, or instructor..."
            class="w-full pl-10 pr-10 py-2.5 bg-gray-50/80 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
          />
          <button id="clear-search" class="hidden absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600">
            &times;
          </button>
        </div>

        <!-- Level Filter Dropdown -->
        <div class="md:col-span-3">
          <div class="relative">
            <select 
              id="filter-level" 
              class="w-full py-2.5 px-3 bg-gray-50/80 border border-gray-200 rounded-xl text-sm text-gray-700 font-medium focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:bg-white cursor-pointer transition-all"
            >
              <option value="All">All Levels</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>
        </div>

        <!-- Sort By Dropdown -->
        <div class="md:col-span-3">
          <div class="relative">
            <select 
              id="sort-courses" 
              class="w-full py-2.5 px-3 bg-gray-50/80 border border-gray-200 rounded-xl text-sm text-gray-700 font-medium focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:bg-white cursor-pointer transition-all"
            >
              <option value="popular">Most Popular</option>
              <option value="highest-rated">Highest Rated</option>
              <option value="newest">Newest First</option>
              <option value="duration-short">Duration: Short to Long</option>
              <option value="duration-long">Duration: Long to Short</option>
            </select>
          </div>
        </div>

      </div>

      <!-- Category Filter Pills -->
      <div class="flex items-center gap-2 overflow-x-auto pb-1 pt-1 scrollbar-none" id="category-pills">
        ${categories.map(cat => `
          <button 
            data-category="${cat}"
            class="cat-pill whitespace-nowrap px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${cat === 'All' ? 'bg-indigo-600 text-white shadow-xs' : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-900'}"
          >
            ${cat}
          </button>
        `).join('')}
      </div>
    </div>

    <!-- Courses Grid -->
    <div id="catalogue-grid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-2"></div>

    <!-- Empty State -->
    <div id="catalogue-empty" class="hidden bg-white rounded-3xl border border-gray-100 p-12 text-center max-w-lg mx-auto shadow-sm">
      <div class="w-14 h-14 mx-auto rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-3">
        ${Icons.search('w-6 h-6')}
      </div>
      <h3 class="text-base font-bold text-gray-900">No matching courses found</h3>
      <p class="text-xs text-gray-500 mt-1 mb-4">Try adjusting your search terms or clear filters to see all available courses.</p>
      <button id="btn-reset-filters" class="px-4 py-2 bg-indigo-600 text-white text-xs font-bold rounded-xl hover:bg-indigo-700 transition-colors">
        Reset All Filters
      </button>
    </div>
  `;

  const searchInput = container.querySelector('#catalogue-search');
  const clearSearchBtn = container.querySelector('#clear-search');
  const levelSelect = container.querySelector('#filter-level');
  const sortSelect = container.querySelector('#sort-courses');
  const pillsContainer = container.querySelector('#category-pills');
  const catalogueGrid = container.querySelector('#catalogue-grid');
  const emptyState = container.querySelector('#catalogue-empty');
  const resultsCount = container.querySelector('#results-count');
  const resetFiltersBtn = container.querySelector('#btn-reset-filters');

  function updateView() {
    let courses = state.getCourses();

    // 1. Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      courses = courses.filter(c => 
        c.title.toLowerCase().includes(q) ||
        c.shortDescription.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q) ||
        c.instructor.name.toLowerCase().includes(q)
      );
    }

    // 2. Category filter
    if (currentCategory !== 'All') {
      courses = courses.filter(c => c.category === currentCategory);
    }

    // 3. Level filter
    if (currentLevel !== 'All') {
      courses = courses.filter(c => c.level === currentLevel);
    }

    // 4. Sort
    courses.sort((a, b) => {
      if (currentSort === 'popular') return (b.studentsCount || 0) - (a.studentsCount || 0);
      if (currentSort === 'highest-rated') return (b.rating || 0) - (a.rating || 0);
      if (currentSort === 'newest') return (b.badge === 'New' ? 1 : 0) - (a.badge === 'New' ? 1 : 0);
      if (currentSort === 'duration-short') return (a.totalMinutes || 0) - (b.totalMinutes || 0);
      if (currentSort === 'duration-long') return (b.totalMinutes || 0) - (a.totalMinutes || 0);
      return 0;
    });

    // Render results
    catalogueGrid.innerHTML = '';
    resultsCount.textContent = `Showing ${courses.length} ${courses.length === 1 ? 'course' : 'courses'}`;

    if (courses.length === 0) {
      catalogueGrid.classList.add('hidden');
      emptyState.classList.remove('hidden');
    } else {
      catalogueGrid.classList.remove('hidden');
      emptyState.classList.add('hidden');

      courses.forEach(c => {
        const card = renderCourseCard(c, {
          onUpdate: updateView
        });
        catalogueGrid.appendChild(card);
      });
    }
  }

  // Event handlers
  searchInput.addEventListener('input', (e) => {
    searchQuery = e.target.value;
    clearSearchBtn.classList.toggle('hidden', !searchQuery);
    updateView();
  });

  clearSearchBtn.addEventListener('click', () => {
    searchInput.value = '';
    searchQuery = '';
    clearSearchBtn.classList.add('hidden');
    updateView();
  });

  levelSelect.addEventListener('change', (e) => {
    currentLevel = e.target.value;
    updateView();
  });

  sortSelect.addEventListener('change', (e) => {
    currentSort = e.target.value;
    updateView();
  });

  const pills = pillsContainer.querySelectorAll('.cat-pill');
  pills.forEach(pill => {
    pill.addEventListener('click', () => {
      pills.forEach(p => {
        p.classList.remove('bg-indigo-600', 'text-white', 'shadow-xs');
        p.classList.add('bg-gray-100', 'text-gray-600');
      });
      pill.classList.remove('bg-gray-100', 'text-gray-600');
      pill.classList.add('bg-indigo-600', 'text-white', 'shadow-xs');

      currentCategory = pill.dataset.category;
      updateView();
    });
  });

  resetFiltersBtn.addEventListener('click', () => {
    searchInput.value = '';
    searchQuery = '';
    clearSearchBtn.classList.add('hidden');
    levelSelect.value = 'All';
    currentLevel = 'All';
    sortSelect.value = 'popular';
    currentSort = 'popular';

    pills.forEach(p => {
      if (p.dataset.category === 'All') {
        p.classList.add('bg-indigo-600', 'text-white', 'shadow-xs');
        p.classList.remove('bg-gray-100', 'text-gray-600');
      } else {
        p.classList.remove('bg-indigo-600', 'text-white', 'shadow-xs');
        p.classList.add('bg-gray-100', 'text-gray-600');
      }
    });
    currentCategory = 'All';
    updateView();
  });

  // Initial render
  updateView();

  return container;
}

