import { Suspense, lazy, useEffect, useMemo, useRef, useState } from "react";
import { BrowserRouter, Link, NavLink, Route, Routes, useLocation, useParams } from "react-router-dom";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Line, Sphere } from "@react-three/drei";
import * as THREE from "three";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, ArrowUpRight, Bot, Boxes, Calendar, Check, ChevronDown, CircleDot, Clock, Cloud, Compass, Database, FileText, Handshake, Layers, LayoutDashboard, Lightbulb, Menu, MessageSquare, Network, ShieldCheck, ShoppingBag, Smartphone, Sparkles, Target, TrendingUp, Unplug, Users, Workflow, X, Zap } from "lucide-react";
import type { IconType } from "react-icons";
import { SiAndroid, SiApple, SiCss, SiDocker, SiFlutter, SiFramer, SiGithubactions, SiGooglecloud, SiHtml5, SiJavascript, SiLaravel, SiLinux, SiMake, SiMongodb, SiMysql, SiN8N, SiNextdotjs, SiNodedotjs, SiPhp, SiPostgresql, SiPython, SiReact, SiRedis, SiShopify, SiSquarespace, SiTailwindcss, SiTypescript, SiVuedotjs, SiWebflow, SiWhatsapp, SiWix, SiWoocommerce, SiWordpress, SiZapier } from "react-icons/si";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { services, solutions, technologies } from "./data";
import "./home-beauty.css";
import "./loader.css";
import { LoadingProvider, useLoading } from "./context/LoadingContext";
import { TopProgressBar, OverlayLoader, ActionButton } from "./components/loader/LoadingComponents";

const fullLogo = "/sempliqo_combined_logo%20(1)(1).png";
const symbolLogo = "/extract_only_the_geometric_s_symbol_from_the_left_side_of_this_image._remove(1).png";
const contactEndpoint = (import.meta as ImportMeta & { env?: Record<string, string> }).env?.VITE_CONTACT_ENDPOINT || "/api/contact";

const techBrands: Record<string, { icon?: IconType; color: string; soft: string }> = {
  PHP: { icon: SiPhp, color: "#777BB4", soft: "#f0f1fa" }, Laravel: { icon: SiLaravel, color: "#FF2D20", soft: "#fff0ef" }, "Node.js": { icon: SiNodedotjs, color: "#339933", soft: "#edf8ed" }, Python: { icon: SiPython, color: "#3776AB", soft: "#edf4fa" }, JavaScript: { icon: SiJavascript, color: "#b79e00", soft: "#fff9d9" }, TypeScript: { icon: SiTypescript, color: "#3178C6", soft: "#ebf4fc" }, React: { icon: SiReact, color: "#087EA4", soft: "#e8f8fc" }, "Next.js": { icon: SiNextdotjs, color: "#111111", soft: "#f1f1f1" }, "Vue.js": { icon: SiVuedotjs, color: "#42B883", soft: "#eaf9f2" }, HTML: { icon: SiHtml5, color: "#E34F26", soft: "#fff0eb" }, CSS: { icon: SiCss, color: "#663399", soft: "#f4ecfa" }, "Tailwind CSS": { icon: SiTailwindcss, color: "#06B6D4", soft: "#e8fbfe" }, Flutter: { icon: SiFlutter, color: "#02569B", soft: "#eaf3fa" }, "React Native": { icon: SiReact, color: "#087EA4", soft: "#e8f8fc" }, Android: { icon: SiAndroid, color: "#3DDC84", soft: "#eafff3" }, iOS: { icon: SiApple, color: "#111111", soft: "#f1f1f1" }, WordPress: { icon: SiWordpress, color: "#21759B", soft: "#ebf5f9" }, WooCommerce: { icon: SiWoocommerce, color: "#96588A", soft: "#f8eff6" }, Shopify: { icon: SiShopify, color: "#7AB55C", soft: "#f1f8ed" }, Webflow: { icon: SiWebflow, color: "#146EF5", soft: "#eaf2ff" }, Wix: { icon: SiWix, color: "#111111", soft: "#f1f1f1" }, Squarespace: { icon: SiSquarespace, color: "#111111", soft: "#f1f1f1" }, Framer: { icon: SiFramer, color: "#0055FF", soft: "#eaf0ff" }, MySQL: { icon: SiMysql, color: "#4479A1", soft: "#edf4f8" }, PostgreSQL: { icon: SiPostgresql, color: "#4169E1", soft: "#edf0fe" }, MongoDB: { icon: SiMongodb, color: "#47A248", soft: "#edf8ed" }, Redis: { icon: SiRedis, color: "#DC382D", soft: "#fff0ef" }, "Google Cloud": { icon: SiGooglecloud, color: "#4285F4", soft: "#edf4ff" }, Docker: { icon: SiDocker, color: "#2496ED", soft: "#eaf6fe" }, Linux: { icon: SiLinux, color: "#D9A400", soft: "#fff9df" }, "GitHub Actions": { icon: SiGithubactions, color: "#2088FF", soft: "#ebf5ff" }, n8n: { icon: SiN8N, color: "#EA4B71", soft: "#fff0f4" }, Make: { icon: SiMake, color: "#6D00CC", soft: "#f5ebff" }, Zapier: { icon: SiZapier, color: "#FF4F00", soft: "#fff1eb" }, "WhatsApp Business API": { icon: SiWhatsapp, color: "#25D366", soft: "#eafff2" }, AWS: { color: "#FF9900", soft: "#fff6e7" }, Azure: { color: "#0078D4", soft: "#eaf5fc" }, OpenAI: { color: "#10A37F", soft: "#e9f8f4" }, LLMs: { color: "#7C3AED", soft: "#f3edff" }, RAG: { color: "#0EA5E9", soft: "#eaf8fe" }, "AI Agents": { color: "#EC4899", soft: "#fff0f7" }, "Voice AI": { color: "#F97316", soft: "#fff2e9" }, "CRM Integrations": { color: "#0F766E", soft: "#eaf7f6" }, "CI/CD": { color: "#2563EB", soft: "#edf3ff" }, "Magento / Adobe Commerce": { color: "#F26322", soft: "#fff1ea" }
};

function TechMark({ name, compact = false }: { name: string; compact?: boolean }) {
  const brand = techBrands[name] || { color: "#0878f9", soft: "#edf5ff" }; const Icon = brand.icon;
  return <span className={`tech-mark ${compact ? "tech-mark-compact" : ""}`} style={{ "--brand": brand.color, "--brand-soft": brand.soft } as React.CSSProperties}><span className="tech-mark-icon">{Icon ? <Icon aria-hidden="true" /> : <b aria-hidden="true">{name.slice(0, 2).toUpperCase()}</b>}</span><span>{name}</span></span>;
}

function BrandLogo({ light = false }: { light?: boolean }) {
  const [missing, setMissing] = useState(false);
  return missing ? <span className={`brand-fallback ${light ? "light" : ""}`}>Sempliqo<span>.</span></span> : <img src={fullLogo} onError={() => setMissing(true)} alt="Sempliqo" className="brand-logo" />;
}
function Symbol({ className = "" }: { className?: string }) { return <img src={symbolLogo} alt="" aria-hidden="true" className={`symbol ${className}`} />; }

function Seo({ title, description, schema }: { title: string; description: string; schema?: object }) {
  const location = useLocation();
  useEffect(() => {
    document.title = `${title} | Sempliqo`;
    const setMeta = (name: string, value: string, property = false) => { const key = property ? "property" : "name"; let tag = document.head.querySelector(`meta[${key}="${name}"]`) as HTMLMetaElement | null; if (!tag) { tag = document.createElement("meta"); tag.setAttribute(key, name); document.head.appendChild(tag); } tag.content = value; };
    setMeta("description", description); setMeta("og:title", title, true); setMeta("og:description", description, true); setMeta("og:type", "website", true); setMeta("twitter:card", "summary_large_image");
    let canonical = document.head.querySelector('link[rel="canonical"]') as HTMLLinkElement | null; if (!canonical) { canonical = document.createElement("link"); canonical.rel = "canonical"; document.head.appendChild(canonical); } canonical.href = `${window.location.origin}${location.pathname}`;
  }, [title, description, location.pathname]);
  return schema ? <script type="application/ld+json">{JSON.stringify(schema)}</script> : null;
}

function BrandScene() {
  const reduced = useReducedMotion(); const group = useRef<THREE.Group>(null);
  const points = useMemo(() => [[-2.5, 1.7, 0], [-1, 2.3, .2], [.8, 1.7, -.2], [2.2, .9, .1], [.8, .1, 0], [-.9, -.2, .2], [-2.2, -1.1, -.1], [-.6, -2, .2], [1.2, -1.7, -.1], [2.5, -1, 0]] as [number, number, number][], []);
  useFrame((state, delta) => { if (!reduced && group.current) { group.current.rotation.y += delta * .08; group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, state.pointer.y * .08, .03); group.current.rotation.z = THREE.MathUtils.lerp(group.current.rotation.z, -state.pointer.x * .08, .03); } });
  return <group ref={group}><Line points={points} color="#19a7ff" lineWidth={2} transparent opacity={.8} />{points.map((point, i) => <Float key={i} speed={reduced ? 0 : 1 + i * .04} floatIntensity={.18}><Sphere position={point} args={[i % 3 === 0 ? .14 : .08, 18, 18]}><meshStandardMaterial color={i % 2 ? "#4ac2ff" : "#0878f9"} emissive="#0969da" emissiveIntensity={1.4} /></Sphere></Float>)}<Line points={points.map(([x, y, z]) => [-x * .72, y * .74, z - .6] as [number, number, number])} color="#246bce" lineWidth={1} transparent opacity={.35} /></group>;
}
function HeroCanvas() { return <div className="hero-canvas" aria-hidden="true"><Canvas dpr={[1, 1.5]} camera={{ position: [0, 0, 7], fov: 48 }} gl={{ antialias: true, powerPreference: "high-performance" }}><ambientLight intensity={1.2} /><pointLight position={[3, 3, 4]} intensity={20} color="#2ab7ff" /><Suspense fallback={null}><BrandScene /></Suspense></Canvas><div className="hero-shade" /></div>; }
const LazyHeroCanvas = lazy(async () => ({ default: HeroCanvas }));

