export const ROLE_SKILLS = {
  'Full Stack Developer': [
    'React', 'Node.js', 'Express', 'MongoDB', 'JavaScript', 'HTML', 'CSS', 'Git', 'REST API'
  ],
  'Frontend Developer': [
    'React', 'JavaScript', 'HTML', 'CSS', 'TypeScript', 'Tailwind CSS', 'Git'
  ],
  'Backend Developer': [
    'Node.js', 'Express', 'MongoDB', 'SQL', 'PostgreSQL', 'REST API', 'Docker', 'Git'
  ],
  'Data Scientist': [
    'Python', 'SQL', 'Machine Learning', 'Pandas', 'NumPy', 'Scikit-Learn', 'Data Visualization'
  ],
  'DevOps Engineer': [
    'Docker', 'Kubernetes', 'CI/CD', 'AWS', 'Linux', 'Terraform', 'Git'
  ]
};

export const ROLE_ROADMAPS = {
  'Full Stack Developer': [
    {
      id: 'fs-1',
      title: 'Frontend Foundations & UI',
      description: 'Master core client-side web technologies, semantic markup, responsive design, and component-driven architecture.',
      skills: ['HTML', 'CSS', 'JavaScript', 'React'],
      duration: '4-6 weeks'
    },
    {
      id: 'fs-2',
      title: 'Backend Development & APIs',
      description: 'Build server-side logic, routing architectures, middleware pipelines, and secure RESTful endpoints.',
      skills: ['Node.js', 'Express', 'REST API'],
      duration: '4-5 weeks'
    },
    {
      id: 'fs-3',
      title: 'Database Management',
      description: 'Design schemas, model document relationships, write indexing strategies, and handle data persistence with Mongoose.',
      skills: ['MongoDB'],
      duration: '3-4 weeks'
    },
    {
      id: 'fs-4',
      title: 'Version Control & Deployment',
      description: 'Manage collaborative codebases using Git workflows, branching strategies, and CI/CD cloud deployment.',
      skills: ['Git'],
      duration: '2-3 weeks'
    }
  ],
  'Frontend Developer': [
    {
      id: 'fe-1',
      title: 'Web Standards & Modern JavaScript',
      description: 'Deep dive into DOM manipulation, ES6+ features, asynchronous programming, and semantic styling.',
      skills: ['HTML', 'CSS', 'JavaScript'],
      duration: '4 weeks'
    },
    {
      id: 'fe-2',
      title: 'Component Architecture & State Management',
      description: 'Build modular, reactive applications using React, hooks, contexts, and modern UI libraries.',
      skills: ['React', 'Tailwind CSS'],
      duration: '4-5 weeks'
    },
    {
      id: 'fe-3',
      title: 'Type Safety & Collaboration',
      description: 'Ensure runtime stability and code maintainability with TypeScript and version control workflows.',
      skills: ['TypeScript', 'Git'],
      duration: '3-4 weeks'
    }
  ],
  'Backend Developer': [
    {
      id: 'be-1',
      title: 'Server Runtime & REST Architecture',
      description: 'Build scalable event-driven servers, handle HTTP requests, routing, and clean API design.',
      skills: ['Node.js', 'Express', 'REST API'],
      duration: '4-5 weeks'
    },
    {
      id: 'be-2',
      title: 'Persistence & Data Modeling',
      description: 'Master relational data normalization, NoSQL document modeling, indexing, and transactional integrity.',
      skills: ['MongoDB', 'SQL', 'PostgreSQL'],
      duration: '5-6 weeks'
    },
    {
      id: 'be-3',
      title: 'Containerization & Code Management',
      description: 'Package backend microservices with Docker and implement robust Git team collaboration.',
      skills: ['Docker', 'Git'],
      duration: '3 weeks'
    }
  ],
  'Data Scientist': [
    {
      id: 'ds-1',
      title: 'Core Programming & Data Querying',
      description: 'Program statistical pipelines and extract datasets using SQL and modern Python idioms.',
      skills: ['Python', 'SQL'],
      duration: '4-5 weeks'
    },
    {
      id: 'ds-2',
      title: 'Data Wrangling & Exploratory Analysis',
      description: 'Transform messy raw data into structured tensors and generate rich visual insights.',
      skills: ['Pandas', 'NumPy', 'Data Visualization'],
      duration: '4 weeks'
    },
    {
      id: 'ds-3',
      title: 'Predictive Modeling & Machine Learning',
      description: 'Train, validate, tune, and evaluate classical ML algorithms on real-world datasets.',
      skills: ['Machine Learning', 'Scikit-Learn'],
      duration: '6 weeks'
    }
  ],
  'DevOps Engineer': [
    {
      id: 'do-1',
      title: 'System Foundations & Version Control',
      description: 'Command line scripting, shell automation, Linux systems administration, and Git repository management.',
      skills: ['Linux', 'Git'],
      duration: '3-4 weeks'
    },
    {
      id: 'do-2',
      title: 'Containerization & Orchestration',
      description: 'Build reproducible container images and orchestrate multi-node clusters at scale.',
      skills: ['Docker', 'Kubernetes'],
      duration: '5-6 weeks'
    },
    {
      id: 'do-3',
      title: 'Cloud Infrastructure & Automation',
      description: 'Automate declarative infrastructure and continuous delivery pipelines on modern cloud environments.',
      skills: ['AWS', 'Terraform', 'CI/CD'],
      duration: '5-6 weeks'
    }
  ]
};

