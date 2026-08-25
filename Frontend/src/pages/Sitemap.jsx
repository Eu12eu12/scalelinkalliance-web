// src/pages/Sitemap.jsx
import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FaHome, FaUsers, FaIdCard, FaBriefcase, FaBook, FaSearch,
  FaEnvelope, FaFileContract, FaArrowRight, FaSitemap, FaGlobe,
  FaChevronRight, FaCheck, FaTimes
} from 'react-icons/fa';

const SITEMAP_SECTIONS = [
  {
    title: 'Main',
    icon: <FaHome />,
    description: 'Core pages of ScaleLink Alliance',
    links: [
      { label: 'Home', to: '/', slug: '/' },
      { label: 'How It Works', to: '/how-it-works', slug: '/how-it-works' },
      { label: 'About', to: '/about', slug: '/about' },
      { label: 'Partners', to: '/business-partners', slug: '/business-partners' },
      { label: 'Contact', to: '/contact', slug: '/contact' },
    ],
  },
  {
    title: 'Chapters',
    icon: <FaUsers />,
    description: 'Local chapter information',
    links: [
      { label: 'Chapters', to: '/chapters', slug: '/chapters' },
      { label: 'Start a Chapter', to: '/become-director', slug: '/become-director' },
    ],
  },
  {
    title: 'Membership',
    icon: <FaIdCard />,
    description: 'Join and membership details',
    links: [
      { label: 'Membership', to: '/membership', slug: '/membership' }
    ],
  },
  {
    title: 'Services',
    icon: <FaBriefcase />,
    description: 'All professional services',
    links: [
      { label: 'All Services', to: '/services', slug: '/services' },
      { label: 'Website Development', to: '/services/website-development', slug: '/services/website-development' },
      { label: 'SEO & Search Marketing', to: '/services/seo-marketing', slug: '/services/seo-marketing' },
      { label: 'Lead Generation', to: '/services/lead-generation', slug: '/services/lead-generation' },
      { label: 'Paid Advertising', to: '/services/paid-advertising', slug: '/services/paid-advertising' },
      { label: 'Landing Pages & Funnels', to: '/services/landing-pages', slug: '/services/landing-pages' },
      { label: 'CRM & Marketing Automation', to: '/services/crm-automation', slug: '/services/crm-automation' },
      { label: 'API Integration', to: '/services/api-integration', slug: '/services/api-integration' },
      { label: 'Web Apps & SaaS', to: '/services/web-applications', slug: '/services/web-applications' },
      { label: 'Copywriting & Content', to: '/services/copywriting', slug: '/services/copywriting' },
      { label: 'Graphic Design', to: '/services/graphic-design', slug: '/services/graphic-design' },
      { label: 'Brand Identity & Logo', to: '/services/brand-identity', slug: '/services/brand-identity' },
      { label: 'Video & Motion Graphics', to: '/services/video-editing', slug: '/services/video-editing' },
      { label: 'Photography & Visual Assets', to: '/services/photography', slug: '/services/photography' },
      { label: 'Virtual Assistant Services', to: '/services/virtual-assistant', slug: '/services/virtual-assistant' },
    ],
  },
  {
    title: 'Resources',
    icon: <FaBook />,
    description: 'Knowledge base and articles',
    links: [
      { label: 'Resources', to: '/resources', slug: '/resources' }
    ],
  },
  {
    title: 'Free Website Review',
    icon: <FaSearch />,
    description: 'Free audit and analysis',
    links: [
      { label: 'Free Website Review', to: '/free-website-review', slug: '/free-website-review' }
    ],
  },
  {
    title: 'Legal & Utility',
    icon: <FaFileContract />,
    description: 'Privacy, terms',
    links: [
      { label: 'Privacy Policy', to: '/legal?tab=privacy', slug: '/legal?tab=privacy' },
      { label: 'Terms & Conditions', to: '/legal?tab=terms', slug: '/legal?tab=terms' },
      { label: 'Payment & Escrow Terms', to: '/legal?tab=escrow', slug: '/legal?tab=escrow' },
    ],
  },
];