const nav = [["Home", "/"], ["Services", "/services"], ["Technologies", "/technologies"], ["Solutions", "/solutions"], ["About", "/about"], ["Insights", "/insights"], ["Contact", "/contact"]];
function Header() {
  const [open, setOpen] = useState(false), [scrolled, setScrolled] = useState(false); const location = useLocation();
  useEffect(() => { setOpen(false); window.scrollTo({ top: 0 }) }, [location.pathname]); useEffect(() => { const fn = () => setScrolled(scrollY > 24); fn(); addEventListener("scroll", fn, { passive: true }); return () => removeEventListener("scroll", fn) }, []);
  return <><a href="#main" className="skip-link">Skip to content</a><div className="value-bar">From product strategy and engineering to AI automation and long-term support.</div><header className={`header ${scrolled ? "header-solid" : ""}`}><div className="container nav-wrap"><Link to="/" aria-label="Sempliqo home"><BrandLogo /></Link><nav className="desktop-nav" aria-label="Primary navigation">{nav.map(([label, path]) => <div className="nav-entry" key={path}><NavLink to={path} className={({ isActive }) => isActive ? "active" : ""}>{label}{["Services", "Technologies"].includes(label) && <ChevronDown size={14} />}</NavLink>{label === "Services" && <MegaMenu title="Engineering services" items={services.map(s => [s.title, `/services/${s.slug}`, s.short])} />} {label === "Technologies" && <MegaMenu title="Technology ecosystem" items={technologies.map(t => [t.title, "/technologies", t.copy])} />}</div>)}</nav><Link to="/contact" className="btn btn-primary nav-cta">Discuss Your Project <ArrowRight size={17} /></Link><button className="menu-button" aria-label="Open navigation" aria-expanded={open} onClick={() => setOpen(true)}><Menu /></button></div></header><AnimatePresence>{open && <motion.div className="mobile-drawer" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><motion.div className="mobile-panel" initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", damping: 28 }}><div className="drawer-top"><Symbol /><button aria-label="Close navigation" onClick={() => setOpen(false)}><X /></button></div><nav aria-label="Mobile navigation">{nav.map(([label, path]) => <NavLink key={path} to={path}>{label}<ArrowRight size={18} /></NavLink>)}</nav><Link to="/contact" className="btn btn-primary">Discuss Your Project</Link></motion.div></motion.div>}</AnimatePresence></>;
}
function MegaMenu({ title, items }: { title: string; items: string[][] }) { return <div className="mega"><div className="mega-head"><span>{title}</span><Link to={title.startsWith("Engineering") ? "/services" : "/technologies"}>View overview <ArrowRight size={15} /></Link></div><div className="mega-grid">{items.map(([label, path, copy]) => <Link key={label} to={path}><strong>{label}</strong><small>{copy}</small></Link>)}</div></div>; }
function Footer() { return <footer><div className="container footer-grid"><div className="footer-brand"><BrandLogo light /><p>Software, AI, automation, and cloud engineering aligned with the way your business needs to operate.</p><Link to="/contact" className="text-link">Discuss Your Project <ArrowRight size={16} /></Link></div><div><h3>Services</h3>{services.slice(0, 5).map(s => <Link key={s.slug} to={`/services/${s.slug}`}>{s.title}</Link>)}</div><div><h3>Explore</h3><Link to="/technologies">Technologies</Link><Link to="/solutions">Solutions</Link><Link to="/about">About</Link><Link to="/insights">Insights</Link><Link to="/contact">Contact</Link></div><div><h3>Contact</h3><p className="muted">Business-controlled email, phone, address, and social URLs can be configured before deployment.</p><Link to="/contact">Project enquiry</Link></div></div><div className="container footer-bottom"><span>© {new Date().getFullYear()} Sempliqo</span><div><Link to="/privacy">Privacy</Link><Link to="/terms">Terms</Link><Link to="/cookies">Cookies</Link></div></div></footer> }

function Layout() {
  const location = useLocation(), reduced = useReducedMotion();
  const { startLoading, stopLoading } = useLoading();

  // Route transition progress indicator
  useEffect(() => {
    const routeId = `route-nav-${location.pathname}`;
    startLoading(routeId, { scope: "global" });
    const timer = setTimeout(() => {
      stopLoading(routeId);
    }, 280);
    return () => {
      clearTimeout(timer);
      stopLoading(routeId);
    };
  }, [location.pathname, startLoading, stopLoading]);

  useEffect(() => {
    const lenis = new Lenis({ autoRaf: true, duration: reduced ? 0 : 1 });
    return () => lenis.destroy();
  }, [reduced]);

  useEffect(() => {
    if (reduced) return;
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() =>
      gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el) =>
        gsap.fromTo(
          el,
          { y: 22, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.7,
            ease: "power2.out",
            scrollTrigger: { trigger: el, start: "top 88%", once: true },
          }
        )
      )
    );
    return () => ctx.revert();
  }, [location.pathname, reduced]);

  return (
    <>
      <TopProgressBar />
      <OverlayLoader />
      <Header />
      <AnimatePresence mode="wait">
        <motion.main
          id="main"
          key={location.pathname}
          initial={reduced ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22 }}
        >
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/services/:slug" element={<ServicePage />} />
            <Route path="/technologies" element={<TechnologiesPage />} />
            <Route path="/solutions" element={<SolutionsPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/insights" element={<InsightsPage />} />
            <Route path="/insights/:slug" element={<ArticlePage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/:policy" element={<PolicyPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </motion.main>
      </AnimatePresence>
      <Footer />
    </>
  );
}
function SectionHead({ eyebrow, title, copy, light = false }: { eyebrow: string; title: string; copy?: string; light?: boolean }) { return <div className={`section-head ${light ? "light" : ""}`} data-reveal><span>{eyebrow}</span><h2>{title}</h2>{copy && <p>{copy}</p>}</div> }
function CtaRow({ secondary = "Explore Our Capabilities" }: { secondary?: string }) { return <div className="cta-row"><Link to="/contact" className="btn btn-primary">Discuss Your Project <ArrowRight size={18} /></Link><Link to="/services" className="btn btn-secondary">{secondary}</Link></div> }

const challengesData = [
  {
    id: "01",
    category: "Operations & Data",
    tag: "Workflow & Ops",
    title: "Manual processes slowing operations",
    desc: "Repetitive manual entry and legacy workflows create operational friction, human errors, and costly delivery delays.",
    solution: "Custom Automation & Workflow Engines",
    icon: Clock,
    accent: "#0878f9",
    accentSoft: "rgba(8, 120, 249, 0.08)",
    accentBorder: "rgba(8, 120, 249, 0.22)"
  },
  {
    id: "02",
    category: "Operations & Data",
    tag: "Integrations & APIs",
    title: "Disconnected software and data",
    desc: "Siloed applications force duplicate data entries and prevent real-time cross-department analytics.",
    solution: "Unified API Mesh & Data Pipelines",
    icon: Unplug,
    accent: "#06b6d4",
    accentSoft: "rgba(6, 182, 212, 0.08)",
    accentBorder: "rgba(6, 182, 212, 0.22)"
  },
  {
    id: "03",
    category: "Strategy & Scale",
    tag: "Modernization",
    title: "Legacy systems limiting growth",
    desc: "Outdated software architectures accumulate technical debt, increase downtime risks, and block new features.",
    solution: "Incremental Refactoring & Migration",
    icon: Layers,
    accent: "#8b5cf6",
    accentSoft: "rgba(139, 92, 246, 0.08)",
    accentBorder: "rgba(139, 92, 246, 0.22)"
  },
  {
    id: "04",
    category: "Strategy & Scale",
    tag: "Product Strategy",
    title: "Product ideas lacking technical direction",
    desc: "Ambitious product roadmaps stall without verified feasibility, clear scope boundaries, and execution plans.",
    solution: "Technical Architecture & Discovery",
    icon: Compass,
    accent: "#d97706",
    accentSoft: "rgba(217, 119, 6, 0.08)",
    accentBorder: "rgba(217, 119, 6, 0.22)"
  },
  {
    id: "05",
    category: "Strategy & Scale",
    tag: "Scale & Cloud",
    title: "Platforms struggling to scale",
    desc: "Unoptimized database queries and monolithic codebases cause crashes and latency during peak loads.",
    solution: "High-Throughput Cloud Infrastructure",
    icon: TrendingUp,
    accent: "#10b981",
    accentSoft: "rgba(16, 185, 129, 0.08)",
    accentBorder: "rgba(16, 185, 129, 0.22)"
  },
  {
    id: "06",
    category: "AI & Commerce",
    tag: "Applied AI",
    title: "Repetitive support and communication work",
    desc: "Support agents get bogged down answering repetitive queries instead of solving high-value customer tasks.",
    solution: "AI Agents & Intelligent Support Bots",
    icon: Bot,
    accent: "#ec4899",
    accentSoft: "rgba(236, 72, 153, 0.08)",
    accentBorder: "rgba(236, 72, 153, 0.22)"
  },
  {
    id: "07",
    category: "AI & Commerce",
    tag: "Custom Commerce",
    title: "E-commerce requiring deeper customization",
    desc: "Off-the-shelf stores cannot support complex B2B pricing, ERP synchronization, or unique user checkout journeys.",
    solution: "Headless E-Commerce & Custom Portals",
    icon: ShoppingBag,
    accent: "#f97316",
    accentSoft: "rgba(249, 115, 22, 0.08)",
    accentBorder: "rgba(249, 115, 22, 0.22)"
  },
  {
    id: "08",
    category: "Strategy & Scale",
    tag: "Engineering Capacity",
    title: "Teams needing dependable development capacity",
    desc: "Recruiting bottlenecks and talent gaps slow down product velocity and overburden key engineering leads.",
    solution: "Dedicated Engineering Pods",
    icon: Users,
    accent: "#6366f1",
    accentSoft: "rgba(99, 102, 241, 0.08)",
    accentBorder: "rgba(99, 102, 241, 0.22)"
  }
];