export const ROLE_MARKET_DATA = {
  'Full Stack Developer': {
    marketDemand: 'Very High',
    expectedSalaryRange: '$75,000 - $135,000',
    industryGrowth: '+22% (Projected over 5 years)',
    topIndustries: ['Fintech & Banking', 'SaaS & Enterprise Cloud', 'E-Commerce', 'HealthTech'],
    summaryTrends: 'Full stack developers who combine strong frontend UX sensibilities with solid API and cloud database skills remain in top tier demand across both agile startups and Fortune 500 teams.'
  },
  'Frontend Developer': {
    marketDemand: 'High',
    expectedSalaryRange: '$70,000 - $125,000',
    industryGrowth: '+18% (Projected over 5 years)',
    topIndustries: ['Consumer Web & Mobile', 'Digital Media', 'Marketing Tech', 'Design Agencies'],
    summaryTrends: 'Specialists in responsive web applications, design systems, web performance, and state management continue to lead client-side innovations.'
  },
  'Backend Developer': {
    marketDemand: 'Very High',
    expectedSalaryRange: '$80,000 - $140,000',
    industryGrowth: '+21% (Projected over 5 years)',
    topIndustries: ['Cloud Infrastructure', 'Payments & Fintech', 'Cybersecurity', 'Streaming Services'],
    summaryTrends: 'High throughput, low latency architecture, distributed transactions, and microservice containerization are driving aggressive hiring.'
  },
  'Data Scientist': {
    marketDemand: 'High',
    expectedSalaryRange: '$85,000 - $145,000',
    industryGrowth: '+28% (Projected over 5 years)',
    topIndustries: ['AI Research Labs', 'Finance & Quantitative Trading', 'Biotech', 'Retail Analytics'],
    summaryTrends: 'The explosive growth in LLMs and enterprise AI makes foundational data engineering and statistical modeling more critical than ever.'
  },
  'DevOps Engineer': {
    marketDemand: 'Very High',
    expectedSalaryRange: '$90,000 - $150,000',
    industryGrowth: '+25% (Projected over 5 years)',
    topIndustries: ['Enterprise IT', 'Cloud Providers', 'Defense & Aerospace', 'Telecom'],
    summaryTrends: 'Organizations prioritize reliability engineering, automated security guardrails (DevSecOps), and cost-optimized multi-cloud orchestration.'
  }
};

