const INTERNSHIP_CATALOG = {
  "ai-machine-learning": {
    slug: "ai-machine-learning",
    title: "Artificial Intelligence & Machine Learning",
    category: "AI & Machine Learning",
    coverImage: "/Image/ai_machine_learning_banner.png",
  },
  "full-stack-ai": {
    slug: "full-stack-ai",
    title: "Full Stack Development with AI",
    category: "Full Stack",
    coverImage: "/Image/full_stack_banner.png",
  },
  "salesforce-cloud-ai": {
    slug: "salesforce-cloud-ai",
    title: "Salesforce Cloud with AI",
    category: "Salesforce & Cloud",
    coverImage: "/Image/salesforce_banner.png",
  },
  "python-data-science-ml": {
    slug: "python-data-science-ml",
    title: "Python for Data Science & Machine Learning",
    category: "Data Science",
    coverImage: "/Image/python_data_science_banner.png",
  },
  "cloud-computing-devops": {
    slug: "cloud-computing-devops",
    title: "Cloud Computing & DevOps",
    category: "Cloud & DevOps",
    coverImage: "/Image/cloud_devops_banner.png",
  },
};

function getInternshipBySlug(slug) {
  return INTERNSHIP_CATALOG[slug] || null;
}

module.exports = { INTERNSHIP_CATALOG, getInternshipBySlug };
