export type Service = {
  slug: string;
  title: string;
  short: string;
  outcome: string;
  intro: string;
  problems: string[];
  groups: { title: string; items: string[] }[];
  builds: string[];
  uses: string[];
  stack: string[];
  integrations: string[];
  faq: { q: string; a: string }[];
};

const commonFaq = (subject: string) => [
  { q: `How does a ${subject} engagement begin?`, a: "We begin by clarifying the business goal, current constraints, users, integrations, and the decisions that need evidence. The first output is a practical delivery path, not a sales-only proposal." },
  { q: "Can Sempliqo work with an existing system?", a: "Yes. We can assess an existing codebase, infrastructure, data model, and operating process before recommending targeted improvement, staged modernization, or replacement." },
  { q: "How are cost and timeline estimated?", a: "Estimates are based on confirmed scope, technical uncertainty, integration complexity, quality requirements, and delivery model. Assumptions and trade-offs are made visible before work begins." },
];

export const services: Service[] = [
  {
    slug: "custom-software", title: "Custom Software", short: "Purpose-built systems shaped around how your business actually operates.", outcome: "Replace operational friction with software that fits your workflows and can evolve with them.",
    intro: "Sempliqo plans and engineers secure business systems where packaged software creates compromises. We map decisions, roles, data, and integrations before shaping an architecture that remains understandable and maintainable.",
    problems: ["Manual handoffs create delays and errors", "Generic software forces inefficient workarounds", "Legacy code blocks product and operational change", "Teams lack a shared, dependable source of operational data"],
    groups: [
      { title: "Product and architecture", items: ["Custom Software Development", "Enterprise Software Development", "Legacy Software Modernization", "Software Re-engineering", "MVP Development", "Digital Product Development", "Software Architecture & Consulting"] },
      { title: "Business platforms", items: ["Business Management Software", "Internal Tools & Business Portals", "Custom CMS", "Custom CRM", "ERP Solutions", "HR Management Systems", "Inventory Management", "Project Management Systems"] },
      { title: "Operational systems", items: ["Helpdesk Systems", "Ticketing Systems", "Appointment Management", "Document Management", "Customer Portals", "Vendor Portals"] },
    ],
    builds: ["Operations platforms", "Role-based enterprise portals", "Workflow and approval systems", "Custom CRM and ERP modules", "Document and inventory systems", "Modernized legacy applications"],
    uses: ["Complex multi-team operations", "Regulated document workflows", "Field and service businesses", "Multi-location inventory", "B2B customer and vendor collaboration"],
    stack: ["Laravel", "Node.js", "Python", "React", "Next.js", "PostgreSQL", "AWS", "Docker"], integrations: ["CRM and ERP", "Accounting", "Identity providers", "Payments", "Document storage", "Reporting and BI"], faq: commonFaq("custom software"),
  },
  {
    slug: "web-mobile-apps", title: "Web & Mobile Apps", short: "Reliable digital experiences for customers, teams, and partners on every screen.", outcome: "Launch accessible, responsive applications backed by dependable APIs and scalable engineering.",
    intro: "We connect product experience with resilient backend engineering. From a focused mobile workflow to an enterprise web platform, design decisions, API contracts, performance, and release planning are handled as one system.",
    problems: ["A product experience is inconsistent across devices", "Frontends are difficult to change safely", "Mobile products depend on fragile backends", "Slow interfaces and unreliable releases affect adoption"],
    groups: [
      { title: "Web applications", items: ["Custom Web Application Development", "Enterprise Web Applications", "Business Web Portals", "Customer Portals", "Admin Panels & Dashboards", "Booking & Reservation Systems", "Marketplace Platforms", "E-learning Platforms", "Membership Platforms", "Real Estate Platforms", "Healthcare Platforms", "Financial & Business Applications"] },
      { title: "Mobile applications", items: ["Android App Development", "iOS App Development", "Cross-Platform App Development", "Flutter App Development", "React Native Development", "Mobile Backend & APIs", "Mobile App UI/UX", "App Store & Play Store Deployment", "Mobile App Maintenance", "Mobile App API Integration"] },
      { title: "Frontend engineering", items: ["React.js Development", "Next.js Development", "Vue.js Development", "JavaScript Development", "TypeScript Development", "HTML/CSS Development", "Responsive Web Development", "SPA Development", "PWA Development", "Frontend Modernization"] },
      { title: "Backend and APIs", items: ["Laravel Development", "PHP Development", "Node.js Development", "Python Backend Development", "REST API Development", "GraphQL API Development", "Microservices", "Authentication & Authorization", "Payment APIs", "Third-Party API Integration", "Webhooks", "Real-Time Applications", "Background Jobs & Queues"] },
    ],
    builds: ["Customer portals", "Booking platforms", "Marketplaces", "Cross-platform mobile apps", "Progressive web apps", "Real-time operational tools"], uses: ["Customer self-service", "Mobile field operations", "Membership experiences", "Property and healthcare workflows", "Transactional digital products"], stack: ["React", "Next.js", "Vue.js", "Flutter", "React Native", "Laravel", "Node.js", "GraphQL"], integrations: ["Payments", "Maps and location", "Push notifications", "Authentication", "Analytics", "App stores"], faq: commonFaq("web or mobile application"),
  },
  {
    slug: "saas-digital-products", title: "SaaS & Digital Products", short: "Product strategy and engineering for subscription software built to grow.", outcome: "Move from product hypothesis to a scalable SaaS platform with commercial and technical foundations aligned.",
    intro: "Sempliqo helps founders and product teams decide what to build, what to validate, and how to avoid architectural constraints. Tenant boundaries, permissions, billing, onboarding, and operations are designed early enough to prevent expensive rework.",
    problems: ["An idea needs a testable product plan", "Tenant and permission models are unclear", "Billing and account administration create complexity", "An early product must scale without premature engineering"],
    groups: [
      { title: "SaaS engineering", items: ["SaaS MVP Development", "Multi-Tenant SaaS", "B2B SaaS", "B2C SaaS", "SaaS Architecture", "Subscription & Billing Systems", "User & Organization Management", "SaaS Admin Panels", "Third-Party SaaS Integrations", "SaaS Maintenance & Scaling"] },
      { title: "Product definition", items: ["MVP Development", "Digital Product Development", "Product Discovery", "MVP Planning", "System Architecture"] },
    ],
    builds: ["B2B workflow products", "B2C subscription services", "Multi-tenant platforms", "Self-service onboarding", "Usage and billing systems", "Product administration consoles"], uses: ["New venture validation", "Digitizing a specialist service", "Commercializing an internal platform", "Replacing spreadsheet-led service delivery"], stack: ["Next.js", "React", "Laravel", "Node.js", "PostgreSQL", "Stripe", "Redis", "AWS"], integrations: ["Subscription billing", "Identity and SSO", "Product analytics", "CRM", "Email and messaging", "Data warehouses"], faq: commonFaq("SaaS product"),
  },
  {
    slug: "ecommerce-cms", title: "E-Commerce & CMS", short: "Connected commerce and content platforms without platform-imposed dead ends.", outcome: "Improve merchandising, content operations, checkout, and fulfillment through the right platform and integrations.",
    intro: "We select, customize, integrate, and migrate commerce and content platforms around operational needs. The result balances editor control, customer experience, transaction reliability, performance, and maintainability.",
    problems: ["Commerce operations require repeated manual updates", "A theme or plugin ecosystem limits customer experience", "Orders, products, and inventory do not stay synchronized", "Content publishing is slow or technically dependent"],
    groups: [
      { title: "E-commerce", items: ["Custom E-Commerce Development", "Shopify Development", "Shopify Customization", "Shopify App & API Integration", "WooCommerce Development", "WordPress E-Commerce", "Magento / Adobe Commerce Development", "Custom E-Commerce Platforms", "Payment Gateway Integration", "Shipping & Logistics Integration", "Inventory Integration", "Product & Order Management", "E-Commerce Migration", "E-Commerce Maintenance"] },
      { title: "Content management", items: ["WordPress Development", "WordPress Custom Themes", "WordPress Custom Plugins", "WordPress API Development", "WordPress Optimization", "WooCommerce", "Headless WordPress", "Custom CMS Development", "Headless CMS", "CMS Migration", "CMS Maintenance"] },
      { title: "Website platforms", items: ["Webflow Development", "Webflow Customization", "Webflow Migration", "Wix Development", "Squarespace Development", "Framer Development", "Website Builder Migration", "Custom Website Development"] },
    ],
    builds: ["Integrated storefronts", "B2B ordering portals", "Headless commerce", "Multi-site content platforms", "Custom checkout workflows", "Product information workflows"], uses: ["Direct-to-consumer commerce", "Complex B2B catalogs", "Multi-market content", "Subscription commerce", "Content-led customer journeys"], stack: ["Shopify", "WooCommerce", "WordPress", "Magento", "Webflow", "Next.js", "PHP", "GraphQL"], integrations: ["Payments", "Shipping and logistics", "Inventory and ERP", "Tax", "CRM and email", "Product information systems"], faq: commonFaq("commerce or CMS"),
  },
  {
    slug: "ai-ai-agents", title: "AI & AI Agents", short: "Applied AI systems grounded in your data, workflows, controls, and customer needs.", outcome: "Use AI where it can reduce effort or improve decisions, with human oversight and measurable operational value.",
    intro: "Sempliqo integrates language, voice, search, extraction, and agent capabilities into real operations. We start with the workflow and risk profile, then design retrieval, tools, guardrails, evaluation, and escalation around it.",
    problems: ["Teams spend time searching fragmented knowledge", "High-volume enquiries require repetitive responses", "Documents require slow manual interpretation", "AI experiments are disconnected from useful business actions"],
    groups: [
      { title: "Applied AI", items: ["AI Application Development", "AI Chatbots", "AI Customer Support", "AI Assistants", "AI Agents", "AI Automation", "AI Search", "AI Recommendation Systems", "AI Content Systems", "AI Document Processing", "AI Data Extraction", "RAG Applications", "LLM Integration", "OpenAI API Integration", "AI Workflow Integration", "Custom AI Solutions"] },
      { title: "Voice AI", items: ["Voice AI Agents", "AI Phone Agents", "AI Receptionists", "AI Appointment Booking", "AI Lead Qualification", "AI Customer Support", "Voice-to-Text Systems", "Text-to-Voice Systems", "Voice AI Integrations", "Call Automation"] },
    ],
    builds: ["Knowledge assistants", "Document processing pipelines", "Customer support agents", "Voice appointment agents", "AI search", "Human-reviewed decision support"], uses: ["Service and support operations", "Knowledge-intensive teams", "Document-heavy processes", "Lead qualification", "Appointment-led businesses"], stack: ["OpenAI", "LLMs", "RAG", "Python", "Vector databases", "Node.js", "Voice AI", "n8n"], integrations: ["CRM", "Knowledge bases", "Telephony", "WhatsApp", "Email", "Business applications"], faq: commonFaq("AI solution"),
  },
  {
    slug: "automation-integrations", title: "Automation & Integrations", short: "Connected workflows that move information and work without repetitive intervention.", outcome: "Reduce manual coordination by joining systems, messages, approvals, and data into dependable workflows.",
    intro: "We map the full process before automating it, including exceptions, ownership, security, and recovery. Integrations are monitored and documented so automation becomes infrastructure rather than another hidden dependency.",
    problems: ["Staff re-enter the same data in multiple systems", "Leads and service requests fall between channels", "Approvals and reporting rely on follow-up", "CRM records do not reflect current business activity"],
    groups: [
      { title: "Business automation", items: ["Workflow Automation", "Business Process Automation", "Lead Automation", "Sales Automation", "Marketing Automation", "Customer Support Automation", "Email Automation", "CRM Automation", "Data Entry Automation", "Document Automation", "Notification Automation", "Approval Workflows", "Reporting Automation", "Internal Process Automation"] },
      { title: "Messaging automation", items: ["WhatsApp Business API", "WhatsApp Chatbots", "WhatsApp AI Agents", "WhatsApp Notifications", "WhatsApp Lead Automation", "WhatsApp Customer Support", "WhatsApp Marketing Automation", "SMS Automation", "Multi-Channel Messaging", "Email + WhatsApp + SMS Workflows"] },
      { title: "API and system integrations", items: ["REST API Integration", "GraphQL Integration", "Payment Gateway Integration", "CRM Integration", "ERP Integration", "E-Commerce Integration", "Accounting Software Integration", "Marketing Platform Integration", "Communication API Integration", "Social Media API Integration", "Custom API Development", "Webhook Automation", "Data Synchronization"] },
      { title: "CRM solutions", items: ["Custom CRM Development", "CRM Customization", "CRM Migration", "CRM Integration", "Lead Management", "Sales Pipeline", "Customer Management", "Automated Follow-Ups", "CRM Dashboards", "CRM Automation", "Third-Party CRM Integration"] },
    ],
    builds: ["Lead-to-CRM workflows", "Approval and notification systems", "Cross-platform data sync", "Omnichannel support flows", "Automated reporting", "Custom integration layers"], uses: ["Sales operations", "Customer support", "Finance administration", "E-commerce operations", "Multi-channel communications"], stack: ["n8n", "Make", "Zapier", "Node.js", "Python", "REST", "GraphQL", "Webhooks"], integrations: ["CRM", "ERP", "Accounting", "WhatsApp and SMS", "Payments", "Marketing platforms"], faq: commonFaq("automation or integration"),
  },
  {
    slug: "cloud-devops-migration", title: "Cloud, DevOps & Migration", short: "Infrastructure, deployment, and modernization planned for continuity and control.", outcome: "Move, operate, and scale applications with safer releases, visibility, recovery, and security built in.",
    intro: "Sempliqo treats infrastructure as part of product quality. We assess dependencies and operational risk, plan reversible migration stages, automate delivery, and create the monitoring and recovery practices needed after launch.",
    problems: ["Deployments are slow or risky", "Infrastructure cannot absorb changing demand", "Legacy hosting lacks visibility and recovery", "A platform or database needs migration with minimal disruption"],
    groups: [
      { title: "Cloud and DevOps", items: ["Cloud Application Deployment", "AWS Solutions", "Google Cloud Solutions", "Microsoft Azure", "Docker", "CI/CD", "GitHub Actions", "Server Setup", "VPS Setup", "Linux Server Management", "Cloud Migration", "Application Scaling", "Load Balancing", "Monitoring & Logging", "Backup & Disaster Recovery"] },
      { title: "Platform migrations", items: ["WordPress Migration", "Shopify Migration", "Magento Migration", "Webflow Migration", "Laravel Migration", "PHP Application Migration", "Hosting Migration", "Server Migration", "Database Migration", "CMS Migration", "Website Redesign & Migration", "Legacy Application Migration", "Cloud Migration"] },
      { title: "Data platforms", items: ["MySQL", "PostgreSQL", "MongoDB", "Redis", "Database Design", "Database Optimization", "Database Migration", "Data Modeling", "Query Optimization", "Database Integration", "Backup & Recovery"] },
      { title: "Security", items: ["Website Security", "Application Security", "API Security", "Authentication Systems", "Role-Based Access Control", "Security Audits", "Vulnerability Fixes", "SSL Configuration", "Secure Payment Integration", "Data Protection"] },
    ],
    builds: ["Automated delivery pipelines", "Cloud application environments", "Observable production systems", "Migration runbooks", "Scalable data tiers", "Backup and recovery plans"], uses: ["Platform modernization", "Hosting consolidation", "Release process improvement", "Reliability improvement", "Demand-driven scaling"], stack: ["AWS", "Google Cloud", "Azure", "Docker", "Linux", "GitHub Actions", "PostgreSQL", "Redis"], integrations: ["Monitoring and alerting", "Identity", "DNS and CDN", "Source control", "Backup storage", "Security tooling"], faq: commonFaq("cloud or migration"),
  },
  {
    slug: "maintenance-dedicated-development", title: "Maintenance & Dedicated Development", short: "Continuous technical capacity for systems that need to stay secure and keep improving.", outcome: "Protect software health while creating a dependable path for fixes, optimization, and ongoing change.",
    intro: "We establish context, priorities, quality controls, and a sustainable delivery rhythm around an existing product. Engagements can focus on stabilization, continuous enhancement, specialist consulting, or embedded development capacity.",
    problems: ["A business-critical application lacks dependable ownership", "Technical debt slows every change", "Performance and reliability issues recur", "An internal team needs flexible engineering capacity"],
    groups: [
      { title: "Maintenance", items: ["Website Maintenance", "Application Maintenance", "Laravel Maintenance", "WordPress Maintenance", "Shopify Maintenance", "Magento Maintenance", "Bug Fixing", "Security Updates", "Performance Monitoring", "Server Maintenance", "Feature Development", "Long-Term Technical Support", "Dedicated Development Support"] },
      { title: "Performance", items: ["Website Speed Optimization", "Laravel Optimization", "PHP Optimization", "Database Optimization", "API Performance Optimization", "Frontend Optimization", "Core Web Vitals Optimization", "Server Optimization", "Application Scaling", "Performance Audits"] },
      { title: "Consulting and professional services", items: ["Technology Consulting", "Software Architecture", "Digital Transformation", "Product Discovery", "Technical Consulting", "Technology Audit", "Code Audit", "Security Audit", "Performance Audit", "MVP Planning", "System Architecture", "Development Team Extension", "Dedicated Developers", "Long-Term Technology Partnership"] },
    ],
    builds: ["Maintenance roadmaps", "Performance improvement programs", "Feature delivery streams", "Technical audit plans", "Embedded engineering capacity", "Modernization backlogs"], uses: ["Business-critical platforms", "Products after initial launch", "Teams with variable demand", "Inherited codebases", "Systems requiring specialist review"], stack: ["Laravel", "PHP", "WordPress", "Shopify", "Magento", "React", "Cloud platforms", "Monitoring"], integrations: ["Issue tracking", "Source control", "Monitoring", "CI/CD", "Security scanning", "Team communication"], faq: commonFaq("maintenance partnership"),
  },
];

