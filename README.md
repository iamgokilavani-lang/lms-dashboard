# 🎓 Moon Light — Learning Management System (Member 4)

A comprehensive, production-grade **Learning Management System (LMS)** designed with modern web architecture, interactive client-side routing, and persistent `localStorage` synchronization.

---

## 🚀 Live Localhost URL

> **The application is currently running live at:**  
> 👉 **[http://localhost:5000](http://localhost:5000)**

---

## 📋 Required Modules Implemented

### 1. Student Dashboard (`#dashboard`)
- **Personalized Welcome Banner**: Greets the logged-in student with learning momentum status and quick resume button.
- **Key Metrics Overview**: Real-time counter of enrolled courses, in-progress courses, overall curriculum progress (%), total hours studied, and average assessment scores.
- **Active "Up Next" Learning Hero**: Direct shortcut to resume the exact last-accessed lesson with progress bar.
- **Enrolled Courses Grid**: Reusable course cards displaying completion percentage, completed lessons count, and resume button.
- **Personalized Recommendations**: Dynamically highlights trending courses not yet enrolled.

### 2. Course Catalogue (`#catalogue`)
- **Real-time Live Search**: Instant filtering by course title, instructor, keywords, or description.
- **Category Filter Pills**: Interactive categories including *Web Development*, *Data Science & AI*, *Design & UX*, *Cloud & DevOps*, *Mobile Dev*, *Cybersecurity*, and *Business & Tech*.
- **Level Filter**: Filter by *Beginner*, *Intermediate*, or *Advanced*.
- **Multi-criteria Sorting**: Sort by *Most Popular*, *Highest Rated*, *Newest*, or *Duration (Short to Long / Long to Short)*.
- **Reusable Course Cards**: Features cover thumbnails, category badges, star ratings, review counts, instructor profiles, duration, and 1-click enrollment.

### 3. Course Details Page (`#course/:id`)
- **Course Overview Hero**: Category badge, status tags (*Bestseller*, *Trending*), title, description, star rating, and total learners.
- **Instructor Showcase**: Avatar, credentials, bio, instructor rating, and student count.
- **"What You'll Learn" Checklist**: Core learning outcomes with visual checkmarks.
- **Curriculum Syllabus**: Structured module breakdown with duration, lesson types (*Video* / *Article*), and completion status indicators.
- **Interactive Enrollment Action Card**: Real-time enrollment toggle (*Enroll Now* vs *Resume Learning* / *Review Course*), course progress ring, and unenroll option.

### 4. My Courses Page (`#my-courses`)
- **Filter Tabs**: Toggle between *All Enrolled*, *In Progress*, and *Completed*.
- **Dedicated Search**: Search and filter within the student's enrolled courses.
- **Progress Tracking**: Visual progress bars, completed lesson counters, next lesson title, and direct resume shortcuts.
- **Assessment Status & Certificates**: Displays completed quiz scores and 1-click access to download verified certificates.

### 5. Lesson Viewer (`#learn/:courseId/:lessonId`)
- **Distraction-Free Classroom Environment**: Dedicated LMS video/reading player inspired by modern educational platforms.
- **Collapsible Curriculum Sidebar**: Section-by-section lesson tree with status checkmarks and click-to-jump navigation.
- **Rich Lesson Types**:
  - Embedded high-definition video player with custom aspect ratio.
  - Formatted study notes with code syntax snippets, bulleted key takeaways, and downloadable resources.
- **Completion Tracking**: Interactive "Mark as Completed" toggle with instant localStorage persistence.
- **Sequential Navigation**: Previous lesson button, Next lesson button (with auto-complete), and a direct transition to the final capstone quiz on the last lesson.

### 6. Quiz Interface (`#quiz/:courseId`)
- **Assessment Flow**: Course-specific multiple choice questions (MCQs) with answer selection.
- **Progress Bar**: Tracks answered questions count in real-time.
- **Instant Score Calculation**: Calculates percentage score against the course passing threshold (e.g. 70%).
- **Pass/Fail Evaluation**: Celebratory feedback, grade assessment, and performance breakdown.
- **Detailed Question Review**: Compares user selection vs correct answer with explanations for every question.
- **Certificate Unlock**: Passing the quiz unlocks an official verifiable certificate of completion.

### 7. Student Profile Page (`#profile`)
- **Profile Header**: Editable avatar, student name, email, student ID, location, and bio.
- **Learning Analytics Matrix**: Total study hours, courses enrolled, lessons completed, and certificates earned.
- **Gamified Badges Showcase**: Displays unlocked achievements (*Speed Demon*, *Quiz Ace*, *7-Day Streak*, *Certified Scholar*).
- **Verified Certificates Gallery**: Direct preview and print/download buttons for all earned certificates.
- **Profile Edit Form**: Live editable profile fields persisting directly to localStorage.
- **Data Management**: Option to reset system state back to default seed data.

### 8. Admin Course Management Page (`#admin`)
- **Admin Analytics**: Total published courses, total lessons count, system learner count, and category diversity.
- **Live Search & Filter**: Rapidly filter across the entire course repository.
- **Management Table**: Displays thumbnail, title, category, instructor, lesson count, and ratings.
- **Course Creation Modal**: Add new courses with category, level, duration, badge, instructor, descriptions, and automatic syllabus generation.
- **Course Editing & Deletion**: Update existing courses or delete courses with immediate persistence.

---

## 🛠️ Functional Requirements Matrix

| Requirement | Implementation Details |
|---|---|
| **Course Enrolment Interactions** | 1-click enroll / unenroll buttons with celebratory toast notifications and dynamic UI updates across all views. |
| **Completed Lessons Tracking via LocalStorage** | Real-time tracking of completed lesson IDs per course stored under `lms_enrollments_v1` in `localStorage`. |
| **Quiz Scores Calculation & Results** | Automatic evaluation of selected answers vs answer keys, score percentage calculation, pass/fail thresholding, and question explanations. |
| **Course Search, Sorting & Progress Indicators** | Real-time text search, category tabs, difficulty filtering, 5 sorting orders, and percentage progress bars/rings. |
| **Reusable Course Cards & Lesson Components** | Modular `renderCourseCard()`, `renderNavbar()`, `CertificateModal`, and `toast` notification system. |
| **Responsive Layouts & Navigation** | Mobile drawer navigation, responsive grid layouts, sticky navigation bars, and accessible interactive controls. |
| **Localhost Output** | Native Node.js HTTP server running live on `http://localhost:5000`. |

---

## 💻 Tech Stack & Architecture

- **Backend**: Native Node.js HTTP Server (`server.js`) with zero external runtime dependencies.
- **Frontend Architecture**: Modern Native ES Modules (`app.js`, `state.js`, `seedData.js`, modular views).
- **Client-Side Routing**: Hash-based router (`#dashboard`, `#catalogue`, `#course/:id`, `#my-courses`, `#learn/:courseId/:lessonId`, `#quiz/:courseId`, `#profile`, `#admin`).
- **Styling**: Tailwind CSS + custom modern design system with Glassmorphism and responsive breakpoints.
- **Storage**: Browser `localStorage` with reactive state subscription pattern.

