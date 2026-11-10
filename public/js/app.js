/**
 * LMS Main Application Entry Point & Client-side Hash Router
 */
import { state } from './state.js';
import { renderNavbar } from './components/Navbar.js';
import { renderDashboardView } from './views/DashboardView.js';
import { renderCatalogueView } from './views/CatalogueView.js';
import { renderDetailsView } from './views/DetailsView.js';
import { renderMyCoursesView } from './views/MyCoursesView.js';
import { renderLessonView } from './views/LessonView.js';
import { renderQuizView } from './views/QuizView.js';
import { renderProfileView } from './views/ProfileView.js';
import { renderAdminView } from './views/AdminView.js';

class LMSApp {
  constructor() {
    this.navContainer = document.getElementById('navbar-root');
    this.appRoot = document.getElementById('app-root');
    this.footerRoot = document.getElementById('footer-root');
    this.currentRoute = '';

    // Listen to hash changes & state changes
    window.addEventListener('hashchange', () => this.handleRoute());
    state.subscribe((event) => this.handleStateChange(event));
  }

  init() {
    if (!window.location.hash) {
      window.location.hash = '#dashboard';
    } else {
      this.handleRoute();
    }
  }

  handleRoute() {
    const hash = window.location.hash || '#dashboard';
    const parts = hash.replace(/^#\/?/, '').split('/');
    const rootRoute = parts[0] || 'dashboard';

    this.currentRoute = rootRoute;
    window.scrollTo({ top: 0, behavior: 'instant' });

    // Distraction-free mode for lesson player
    const isLessonPlayer = rootRoute === 'learn';

    if (isLessonPlayer) {
      if (this.navContainer) this.navContainer.classList.add('hidden');
      if (this.footerRoot) this.footerRoot.classList.add('hidden');
    } else {
      if (this.navContainer) {
        this.navContainer.classList.remove('hidden');
        this.navContainer.innerHTML = '';
        this.navContainer.appendChild(renderNavbar(rootRoute));
      }
      if (this.footerRoot) this.footerRoot.classList.remove('hidden');
    }

    // Render corresponding view
    this.appRoot.innerHTML = '';

    switch (rootRoute) {
      case 'dashboard':
        this.appRoot.appendChild(renderDashboardView());
        document.title = 'Dashboard | LMS Portal';
        break;

      case 'catalogue':
        this.appRoot.appendChild(renderCatalogueView());
        document.title = 'Course Catalogue | LMS Portal';
        break;

      case 'course':
        const courseId = parts[1];
        this.appRoot.appendChild(renderDetailsView(courseId));
        document.title = 'Course Details | LMS Portal';
        break;

      case 'my-courses':
        this.appRoot.appendChild(renderMyCoursesView());
        document.title = 'My Courses | LMS Portal';
        break;

      case 'learn':
        const cId = parts[1];
        const lId = parts[2];
        this.appRoot.appendChild(renderLessonView(cId, lId));
        document.title = 'Course Classroom | LMS Portal';
        break;

      case 'quiz':
        const quizCourseId = parts[1];
        this.appRoot.appendChild(renderQuizView(quizCourseId));
        document.title = 'Course Assessment | LMS Portal';
        break;

      case 'profile':
        this.appRoot.appendChild(renderProfileView());
        document.title = 'Student Profile | LMS Portal';
        break;

      case 'admin':
        this.appRoot.appendChild(renderAdminView());
        document.title = 'Admin Management | LMS Portal';
        break;

      default:
        window.location.hash = '#dashboard';
        break;
    }
  }

  handleStateChange(event) {
    // If on navbar-dependent route and profile/enrollment changed, refresh navbar
    if (this.currentRoute !== 'learn' && this.navContainer) {
      this.navContainer.innerHTML = '';
      this.navContainer.appendChild(renderNavbar(this.currentRoute));
    }
  }
}

// Instantiate and start app on DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
  const app = new LMSApp();
  app.init();
});