export const technologies = [
  { title: "Programming and Backend", items: ["PHP", "Laravel", "Node.js", "Python", "JavaScript", "TypeScript"], copy: "APIs, workflow engines, business logic, integrations, and maintainable service layers." },
  { title: "Frontend", items: ["React", "Next.js", "Vue.js", "HTML", "CSS", "Tailwind CSS"], copy: "Fast, accessible interfaces for products, portals, operational systems, and content experiences." },
  { title: "Mobile", items: ["Flutter", "React Native", "Android", "iOS"], copy: "Cross-platform or native delivery selected around device needs, product roadmap, and team economics." },
  { title: "CMS and E-Commerce", items: ["WordPress", "WooCommerce", "Shopify", "Magento / Adobe Commerce", "Webflow", "Wix", "Squarespace", "Framer"], copy: "Content and transaction platforms tailored to editorial, merchandising, and operational requirements." },
  { title: "Databases", items: ["MySQL", "PostgreSQL", "MongoDB", "Redis"], copy: "Data models and storage patterns matched to consistency, query, scale, and latency requirements." },
  { title: "Cloud and Infrastructure", items: ["AWS", "Google Cloud", "Azure", "Docker", "Linux", "CI/CD", "GitHub Actions"], copy: "Repeatable delivery, resilient environments, monitoring, recovery, and controlled scaling." },
  { title: "AI and Automation", items: ["OpenAI", "LLMs", "RAG", "AI Agents", "Voice AI", "n8n", "Make", "Zapier", "WhatsApp Business API", "CRM Integrations"], copy: "AI and workflows connected to business data, approval rules, tools, and communication channels." },
];

