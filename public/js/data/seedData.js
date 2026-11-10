/**
 * LMS Seed Data
 * Rich dataset of 8 comprehensive courses across tech, design, and management.
 */

export const INITIAL_STUDENT_PROFILE = {
  id: "student-gokilavani",
  name: "Gokilavani",
  email: "gokilavani@edu-portal.dev",
  studentId: "STU-2026-8942",
  avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&h=256&q=80",
  headline: "Aspiring Full-Stack Software Engineer & UI Enthusiast",
  bio: "Lifelong learner pursuing mastery in modern web platforms, distributed systems, and delightful UX design. Currently completing specialization modules.",
  location: "San Francisco, CA",
  dailyGoalMinutes: 45,
  joinedDate: "January 2026",
  github: "https://github.com",
  linkedin: "https://linkedin.com",
  website: "https://gokilavani.dev",
  skills: ["JavaScript", "React", "Node.js", "TypeScript", "UI Design", "Git"],
  badges: [
    { id: "badge-fast-learner", name: "Speed Demon", icon: "⚡", description: "Completed 5 lessons in a single day" },
    { id: "badge-quiz-ace", name: "Quiz Ace", icon: "🏆", description: "Scored 100% on a course final assessment" },
    { id: "badge-consistency", name: "7-Day Streak", icon: "🔥", description: "Logged in and learned for 7 days in a row" },
    { id: "badge-scholar", name: "Certified Scholar", icon: "🎓", description: "Earned first verified certificate" }
  ]
};