function BusinessChallenges() {
  const [filter, setFilter] = useState("All");
  const categories = ["All", "Operations & Data", "Strategy & Scale", "AI & Commerce"];

  const filteredChallenges = useMemo(() => {
    if (filter === "All") return challengesData;
    return challengesData.filter(c => c.category === filter);
  }, [filter]);

  return (
    <section className="section challenge-section">
      <div className="container">
        <div className="challenge-head-wrap" data-reveal>
          <SectionHead
            eyebrow="Business challenges"
            title="Start with the constraint, not the technology."
            copy="A useful technical plan begins with the operational issue, commercial goal, and risk that software needs to address."
          />

          <div className="challenge-filter-bar">
            {categories.map(cat => (
              <button
                key={cat}
                className={`challenge-filter-btn ${filter === cat ? "active" : ""}`}
                onClick={() => setFilter(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <motion.div className="challenge-grid-v2" layout>
          <AnimatePresence mode="popLayout">
            {filteredChallenges.map((c) => {
              const Icon = c.icon;
              return (
                <motion.article
                  key={c.id}
                  layout
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  whileHover={{ y: -7, scale: 1.012 }}
                  className="challenge-card"
                  style={{
                    "--accent": c.accent,
                    "--accent-soft": c.accentSoft,
                    "--accent-border": c.accentBorder
                  } as React.CSSProperties}
                >
                  <div className="challenge-card-top">
                    <span className="challenge-num">{c.id}</span>
                    <span className="challenge-tag">{c.tag}</span>
                    <div className="challenge-icon-box">
                      <Icon size={20} />
                    </div>
                  </div>

                  <div className="challenge-card-body">
                    <h3>{c.title}</h3>
                    <p>{c.desc}</p>
                  </div>

                  <div className="challenge-card-footer">
                    <div className="challenge-solution-badge">
                      <Sparkles size={13} />
                      <span>{c.solution}</span>
                    </div>
                    <Link to="/contact" className="challenge-action-link" aria-label={`Solve ${c.title}`}>
                      <ArrowUpRight size={17} />
                    </Link>
                  </div>

                  <div className="challenge-card-glow" aria-hidden="true" />
                </motion.article>
              );
            })}
          </AnimatePresence>
        </motion.div>

        <div className="challenge-banner" data-reveal>
          <div className="challenge-banner-content">
            <div className="challenge-banner-badge">
              <Check size={14} />
              <span>Constraint-Led Engineering</span>
            </div>
            <h3>Facing one of these operational bottlenecks?</h3>
            <p>We analyze your exact systems, data flow, and commercial goals before writing a single line of code.</p>
          </div>
          <div className="challenge-banner-actions">
            <Link to="/contact" className="btn btn-primary">
              Map Your Solution <ArrowRight size={17} />
            </Link>
            <Link to="/solutions" className="btn btn-secondary">
              View Solution Patterns
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

const solutionPatternsV4 = [
  {
    title: "Business Management",
    tagline: "Streamline core business operations with custom internal platforms, dashboards, and automated tools.",
    tag: "Custom Ops",
    icon: Boxes,
    accent: "#0878f9",
    stat: "40% Ops Efficiency Boost",
    features: ["Custom workflow automation", "Multi-role permission controls", "Real-time analytics & reporting", "Third-party API integrations"],
    tech: ["React", "TypeScript", "Node.js", "PostgreSQL"]
  },
  {
    title: "Customer & Vendor Portals",
    tagline: "Empower clients and suppliers with secure, 24/7 self-service digital portals.",
    tag: "Self-Service",
    icon: Users,
    accent: "#06b6d4",
    stat: "24/7 Self-Service Access",
    features: ["Secure authentication & RBAC", "Document sharing & e-signatures", "Live order & ticket tracking", "Automated email/SMS alerts"],
    tech: ["Next.js", "TypeScript", "Tailwind CSS", "Redis"]
  },
  {
    title: "SaaS Platforms",
    tagline: "Build multi-tenant B2B and B2C SaaS products engineered for high scale and concurrency.",
    tag: "Cloud Product",
    icon: Cloud,
    accent: "#8b5cf6",
    stat: "Multi-Tenant Ready",
    features: ["Multi-tenant data isolation", "Subscription & billing engines", "Usage metering & telemetry", "Automated user onboarding"],
    tech: ["React", "Node.js", "PostgreSQL", "Docker"]
  },
  {
    title: "Mobile Applications",
    tagline: "High-performance cross-platform mobile applications for iOS and Android.",
    tag: "iOS & Android",
    icon: Smartphone,
    accent: "#10b981",
    stat: "60fps Smooth Native UX",
    features: ["Offline-first data sync", "Biometric security & push alerts", "Native device integrations", "App Store & Play Store ready"],
    tech: ["Flutter", "React Native", "iOS", "Android"]
  },
  {
    title: "E-Commerce Ecosystems",
    tagline: "Headless storefronts and custom checkout systems built for high conversion.",
    tag: "Commerce",
    icon: ShoppingBag,
    accent: "#f97316",
    stat: "Sub-Second Page Load",
    features: ["Headless checkout architecture", "B2B wholesale pricing rules", "ERP & inventory synchronization", "Custom promotion engines"],
    tech: ["Next.js", "Shopify", "WooCommerce", "Node.js"]
  },
  {
    title: "AI Assistants & Agents",
    tagline: "Autonomous AI agents and RAG-powered enterprise knowledge engines.",
    tag: "Applied AI",
    icon: Bot,
    accent: "#ec4899",
    stat: "Sub-Second AI Inference",
    features: ["RAG on proprietary docs", "Context-aware conversational AI", "Automated system actions", "Human-in-the-loop fallback"],
    tech: ["Python", "OpenAI", "RAG", "n8n"]
  },
  {
    title: "CRM & ERP Systems",
    tagline: "Unified customer relationship management and enterprise resource planning.",
    tag: "Enterprise Ops",
    icon: Database,
    accent: "#3b82f6",
    stat: "Single Source of Truth",
    features: ["Lead & pipeline management", "Automated invoicing & ledger", "Custom reporting dashboards", "HubSpot / Salesforce sync"],
    tech: ["TypeScript", "Laravel", "MySQL", "Redis"]
  },
  {
    title: "Booking & Marketplaces",
    tagline: "Multi-vendor scheduling, booking engines, and digital marketplaces.",
    tag: "Marketplace",
    icon: Calendar,
    accent: "#d97706",
    stat: "Real-Time Scheduling",
    features: ["Real-time availability calendars", "Automated payout processing", "Review & rating moderation", "Escrow & payment gateways"],
    tech: ["React", "Node.js", "PostgreSQL", "JavaScript"]
  },
  {
    title: "Internal Tools & Dashboards",
    tagline: "Custom admin panels, telemetry grids, and operational monitoring dashboards.",
    tag: "Internal Ops",
    icon: LayoutDashboard,
    accent: "#14b8a6",
    stat: "100% Data Control",
    features: ["Custom data visualization", "Bulk action audit logs", "Fast filtering & data grids", "Role-based access controls"],
    tech: ["React", "Tailwind CSS", "TypeScript", "Node.js"]
  },
  {
    title: "Workflow Automation",
    tagline: "Connect legacy software and automate repetitive cross-application processes.",
    tag: "Automation",
    icon: Workflow,
    accent: "#6366f1",
    stat: "Zero Manual Error",
    features: ["Event-driven webhook pipelines", "Error handling & automatic retries", "Custom API connectors", "Visual workflow monitoring"],
    tech: ["n8n", "Make", "Python", "Zapier"]
  }
];

function SolutionShowcaseV4() {
  const [active, setActive] = useState(0);
  const current = solutionPatternsV4[active];
  const Icon = current.icon;

  return (
    <section className="section solution-section-v4">
      <div className="container solution-split-v4">
        {/* Left Column Intro */}
        <div className="solution-intro-v4" data-reveal>
          <SectionHead
            eyebrow="What we can build"
            title="Connected systems for the work your business depends on."
            copy="Explore common solution patterns configured around your users, data, rules, and existing technology."
          />

          <div className="solution-highlights-v4">
            <div className="solution-hl-card">
              <Zap size={18} />
              <div>
                <strong>API-First Architecture</strong>
                <span>Built to integrate seamlessly with your current software landscape.</span>
              </div>
            </div>

            <div className="solution-hl-card">
              <ShieldCheck size={18} />
              <div>
                <strong>Enterprise Security & Ownership</strong>
                <span>Strict data isolation, role-based access, and full code ownership.</span>
              </div>
            </div>

            <div className="solution-hl-card">
              <Network size={18} />
              <div>
                <strong>Built for Growth & Velocity</strong>
                <span>Scalable cloud architecture that evolves as your business grows.</span>
              </div>
            </div>
          </div>

          <Link to="/contact" className="btn btn-primary" style={{ width: "fit-content" }}>
            Discuss Your System Requirements <ArrowRight size={17} />
          </Link>
        </div>

        {/* Right Column Interactive Showcase Card */}
        <div className="solution-module-v4" data-reveal>
          {/* Sidebar Tabs */}
          <div className="solution-sidebar-v4" role="tablist" aria-label="Solution types">
            {solutionPatternsV4.map((s, i) => {
              const TabIcon = s.icon;
              const isActive = active === i;
              return (
                <button
                  role="tab"
                  aria-selected={isActive}
                  key={s.title}
                  onClick={() => setActive(i)}
                  className={`solution-tab-v4 ${isActive ? "active" : ""}`}
                  style={{ "--tab-accent": s.accent } as React.CSSProperties}
                >
                  <span className="tab-icon-v4"><TabIcon size={16} /></span>
                  <span className="tab-title-v4">{s.title}</span>
                  <ArrowRight size={14} className="tab-arrow-v4" />
                </button>
              );
            })}
          </div>

          {/* Solution Details Panel */}
          <AnimatePresence mode="wait">
            <motion.div
              key={current.title}
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className="solution-panel-v4"
              style={{ "--accent": current.accent } as React.CSSProperties}
            >
              <div className="panel-header-v4">
                <div className="panel-icon-wrap">
                  <Icon size={22} />
                </div>
                <span className="panel-tag-v4">{current.tag}</span>
                <div className="panel-stat-v4">
                  <Sparkles size={12} />
                  <span>{current.stat}</span>
                </div>
              </div>

              <div className="panel-body-v4">
                <h3>{current.title}</h3>
                <p className="panel-tagline-v4">{current.tagline}</p>

                <div className="panel-sec-title">Core Capabilities & Deliverables</div>
                <div className="panel-features-v4">
                  {current.features.map((feat) => (
                    <div key={feat} className="panel-feat-item">
                      <Check size={14} className="panel-check-icon" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>

                <div className="panel-tech-v4">
                  <span className="panel-tech-label">Suggested Technology Stack</span>
                  <div className="panel-tech-tags">
                    {current.tech.map((t) => (
                      <TechMark key={t} name={t} compact />
                    ))}
                  </div>
                </div>
              </div>

              <div className="panel-glow-v4" aria-hidden="true" />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

const aiCapabilities = [
  {
    id: "agents",
    name: "AI Agents",
    subtitle: "Autonomous Workflows",
    icon: Bot,
    accent: "#06b6d4",
    stat: "99.8% Execution Accuracy",
    description: "Autonomous multi-agent systems executing multi-step operational tasks, database updates, and workflow triggers with strict role boundaries.",
    tech: ["Python", "OpenAI", "LangChain", "n8n"]
  },
  {
    id: "rag",
    name: "RAG Applications",
    subtitle: "Enterprise Knowledge Search",
    icon: Database,
    accent: "#8b5cf6",
    stat: "<350ms Query Retrieval",
    description: "Connect LLMs to proprietary PDFs, contracts, database tables, and code repositories using hybrid vector semantic search.",
    tech: ["Python", "Pgvector", "Pinecone", "LlamaIndex"]
  },
  {
    id: "voice",
    name: "Voice AI",
    subtitle: "Real-Time Voice Systems",
    icon: Smartphone,
    accent: "#10b981",
    stat: "<400ms Audio Latency",
    description: "Low-latency conversational voice AI agents for customer support hotline intake, appointment booking, and dispatch routing.",
    tech: ["Whisper", "WebRTC", "Twilio", "Python"]
  },
  {
    id: "docs",
    name: "Document Processing",
    subtitle: "Intelligent Document Parsing",
    icon: FileText,
    accent: "#f97316",
    stat: "Sub-Second Invoice OCR",
    description: "Automated extraction of structured key-value data from invoices, receipts, legal contracts, and scanned IDs at scale.",
    tech: ["Python", "OpenAI Vision", "AWS Textract", "PostgreSQL"]
  },
  {
    id: "whatsapp",
    name: "WhatsApp Automation",
    subtitle: "Conversational Commerce",
    icon: MessageSquare,
    accent: "#22c55e",
    stat: "24/7 Instant Lead Triage",
    description: "AI-driven WhatsApp bots connected to inventory databases, CRM pipelines, and automated customer appointment schedulers.",
    tech: ["Meta API", "Node.js", "Redis", "TypeScript"]
  },
  {
    id: "crm",
    name: "CRM Automation",
    subtitle: "Smart Pipeline Triage",
    icon: Workflow,
    accent: "#3b82f6",
    stat: "10x Faster Lead Route",
    description: "Intelligent lead scoring, automated CRM record enrichment, email follow-up generation, and deal risk telemetry.",
    tech: ["TypeScript", "HubSpot", "Salesforce API", "OpenAI"]
  },
  {
    id: "extraction",
    name: "Data Extraction",
    subtitle: "Unstructured Data to JSON",
    icon: Sparkles,
    accent: "#eab308",
    stat: "100% Schema Validated",
    description: "Transform unstructured raw email threads, web pages, and customer notes into strict, schema-validated JSON data models.",
    tech: ["Python", "Pydantic", "OpenAI", "Node.js"]
  },
  {
    id: "human",
    name: "Human Review",
    subtitle: "Human-in-the-Loop Oversight",
    icon: ShieldCheck,
    accent: "#ec4899",
    stat: "Zero Data Leakage",
    description: "Fail-safe human review dashboards where human operators can inspect, verify, and approve high-stakes AI decision outputs.",
    tech: ["React", "PostgreSQL", "Tailwind CSS", "RBAC"]
  }
];

function AiShowcaseSection() {
  const [activeId, setActiveId] = useState("agents");
  const current = useMemo(() => aiCapabilities.find((x) => x.id === activeId) || aiCapabilities[0], [activeId]);
  const CurrentIcon = current.icon;

  return (
    <section className="section ai-section-v5">
      <div className="container ai-grid-layout-v5">
        {/* Left Column Intro */}
        <div className="ai-intro-v5" data-reveal>
          <SectionHead
            light
            eyebrow="Applied AI and Automation"
            title="Make AI useful by connecting it to real work."
            copy="We combine context, trusted knowledge, system actions, guardrails, and human review so AI supports your core operational processes."
          />

          <div className="ai-trust-cards">
            <div className="ai-trust-item">
              <Bot size={18} />
              <div>
                <strong>Autonomous Multi-Agent Systems</strong>
                <span>Agents collaborate safely across your software tools to execute complex workflows.</span>
              </div>
            </div>

            <div className="ai-trust-item">
              <ShieldCheck size={18} />
              <div>
                <strong>Enterprise Guardrails & Privacy</strong>
                <span>Strict SOC2 data isolation, local vector security, and zero public data retention.</span>
              </div>
            </div>

            <div className="ai-trust-item">
              <Zap size={18} />
              <div>
                <strong>Sub-Second Knowledge Retrieval</strong>
                <span>Instant retrieval over millions of internal documents connected via hybrid RAG engines.</span>
              </div>
            </div>
          </div>

          <Link to="/services/ai-ai-agents" className="btn btn-light" style={{ width: "fit-content" }}>
            Explore AI Engineering <ArrowRight size={17} />
          </Link>
        </div>

        {/* Right Interactive Node Grid + Inspector */}
        <div className="ai-interactive-panel-v5" data-reveal>
          <div className="ai-nodes-grid-v5">
            {aiCapabilities.map((item) => {
              const NodeIcon = item.icon;
              const isActive = activeId === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveId(item.id)}
                  className={`ai-node-card-v5 ${isActive ? "active" : ""}`}
                  style={{ "--accent": item.accent } as React.CSSProperties}
                >
                  <div className="node-icon-v5">
                    <NodeIcon size={18} />
                  </div>
                  <div className="node-text-v5">
                    <strong>{item.name}</strong>
                    <span>{item.subtitle}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Active AI Inspector Drawer */}
          <AnimatePresence mode="wait">
            <motion.div
              key={current.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className="ai-inspector-v5"
              style={{ "--accent": current.accent } as React.CSSProperties}
            >
              <div className="inspector-header-v5">
                <div className="inspector-title-v5">
                  <CurrentIcon size={20} style={{ color: current.accent }} />
                  <h4>{current.name}</h4>
                  <span className="inspector-tag-v5">{current.subtitle}</span>
                </div>
                <div className="inspector-stat-v5">
                  <Sparkles size={12} />
                  <span>{current.stat}</span>
                </div>
              </div>

              <p className="inspector-desc-v5">{current.description}</p>

              <div className="inspector-tech-v5">
                <span className="inspector-tech-label">Engine Stack</span>
                {current.tech.map((t) => (
                  <TechMark key={t} name={t} compact />
                ))}
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="ai-bg-flare-1" aria-hidden="true" />
          <div className="ai-bg-flare-2" aria-hidden="true" />
        </div>
      </div>
    </section>
  );
}

const serviceAccents = ["#0878f9", "#14b8a6", "#8b5cf6", "#f97316", "#ec4899", "#16a34a", "#eab308", "#e11d48"];
const serviceIcons = [Network, Boxes, Zap, ShieldCheck, CircleDot, Network, Boxes, Zap];
function ServiceGrid() {
  return (
    <div className="service-grid-v2">
      {services.map((s, i) => {
        const accent = serviceAccents[i % serviceAccents.length];
        const Icon = serviceIcons[i % serviceIcons.length];
        return (
          <motion.article
            className="svc-card"
            key={s.slug}
            style={{ "--accent": accent, "--accent-soft": `${accent}18` } as React.CSSProperties}
            whileHover={{ y: -6, scale: 1.012 }}
            transition={{ type: "spring", damping: 22, stiffness: 260 }}
            data-reveal
          >
            <div className="svc-card-header">
              <span className="svc-num">0{i + 1}</span>
              <span className="svc-icon-wrap"><Icon size={20} /></span>
            </div>
            <h3>{s.title}</h3>
            <p>{s.short}</p>
            <div className="svc-stack">
              {s.stack.slice(0, 4).map((x) => (
                <TechMark key={x} name={x} compact />
              ))}
            </div>
            <Link className="svc-link" to={`/services/${s.slug}`}>
              Explore service <ArrowRight size={16} />
            </Link>
            <div className="svc-glow" aria-hidden="true" />
          </motion.article>
        );
      })}
    </div>
  );
}

const engagementStepsV5 = [
  {
    step: "01",
    name: "Discovery & Audit",
    accent: "#0878f9",
    icon: Compass,
    result: "Goals, user needs, operating constraints, and current software audit.",
    deliverables: ["Product Charter", "User Journey Map", "Tech Audit"]
  },
  {
    step: "02",
    name: "Solution Architecture",
    accent: "#14b8a6",
    icon: Layers,
    result: "Scope, risks, system boundaries, integration strategy, and delivery path.",
    deliverables: ["System Diagram", "API Specification", "Sprint Roadmap"]
  },
  {
    step: "03",
    name: "Experience & Interface",
    accent: "#8b5cf6",
    icon: Sparkles,
    result: "User flows, data schemas, interactive wireframes, and design system.",
    deliverables: ["Figma Prototype", "UI Design System", "UX Specification"]
  },
  {
    step: "04",
    name: "Agile Engineering",
    accent: "#f97316",
    icon: Boxes,
    result: "Working code increments with visible decisions and weekly live demos.",
    deliverables: ["Production Code", "CI/CD Pipelines", "Weekly Demo Builds"]
  },
  {
    step: "05",
    name: "Testing & Security",
    accent: "#16a34a",
    icon: ShieldCheck,
    result: "Quality assurance, security audits, load testing, and zero-downtime release.",
    deliverables: ["Security Audit", "QA Test Matrix", "Release Deployment"]
  },
  {
    step: "06",
    name: "Optimization & Support",
    accent: "#ec4899",
    icon: TrendingUp,
    result: "Performance tuning, telemetry, learning feedback loops, and evolution.",
    deliverables: ["SLA Monitoring", "Performance Index", "Feature Backlog"]
  }
];

function EngagementProcessV5() {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <section className="section process-section-v5">
      <div className="container">
        <SectionHead
          eyebrow="Engagement process"
          title="Decisions stay visible from discovery through operation."
          copy="Each phase produces concrete choices and engineering artifacts that reduce uncertainty for the next."
        />

        {/* Timeline Bar */}
        <div className="process-timeline-bar-v5" data-reveal>
          {engagementStepsV5.map((item, index) => (
            <button
              key={item.step}
              onClick={() => setActiveStep(index)}
              className={`timeline-step-node-v5 ${activeStep === index ? "active" : ""}`}
              style={{ "--step-accent": item.accent } as React.CSSProperties}
            >
              <div className="step-node-bubble-v5">{item.step}</div>
              <span className="step-node-label-v5">{item.name}</span>
            </button>
          ))}
        </div>

        {/* 6-Card Grid */}
        <div className="process-cards-grid-v5">
          {engagementStepsV5.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.step}
                className="process-card-v5"
                style={{ "--step-accent": item.accent } as React.CSSProperties}
                whileHover={{ y: -6, scale: 1.015 }}
                transition={{ type: "spring", damping: 22, stiffness: 260 }}
                onClick={() => setActiveStep(index)}
                data-reveal
              >
                <div className="card-header-v5">
                  <span className="step-num-v5">Step {item.step}</span>
                  <div className="step-icon-v5">
                    <Icon size={20} />
                  </div>
                </div>

                <h3>{item.name}</h3>
                <p>{item.result}</p>

                <div className="card-deliverables-v5">
                  {item.deliverables.map((deliv) => (
                    <span key={deliv}>{deliv}</span>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

const techCategoriesV5 = [
  { id: "all", label: "All Stack Capabilities" },
  { id: "backend", label: "Backend & APIs", items: ["Node.js", "Python", "PHP", "Laravel", "TypeScript", "JavaScript"] },
  { id: "frontend", label: "Frontend & Mobile", items: ["React", "Next.js", "Vue.js", "Tailwind CSS", "Flutter", "Android", "iOS", "HTML", "CSS"] },
  { id: "data", label: "Databases & Storage", items: ["PostgreSQL", "MySQL", "MongoDB", "Redis", "Pgvector"] },
  { id: "cloud", label: "Cloud & Infrastructure", items: ["Google Cloud", "AWS", "Azure", "Docker", "Linux", "GitHub Actions", "CI/CD"] },
  { id: "ai", label: "AI & Automation", items: ["OpenAI", "LLMs", "RAG", "AI Agents", "Voice AI", "n8n", "Make", "Zapier", "WhatsApp Business API"] },
  { id: "cms", label: "CMS & E-Commerce", items: ["WordPress", "WooCommerce", "Shopify", "Webflow", "Wix", "Squarespace", "Framer", "Magento / Adobe Commerce"] }
];

function TechEcosystemV5() {
  const [activeTab, setActiveTab] = useState("all");

  const filteredItems = useMemo<string[]>(() => {
    if (activeTab === "all") {
      return technologies.flatMap((t) => t.items || []);
    }
    const cat = techCategoriesV5.find((c) => c.id === activeTab);
    return cat?.items ? cat.items : technologies.flatMap((t) => t.items || []);
  }, [activeTab]);

  return (
    <section className="section tech-section-v5">
      <div className="container">
        <SectionHead
          light
          eyebrow="Technology Ecosystem"
          title="Technology selected for fit, not fashion."
          copy="A connected engineering stack across interfaces, applications, data, cloud, AI, and automation."
        />

        {/* Category Filter Pills */}
        <div className="tech-tabs-v5" data-reveal>
          {techCategoriesV5.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveTab(cat.id)}
              className={`tech-tab-btn-v5 ${activeTab === cat.id ? "active" : ""}`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Interactive Filtered Tech Grid */}
        <motion.div layout className="tech-interactive-grid-v5" data-reveal>
          <AnimatePresence mode="popLayout">
            {filteredItems.map((name) => (
              <motion.div
                key={name}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
                className="tech-chip-item-v5"
              >
                <TechMark name={name} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Smooth Infinite Marquee */}
        <div className="tech-marquee-wrap-v5">
          <TechMarquee />
        </div>

        {/* Action Link */}
        <div className="tech-footer-v5">
          <Link to="/technologies" className="btn btn-outline-light">
            Understand Our Technology Approach <ArrowRight size={16} />
          </Link>
        </div>
      </div>

      <div className="tech-glow-flare-1" aria-hidden="true" />
    </section>
  );
}

const whyPrinciplesV5 = [
  {
    num: "01",
    title: "Business-first technical thinking",
    icon: Compass,
    accent: "#0878f9",
    copy: "Engineering choices begin with business outcomes, operating constraints, and ROI, not short-lived technology trends."
  },
  {
    num: "02",
    title: "Architecture designed for growth",
    icon: Layers,
    accent: "#14b8a6",
    copy: "Modular, extensible software architecture built to handle scaling and evolving feature requirements without costly rewrites."
  },
  {
    num: "03",
    title: "Transparent communication",
    icon: MessageSquare,
    accent: "#8b5cf6",
    copy: "Clear visibility into progress, technical decisions, risks, and trade-offs explained through working software increments."
  },
  {
    num: "04",
    title: "Security and performance by design",
    icon: ShieldCheck,
    accent: "#16a34a",
    copy: "Least-privilege security, zero data leakage policies, and sub-second interface latency built into core architecture."
  },
  {
    num: "05",
    title: "Flexible engagement models",
    icon: Users,
    accent: "#f97316",
    copy: "Fixed-scope deliverables, dedicated engineering teams, or technical consulting matched to your internal roadmap."
  },
  {
    num: "06",
    title: "Complete product lifecycle support",
    icon: Workflow,
    accent: "#ec4899",
    copy: "Seamless ownership from initial discovery and UX testing through cloud launch and continuous SLA support."
  },
  {
    num: "07",
    title: "Integration across existing systems",
    icon: Unplug,
    accent: "#eab308",
    copy: "Connect new software seamlessly with your existing ERPs, CRMs, payment gateways, and proprietary SQL databases."
  },
  {
    num: "08",
    title: "Long-term technology partnership",
    icon: TrendingUp,
    accent: "#06b6d4",
    copy: "A committed engineering team dedicated to your long-term product health, architecture evolution, and technical advantage."
  }
];

function WhySempliqoV5() {
  return (
    <section className="section why-section-v5">
      <div className="container">
        <SectionHead
          eyebrow="Why Sempliqo"
          title="Technical depth directed by business context."
          copy="Eight core principles guiding every software architecture, delivery decision, and client engagement."
        />

        <div className="why-grid-v5">
          {whyPrinciplesV5.map((item) => {
            const Icon = item.icon;
            return (
              <motion.article
                key={item.num}
                className="why-card-v5"
                style={{ "--accent": item.accent } as React.CSSProperties}
                whileHover={{ y: -5 }}
                transition={{ duration: 0.22 }}
                data-reveal
              >
                <div className="why-card-header-v5">
                  <div className="why-icon-bubble-v5">
                    <Icon size={18} />
                  </div>
                  <span className="why-num-v5">{item.num}</span>
                </div>

                <h3>{item.title}</h3>
                <p>{item.copy}</p>

                <div className="why-num-watermark-v5" aria-hidden="true">
                  {item.num}
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function Home() {

  const faq = [
    ["Can Sempliqo help define my project requirements?", "Yes. Discovery turns an unclear opportunity into user flows, boundaries, priorities, technical options, and an evidence-based delivery plan."],
    ["Do you work with existing or legacy software?", "Yes. We assess the system, dependencies, risks, and continuity needs before proposing improvement or modernization."],
    ["Can you build an MVP and scale it later?", "Yes. The first release can be deliberately focused while preserving the foundations needed for growth."],
    ["Can you integrate our CRM, ERP, or payments?", "Yes. We assess APIs, data ownership, synchronization, exceptions, and security before implementation."],
    ["Do you provide ongoing maintenance?", "Yes. Support can cover monitoring, security, fixes, performance, features, and continuous technical planning."],
    ["Can you extend our internal team?", "Yes. Sempliqo can provide dedicated capacity with agreed responsibilities, communication, and quality controls."],
    ["How do you estimate cost and timeline?", "We estimate against scope, uncertainty, dependencies, quality needs, and engagement model, making assumptions explicit."],
    ["Can you implement AI without replacing current systems?", "Often, yes. AI can be introduced through APIs, workflow tools, retrieval layers, and human review around existing systems."]
  ];

  return (
    <>
      <Seo
        title="Software, AI and Digital Systems"
        description="Sempliqo designs, builds, integrates and scales custom software, web and mobile products, AI agents, automation, and cloud infrastructure."
        schema={{
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "Sempliqo",
          url: window.location.origin
        }}
      />
      <section className="hero">
        <Suspense fallback={<div className="hero-static" />}>
          <LazyHeroCanvas />
        </Suspense>
        <div className="hero-symbol">
          <Symbol />
        </div>
        <div className="container hero-content">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <p className="hero-brand">Sempliqo</p>
            <h1>Software, AI and digital systems engineered around your business.</h1>
            <p className="hero-copy">
              Sempliqo designs, builds, integrates and scales custom software, from web and mobile products to AI agents, business automation and cloud infrastructure.
            </p>
            <CtaRow />
            <div className="hero-signals">
              {["Strategy to deployment", "Web, mobile, SaaS and AI", "Integrations and automation", "Long-term technical support"].map((x) => (
                <span key={x}>
                  <Check size={15} />
                  {x}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <BusinessChallenges />

      <section className="section section-ice">
        <div className="container">
          <SectionHead
            eyebrow="Services"
            title="One engineering partner across the product lifecycle."
            copy="Move from strategy and architecture through delivery, integration, infrastructure, and continuous improvement."
          />
          <ServiceGrid />
        </div>
      </section>

      <SolutionShowcaseV4 />

      <AiShowcaseSection />

      <EngagementProcessV5 />

      <TechEcosystemV5 />

      <WhySempliqoV5 />

      <Models />

      <section className="section">
        <div className="container faq-layout">
          <SectionHead eyebrow="FAQ" title="Questions that help shape a sound engagement." />
          <Faq items={faq} />
        </div>
      </section>

      <Conversion />
    </>
  );
}

function TechMarquee() { const all = technologies.flatMap(t => t.items); return <div className="marquee" tabIndex={0} aria-label="Technology capabilities"><div>{[...all, ...all].map((x, i) => <span className="marquee-item" key={`${x}${i}`}><TechMark name={x} compact /></span>)}</div></div> }
const engagementModelsV5 = [
  {
    title: "Fixed-Scope Project",
    icon: Target,
    badge: "Milestone Delivery",
    accent: "#0878f9",
    copy: "For defined outcomes and boundaries with a planned delivery path, fixed milestones, and guaranteed scope."
  },
  {
    title: "Dedicated Engineering Team",
    icon: Users,
    badge: "Agile Integration",
    accent: "#14b8a6",
    copy: "For continuous development capacity fully integrated with your internal roadmap and engineering practices."
  },
  {
    title: "Product Development Partnership",
    icon: Handshake,
    badge: "Co-Engineering",
    accent: "#8b5cf6",
    copy: "For evolving products requiring collaborative discovery, full-stack engineering, and co-founding focus."
  },
  {
    title: "Technical Consulting",
    icon: Lightbulb,
    badge: "Architecture & Advisory",
    accent: "#f97316",
    copy: "For high-stakes architecture reviews, code audits, roadmap planning, or critical technical decisions."
  },
  {
    title: "Maintenance & SLA Support",
    icon: ShieldCheck,
    badge: "24/7 Operations",
    accent: "#16a34a",
    copy: "For live software applications needing reliable ownership, security patches, SLA support, and continuous evolution."
  }
];

function Models() {
  return (
    <section className="section models-section-v5">
      <div className="container">
        <SectionHead
          eyebrow="Engagement Models"
          title="A working model matched to the shape of the problem."
          copy="Choose the engagement structure that aligns with your timeline, internal capacity, and budget predictability."
        />

        <div className="models-grid-v5">
          {engagementModelsV5.map((model) => {
            const Icon = model.icon;
            return (
              <motion.div
                key={model.title}
                className="model-card-v5"
                style={{ "--accent": model.accent } as React.CSSProperties}
                whileHover={{ y: -6 }}
                transition={{ duration: 0.22 }}
                data-reveal
              >
                <div className="model-header-v5">
                  <div className="model-icon-bubble-v5">
                    <Icon size={20} />
                  </div>
                  <span className="model-badge-v5">{model.badge}</span>
                </div>

                <h3>{model.title}</h3>
                <p>{model.copy}</p>

                <Link to="/contact" className="model-link-v5">
                  Talk to an expert <ArrowRight size={15} />
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function Faq({ items }: { items: string[][] }) {
  const [active, setActive] = useState<number>(0);

  return (
    <div className="faq-container-v5">
      {items.map(([q, a], i) => {
        const isOpen = active === i;
        return (
          <div key={q} className={`faq-item-v5 ${isOpen ? "open" : ""}`}>
            <button
              onClick={() => setActive(isOpen ? -1 : i)}
              aria-expanded={isOpen}
              className="faq-trigger-v5"
            >
              <span className="faq-num-badge-v5">{String(i + 1).padStart(2, "0")}</span>
              <span className="faq-question-v5">{q}</span>
              <ChevronDown className={`faq-chevron-v5 ${isOpen ? "rotate" : ""}`} size={18} />
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                  className="faq-answer-wrap-v5"
                >
                  <p className="faq-answer-text-v5">{a}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
function PageHero({ eyebrow, title, copy, cta = true }: { eyebrow: string; title: string; copy: string; cta?: boolean }) { return <section className="page-hero"><div className="grid-lines" /><Symbol className="page-symbol" /><div className="container"><p className="eyebrow">{eyebrow}</p><h1>{title}</h1><p>{copy}</p>{cta && <CtaRow />}</div></section> }
function Breadcrumbs({ current, parent }: { current: string; parent?: string }) { return <nav className="breadcrumbs container" aria-label="Breadcrumb"><Link to="/">Home</Link><span>/</span>{parent && <><Link to={`/${parent.toLowerCase()}`}>{parent}</Link><span>/</span></>}<span aria-current="page">{current}</span></nav> }

function ServicesPage() { return <><Seo title="Software Development Services" description="Explore Sempliqo services across custom software, applications, SaaS, commerce, AI, automation, cloud, migration, and maintenance." /><PageHero eyebrow="Services" title="Engineering capability from product decision to long-term operation." copy="Choose a service pillar to explore the business problems, systems, technologies, integrations, and delivery considerations involved." /><Breadcrumbs current="Services" /><section className="section"><div className="container"><ServiceGrid /></div></section><section className="section section-ice"><div className="container"><SectionHead eyebrow="Complete capability map" title="Specialist services, organized around the outcome they support." copy="Expand each pillar to review every available capability without navigating an unreadable service wall." /><CapabilityAccordion /></div></section><Conversion /></> }
function CapabilityAccordion() { const [active, setActive] = useState(0); return <div className="cap-accordion">{services.map((s, i) => <div key={s.slug}><button onClick={() => setActive(i === active ? -1 : i)} aria-expanded={active === i}><span>0{i + 1}</span><strong>{s.title}</strong><ChevronDown className={active === i ? "rotate" : ""} /></button>{active === i && <div className="cap-content">{s.groups.map(g => <div key={g.title}><h3>{g.title}</h3><ul>{g.items.map(x => <li key={x}>{x}</li>)}</ul></div>)}</div>}</div>)}</div> }

const delivery = ["Discovery and assessment", "Scope and solution planning", "Experience and architecture", "Iterative engineering", "Quality and launch", "Optimization and support"];
const quality = [["Architecture", "Clear boundaries, documented decisions, and patterns chosen around change and scale."], ["Security", "Least-privilege access, secure data handling, dependency control, and threat-aware implementation."], ["Scalability", "Capacity planning, observability, asynchronous work, and data models suited to expected demand."], ["Quality", "Review, automated checks, accessible interfaces, test strategy, and controlled releases."]];
function ServicePage() { const { slug } = useParams(), service = services.find(s => s.slug === slug); if (!service) return <NotFound />; const related = services.filter(s => s.slug !== service.slug).slice(0, 3); const schema = { "@context": "https://schema.org", "@type": "Service", name: service.title, description: service.outcome, provider: { "@type": "Organization", name: "Sempliqo" } }; return <><Seo title={`${service.title} Services`} description={service.outcome} schema={schema} /><PageHero eyebrow={`${service.title} services`} title={service.outcome} copy={service.intro} /><Breadcrumbs parent="Services" current={service.title} /><section className="section"><div className="container two-col"><div><SectionHead eyebrow="Where it helps" title="Solve the operating problem before it compounds." />{service.problems.map(x => <div className="problem-row" key={x}><Zap size={18} /><span>{x}</span></div>)}</div><div className="build-panel"><h2>Systems Sempliqo can build</h2>{service.builds.map(x => <div key={x}><Check size={17} />{x}</div>)}</div></div></section><section className="section section-ice"><div className="container"><SectionHead eyebrow="Capabilities" title={`Complete ${service.title.toLowerCase()} scope.`} copy="Services can be combined into a focused workstream or a complete delivery engagement." /><div className="taxonomy-grid">{service.groups.map(g => <div key={g.title}><h3>{g.title}</h3><ul>{g.items.map(x => <li key={x}>{x}</li>)}</ul></div>)}</div></div></section><section className="section"><div className="container two-col"><div><SectionHead eyebrow="Operational use" title="Designed around context, not a fixed industry template." />{service.uses.map(x => <div className="use-row" key={x}><CircleDot size={16} />{x}</div>)}</div><div><SectionHead eyebrow="Technology and integration" title="A connected implementation approach." /><div className="tag-cloud">{service.stack.map(x => <span key={x}>{x}</span>)}</div><h3 className="integration-title">Integration possibilities</h3><div className="integration-list">{service.integrations.map(x => <span key={x}><Network size={15} />{x}</span>)}</div></div></div></section><section className="section section-dark"><div className="container"><SectionHead light eyebrow="Delivery" title="A controlled path from uncertainty to operation." /><div className="delivery-grid">{delivery.map((x, i) => <div key={x}><span>0{i + 1}</span><h3>{x}</h3></div>)}</div></div></section><section className="section"><div className="container"><SectionHead eyebrow="Engineering quality" title="Built for safe change after launch." /><div className="quality-grid">{quality.map(([a, b]) => <div key={a}><ShieldCheck /><h3>{a}</h3><p>{b}</p></div>)}</div></div></section><Models /><section className="section"><div className="container"><SectionHead eyebrow="Related services" title="Connect this capability to the wider system." /><div className="related-grid">{related.map(x => <Link to={`/services/${x.slug}`} key={x.slug}><h3>{x.title}</h3><p>{x.short}</p><ArrowRight /></Link>)}</div></div></section><section className="section"><div className="container faq-layout"><SectionHead eyebrow={`${service.title} FAQ`} title="Clarify the engagement before you commit." /><Faq items={service.faq.map(x => [x.q, x.a])} /></div></section><Conversion compact /></> }

function TechnologiesPage() { return <><Seo title="Technology Expertise" description="Understand how Sempliqo applies backend, frontend, mobile, commerce, database, cloud, AI, and automation technologies." /><PageHero eyebrow="Technologies" title="A technology ecosystem designed around product and operational fit." copy="We evaluate team context, security, integration, change frequency, scale, and total cost before selecting tools." /><Breadcrumbs current="Technologies" /><section className="section tech-section"><div className="container tech-groups">{technologies.map((t, i) => <article data-reveal key={t.title} style={{ "--group-accent": ["#0878f9", "#14b8a6", "#8b5cf6", "#f97316", "#16a34a", "#eab308", "#ec4899"][i] } as React.CSSProperties}><span>0{i + 1}</span><div><h2>{t.title}</h2><p>{t.copy}</p><div className="tech-logo-grid">{t.items.map(x => <TechMark name={x} key={x} />)}</div></div></article>)}</div></section><Conversion /></> }
function SolutionsPage() { return <><Seo title="Solutions by Business Need" description="Navigate Sempliqo software, AI, automation, commerce, cloud, and development services by the business change you need to make." /><PageHero eyebrow="Solutions" title="Begin with what needs to change in the business." copy="Use these common starting points to connect an operating goal to the right discovery, engineering, integration, and support capabilities." /><Breadcrumbs current="Solutions" /><section className="section"><div className="container solution-list">{solutions.map(([title, copy, slug], i) => <Link data-reveal to={`/services/${slug}`} key={title}><span>{String(i + 1).padStart(2, "0")}</span><div><h2>{title}</h2><p>{copy}</p></div><ArrowRight /></Link>)}</div></section><Conversion /></> }
function AboutPage() { const principles = [["Business-first engineering", "Technical decisions begin with users, operations, commercial constraints, and consequences of change."], ["Explicit decision-making", "Architecture and scope choices are documented with trade-offs so stakeholders can make informed decisions."], ["Communication with context", "Progress is explained through working outcomes, unresolved questions, risks, and next decisions."], ["Quality as an operating practice", "Security, performance, accessibility, testing, and maintainability are part of delivery."], ["Partnership without dependency", "Documentation, understandable systems, and transparent planning preserve your control."], ["Consulting that leads to action", "Audits and discovery conclude with priorities and practical next steps."]]; return <><Seo title="About Sempliqo" description="Learn about Sempliqo's business-first engineering philosophy, technical decision process, delivery principles, and partnership models." /><PageHero eyebrow="About Sempliqo" title="A technology partner for consequential software decisions." copy="Sempliqo combines consulting, product thinking, and engineering to help businesses plan, build, connect, and operate technology with greater clarity." /><Breadcrumbs current="About" /><section className="section"><div className="container"><SectionHead eyebrow="Operating philosophy" title="Clarity before complexity. Maintainability after launch." copy="We focus on the quality of decisions as well as the quality of implementation." /><div className="about-principles">{principles.map(([a, b], i) => <div data-reveal key={a}><span>0{i + 1}</span><h3>{a}</h3><p>{b}</p></div>)}</div></div></section><section className="section section-dark"><div className="container two-col"><SectionHead light eyebrow="Partnership approach" title="The right depth of involvement for each stage." copy="Engage Sempliqo for discovery, architecture, product delivery, team extension, or continuous maintenance." /><div className="consult-panel"><h3>What remains visible</h3>{["Business and technical assumptions", "Scope boundaries and dependencies", "Architecture decisions and trade-offs", "Quality and release criteria", "Risks, priorities, and next decisions"].map(x => <p key={x}><Check />{x}</p>)}</div></div></section><Conversion /></> }

const insightTopics = ["Software strategy", "SaaS development", "AI implementation", "Business automation", "E-commerce engineering", "Cloud and DevOps", "Performance and security"];
function InsightsPage() { return <><Seo title="Technology Insights" description="Sempliqo insights on software strategy, SaaS, AI implementation, automation, e-commerce, cloud, performance, and security." /><PageHero eyebrow="Insights" title="Practical guidance for software and technology decisions." copy="This publication framework is ready for reviewed Sempliqo content. No fabricated dates, authors, or claims are shown." /><Breadcrumbs current="Insights" /><section className="section"><div className="container"><SectionHead eyebrow="Topics" title="Build an informed technology roadmap." /><div className="insight-grid">{insightTopics.map((x, i) => <Link to={`/insights/${x.toLowerCase().replace(/ /g, "-").replace("-and-", "-")}`} key={x}><span>Guide {String(i + 1).padStart(2, "0")}</span><h2>{x}</h2><p>Decision frameworks, implementation considerations, and questions to resolve before committing resources.</p><b>Read topic template <ArrowRight size={16} /></b></Link>)}</div></div></section><Conversion /></> }
function ArticlePage() { const { slug = "software-strategy" } = useParams(), topic = slug.split("-").map(x => x[0]?.toUpperCase() + x.slice(1)).join(" "); return <><Seo title={topic} description={`Sempliqo guidance and decision frameworks for ${topic.toLowerCase()}.`} schema={{ "@context": "https://schema.org", "@type": "Article", headline: topic, publisher: { "@type": "Organization", name: "Sempliqo" } }} /><PageHero eyebrow="Sempliqo insight" title={topic} copy="A configurable article template for future expert content, with accessible structure and article metadata support." cta={false} /><Breadcrumbs parent="Insights" current={topic} /><article className="article container"><p className="lead">This template is intentionally publication-ready without inventing an author, date, research, or business claim.</p><h2>Decision context</h2><p>Frame the business decision, affected users, current constraints, and why the issue matters before evaluating a technical response.</p><h2>Questions to resolve</h2><p>Identify ownership, data, security, integration, operational, adoption, and maintenance questions. Explicit unknowns produce a more reliable plan.</p><h2>Implementation considerations</h2><p>Compare options against actual capacity, system landscape, risk tolerance, and expected pace of change. Document trade-offs and evidence.</p><div className="article-cta"><h2>Apply this thinking to your project.</h2><Link className="btn btn-primary" to="/contact">Request a Technical Consultation</Link></div></article></> }

const enquirySchema = z.object({ name: z.string().min(2, "Enter your name"), email: z.string().email("Enter a valid work email"), phone: z.string().optional(), company: z.string().min(2, "Enter your company"), projectType: z.string().min(1, "Select a project type"), services: z.string().min(1, "Select a service"), description: z.string().min(30, "Please provide at least 30 characters"), stage: z.string().min(1, "Select the current stage"), timeline: z.string().min(1, "Select a timeline"), budget: z.string().min(1, "Select an indicative range"), contactMethod: z.string().min(1, "Select a contact method"), consent: z.literal(true, { error: "Consent is required" }), website: z.string().max(0, "Spam detected").optional() }); type Enquiry = z.infer<typeof enquirySchema>;
const projectTypes = ["New software product", "Existing application improvement", "Website or web application", "Mobile application", "SaaS platform", "E-commerce or CMS", "AI or AI agent", "Automation or integration", "Migration or modernization", "Maintenance or dedicated team", "Technical consultation", "Not sure yet"];
function EnquiryForm({ compact = false }: { compact?: boolean }) {
  const [step, setStep] = useState(1), [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle"), [errorMessage, setErrorMessage] = useState("");
  const { startLoading, stopLoading } = useLoading();
  const { register, handleSubmit, trigger, reset, formState: { errors } } = useForm<Enquiry>({ resolver: zodResolver(enquirySchema), defaultValues: { website: "" } });
  
  const next = async () => { if (await trigger(["projectType", "services", "description"])) setStep(2) };
  
  const submit = async (data: Enquiry) => {
    setStatus("loading");
    setErrorMessage("");
    const loadId = "contact-form-submit";
    startLoading(loadId, { scope: "global", message: "Sending project enquiry..." });
    
    try {
      const res = await fetch(contactEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json().catch(() => null);
      if (!res.ok) {
        setErrorMessage(json?.message || "Something went wrong while sending your message. Please try again.");
        throw new Error();
      }
      reset();
      setStatus("success");
    } catch {
      setStatus("error");
      if (!errorMessage) setErrorMessage("Something went wrong while sending your message. Please try again.");
    } finally {
      stopLoading(loadId);
    }
  };

  if (status === "success")
    return (
      <div className="form-success" role="status">
        <Check />
        <h3>Thanks for contacting Sempliqo. We'll get back to you shortly.</h3>
        <p>The configured Sempliqo contact workflow will use your preferred method to continue the technical conversation.</p>
      </div>
    );

  return (
    <form className={`enquiry-form ${compact ? "compact" : ""}`} onSubmit={handleSubmit(submit)} noValidate>
      <div className="form-progress">
        <span>Project</span>
        <i />
        <span>Contact</span>
      </div>
      <input className="honey" tabIndex={-1} autoComplete="off" {...register("website")} aria-hidden="true" />
      {step === 1 ? (
        <div className="form-fields">
          <Select label="Project type" error={errors.projectType?.message} options={projectTypes} reg={register("projectType")} />
          <Select label="Services needed" error={errors.services?.message} options={services.map((s) => s.title)} reg={register("services")} />
          <Field area label="Brief project description" error={errors.description?.message} reg={register("description")} placeholder="What needs to change, who will use it, and what systems are involved?" />
          <button type="button" className="btn btn-primary form-next" onClick={next}>
            Continue <ArrowRight size={17} />
          </button>
        </div>
      ) : (
        <div className="form-fields">
          <Field label="Name" error={errors.name?.message} reg={register("name")} />
          <Field label="Work email" type="email" error={errors.email?.message} reg={register("email")} />
          <Field label="Phone or WhatsApp (optional)" reg={register("phone")} />
          <Field label="Company" error={errors.company?.message} reg={register("company")} />
          <Select label="Current project stage" error={errors.stage?.message} options={["Exploring options", "Requirements in progress", "Ready to scope", "In development", "Live and needs improvement"]} reg={register("stage")} />
          <Select label="Desired timeline" error={errors.timeline?.message} options={["As soon as practical", "Within 3 months", "3 to 6 months", "6+ months", "Not sure"]} reg={register("timeline")} />
          <Select label="Indicative budget range" error={errors.budget?.message} options={["To be determined", "Under $10,000", "$10,000 - $25,000", "$25,000 - $75,000", "$75,000+"]} reg={register("budget")} />
          <Select label="Preferred contact method" error={errors.contactMethod?.message} options={["Email", "Phone", "WhatsApp", "Video call"]} reg={register("contactMethod")} />
          <label className="file-label">
            Optional brief or reference file
            <input type="file" accept=".pdf,.doc,.docx,.txt,.png,.jpg" />
          </label>
          <label className="consent">
            <input type="checkbox" {...register("consent")} />
            <span>I consent to Sempliqo using this information to assess and discuss my enquiry.</span>
          </label>
          {errors.consent && <small className="error">{errors.consent.message}</small>}
          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={() => setStep(1)} disabled={status === "loading"}>
              Back
            </button>
            <ActionButton
              type="submit"
              loading={status === "loading"}
              loadingText="Submitting Enquiry..."
              variant="primary"
            >
              Submit Project Enquiry
            </ActionButton>
          </div>
          {status === "error" && (
            <p className="error" role="alert">
              {errorMessage || "Something went wrong while sending your message. Please try again."}
            </p>
          )}
        </div>
      )}
    </form>
  );
}
function Field({ label, reg, error, area, type = "text", placeholder }: any) { const id = label.toLowerCase().replace(/ /g, "-"); return <label htmlFor={id}>{label}{area ? <textarea id={id} {...reg} placeholder={placeholder} aria-invalid={!!error} /> : <input id={id} type={type} {...reg} aria-invalid={!!error} />} {error && <small className="error">{error}</small>}</label> }
function Select({ label, reg, error, options }: any) { const id = label.toLowerCase().replace(/ /g, "-"); return <label htmlFor={id}>{label}<select id={id} {...reg} aria-invalid={!!error}><option value="">Select an option</option>{options.map((x: string) => <option key={x}>{x}</option>)}</select>{error && <small className="error">{error}</small>}</label> }
function ContactPage() { return <><Seo title="Discuss Your Software Project" description="Tell Sempliqo about your software, AI, automation, cloud, commerce, or development requirement through a structured project enquiry." /><PageHero eyebrow="Project enquiry" title="Bring the business problem. We will help structure the technical conversation." copy="Share what you know now. You do not need a complete specification to begin." cta={false} /><Breadcrumbs current="Contact" /><section className="section"><div className="container contact-layout"><div><SectionHead eyebrow="Discuss your project" title="A focused first step." copy="Your information helps identify the relevant questions, technical disciplines, and a suitable way to engage." /><div className="expect-list"><h3>What happens next</h3>{["Your context and requirements are reviewed", "Open questions and dependencies are identified", "A suitable consultation or discovery path is proposed", "No timeline or cost is committed without sufficient scope"].map(x => <p key={x}><Check />{x}</p>)}<p className="config-note">Email, phone, address, and response expectations are business-controlled fields and are not invented here.</p></div></div><EnquiryForm /></div></section></> }
function Conversion({ compact = false }: { compact?: boolean }) {
  return (
    <section className="conversion-section-v5">
      <div className="container conversion-layout-v5">
        <div className="conversion-info-v5" data-reveal>
          <span className="conversion-eyebrow-v5">Start a Technical Conversation</span>
          <h2>Have a product to launch, a system to improve, or a process to automate?</h2>
          <p>Share your business context and current challenges. Sempliqo helps frame the right architecture, roadmap, and delivery options.</p>

          <div className="conversion-signals-v5">
            {[
              "Zero-obligation initial architecture review",
              "100% IP and full repository ownership",
              "Direct access to senior engineering leads"
            ].map((text) => (
              <div className="conversion-signal-item-v5" key={text}>
                <Check size={16} />
                <span>{text}</span>
              </div>
            ))}
          </div>

          <div className="conversion-cta-group-v5">
            <Link to="/contact" className="btn btn-primary-glow">
              Discuss Your Project <ArrowRight size={17} />
            </Link>
            <Link to="/contact" className="btn btn-outline-glass">
              Book a Consultation
            </Link>
          </div>
        </div>

        {!compact && (
          <div className="conversion-form-wrap-v5" data-reveal>
            <EnquiryForm compact />
          </div>
        )}
      </div>

      <div className="conversion-glow-flare" aria-hidden="true" />
    </section>
  );
}
function PolicyPage() { const { policy } = useParams(), valid: Record<string, string> = { privacy: "Privacy Policy", terms: "Terms of Use", cookies: "Cookie Policy" }, title = valid[policy || ""]; if (!title) return <NotFound />; return <><Seo title={title} description={`${title} template for Sempliqo.`} /><PageHero eyebrow="Legal" title={title} copy="A transparent, configurable legal template to be reviewed and completed for Sempliqo's operating jurisdictions before publication." cta={false} /><article className="article container"><h2>Business details and scope</h2><p>Insert the applicable legal entity, registered address, contact information, governing jurisdiction, and effective date following professional legal review.</p><h2>Information and services</h2><p>Describe the data, cookies, services, responsibilities, retention practices, subprocessors, and user rights that apply to the deployed website and enquiry workflow.</p><h2>Contact and updates</h2><p>Provide the configured privacy or legal contact and explain how material updates will be communicated. This template is not legal advice.</p></article></> }
function NotFound() { return <section className="not-found"><Seo title="Page Not Found" description="The requested Sempliqo page could not be found." /><h1>That page is not available.</h1><p>Use the service overview or begin a project conversation.</p><CtaRow /></section> }
export default function App() { return <BrowserRouter><LoadingProvider><Layout /></LoadingProvider></BrowserRouter> }