export const solutions = [
  ["Launch a new digital product", "Validate the operating model, define the first useful release, and establish foundations that support iteration.", "saas-digital-products"],
  ["Modernize legacy software", "Reduce change risk through assessment, staged re-engineering, migration, and controlled transition.", "custom-software"],
  ["Automate internal operations", "Connect tasks, approvals, messages, and records so routine work moves with less manual coordination.", "automation-integrations"],
  ["Add AI to an existing business", "Introduce search, agents, extraction, or voice into a real workflow with appropriate controls.", "ai-ai-agents"],
  ["Build a customer or vendor portal", "Give external users a secure, focused interface for transactions, documents, requests, and status.", "web-mobile-apps"],
  ["Connect disconnected systems", "Create durable integration flows and a reliable view of information across platforms.", "automation-integrations"],
  ["Create a SaaS platform", "Design tenancy, billing, access, onboarding, and operations around a commercial product model.", "saas-digital-products"],
  ["Improve e-commerce operations", "Align storefront, content, inventory, fulfillment, and customer communication.", "ecommerce-cms"],
  ["Scale infrastructure and performance", "Improve delivery, observability, capacity, and recovery around business demand.", "cloud-devops-migration"],
  ["Extend an existing development team", "Add accountable engineering capacity with clear context, priorities, and quality controls.", "maintenance-dedicated-development"],
];