export const ASSESSMENT_QUESTIONS = {
  'Full Stack Developer': [
    {
      id: 'fs-q1',
      question: 'In React, what is the primary benefit of using the useEffect hook with an empty dependency array []?',
      options: [
        'It causes the effect to run on every state change',
        'It runs the effect exactly once after the initial render (mount)',
        'It prevents the component from re-rendering forever',
        'It synchronously blocks the browser from painting'
      ],
      correctAnswer: 1,
      skill: 'React',
      difficulty: 'Intermediate'
    },
    {
      id: 'fs-q2',
      question: 'Which HTTP method is specifically intended to be idempotent and used to replace an entire resource at a URI?',
      options: ['POST', 'PATCH', 'PUT', 'DELETE'],
      correctAnswer: 2,
      skill: 'REST API',
      difficulty: 'Beginner'
    },
    {
      id: 'fs-q3',
      question: 'How does Node.js handle non-blocking asynchronous I/O operations despite having a single main execution thread?',
      options: [
        'Through an underlying thread pool and the Libuv Event Loop',
        'By creating a new operating system process for each incoming request',
        'By running multiple V8 engines concurrently in parallel',
        'Node.js is actually multi-threaded in JavaScript code execution'
      ],
      correctAnswer: 0,
      skill: 'Node.js',
      difficulty: 'Intermediate'
    },
    {
      id: 'fs-q4',
      question: 'In MongoDB, which aggregation stage is used to filter documents in a manner similar to find()?',
      options: ['$project', '$group', '$match', '$lookup'],
      correctAnswer: 2,
      skill: 'MongoDB',
      difficulty: 'Intermediate'
    },
    {
      id: 'fs-q5',
      question: 'In Express.js, what must a middleware function call to pass control to the next handler in the stack?',
      options: ['return true', 'next()', 'response.send()', 'this.continue()'],
      correctAnswer: 1,
      skill: 'Express',
      difficulty: 'Beginner'
    },
    {
      id: 'fs-q6',
      question: 'What is the purpose of the JavaScript Promise.all() method?',
      options: [
        'It runs promises sequentially one after another',
        'It returns a single Promise that fulfills when all of the input promises have fulfilled',
        'It returns the first resolved promise and cancels the remaining ones',
        'It catches errors and converts all rejected promises to null'
      ],
      correctAnswer: 1,
      skill: 'JavaScript',
      difficulty: 'Intermediate'
    }
  ],
  'Frontend Developer': [
    {
      id: 'fe-q1',
      question: 'What is the difference between CSS Flexbox and CSS Grid layout models?',
      options: [
        'Flexbox is designed for 1-dimensional layouts (rows or columns), while Grid is designed for 2-dimensional layouts (rows and columns simultaneously)',
        'Grid only works with images, while Flexbox works with text',
        'Flexbox requires JavaScript polyfills in modern browsers',
        'Grid is exclusively used for responsive breakpoints'
      ],
      correctAnswer: 0,
      skill: 'CSS',
      difficulty: 'Beginner'
    },
    {
      id: 'fe-q2',
      question: 'In React, why should you avoid using array indices as "key" props for dynamic list items?',
      options: [
        'React throws a compile error if an index is used',
        'Reordering or deleting items can cause component state bugs and inefficient re-renders',
        'Indices consume 10x more memory in the Virtual DOM',
        'Keys must always be UUID version 4 strings'
      ],
      correctAnswer: 1,
      skill: 'React',
      difficulty: 'Intermediate'
    },
    {
      id: 'fe-q3',
      question: 'In TypeScript, what is the key difference between an "interface" and a "type" alias?',
      options: [
        'Interfaces can be merged through declaration merging, whereas type aliases cannot',
        'Types can only describe primitive strings and numbers',
        'Interfaces are compiled into JavaScript runtime objects',
        'There is zero difference; they are 100% interchangeable in all situations'
      ],
      correctAnswer: 0,
      skill: 'TypeScript',
      difficulty: 'Intermediate'
    },
    {
      id: 'fe-q4',
      question: 'What does the Git command `git merge --squash feature-branch` accomplish?',
      options: [
        'Deletes the feature branch and discards all changes',
        'Combines all commits from the feature branch into a single staged change on the current branch',
        'Pushes the feature branch directly to origin main without review',
        'Reverts the last 5 commits on main'
      ],
      correctAnswer: 1,
      skill: 'Git',
      difficulty: 'Intermediate'
    }
  ],
  'Backend Developer': [
    {
      id: 'be-q1',
      question: 'What is an ACID transaction in database engineering?',
      options: [
        'Atomicity, Consistency, Isolation, Durability guarantees ensuring reliable transactions',
        'Asynchronous, Cached, Indexed, Distributed query architectures',
        'A protocol for encrypting database backups at rest',
        'Automated Cloud Infrastructure Deployment'
      ],
      correctAnswer: 0,
      skill: 'SQL',
      difficulty: 'Intermediate'
    },
    {
      id: 'be-q2',
      question: 'In Docker, what is the role of a multi-stage build?',
      options: [
        'To allow multiple containers to share the exact same network IP',
        'To create smaller, production-ready container images by separating the build environment from the runtime container',
        'To run containers on multiple operating systems simultaneously',
        'To automatically publish images to Docker Hub on git push'
      ],
      correctAnswer: 1,
      skill: 'Docker',
      difficulty: 'Intermediate'
    },
    {
      id: 'be-q3',
      question: 'Which index type in MongoDB or PostgreSQL is most optimal for range queries (e.g., age > 21 and age < 65)?',
      options: ['Hash index', 'B-Tree index', 'Geospatial 2dsphere index', 'Text inverted index'],
      correctAnswer: 1,
      skill: 'PostgreSQL',
      difficulty: 'Intermediate'
    },
    {
      id: 'be-q4',
      question: 'What is the purpose of rate limiting middleware in an Express.js production API?',
      options: [
        'To prevent brute-force attacks, DDoS, and API abuse by capping requests per client IP within a window',
        'To throttle database writes during scheduled backups',
        'To automatically compress JSON responses with gzip',
        'To encrypt payload parameters with AES-256'
      ],
      correctAnswer: 0,
      skill: 'Express',
      difficulty: 'Beginner'
    }
  ],
  'Data Scientist': [
    {
      id: 'ds-q1',
      question: 'In Pandas, what does the `df.groupby(\'department\')[\'salary\'].transform(\'mean\')` operation return?',
      options: [
        'A collapsed dataframe with one row per department',
        'A Series with the same index and length as the original dataframe containing the group mean aligned to each row',
        'A Boolean mask indicating above-average salaries',
        'A histogram chart object'
      ],
      correctAnswer: 1,
      skill: 'Pandas',
      difficulty: 'Intermediate'
    },
    {
      id: 'ds-q2',
      question: 'What is the fundamental difference between L1 regularization (Lasso) and L2 regularization (Ridge)?',
      options: [
        'L1 penalizes absolute weights and can drive feature coefficients exactly to zero (sparsity), whereas L2 penalizes squared weights',
        'L2 only works with classification, while L1 only works with regression',
        'L1 cannot be used with gradient descent',
        'Ridge regression eliminates correlated features automatically'
      ],
      correctAnswer: 0,
      skill: 'Machine Learning',
      difficulty: 'Intermediate'
    },
    {
      id: 'ds-q3',
      question: 'Why is NumPy array computation significantly faster than iterating over native Python lists?',
      options: [
        'NumPy arrays are stored in contiguous memory blocks and leverage vectorized C/BLAS routines',
        'NumPy converts all Python code to assembly at runtime',
        'Python lists do not support numerical data types',
        'NumPy arrays automatically execute on the GPU by default'
      ],
      correctAnswer: 0,
      skill: 'NumPy',
      difficulty: 'Intermediate'
    }
  ],
  'DevOps Engineer': [
    {
      id: 'do-q1',
      question: 'In Kubernetes, what is the function of an Ingress Controller?',
      options: [
        'It routes external HTTP/S traffic to internal cluster services based on hostnames or path rules',
        'It compiles Docker containers inside worker nodes',
        'It restarts failing pods when liveness probes fail',
        'It manages persistent disk snapshots on cloud storage'
      ],
      correctAnswer: 0,
      skill: 'Kubernetes',
      difficulty: 'Intermediate'
    },
    {
      id: 'do-q2',
      question: 'In Terraform, what is the primary purpose of the state file (terraform.tfstate)?',
      options: [
        'To map your real-world cloud resources to your configuration files and keep track of metadata',
        'To store your AWS secret access keys unencrypted for CI/CD',
        'To compile HCL code into Go binary executables',
        'To generate documentation for GitHub pull requests'
      ],
      correctAnswer: 0,
      skill: 'Terraform',
      difficulty: 'Intermediate'
    },
    {
      id: 'do-q3',
      question: 'What is the main principle of Continuous Delivery (CD)?',
      options: [
        'Code changes are automatically built, tested, and prepared for release to production in a reliable, repeatable manner',
        'Developers only push code to production once per quarter',
        'All automated testing is replaced by manual QA testers',
        'Servers are patched without rebooting'
      ],
      correctAnswer: 0,
      skill: 'CI/CD',
      difficulty: 'Beginner'
    }
  ]
};