export const INITIAL_COURSES = [
  {
    id: "course-react-fullstack",
    title: "Full-Stack React & Node.js Masterclass",
    category: "Web Development",
    level: "Intermediate",
    duration: "18 hours",
    totalMinutes: 1080,
    rating: 4.9,
    reviewCount: 3840,
    studentsCount: 14250,
    badge: "Bestseller",
    thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=800&q=80",
    colorTheme: "from-blue-600 to-indigo-700",
    shortDescription: "Build production-ready web applications from scratch using React 19, Node.js, Express, and modern REST APIs.",
    fullDescription: "Master end-to-end fullstack development. You will learn modern React state management, hooks, component architecture, RESTful backend APIs with Node and Express, database integration, authentication, and deployment best practices.",
    learningObjectives: [
      "Architect modular React component hierarchies and custom hooks",
      "Develop secure Node.js REST APIs with Express & input validation",
      "Manage persistent user authentication via JWT & secure cookies",
      "Handle asynchronous state, caching, and optimistic UI updates",
      "Deploy scalable full-stack apps to production cloud platforms"
    ],
    prerequisites: ["Solid understanding of modern JavaScript (ES6+)", "Basic HTML5 and CSS3"],
    instructor: {
      name: "Dr. Angela Wu",
      role: "Principal Software Architect & Lead Educator",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=256&h=256&q=80",
      bio: "Former Staff Engineer at Google and Netflix. Angela has trained over 250,000 developers worldwide in modern web and distributed systems architecture.",
      rating: 4.95,
      students: "248k+",
      coursesCount: 12
    },
    sections: [
      {
        sectionTitle: "Section 1: Modern React Fundamentals",
        lessons: [
          {
            id: "react-l1",
            title: "React Architecture, JSX & Virtual DOM Deep Dive",
            duration: "14:20",
            type: "video",
            videoEmbed: "https://www.youtube-nocookie.com/embed/SqcY0GlETPk",
            summary: "Understand how React reconciles changes using the Virtual DOM, fiber tree architecture, and best practices for writing clean JSX.",
            notes: `
### Key Architecture Principles
React is a declarative, component-based library for building user interfaces.
- **Declarative**: You describe *what* the UI should look like for a given state, and React handles the DOM mutations.
- **Component-Driven**: Build encapsulated components that manage their own state, then compose them into complex user interfaces.
- **Unidirectional Data Flow**: State flows down through props, while events flow up through callback functions.

\`\`\`jsx
// Example clean functional component
function UserBadge({ user, onStatusChange }) {
  return (
    <div className="flex items-center gap-3 p-3 bg-white rounded-xl shadow-sm">
      <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full" />
      <div>
        <h4 className="font-semibold text-gray-900">{user.name}</h4>
        <p className="text-xs text-gray-500">{user.role}</p>
      </div>
      <button 
        onClick={() => onStatusChange(user.id)}
        className="ml-auto text-xs px-2 py-1 bg-indigo-50 text-indigo-600 rounded-md font-medium"
      >
        Update
      </button>
    </div>
  );
}
\`\`\`
            `,
            resources: [
              { title: "React 19 Official Documentation", url: "https://react.dev" },
              { title: "Component Life Cycle Cheat Sheet PDF", url: "#" }
            ]
          },
          {
            id: "react-l2",
            title: "Advanced State Management: useState, useReducer & Custom Hooks",
            duration: "18:45",
            type: "video",
            videoEmbed: "https://www.youtube-nocookie.com/embed/k3t_qX8k6wM",
            summary: "Master complex state transformations with useReducer and learn how to extract reusable business logic into custom React hooks.",
            notes: `
### When to use useReducer over useState
When state transitions depend on previous state or involve multiple sub-values, \`useReducer\` provides a predictable, testable state machine.

\`\`\`javascript
const initialState = { count: 0, history: [] };

function counterReducer(state, action) {
  switch (action.type) {
    case 'INCREMENT':
      return { count: state.count + 1, history: [...state.history, '+1'] };
    case 'DECREMENT':
      return { count: state.count - 1, history: [...state.history, '-1'] };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
}
\`\`\`
            `,
            resources: [
              { title: "Custom Hooks Patterns Guide", url: "#" }
            ]
          },
          {
            id: "react-l3",
            title: "Side Effects & Lifecycles with useEffect & Cleanups",
            duration: "15:10",
            type: "article",
            summary: "Avoid memory leaks, race conditions, and infinite render loops by mastering the useEffect dependency array and cleanup functions.",
            notes: `
### Effect Lifecycles and Cleanups
An effect's cleanup function runs:
1. Before every re-render when dependencies change.
2. When the component unmounts from the DOM.

Always clean up timers, subscriptions, WebSocket listeners, and abort ongoing network requests with \`AbortController\`:

\`\`\`javascript
useEffect(() => {
  const controller = new AbortController();

  async function fetchData() {
    try {
      const res = await fetch('/api/courses', { signal: controller.signal });
      const data = await res.json();
      setCourses(data);
    } catch (err) {
      if (err.name !== 'AbortError') console.error(err);
    }
  }

  fetchData();
  return () => controller.abort();
}, []);
\`\`\`
            `,
            resources: [
              { title: "AbortController Network Guide", url: "https://developer.mozilla.org" }
            ]
          }
        ]
      },
      {
        sectionTitle: "Section 2: Node.js Backend & API Development",
        lessons: [
          {
            id: "react-l4",
            title: "Node.js Event Loop, HTTP Architecture & Express Setup",
            duration: "21:30",
            type: "video",
            videoEmbed: "https://www.youtube-nocookie.com/embed/Oe421EPjeBE",
            summary: "Deep dive into the Node.js single-threaded event loop, non-blocking I/O, middleware chains, and crafting REST endpoints with Express.",
            notes: `
### The Node.js Event Loop Phases
- **Timers**: Executes callbacks scheduled by \`setTimeout\` and \`setInterval\`.
- **Pending Callbacks**: Executes I/O callbacks deferred to the next loop iteration.
- **Poll**: Retrieves new I/O events; executes I/O-related callbacks.
- **Check**: Executes \`setImmediate\` callbacks.
- **Close Callbacks**: Executes close events (e.g. \`socket.on('close')\`).
            `,
            resources: [
              { title: "Express.js Routing Best Practices", url: "https://expressjs.com" }
            ]
          },
          {
            id: "react-l5",
            title: "Authentication, JWT Tokens & Security Middleware",
            duration: "24:15",
            type: "article",
            summary: "Implement production-grade authentication with JSON Web Tokens (JWT), password hashing with bcrypt, and rate-limiting security headers.",
            notes: `
### JWT Token Strategy
1. Client submits credentials to \`/api/auth/login\`.
2. Server verifies hashed password with bcrypt.
3. Server returns signed access token + httpOnly refresh token.
4. Protected routes verify the token via custom middleware:

\`\`\`javascript
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Access token required' });

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Token expired or invalid' });
    req.user = user;
    next();
  });
}
\`\`\`
            `,
            resources: [
              { title: "OWASP API Security Top 10", url: "https://owasp.org" }
            ]
          }
        ]
      }
    ],
    quiz: {
      id: "quiz-react-fullstack",
      title: "React & Node.js Certification Assessment",
      passingScore: 75,
      questions: [
        {
          id: "q1",
          question: "Which hook should you use in React to execute imperative side effects like DOM queries, subscriptions, or HTTP calls?",
          options: ["useReducer", "useState", "useEffect", "useMemo"],
          correctIndex: 2,
          explanation: "useEffect is specifically designed for side effects, network operations, manual DOM manipulations, and setting up subscriptions."
        },
        {
          id: "q2",
          question: "What happens when you return a function from the callback inside useEffect?",
          options: [
            "It triggers an immediate re-render",
            "It acts as a cleanup function before unmounting or before the effect runs again",
            "It renders an error in the console",
            "It memoizes the effect's return value"
          ],
          correctIndex: 1,
          explanation: "The returned function is the effect's cleanup routine, called when dependencies change or when the component unmounts."
        },
        {
          id: "q3",
          question: "In Express.js, what is the role of the 'next()' argument passed to middleware functions?",
          options: [
            "It terminates the HTTP request immediately",
            "It reloads the server configuration",
            "It passes control to the next middleware or route handler in the pipeline",
            "It redirects the client to the homepage"
          ],
          correctIndex: 2,
          explanation: "Calling next() tells Express to invoke the subsequent middleware in the request-response processing pipeline."
        },
        {
          id: "q4",
          question: "Why should refresh tokens ideally be stored in 'httpOnly' cookies instead of localStorage in browser clients?",
          options: [
            "To speed up database indexing",
            "To prevent Cross-Site Scripting (XSS) attacks from accessing the token via JavaScript",
            "Because localStorage can only hold 100 bytes of data",
            "Because cookies are encrypted automatically by default"
          ],
          correctIndex: 1,
          explanation: "httpOnly cookies cannot be read or stolen by malicious JavaScript running in the browser, providing strong protection against XSS token theft."
        }
      ]
    }
  },
  {
    id: "course-python-ml-ai",
    title: "Machine Learning & AI Foundations with Python",
    category: "Data Science & AI",
    level: "Beginner",
    duration: "16 hours",
    totalMinutes: 960,
    rating: 4.85,
    reviewCount: 2910,
    studentsCount: 11200,
    badge: "Popular",
    thumbnail: "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?auto=format&fit=crop&w=800&q=80",
    colorTheme: "from-emerald-600 to-teal-700",
    shortDescription: "Learn supervised and unsupervised learning, Scikit-Learn, data wrangling with Pandas, and neural networks from fundamentals.",
    fullDescription: "Gain practical AI skills starting with mathematical foundations, feature engineering, classification and regression models, model validation, and an introduction to deep learning with PyTorch and TensorFlow.",
    learningObjectives: [
      "Process, clean, and visualize large datasets using NumPy, Pandas & Seaborn",
      "Train linear regression, logistic regression, decision trees, and random forests",
      "Evaluate model performance with ROC-AUC, precision-recall, and confusion matrices",
      "Implement clustering algorithms like K-Means and dimensionality reduction via PCA",
      "Build your first deep feedforward neural network for image classification"
    ],
    prerequisites: ["Basic familiarity with Python syntax (variables, loops, functions)"],
    instructor: {
      name: "Marcus Vance",
      role: "Lead AI Researcher & ML Consultant",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&h=256&q=80",
      bio: "Marcus has spent 8 years developing predictive AI algorithms for healthcare and autonomous systems. Passionate about democratizing data science.",
      rating: 4.9,
      students: "185k+",
      coursesCount: 8
    },
    sections: [
      {
        sectionTitle: "Section 1: Data Wrangling & Exploratory Analysis",
        lessons: [
          {
            id: "ml-l1",
            title: "Data Manipulation with Pandas & NumPy Arrays",
            duration: "16:40",
            type: "video",
            videoEmbed: "https://www.youtube-nocookie.com/embed/vmEHCJofslg",
            summary: "Learn vectorized operations, dataframe indexing, handling missing values, and data aggregation techniques.",
            notes: `
### NumPy Vectorization vs Python Loops
Vectorized operations execute in compiled C code at memory speed, avoiding Python interpreter overhead.
\`\`\`python
import numpy as np

# Fast vectorized computation
arr = np.random.randn(1000000)
squared = arr ** 2  # 50x faster than list comprehension!
\`\`\`
            `,
            resources: [{ title: "Pandas Cheat Sheet", url: "#" }]
          },
          {
            id: "ml-l2",
            title: "Supervised Learning: Regression vs Classification",
            duration: "20:10",
            type: "article",
            summary: "Understand the core taxonomy of machine learning tasks: continuous output prediction vs discrete label assignment.",
            notes: `
### Supervised Learning Taxonomy
- **Regression**: Predicting numeric quantities (e.g. house pricing, temperature, revenue).
- **Classification**: Assigning input vectors into categories (e.g. spam detection, diagnosis).
            `,
            resources: [{ title: "Scikit-Learn Model Map", url: "https://scikit-learn.org" }]
          }
        ]
      },
      {
        sectionTitle: "Section 2: Model Training & Evaluation",
        lessons: [
          {
            id: "ml-l3",
            title: "Overfitting, Cross-Validation & Hyperparameter Tuning",
            duration: "18:25",
            type: "video",
            videoEmbed: "https://www.youtube-nocookie.com/embed/fSytzGwwBVw",
            summary: "Diagnose high bias vs high variance with learning curves and apply K-Fold cross validation and GridSearch.",
            notes: `
### Combatting Overfitting
1. Add regularization (L1 Lasso, L2 Ridge).
2. Gather more training samples.
3. Reduce model complexity (e.g. limit tree depth).
4. Apply dropout in neural networks.
            `,
            resources: [{ title: "Cross Validation Guide", url: "#" }]
          }
        ]
      }
    ],
    quiz: {
      id: "quiz-python-ml-ai",
      title: "Machine Learning Concepts Exam",
      passingScore: 70,
      questions: [
        {
          id: "q1",
          question: "Which of the following is an example of an unsupervised learning problem?",
          options: [
            "Predicting house prices given square footage",
            "Segmenting online shoppers into behavioral clusters without prior labels",
            "Classifying emails as Spam or Not Spam",
            "Detecting credit card fraud using historical labelled fraud logs"
          ],
          correctIndex: 1,
          explanation: "Unsupervised learning discovers hidden patterns or groupings in unlabeled datasets, such as customer segmentation via K-Means."
        },
        {
          id: "q2",
          question: "What does the 'Overfitting' phenomenon indicate in machine learning?",
          options: [
            "The model performs poorly on both training and test sets",
            "The model memorizes training noise and fails to generalize to unseen test data",
            "The training loss takes too long to converge",
            "The dataset has too few features"
          ],
          correctIndex: 1,
          explanation: "Overfitting occurs when a model captures random noise rather than the underlying distribution, leading to low training error but high test error."
        },
        {
          id: "q3",
          question: "Which metric is generally preferred over standard accuracy when evaluating models on heavily imbalanced datasets?",
          options: ["F1-Score / ROC-AUC", "Mean Squared Error", "R-squared", "Adjusted R-squared"],
          correctIndex: 0,
          explanation: "F1-Score harmonizes precision and recall, preventing deceptive high accuracy figures caused by majority-class dominance."
        }
      ]
    }
  },
  {
    id: "course-uiux-figma",
    title: "UI/UX Design Systems & Interactive Prototyping in Figma",
    category: "Design & UX",
    level: "Beginner",
    duration: "12 hours",
    totalMinutes: 720,
    rating: 4.92,
    reviewCount: 1820,
    studentsCount: 9400,
    badge: "Trending",
    thumbnail: "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?auto=format&fit=crop&w=800&q=80",
    colorTheme: "from-purple-600 to-pink-600",
    shortDescription: "Build scalable design systems, master Auto Layout 5.0, create interactive variables, and craft modern mobile/web UI components.",
    fullDescription: "From wireframes to production-ready design tokens. Learn how Figma's component variants, responsive constraints, typography scales, accessibility guidelines, and smart-animate prototypes bridge the gap between design and engineering.",
    learningObjectives: [
      "Master Figma Auto Layout, component properties, and responsive nesting",
      "Construct a comprehensive design token system (Colors, Spacing, Typography)",
      "Design accessible interfaces meeting WCAG 2.1 AA contrast standards",
      "Create high-fidelity interactive prototypes with variables and conditionals",
      "Hand off assets and design specifications seamlessly to frontend developers"
    ],
    prerequisites: ["No prior design experience required. Curiosity for visual aesthetics!"],
    instructor: {
      name: "Elena Rostova",
      role: "Staff Product Designer",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=256&h=256&q=80",
      bio: "Elena has built design systems for Spotify, Airbnb, and Shopify. She advocates for accessible, user-centric product craft.",
      rating: 4.96,
      students: "92k+",
      coursesCount: 5
    },
    sections: [
      {
        sectionTitle: "Section 1: Foundations of Design Systems",
        lessons: [
          {
            id: "figma-l1",
            title: "Design Tokens: Color Semantics, Typography & Spacing Scales",
            duration: "14:10",
            type: "video",
            videoEmbed: "https://www.youtube-nocookie.com/embed/FTFaQWZBqQ8",
            summary: "Learn how to define semantic tokens (Primary, Surface, On-Surface, Error) rather than hardcoded hex colors.",
            notes: `
### Semantic Token Architecture
- **Global tokens**: \`blue-500 = #3b82f6\`
- **Semantic tokens**: \`color-primary-action = {blue-500}\`
- **Component tokens**: \`btn-primary-bg = {color-primary-action}\`
            `,
            resources: [{ title: "Figma Tokens Kit", url: "#" }]
          },
          {
            id: "figma-l2",
            title: "Auto Layout 5.0, Min/Max Constraints & Responsive Wrapping",
            duration: "19:00",
            type: "article",
            summary: "Construct fluid component containers that automatically expand, contract, and wrap like real CSS Flexbox.",
            notes: `
### Auto Layout Best Practices
1. Never use fixed pixel frames for content cards.
2. Set parent to \`Auto Layout\` and children to \`Fill container\` for responsive layouts.
3. Utilize negative spacing for overlapping avatars!
            `,
            resources: [{ title: "Auto Layout Keyboard Shortcuts", url: "#" }]
          }
        ]
      }
    ],
    quiz: {
      id: "quiz-uiux-figma",
      title: "UI/UX & Design Systems Assessment",
      passingScore: 70,
      questions: [
        {
          id: "q1",
          question: "What is the primary benefit of using semantic tokens over raw color hex values in a design system?",
          options: [
            "It reduces the file size of the Figma project",
            "It decouples visual intent from concrete values, enabling easy theming (e.g. Dark Mode)",
            "It forces all fonts to be sans-serif",
            "It automatically generates SVG code"
          ],
          correctIndex: 1,
          explanation: "Semantic tokens reference design intent (e.g. background-surface), making systemic updates like dark mode effortless across entire products."
        },
        {
          id: "q2",
          question: "What minimum contrast ratio does WCAG 2.1 AA require for normal body text against its background?",
          options: ["3.0:1", "4.5:1", "7.0:1", "2.0:1"],
          correctIndex: 1,
          explanation: "WCAG 2.1 Level AA requires a contrast ratio of at least 4.5:1 for normal body text and 3:1 for large text."
        }
      ]
    }
  },
  {
    id: "course-typescript-mastery",
    title: "Modern TypeScript: From Fundamentals to Architecture",
    category: "Web Development",
    level: "Advanced",
    duration: "11 hours",
    totalMinutes: 660,
    rating: 4.94,
    reviewCount: 1650,
    studentsCount: 7800,
    badge: "Popular",
    thumbnail: "https://images.unsplash.com/photo-1516116211227-bbc67eb94819?auto=format&fit=crop&w=800&q=80",
    colorTheme: "from-sky-600 to-blue-800",
    shortDescription: "Master generics, conditional types, template literal types, mapped types, and type-safe enterprise patterns.",
    fullDescription: "Go beyond basic types. Learn advanced type-level programming in TypeScript, infer keywords, recursive type definitions, brand types, and how to write bulletproof libraries with zero runtime overhead.",
    learningObjectives: [
      "Leverage generics, constraints, and default type parameters effectively",
      "Craft dynamic type utilities with mapped, indexed, and conditional types",
      "Enforce domain invariants using Nominal/Branded types",
      "Design strict type-safe APIs and Redux/Zustand state slices",
      "Configure tsconfig.json for maximum safety and performance"
    ],
    prerequisites: ["Intermediate JavaScript fluency"],
    instructor: {
      name: "Dr. Angela Wu",
      role: "Principal Software Architect",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=256&h=256&q=80",
      bio: "Former Staff Engineer at Google and Netflix. Angela has trained over 250,000 developers worldwide in modern web systems.",
      rating: 4.95,
      students: "248k+",
      coursesCount: 12
    },
    sections: [
      {
        sectionTitle: "Section 1: Advanced Type System Mechanics",
        lessons: [
          {
            id: "ts-l1",
            title: "Generics, Type Constraints & Infer Keyword",
            duration: "16:20",
            type: "video",
            videoEmbed: "https://www.youtube-nocookie.com/embed/d56mG7DezGs",
            summary: "Explore polymorphic functions, generic constraints using extends, and extracting inner types with infer.",
            notes: `
### Generic Constraints & Type Inference
\`\`\`typescript
type UnpackPromise<T> = T extends Promise<infer U> ? U : T;

type Example = UnpackPromise<Promise<string>>; // string
\`\`\`
            `,
            resources: [{ title: "TypeScript Handbook Generics", url: "https://www.typescriptlang.org" }]
          },
          {
            id: "ts-l2",
            title: "Branded Types & Nominal Typing in TypeScript",
            duration: "12:15",
            type: "article",
            summary: "Prevent logical bugs like mixing up UserId and OrderId using compile-time branded tags.",
            notes: `
\`\`\`typescript
declare const __brand: unique symbol;
type Brand<K, T> = K & { readonly [__brand]: T };

type UserId = Brand<string, 'UserId'>;
type OrderId = Brand<string, 'OrderId'>;

function getUser(id: UserId) { /* ... */ }
\`\`\`
            `,
            resources: [{ title: "Branded Types Patterns", url: "#" }]
          }
        ]
      }
    ],
    quiz: {
      id: "quiz-typescript-mastery",
      title: "TypeScript Architectural Mastery Quiz",
      passingScore: 75,
      questions: [
        {
          id: "q1",
          question: "What does the 'infer' keyword do inside a conditional type in TypeScript?",
          options: [
            "It casts an unknown variable to any",
            "It introduces a type variable to be deduced from the type being checked",
            "It skips type checking at compile time",
            "It forces the compiler to inline the function"
          ],
          correctIndex: 1,
          explanation: "In conditional types, the 'infer' keyword introduces a type variable to extract inner types (such as extracting return types or promise resolutions)."
        },
        {
          id: "q2",
          question: "Which utility type constructs a type with all properties of Type set to optional?",
          options: ["Required<Type>", "Partial<Type>", "Readonly<Type>", "Pick<Type, Keys>"],
          correctIndex: 1,
          explanation: "Partial<Type> returns a type with all properties of Type set to optional."
        }
      ]
    }
  },
  {
    id: "course-cloud-devops-aws",
    title: "Cloud Architecture & DevOps on AWS & Docker",
    category: "Cloud & DevOps",
    level: "Intermediate",
    duration: "15 hours",
    totalMinutes: 900,
    rating: 4.88,
    reviewCount: 1410,
    studentsCount: 6300,
    badge: "Popular",
    thumbnail: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80",
    colorTheme: "from-amber-600 to-orange-700",
    shortDescription: "Containerize apps with Docker, configure automated CI/CD pipelines, and deploy resilient architectures on AWS.",
    fullDescription: "Learn core DevOps engineering practices. Build multi-stage Docker builds, orchestrate containers, configure GitHub Actions pipelines, automate infrastructure with Terraform, and monitor production systems with Prometheus & Grafana.",
    learningObjectives: [
      "Write optimized, secure multi-stage Dockerfiles",
      "Deploy scalable microservices across AWS ECS, S3, and RDS",
      "Automate testing, linting, and deployments with GitHub Actions CI/CD",
      "Manage Infrastructure as Code (IaC) using Terraform modules",
      "Configure centralized logs and metrics with CloudWatch & Grafana"
    ],
    prerequisites: ["Familiarity with command line terminal and basic networking concepts"],
    instructor: {
      name: "Kavita Sen",
      role: "Cloud Infrastructure Architect & AWS Community Hero",
      avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=256&h=256&q=80",
      bio: "Kavita designs multi-region resilient cloud infrastructures for fintech startups and trains engineering teams in cloud reliability.",
      rating: 4.92,
      students: "110k+",
      coursesCount: 6
    },
    sections: [
      {
        sectionTitle: "Section 1: Containerization with Docker",
        lessons: [
          {
            id: "devops-l1",
            title: "Multi-Stage Docker Builds for Node & Python Apps",
            duration: "17:30",
            type: "video",
            videoEmbed: "https://www.youtube-nocookie.com/embed/gAkwW2tuIqE",
            summary: "Shrink image footprints by 90% and remove build-time vulnerabilities using multi-stage Docker patterns.",
            notes: `
### Multi-Stage Dockerfile
\`\`\`dockerfile
# Build stage
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production runtime stage
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./
RUN npm ci --only=production
EXPOSE 3000
CMD ["node", "dist/server.js"]
\`\`\`
            `,
            resources: [{ title: "Docker Best Practices Guide", url: "https://docs.docker.com" }]
          }
        ]
      }
    ],
    quiz: {
      id: "quiz-cloud-devops-aws",
      title: "DevOps & Cloud Architecture Assessment",
      passingScore: 70,
      questions: [
        {
          id: "q1",
          question: "What is the primary benefit of multi-stage Docker builds?",
          options: [
            "It runs containers faster at runtime",
            "It produces significantly smaller, more secure production images by discarding build-time tooling",
            "It eliminates the need for port forwarding",
            "It automatically configures SSL certificates"
          ],
          correctIndex: 1,
          explanation: "Multi-stage builds allow compiling in an intermediate container and copying only runtime artifacts into a lean final base image."
        }
      ]
    }
  },
  {
    id: "course-flutter-mobile",
    title: "Cross-Platform Mobile App Development with Flutter & Dart",
    category: "Mobile Dev",
    level: "Beginner",
    duration: "14 hours",
    totalMinutes: 840,
    rating: 4.87,
    reviewCount: 920,
    studentsCount: 4500,
    badge: "New",
    thumbnail: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=800&q=80",
    colorTheme: "from-cyan-600 to-blue-700",
    shortDescription: "Build beautiful, native-performance iOS and Android mobile apps from a single codebase using Flutter 3.x and Dart.",
    fullDescription: "Master mobile app engineering. Understand widget composition, State Management with Riverpod, offline data persistence with SQLite and Hive, device hardware access (Camera, GPS, Biometrics), and store release automation.",
    learningObjectives: [
      "Build fluid custom widgets with Stateless and Stateful lifecycles",
      "Manage app-wide state predictably with Riverpod",
      "Integrate RESTful backends and serialize JSON safely",
      "Access native mobile sensors, camera, and local device storage",
      "Prepare and publish production releases for Google Play & Apple App Store"
    ],
    prerequisites: ["Basic programming logic in any object-oriented language"],
    instructor: {
      name: "Tariq Al-Mansoor",
      role: "Lead Mobile Engineer",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=256&h=256&q=80",
      bio: "Tariq has architected fintech and logistics mobile applications with over 15 million global downloads on iOS and Android.",
      rating: 4.89,
      students: "74k+",
      coursesCount: 4
    },
    sections: [
      {
        sectionTitle: "Section 1: Flutter Widgets & Layouts",
        lessons: [
          {
            id: "flutter-l1",
            title: "Everything is a Widget: Row, Column, Stack & Flex",
            duration: "15:45",
            type: "video",
            videoEmbed: "https://www.youtube-nocookie.com/embed/1gDhl4leEzA",
            summary: "Learn Flutter's declarative layout model and composition over inheritance.",
            notes: `
### Flutter Widget Trees
In Flutter, layout is achieved through nested widget composition. Constraints go down, sizes go up, parent sets position.
            `,
            resources: [{ title: "Flutter Widget of the Week", url: "https://flutter.dev" }]
          }
        ]
      }
    ],
    quiz: {
      id: "quiz-flutter-mobile",
      title: "Flutter Mobile Mastery Quiz",
      passingScore: 70,
      questions: [
        {
          id: "q1",
          question: "In Flutter's layout protocol, how is sizing and positioning communicated between parent and child?",
          options: [
            "Constraints go down, sizes go up, parent sets position",
            "Sizes go down, constraints go up, child sets position",
            "Children dictate the window dimension directly",
            "Layout is computed purely via CSS style sheets"
          ],
          correctIndex: 0,
          explanation: "Flutter follows the golden rule: Constraints go down, sizes go up, and the parent sets the position."
        }
      ]
    }
  },
  {
    id: "course-cybersecurity-essentials",
    title: "Cybersecurity & Ethical Hacking Essentials",
    category: "Cybersecurity",
    level: "Intermediate",
    duration: "13 hours",
    totalMinutes: 780,
    rating: 4.91,
    reviewCount: 1530,
    studentsCount: 7100,
    badge: "Trending",
    thumbnail: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=80",
    colorTheme: "from-rose-600 to-red-800",
    shortDescription: "Learn penetration testing methodology, OWASP Top 10 vulnerabilities, network traffic analysis, and defensive hardening.",
    fullDescription: "Gain practical offensive and defensive security skills. Explore SQL injection, Cross-Site Scripting (XSS), CSRF, network reconnaissance with Wireshark and Nmap, password cracking prevention, and modern zero-trust enterprise security.",
    learningObjectives: [
      "Understand threat modeling and the ethical hacker methodology",
      "Detect and remediate OWASP Top 10 web vulnerabilities",
      "Inspect network packets and protocols using Wireshark & tcpdump",
      "Implement cryptographically secure password storage and MFA",
      "Apply zero-trust architecture principles to web and cloud systems"
    ],
    prerequisites: ["Understanding of web basics (HTTP, cookies, IP networking)"],
    instructor: {
      name: "Marcus Vance",
      role: "Security Researcher & CISSP Certified Consultant",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&h=256&q=80",
      bio: "Marcus consults on red team engagements and helps companies build robust defensive software architecture.",
      rating: 4.9,
      students: "185k+",
      coursesCount: 8
    },
    sections: [
      {
        sectionTitle: "Section 1: Web Application Security",
        lessons: [
          {
            id: "sec-l1",
            title: "OWASP Top 10: SQL Injection & Remediation with Parameterized Queries",
            duration: "18:00",
            type: "video",
            videoEmbed: "https://www.youtube-nocookie.com/embed/ciNHn38EyRc",
            summary: "Learn how unescaped user input alters SQL syntax and how prepared statements eliminate injection entirely.",
            notes: `
### Parameterized Queries
Never concatenate raw strings into SQL statements. Always use parameterized queries or trusted ORM sanitization.
\`\`\`sql
-- VULNERABLE:
-- SELECT * FROM users WHERE email = '' OR '1'='1';

-- SECURE:
SELECT * FROM users WHERE email = $1;
\`\`\`
            `,
            resources: [{ title: "OWASP SQLi Prevention Cheat Sheet", url: "https://owasp.org" }]
          }
        ]
      }
    ],
    quiz: {
      id: "quiz-cybersecurity-essentials",
      title: "Cybersecurity Fundamentals Quiz",
      passingScore: 75,
      questions: [
        {
          id: "q1",
          question: "What is the most effective defense against SQL Injection vulnerabilities?",
          options: [
            "Filtering out quote characters using client-side JavaScript regex",
            "Using Parameterized Queries (Prepared Statements)",
            "Hiding database error messages",
            "Encrypting the database hard drive"
          ],
          correctIndex: 1,
          explanation: "Parameterized queries ensure the database engine treats input strictly as data parameters, never as executable SQL code."
        }
      ]
    }
  },
  {
    id: "course-agile-product-management",
    title: "Product Management & Agile Scrum in Tech",
    category: "Business & Tech",
    level: "Beginner",
    duration: "10 hours",
    totalMinutes: 600,
    rating: 4.83,
    reviewCount: 880,
    studentsCount: 3900,
    badge: "New",
    thumbnail: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=800&q=80",
    colorTheme: "from-violet-600 to-indigo-800",
    shortDescription: "Lead tech product teams, write clear PRDs and user stories, run Agile Scrum sprints, and master data-driven prioritization.",
    fullDescription: "Become an impactful Product Manager. Learn the end-to-end product lifecycle from user discovery interviews, problem validation, product requirement documents (PRD), sprint ceremonies, roadmapping with RICE/MoSCoW, and metrics like North Star & OKRs.",
    learningObjectives: [
      "Conduct user research and translate customer pain points into PRDs",
      "Facilitate Agile Scrum ceremonies: Sprint Planning, Daily Standups, Retrospectives",
      "Prioritize feature backlogs using RICE and Value vs Effort frameworks",
      "Define North Star Metrics and measurable OKRs for software teams",
      "Communicate cross-functionally with engineers, designers, and executives"
    ],
    prerequisites: ["Interest in product strategy, teamwork, and modern software workflows"],
    instructor: {
      name: "Elena Rostova",
      role: "Staff Product Designer & Tech Lead",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=256&h=256&q=80",
      bio: "Elena mentors product managers and engineers on rapid prototyping, agile delivery, and human-centered design.",
      rating: 4.96,
      students: "92k+",
      coursesCount: 5
    },
    sections: [
      {
        sectionTitle: "Section 1: Product Discovery & Agile Sprints",
        lessons: [
          {
            id: "pm-l1",
            title: "Writing Effective User Stories & Acceptance Criteria",
            duration: "13:30",
            type: "video",
            videoEmbed: "https://www.youtube-nocookie.com/embed/502ILHjX9EE",
            summary: "Learn the standard 'As a [user], I want [action] so that [benefit]' template and Given-When-Then criteria.",
            notes: `
### User Story Formula
**As a** registered student,
**I want to** mark lessons as completed,
**So that** I can track my learning progress across courses.
            `,
            resources: [{ title: "User Story Template", url: "#" }]
          }
        ]
      }
    ],
    quiz: {
      id: "quiz-agile-product-management",
      title: "Agile & Product Management Assessment",
      passingScore: 70,
      questions: [
        {
          id: "q1",
          question: "In the RICE prioritization framework, what do the letters stand for?",
          options: [
            "Reach, Impact, Confidence, Effort",
            "Revenue, Innovation, Cost, Execution",
            "Retention, Interface, Customer, Engagement",
            "Rate, Investment, Complexity, Efficiency"
          ],
          correctIndex: 0,
          explanation: "RICE scores features based on (Reach × Impact × Confidence) / Effort."
        }
      ]
    }
  }
];

// Initial enrolled courses for realistic first impression on dashboard
export const INITIAL_ENROLLMENTS = [
  {
    courseId: "course-react-fullstack",
    enrolledAt: "2026-02-15T10:00:00Z",
    completedLessonIds: ["react-l1", "react-l2"],
    lastAccessedLessonId: "react-l3",
    quizScore: null
  },
  {
    courseId: "course-uiux-figma",
    enrolledAt: "2026-02-20T14:30:00Z",
    completedLessonIds: ["figma-l1"],
    lastAccessedLessonId: "figma-l2",
    quizScore: null
  }
];