const sectionStyles = {
  Main: {
    icon: 'from-blue-500 to-cyan-500',
    soft: 'bg-blue-50 text-blue-600',
    ring: 'ring-blue-100',
  },
  Chapters: {
    icon: 'from-violet-500 to-purple-600',
    soft: 'bg-violet-50 text-violet-600',
    ring: 'ring-violet-100',
  },
  Membership: {
    icon: 'from-emerald-500 to-teal-500',
    soft: 'bg-emerald-50 text-emerald-600',
    ring: 'ring-emerald-100',
  },
  Services: {
    icon: 'from-orange-500 to-amber-500',
    soft: 'bg-orange-50 text-orange-600',
    ring: 'ring-orange-100',
  },
  Resources: {
    icon: 'from-fuchsia-500 to-pink-500',
    soft: 'bg-fuchsia-50 text-fuchsia-600',
    ring: 'ring-fuchsia-100',
  },
  'Free Website Review': {
    icon: 'from-rose-500 to-red-500',
    soft: 'bg-rose-50 text-rose-600',
    ring: 'ring-rose-100',
  },
  'Legal & Utility': {
    icon: 'from-slate-500 to-slate-700',
    soft: 'bg-slate-100 text-slate-600',
    ring: 'ring-slate-200',
  },
};