export const LEARNING_CATALOG = {
  'React': {
    whyItMatters: 'React is the industry benchmark for client-side component architecture, powering the majority of modern frontend ecosystems and full-stack frameworks.',
    whatToLearn: 'Component lifecycle, hooks (useState, useEffect, useMemo, useCallback), context API, custom hooks, and virtual DOM performance tuning.',
    suggestedProject: 'Interactive Real-Time Kanban Board with drag-and-drop, state persistence, and modular component hierarchy.',
    suggestedLearningDirection: 'Complete official React 19 documentation tutorials followed by building production-grade dashboards.'
  },
  'Node.js': {
    whyItMatters: 'Node.js enables high-concurrency, event-driven backend services using JavaScript, unifying the development stack across client and server.',
    whatToLearn: 'Event Loop architecture, Streams and Buffers, child processes, filesystem I/O, and asynchronous event emitter patterns.',
    suggestedProject: 'High-throughput File Processing and Video Metadata API with streaming data pipelines.',
    suggestedLearningDirection: 'Master Node.js core modules, libuv mechanics, and non-blocking I/O programming.'
  },
  'Express': {
    whyItMatters: 'Express is the minimal, unopinionated routing foundation powering millions of Node.js microservices and RESTful web servers.',
    whatToLearn: 'Middleware execution chains, dynamic routing, parameter sanitization, error-handling middleware, and JWT authentication.',
    suggestedProject: 'Multi-Tenant Authentication and API Gateway with rate limiting, logging, and role-based permissions.',
    suggestedLearningDirection: 'Study Express middleware patterns, CORS headers, security headers (Helmet), and error architectures.'
  },
  'MongoDB': {
    whyItMatters: 'Flexible schema document modeling allows fast iteration and natural JSON mapping for modern web application data layers.',
    whatToLearn: 'Document modeling, Mongoose schemas and hooks, compound indexes, aggregation pipelines ($lookup, $match, $group), and replica sets.',
    suggestedProject: 'E-commerce Product Catalog with faceted search, geospatial location indexing, and review aggregations.',
    suggestedLearningDirection: 'Practice complex aggregation pipeline queries and compound index performance optimization in MongoDB Compass.'
  },
  'JavaScript': {
    whyItMatters: 'JavaScript is the fundamental language of the web, executing everywhere from browser engines to edge compute nodes.',
    whatToLearn: 'Closures, prototype inheritance, event loop and microtask queue, async/await, ES6+ modules, and destructuring.',
    suggestedProject: 'Custom Event Emitter & Lightweight Reactive State Store without third-party dependencies.',
    suggestedLearningDirection: 'Deep dive into "You Don\'t Know JS" and practice advanced algorithmic data structures in JS.'
  },
  'HTML': {
    whyItMatters: 'Semantic HTML is the backbone of accessible, SEO-friendly, and structurally sound web applications.',
    whatToLearn: 'Semantic tags (<main>, <article>, <nav>), accessibility ARIA attributes, forms validation, and responsive meta tags.',
    suggestedProject: 'Fully Accessible Accessible WCAG AAA Compliant Web Portal with keyboard navigation and screen reader support.',
    suggestedLearningDirection: 'Audit web accessibility standards with Lighthouse and WebAIM guidelines.'
  },
  'CSS': {
    whyItMatters: 'Modern CSS provides expressive styling, layout control, and hardware-accelerated animations for polished user experiences.',
    whatToLearn: 'Flexbox, CSS Grid, custom properties (variables), transitions, keyframe animations, media queries, and container queries.',
    suggestedProject: 'Futuristic Dark-Mode Glassmorphism Component Library with responsive layouts and fluid typography.',
    suggestedLearningDirection: 'Master modern CSS layout algorithms and avoid reliance on heavy UI framework wrappers.'
  },
  'Git': {
    whyItMatters: 'Git is the universal standard for version control, collaborative development, code review, and CI/CD triggers.',
    whatToLearn: 'Branching models, interactive rebasing, merge conflict resolution, git cherry-pick, stash, and semantic commit tagging.',
    suggestedProject: 'Open-Source Contribution Repository with feature branch protections, PR templates, and GitHub Actions.',
    suggestedLearningDirection: 'Practice complex git rebasing and branching workflows through command line simulation.'
  },
  'REST API': {
    whyItMatters: 'RESTful contracts define predictable, standardized interfaces for client-server communication and third-party integrations.',
    whatToLearn: 'HTTP status codes (2xx, 4xx, 5xx), idempotent methods, resource nesting, pagination, filtering, and OpenAPI documentation.',
    suggestedProject: 'Public Developer API for a Bookstore or Task Engine with rate limits, pagination, and OpenAPI spec docs.',
    suggestedLearningDirection: 'Design API contracts first, enforce proper HTTP response codes, and practice testing endpoints with Postman or Curl.'
  },
  'Docker': {
    whyItMatters: 'Containers eliminate the "works on my machine" dilemma and form the baseline unit of modern cloud infrastructure.',
    whatToLearn: 'Dockerfiles, layer caching, multi-stage builds, networking, volumes, and Docker Compose multi-container services.',
    suggestedProject: 'Containerized Full-Stack MERN Application with persistent volumes and health check routines.',
    suggestedLearningDirection: 'Containerize local applications and optimize Docker images down to alpine-based minimal sizes.'
  },
  'SQL': {
    whyItMatters: 'Relational data modeling and structured query language are foundational for transactional data integrity.',
    whatToLearn: 'Joins (INNER, LEFT, FULL), subqueries, window functions, indexing, normal forms (1NF-3NF), and ACID transactions.',
    suggestedProject: 'Financial Ledger & Analytics Database with audit logs, foreign keys, and roll-up reporting queries.',
    suggestedLearningDirection: 'Solve intermediate to advanced SQL problems on platforms like LeetCode and HackerRank.'
  },
  'Python': {
    whyItMatters: 'Python is the premier language for artificial intelligence, machine learning, data engineering, and automation scripting.',
    whatToLearn: 'Generators, decorators, list comprehensions, object-oriented design, virtual environments, and scientific library ecosystems.',
    suggestedProject: 'Automated Web Scraper and Analytical Report Generator for job board trends.',
    suggestedLearningDirection: 'Practice idiomatic Python (PEP 8) and explore foundational data analysis libraries.'
  }
};

