import { Brain, Code, Cloud, Terminal, Cpu } from "lucide-react";

export const SYLLABUS_NOTE =
  "Total 12 weeks: Weeks 1-8 focus on core lessons. Weeks 9-12 are dedicated entirely to Live Capstone Project execution.";

export const internshipTracks = [
  {
    id: 1,
    slug: "ai-machine-learning",
    title: "Artificial Intelligence & Machine Learning",
    category: "AI & Machine Learning",
    icon: Brain,
    iconColor: "text-purple-600 bg-purple-50 border-purple-100",
    desc: "Master neural networks, predictive modeling, deep learning architectures, and deploy real-world AI/ML production pipelines.",
    highlights: [
      "Live classes + Recordings",
      "All program notes & recordings",
      "E-Book included",
      "Free GenAI & Prompt Engineering workshop",
      "Free Reznio job-search platform access",
    ],
    formUrl: "https://forms.gle/4JeqCsAveQRqWWq48",
    coverImage: "/Image/ai_machine_learning_banner.png",
    curriculum: [
      // Weeks 1-8: Teaching
      { week: "Week 1", topic: "AI & ML Foundations: Problem framing, AI vs ML vs DL, supervised vs unsupervised learning, and ML project lifecycle" },
      { week: "Week 2", topic: "Python for ML: NumPy, Pandas, data loading, exploratory analysis, and feature preparation" },
      { week: "Week 3", topic: "Math for ML: Linear algebra essentials, probability, cost functions, and gradient descent intuition" },
      { week: "Week 4", topic: "Supervised Learning: Linear/logistic regression, classification metrics, precision, recall, F1, and ROC-AUC" },
      { week: "Week 5", topic: "Classical ML Models: Decision trees, Random Forests, SVM, k-NN, and model comparison workflows" },
      { week: "Week 6", topic: "Unsupervised Learning: K-Means, hierarchical clustering, PCA, and dimensionality reduction" },
      { week: "Week 7", topic: "Neural Networks & Deep Learning: MLP architectures, CNNs, transfer learning, and vision basics" },
      { week: "Week 8", topic: "NLP, Generative AI & MLOps Basics: Embeddings, LLM APIs, model serialization, and inference pipelines" },
      // Weeks 9-12: Project
      { week: "Week 9", topic: "Capstone Kickoff: Problem selection, dataset strategy, baseline model, and milestone plan" },
      { week: "Week 10", topic: "Capstone Build: Feature engineering, model training, hyperparameter tuning, and experiment tracking" },
      { week: "Week 11", topic: "Capstone Deploy: Package model as a service, validation checks, demo environment, and performance review" },
      { week: "Week 12", topic: "Capstone Showcase: Live demo, technical pitch, documentation, and certificate readiness" },
    ],
    tools: ["Python", "TensorFlow/PyTorch", "Scikit-Learn", "Keras", "Pandas", "NumPy", "OpenCV", "Hugging Face"],
  },
  {
    id: 2,
    slug: "full-stack-ai",
    title: "Full Stack Development with AI",
    category: "Modern Web & AI",
    icon: Code,
    iconColor: "text-blue-600 bg-blue-50 border-blue-100",
    desc: "Ship production-ready web apps with React, Next.js, TypeScript, and modern APIs - then wire in AI features like chat, search, and automation.",
    highlights: [
      "Live classes + Recordings",
      "All program notes & recordings",
      "E-Book included",
      "Free GenAI & Prompt Engineering workshop",
      "Free Reznio job-search platform access",
    ],
    formUrl: "https://forms.gle/4JeqCsAveQRqWWq48",
    coverImage: "/Image/full_stack_dev_banner.png",
    curriculum: [
      { week: "Week 1", topic: "Modern Web Foundations: HTML/CSS systems, responsive layouts, Git/GitHub workflow, and project setup" },
      { week: "Week 2", topic: "React Essentials: Components, props, state, hooks, forms, and reusable UI patterns" },
      { week: "Week 3", topic: "Next.js & TypeScript: App Router basics, typed components, routing, and data fetching" },
      { week: "Week 4", topic: "Frontend Systems: Auth UI flows, protected routes, API clients, and loading/error states" },
      { week: "Week 5", topic: "Backend APIs: Node.js services, REST design, validation, middleware, and error handling" },
      { week: "Week 6", topic: "Databases & Auth: PostgreSQL/MongoDB modeling, CRUD, JWT/session auth, and role-based access" },
      { week: "Week 7", topic: "AI Product Features: LLM APIs, prompt patterns, chat UIs, embeddings, and simple RAG flows" },
      { week: "Week 8", topic: "Full-Stack Delivery: Integration, testing basics, CI intro, Docker basics, and secure secrets handling" },
      { week: "Week 9", topic: "Capstone Kickoff: Product scope, user stories, architecture diagram, and MVP milestone plan" },
      { week: "Week 10", topic: "Capstone Build: Core screens, APIs, database schema, and AI feature vertical slice" },
      { week: "Week 11", topic: "Capstone Harden & Deploy: Auth edge cases, hosting, production DB, and smoke tests" },
      { week: "Week 12", topic: "Capstone Showcase: Live product demo, technical Q&A, docs, and certificate readiness" },
    ],
    tools: ["React", "Next.js", "TypeScript", "Node.js", "PostgreSQL/MongoDB", "AI APIs", "Docker", "GitHub"],
  },
  {
    id: 3,
    slug: "salesforce-cloud-ai",
    title: "Salesforce Cloud with AI",
    category: "Salesforce & AI",
    icon: Cloud,
    iconColor: "text-cyan-600 bg-cyan-50 border-cyan-100",
    desc: "Learn Salesforce administration, developer flows, Apex programming, and integrating Einstein AI tools.",
    highlights: [
      "Live classes + Recordings",
      "All program notes & recordings",
      "E-Book included",
      "Free GenAI & Prompt Engineering workshop",
      "Free Reznio job-search platform access",
    ],
    formUrl: "https://forms.gle/4JeqCsAveQRqWWq48",
    coverImage: "/Image/salesforce_cloud_ai_banner.png",
    curriculum: [
      { week: "Week 1", topic: "Salesforce CRM Foundations: Org setup, objects, fields, page layouts, and navigation basics" },
      { week: "Week 2", topic: "Admin Essentials: Validation rules, workflows, Process Builder/Flow, and security profiles" },
      { week: "Week 3", topic: "Data Model & Reporting: Relationships, record types, reports, dashboards, and data import/export" },
      { week: "Week 4", topic: "Lightning Experience: App builder, Lightning components overview, and UI customization" },
      { week: "Week 5", topic: "Apex Fundamentals: Classes, triggers, SOQL/SOSL, governor limits, and debugging" },
      { week: "Week 6", topic: "Apex Advanced: Batch Apex, async patterns, test classes, and deployment readiness" },
      { week: "Week 7", topic: "Einstein AI & Automation: Einstein features, AI-assisted insights, and intelligent service workflows" },
      { week: "Week 8", topic: "Integration Basics: APIs, connected apps, external services, and secure integration patterns" },
      { week: "Week 9", topic: "Capstone Kickoff: Business use case, org design, automation map, and milestone plan" },
      { week: "Week 10", topic: "Capstone Build: Custom objects, Apex/Flow automation, and Einstein-assisted service flows" },
      { week: "Week 11", topic: "Capstone Test & Harden: Test coverage, UAT scenarios, data quality checks, and docs" },
      { week: "Week 12", topic: "Capstone Showcase: Live Salesforce demo, stakeholder pitch, and certificate readiness" },
    ],
    tools: ["Salesforce", "Apex", "Einstein AI", "SOQL", "Lightning Web Components", "Flow"],
  },
  {
    id: 5,
    slug: "python-data-science-ml",
    title: "Python for Data Science & Machine Learning",
    category: "Data Science & ML",
    icon: Terminal,
    iconColor: "text-amber-600 bg-amber-50 border-amber-100",
    desc: "Build end-to-end data workflows with Python, NumPy, Pandas, SQL, and Scikit-Learn - from EDA and feature engineering to trained, validated ML models.",
    highlights: [
      "Live classes + Recordings",
      "All program notes & recordings",
      "E-Book included",
      "Free GenAI & Prompt Engineering workshop",
      "Free Reznio job-search platform access",
    ],
    formUrl: "https://forms.gle/4JeqCsAveQRqWWq48",
    coverImage: "/Image/python_developer_ai_banner.png",
    curriculum: [
      { week: "Week 1", topic: "Python Fundamentals: Syntax, comprehensions, functions, error handling, and file I/O" },
      { week: "Week 2", topic: "NumPy & Pandas: Arrays, DataFrames, indexing, filtering, and data ingestion" },
      { week: "Week 3", topic: "Data Wrangling: Missing data, imputation, duplicates, type casting, and string operations" },
      { week: "Week 4", topic: "Visualization & EDA: Matplotlib, Seaborn, distributions, heatmaps, skewness, and outliers" },
      { week: "Week 5", topic: "Feature Engineering: Scaling, encoding, transformations, and feature matrix design" },
      { week: "Week 6", topic: "Stats & SQL: Probability basics, distributions, SELECT/joins/aggregations, and Pandas-SQL" },
      { week: "Week 7", topic: "Scikit-Learn Core: Train-test split, linear/logistic regression, metrics, and fit/predict workflows" },
      { week: "Week 8", topic: "Classical ML & Tuning: Trees, Random Forests, SVM, cross-validation, and GridSearchCV" },
      { week: "Week 9", topic: "Capstone Kickoff: Dataset selection, problem statement, baseline profiling, and milestone plan" },
      { week: "Week 10", topic: "Capstone Build: EDA pipeline, feature engineering, model training, and evaluation loops" },
      { week: "Week 11", topic: "Capstone Validate: Model comparison, error analysis, pipeline packaging, and dry-run pitch" },
      { week: "Week 12", topic: "Capstone Showcase: Live prediction demo, technical pitch, docs, and certificate readiness" },
    ],
    tools: ["Python", "NumPy", "Pandas", "Matplotlib", "Seaborn", "Scikit-Learn", "SQL", "Jupyter"],
  },
  {
    id: 8,
    slug: "cloud-computing-devops",
    title: "Cloud Computing & DevOps",
    category: "Infrastructure",
    icon: Cpu,
    iconColor: "text-sky-600 bg-sky-50 border-sky-100",
    desc: "Understand AWS/Azure operations, docker container deployment, and building automated CI/CD pipelines.",
    highlights: [
      "Live classes + Recordings",
      "All program notes & recordings",
      "E-Book included",
      "Free GenAI & Prompt Engineering workshop",
      "Free Reznio job-search platform access",
    ],
    formUrl: "https://forms.gle/4JeqCsAveQRqWWq48",
    coverImage: "/Image/cloud_devops_banner.png",
    curriculum: [
      { week: "Week 1", topic: "Cloud Foundations: IaaS/PaaS/SaaS, regions/AZs, IAM basics, billing awareness, and shared responsibility" },
      { week: "Week 2", topic: "Compute & Networking: VMs/EC2, VPC/subnets, security groups, load balancers, and secure access" },
      { week: "Week 3", topic: "Storage & Databases: Object storage, block storage, managed DB basics, backups, and access policies" },
      { week: "Week 4", topic: "Linux & Automation: Shell essentials, package management, services, and infrastructure scripting" },
      { week: "Week 5", topic: "Containers: Docker images, Dockerfiles, volumes, networking, and multi-container packaging" },
      { week: "Week 6", topic: "Kubernetes Intro: Pods, services, deployments, kubectl workflows, and health checks" },
      { week: "Week 7", topic: "CI/CD Pipelines: GitHub Actions/Jenkins, build-test-deploy stages, and environment promotion" },
      { week: "Week 8", topic: "IaC & Observability: Terraform basics, logging/metrics/alerts, secrets, and least-privilege IAM" },
      { week: "Week 9", topic: "Capstone Kickoff: Architecture design for an auto-scaling app stack with CI/CD and monitoring plan" },
      { week: "Week 10", topic: "Capstone Build: Provision cloud resources, containerize services, and wire the deployment pipeline" },
      { week: "Week 11", topic: "Capstone Scale & Harden: Load balancing, autoscaling, rollback strategy, and security review" },
      { week: "Week 12", topic: "Capstone Showcase: Live deploy demo, failure simulation, docs, and certificate readiness" },
    ],
    tools: ["AWS", "Azure", "Docker", "Kubernetes", "Jenkins", "GitHub Actions", "Terraform", "Linux"],
  },
];

export function getTrackBySlug(slug) {
  return internshipTracks.find((track) => track.slug === slug) || null;
}

export function getTrackStats(title) {
  if (title.includes("Artificial Intelligence") && title.includes("Machine Learning")) {
    return { jobs: "35K+", market: "$180 Billion", salary: "₹8 - 18 Lakh" };
  }
  if (title.includes("Full Stack")) {
    return { jobs: "45K+", market: "$120 Billion", salary: "₹6 - 14 Lakh" };
  }
  if (title.includes("Salesforce")) {
    return { jobs: "20K+", market: "$85 Billion", salary: "₹7 - 15 Lakh" };
  }
  if (title.includes("Python")) {
    return { jobs: "30K+", market: "$98 Billion", salary: "₹5 - 12 Lakh" };
  }
  if (title.includes("Cloud") || title.includes("DevOps")) {
    return { jobs: "28K+", market: "$150 Billion", salary: "₹7 - 16 Lakh" };
  }
  return { jobs: "22K+", market: "$60 Billion", salary: "₹5 - 10 Lakh" };
}