const Sitemap = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedSections, setExpandedSections] = useState({});
  const [activeFilter, setActiveFilter] = useState('All');

  useEffect(() => {
    document.title = 'Sitemap | ScaleLink Alliance | Business Growth, Web';

    const setMeta = (name, content) => {
      let tag = document.querySelector(`meta[name="${name}"]`);
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute('name', name);
        document.head.appendChild(tag);
      }
      tag.setAttribute('content', content);
    };

    setMeta(
      'description',
      'Complete sitemap of ScaleLink Alliance - Find all business services, chapters, membership options, resources, and more.'
    );

    return () => {
      document.title = 'ScaleLink Alliance';
    };
  }, []);

  const toggleSection = (title) => {
    setExpandedSections((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

  const filteredSections = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    return SITEMAP_SECTIONS
      .filter((section) => activeFilter === 'All' || section.title === activeFilter)
      .map((section) => ({
        ...section,
        links: section.links.filter(
          (link) =>
            !term ||
            link.label.toLowerCase().includes(term) ||
            link.slug.toLowerCase().includes(term)
        ),
      }))
      .filter((section) => section.links.length > 0);
  }, [searchTerm, activeFilter]);

  const totalPages = SITEMAP_SECTIONS.reduce(
    (total, section) => total + section.links.length,
    0
  );

  const serviceCount =
    SITEMAP_SECTIONS.find((section) => section.title === 'Services')?.links.length || 0;

  const filterOptions = ['All', ...SITEMAP_SECTIONS.map((section) => section.title)];

  return (
    <main className="min-h-screen overflow-hidden bg-slate-50 text-slate-900">

      {/* HERO */}
      <section className="relative isolate overflow-hidden bg-slate-950">
        <div className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-blue-600/25 blur-3xl" />
        <div className="pointer-events-none absolute -right-24 top-10 h-[28rem] w-[28rem] rounded-full bg-cyan-500/15 blur-3xl" />

        <div
          className="pointer-events-none absolute inset-0 opacity-[0.12]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,.14) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.14) 1px, transparent 1px)',
            backgroundSize: '44px 44px',
          }}
        />

        <div className="relative mx-auto max-w-7xl px-5 pb-24 pt-14 sm:px-8 lg:px-10 lg:pb-32 lg:pt-20">
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65 }}
            className="mx-auto max-w-4xl text-center"
          >
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.07] px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-blue-200 backdrop-blur">
              <FaSitemap />
              ScaleLink Alliance
              <span className="h-1 w-1 rounded-full bg-blue-300" />
              Website Sitemap
            </div>

            <h1 className="text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-7xl">
              Everything you need.
              <span className="block bg-gradient-to-r from-blue-300 via-cyan-300 to-white bg-clip-text text-transparent">
                All in one place.
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
              Explore the complete ScaleLink Alliance ecosystem — from business
              services and chapters to resources, membership and your free website review.
            </p>

            <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                to="/free-website-review"
                className="group inline-flex items-center gap-2 rounded-2xl bg-white px-6 py-3.5 text-sm font-extrabold text-slate-950 shadow-xl transition hover:-translate-y-0.5 hover:shadow-2xl"
              >
                Get a Free Website Review
                <FaArrowRight className="text-xs transition-transform group-hover:translate-x-1" />
              </Link>

              <Link
                to="/services"
                className="inline-flex items-center gap-2 rounded-2xl border border-white/15 bg-white/[0.06] px-6 py-3.5 text-sm font-bold text-white backdrop-blur transition hover:bg-white/10"
              >
                Explore Services
              </Link>
            </div>
          </motion.div>
        </div>

        <div className="absolute -bottom-px left-0 right-0 h-10 bg-slate-50 [clip-path:ellipse(65%_100%_at_50%_100%)]" />
      </section>

      {/* SEARCH + FILTER */}
      <section className="relative z-10 -mt-2 px-5 sm:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="rounded-3xl border border-slate-200 bg-white p-3 shadow-[0_20px_70px_-35px_rgba(15,23,42,.45)]">
            <div className="relative">
              <FaSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" />

              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search pages, services, URLs..."
                className="w-full rounded-2xl bg-slate-50 py-4 pl-12 pr-12 text-sm font-medium text-slate-800 outline-none ring-1 ring-inset ring-transparent transition placeholder:text-slate-400 focus:bg-white focus:ring-blue-500"
              />

              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full p-2 text-slate-400 transition hover:bg-slate-200 hover:text-slate-700"
                  aria-label="Clear search"
                >
                  <FaTimes />
                </button>
              )}
            </div>

            <div className="mt-3 flex gap-2 overflow-x-auto px-1 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {filterOptions.map((filter) => (
                <button
                  key={filter}
                  type="button"
                  onClick={() => setActiveFilter(filter)}
                  className={`whitespace-nowrap rounded-xl px-4 py-2 text-xs font-bold transition ${
                    activeFilter === filter
                      ? 'bg-slate-950 text-white shadow-md'
                      : 'bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-800'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CONTENT */}
      <section className="px-5 py-14 sm:px-8 lg:py-20">
        <div className="mx-auto max-w-7xl">

          {/* STATS */}
          <div className="mb-12 grid grid-cols-2 gap-4 lg:grid-cols-4">
            {[
              ['Core Sections', SITEMAP_SECTIONS.length, FaGlobe, 'blue'],
              ['Service Pages', serviceCount, FaBriefcase, 'orange'],
              ['Total Pages', totalPages, FaBook, 'violet'],
              ['Navigation', '100%', FaCheck, 'emerald'],
            ].map(([label, value, Icon, tone], index) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ delay: index * 0.06 }}
                className="group rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl sm:p-6"
              >
                <div
                  className={`mb-5 flex h-11 w-11 items-center justify-center rounded-2xl ${
                    tone === 'blue'
                      ? 'bg-blue-50 text-blue-600'
                      : tone === 'orange'
                      ? 'bg-orange-50 text-orange-600'
                      : tone === 'violet'
                      ? 'bg-violet-50 text-violet-600'
                      : 'bg-emerald-50 text-emerald-600'
                  }`}
                >
                  <Icon />
                </div>
                <div className="text-2xl font-black tracking-tight sm:text-3xl">
                  {value}
                </div>
                <div className="mt-1 text-xs font-semibold uppercase tracking-wider text-slate-400">
                  {label}
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mb-7 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
            <div>
              <p className="mb-2 text-xs font-black uppercase tracking-[0.18em] text-blue-600">
                Explore the ecosystem
              </p>
              <h2 className="text-2xl font-black tracking-tight sm:text-3xl">
                Browse every section
              </h2>
            </div>

            <p className="text-sm text-slate-500">
              {filteredSections.length} section
              {filteredSections.length === 1 ? '' : 's'} visible
            </p>
          </div>

          {/* CARDS */}
          {filteredSections.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
              {filteredSections.map((section, index) => {
                const styles = sectionStyles[section.title] || sectionStyles.Main;
                const isExpanded = !!expandedSections[section.title];
                const visibleLinks = isExpanded
                  ? section.links
                  : section.links.slice(0, 6);

                return (
                  <motion.article
                    key={section.title}
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.12 }}
                    transition={{ duration: 0.45, delay: index * 0.045 }}
                    className="group relative overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-2xl"
                  >
                    <div className={`h-1.5 w-full bg-gradient-to-r ${styles.icon}`} />

                    <div className="p-6">
                      <div className="mb-5 flex items-start justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${styles.icon} text-lg text-white shadow-lg ring-4 ${styles.ring}`}
                          >
                            {section.icon}
                          </div>

                          <div>
                            <h3 className="font-black tracking-tight text-slate-900">
                              {section.title}
                            </h3>
                            <p className="mt-0.5 text-xs font-medium text-slate-400">
                              {section.description}
                            </p>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => toggleSection(section.title)}
                          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${styles.soft} transition hover:scale-105`}
                          aria-label={`${isExpanded ? 'Collapse' : 'Expand'} ${section.title}`}
                        >
                          <FaChevronRight
                            className={`text-xs transition-transform duration-300 ${
                              isExpanded ? 'rotate-90' : ''
                            }`}
                          />
                        </button>
                      </div>

                      <div className="space-y-1">
                        {visibleLinks.map((link) => (
                          <Link
                            key={link.slug}
                            to={link.to}
                            className="group/link flex items-center justify-between rounded-xl px-3 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 hover:text-slate-950"
                          >
                            <span className="flex min-w-0 items-center gap-3">
                              <span
                                className={`h-1.5 w-1.5 shrink-0 rounded-full transition group-hover/link:scale-125 ${
                                  styles.soft.includes('text-blue')
                                    ? 'bg-blue-400'
                                    : styles.soft.includes('text-violet')
                                    ? 'bg-violet-400'
                                    : styles.soft.includes('text-emerald')
                                    ? 'bg-emerald-400'
                                    : styles.soft.includes('text-orange')
                                    ? 'bg-orange-400'
                                    : styles.soft.includes('text-fuchsia')
                                    ? 'bg-fuchsia-400'
                                    : styles.soft.includes('text-rose')
                                    ? 'bg-rose-400'
                                    : 'bg-slate-400'
                                }`}
                              />
                              <span className="truncate">{link.label}</span>
                            </span>

                            <FaArrowRight className="shrink-0 text-[10px] text-slate-300 opacity-0 transition-all group-hover/link:translate-x-1 group-hover/link:text-slate-600 group-hover/link:opacity-100" />
                          </Link>
                        ))}
                      </div>

                      {section.links.length > 6 && (
                        <button
                          type="button"
                          onClick={() => toggleSection(section.title)}
                          className={`mt-3 inline-flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-black ${styles.soft} transition hover:brightness-95`}
                        >
                          {isExpanded
                            ? 'Show less'
                            : `Show ${section.links.length - 6} more`}
                          <FaChevronRight
                            className={`text-[9px] transition-transform ${
                              isExpanded ? '-rotate-90' : ''
                            }`}
                          />
                        </button>
                      )}

                      <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                          {section.links.length}{' '}
                          {section.links.length === 1 ? 'page' : 'pages'}
                        </span>
                        <span className="text-[11px] font-semibold text-slate-300">
                          ScaleLink
                        </span>
                      </div>
                    </div>
                  </motion.article>
                );
              })}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="rounded-[2rem] border border-dashed border-slate-300 bg-white px-6 py-20 text-center"
            >
              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-2xl text-slate-400">
                <FaSearch />
              </div>

              <h3 className="text-xl font-black text-slate-900">
                No pages found
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                Try a different page name, URL, or section.
              </p>

              <button
                type="button"
                onClick={() => {
                  setSearchTerm('');
                  setActiveFilter('All');
                }}
                className="mt-6 rounded-xl bg-slate-950 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-600"
              >
                Reset search
              </button>
            </motion.div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden bg-slate-950 px-5 py-16 sm:px-8">
        <div className="pointer-events-none absolute -right-32 -top-32 h-80 w-80 rounded-full bg-blue-600/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-40 left-1/4 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative mx-auto flex max-w-6xl flex-col items-start justify-between gap-8 rounded-[2rem] border border-white/10 bg-white/[0.05] p-7 backdrop-blur sm:p-10 lg:flex-row lg:items-center"
        >
          <div className="flex items-start gap-5">
            <div className="hidden h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-blue-500/15 text-xl text-blue-300 sm:flex">
              <FaEnvelope />
            </div>

            <div>
              <p className="mb-2 text-xs font-black uppercase tracking-[0.18em] text-blue-300">
                Need a hand?
              </p>

              <h2 className="text-2xl font-black text-white sm:text-3xl">
                Can't find what you're looking for?
              </h2>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
                Our team can help you find the right service, resource, or next step for your business.
              </p>
            </div>
          </div>

          <Link
            to="/contact"
            className="group inline-flex shrink-0 items-center gap-3 rounded-2xl bg-white px-6 py-3.5 text-sm font-black text-slate-950 shadow-xl transition hover:-translate-y-0.5 hover:bg-blue-50"
          >
            Contact ScaleLink
            <FaArrowRight className="text-xs transition-transform group-hover:translate-x-1" />
          </Link>
        </motion.div>
      </section>
    </main>
  );
};

export default Sitemap;