export const MOCK_INTERVIEW_QUESTIONS = {
  'Full Stack Developer': [
    'Can you explain the end-to-end lifecycle of a web request when a user visits a React frontend that communicates with an Express and MongoDB backend?',
    'How do you manage authentication and authorization in a MERN stack application, and what are the security considerations between storing JWTs in cookies versus localStorage?',
    'Suppose an endpoint in your Express application is taking 5+ seconds to query a MongoDB collection. How would you diagnose, profile, and optimize the performance?',
    'What is the difference between client-side rendering (CSR) and server-side rendering (SSR), and how do you decide which architecture to choose for a given project?',
    'How do you handle error boundaries and unhandled promise rejections across both your React UI and Node.js server to ensure a resilient user experience?'
  ],
  'Frontend Developer': [
    'How does the browser rendering engine work, specifically regarding the DOM, CSSOM, Render Tree, Layout (reflow), and Painting phases?',
    'Explain the concept of Web Accessibility (a11y) and how you ensure semantic structure, ARIA landmarks, and keyboard navigability in complex web applications.',
    'How do you prevent unnecessary re-renders in a large-scale React application, and when should you use useMemo or useCallback?',
    'What strategies do you employ to optimize Core Web Vitals, specifically Largest Contentful Paint (LCP) and Cumulative Layout Shift (CLS)?'
  ],
  'Backend Developer': [
    'How does Node.js manage concurrency with its single-threaded event loop, and when should you offload tasks to Worker Threads or external queues?',
    'Explain database normalization versus denormalization. In what scenarios would you intentionally denormalize data in a NoSQL database like MongoDB?',
    'How would you design a scalable rate limiter for a public API that supports thousands of concurrent requests across multiple server instances?',
    'What are the advantages and trade-offs of microservices architecture compared to a well-structured modular monolith?'
  ],
  'Data Scientist': [
    'How do you detect and mitigate multicollinearity in a regression dataset, and what metrics would you calculate?',
    'Explain the bias-variance tradeoff and how regularization techniques (L1/L2) impact model generalization.',
    'How do you evaluate an imbalanced classification model where accuracy gives a deceptive score?'
  ],
  'DevOps Engineer': [
    'Can you explain how a Kubernetes Pod communicates with another Pod across different nodes in a cluster?',
    'What are the best practices for structuring CI/CD pipelines to guarantee zero-downtime blue/green or canary deployments?',
    'How do you secure secrets and sensitive credentials in containerized cloud environments using tools like HashiCorp Vault or AWS Secrets Manager?'
  ]
};
