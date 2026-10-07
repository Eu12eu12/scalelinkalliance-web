// src/pages/ResourcesPage.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaFileAlt, FaNetworkWired, FaHandshake, FaChartLine, FaDownload, FaVideo, FaBookOpen, FaCalculator, FaArrowRight, FaTimes, FaChevronLeft, FaChevronRight, FaShareAlt, FaPrint, FaTags, FaCalendarAlt } from 'react-icons/fa';

// Helper to format dates to "Month DD, YYYY"
const formatDate = (dateString) => {
  if (!dateString) return 'January 04, 2026'; // Fallback
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: '2-digit',
    year: 'numeric'
  }).format(date);
};

// Component for individual document articles
// Replaces regular hyphens between letters with Non-Breaking Hyphen (U+2011)
// so the browser cannot use them as line-break opportunities.
// Only processes text â€” safely skips HTML tags and their attributes.
const fixCompoundHyphens = (html) => {
  if (!html) return html;
  // Split on HTML tags (< ... >). Process text segments only.
  return html
    .split(/(<[^>]+>)/)
    .map((segment) => {
      // Skip HTML tags â€” they start with '<'
      if (segment.startsWith('<')) return segment;
      // Replace letter-hyphen-letter with letter + non-breaking hyphen (U+2011) + letter
      return segment.replace(/([a-zA-Z])-([a-zA-Z])/g, '$1\u2011$2');
    })
    .join('');
};

const DocumentArticle = ({ title, content, author, imageUrl, date, onClose, isHtml }) => {
  // For CMS rich HTML content, render directly without the static text processor
  if (isHtml) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-75 flex items-center justify-center p-4 resource-modal-overlay"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: "spring", damping: 25 }}
          className="bg-white rounded-2xl max-w-5xl w-full max-h-[95vh] overflow-y-auto resource-modal-content"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="relative aspect-[2/1] md:aspect-[3/1] bg-[#18264A] resource-article-banner">
            {imageUrl && (
              <img 
                src={imageUrl} 
                alt={title}
                className={`absolute inset-0 w-full h-full ${imageUrl?.endsWith('#contain') ? 'object-contain' : 'object-cover'} opacity-30`}
              />
            )}
            <div className="relative z-10 p-8 text-white h-full flex flex-col justify-between">
              <div className="flex justify-between items-start">
                <div className="inline-flex items-center px-4 py-2 bg-emerald-500/20 backdrop-blur-sm rounded-full border border-emerald-400/30 text-emerald-300 font-bold">
                  <FaBookOpen className="mr-2" />
                  <span className="font-semibold text-white">Resource</span>
                </div>
                <div className="flex items-center space-x-2 no-print">
                  <button
                    onClick={async () => {
                      const shareData = { title, text: title, url: window.location.href };
                      if (navigator.share) {
                        try { await navigator.share(shareData); } catch (_) {}
                      } else {
                        await navigator.clipboard.writeText(window.location.href);
                        alert('Link copied to clipboard!');
                      }
                    }}
                    className="flex items-center px-3 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-medium transition-colors"
                  >
                    <FaShareAlt className="mr-2" /> Share
                  </button>
                  <button
                    onClick={() => window.print()}
                    className="flex items-center px-3 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-medium transition-colors"
                  >
                    <FaPrint className="mr-2" /> Print
                  </button>
                  <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-full transition-colors ml-1">
                    <FaTimes size={20} />
                  </button>
                </div>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold max-w-2xl">{title}</h1>
            </div>
          </div>
          <div className="p-8 overflow-x-hidden min-w-0">
            {/* Metadata Row - Faithfully restored from backup */}
            <div className="flex flex-wrap items-center gap-6 mb-8 pb-3">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center mr-3 border border-slate-200">
                  <FaFileAlt className="text-[#18264A]" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{author || 'Scale Link Alliance'}</p>
                  <p className="text-sm text-gray-500">Published: {date}</p>
                </div>
              </div>
            </div>

            <hr className="mb-8 border-t-2 border-gray-200" />

            <div className="max-w-3xl mx-auto">
              <div
                className="prose prose-lg prose-blue max-w-none text-gray-900 leading-relaxed text-left"
                style={{ overflowWrap: 'break-word', wordBreak: 'normal' }}
                dangerouslySetInnerHTML={{ __html: fixCompoundHyphens(content) }}
              />
            </div>

            {/* Standard Bottom-of-Article CTA (Streamlined & Compact) */}
<div className="relative mt-8 p-5 sm:p-6 md:py-6 md:px-8 rounded-xl overflow-hidden bg-[#18264A] text-white shadow-lg border border-white/10 no-print">
  <div className="absolute -top-16 -right-16 w-48 h-48 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
  <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

  <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-4 md:gap-6">
    <div className="text-center md:text-left min-w-0">
      <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-1.5 leading-snug text-white">
        Is Your Website or Digital System Holding Your Business Back?
      </h3>
      <p className="text-slate-200 text-xs sm:text-sm leading-relaxed max-w-xl">
        Get a complimentary ScaleLink Business Growth Review and identify opportunities to improve your website, lead generation, CRM, automation and follow-up.
      </p>
    </div>
    <Link
      to="/free-website-review"
      onClick={onClose}
      className="shrink-0 px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-lg transition-all shadow-md hover:shadow-lg whitespace-nowrap text-xs sm:text-sm tracking-wide"
    >
      GET MY FREE REVIEW
    </Link>
  </div>
</div>
          </div>
        </motion.div>
      </motion.div>
    );
  }

  // Original static content processor (unchanged)
  const processedContent = content
    // Replace asterisk-wrapped text with bold formatting
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    // Fix bullet points - ensure each is on its own line with proper formatting
    .split('\n')
    .map(line => {
      // Handle bullet points
      if (line.trim().startsWith('â€¢') || line.trim().startsWith('-')) {
        // Remove multiple bullets and ensure single bullet
        const cleanLine = line.replace(/^[â€¢\-]\s*/, '').replace(/[â€¢\-]/g, '').trim();
        return `â€¢ ${cleanLine}`;
      }
      // Handle numbered lists
      else if (line.match(/^\d+\./)) {
        return line; // Keep numbered lists as is
      }
      // Handle section headers
      else if (line.includes('**') && line.split('**').length === 3) {
        const parts = line.split('**');
        return `<h3 class="text-xl font-bold text-gray-900 mt-8 mb-4">${parts[1]}</h3>${parts[2] ? '<p class="text-gray-700 mb-4">' + parts[2].trim() + '</p>' : ''}`;
      }
      else {
        return line;
      }
    })
    .join('\n')
    // Replace multiple dashes with em dash
    .replace(/---+/g, 'â€”')
    // Clean up multiple bullet points in same line
    .replace(/â€¢.*â€¢/g, match => {
      const bullets = match.split('â€¢').filter(b => b.trim());
      return bullets.map(b => `â€¢ ${b.trim()}`).join('\n');
    })
    // Remove random punctuation at start of bold headings
    .replace(/[.,!?]\s*<strong>/g, '<strong>')
    // Ensure bold subheadings are on their own line
    .replace(/(<strong>.*?<\/strong>)/g, '\n$1\n');

  const sections = processedContent.split('\n\n').filter(section => section.trim());
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-75 flex items-center justify-center p-4 resource-modal-overlay"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", damping: 25 }}
        className="bg-white rounded-2xl max-w-5xl w-full max-h-[95vh] overflow-y-auto resource-modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Article Header */}
        <div className="relative aspect-[2/1] md:aspect-[3/1] bg-[#18264A] resource-article-banner">
          <img 
            src={imageUrl || "https://images.unsplash.com/photo-1542744095-fcf48d80b0fd?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"}
            alt={title}
            className={`absolute inset-0 w-full h-full ${imageUrl?.endsWith('#contain') ? 'object-contain' : 'object-cover'} opacity-40`}
          />
          <div className="relative z-10 p-8 text-white">
            <div className="flex justify-between items-start">
              <div>
                <div className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full mb-4">
                  <FaBookOpen className="mr-2" />
                  <span className="font-semibold text-white">Resource</span>
                </div>
                <h1 className="text-2xl md:text-3xl font-bold mb-2">
                  {title}
                </h1>
                {author && <p className="text-sm opacity-90">By {author}</p>}
              </div>
              <div className="flex items-center space-x-2 no-print">
                <button
                  onClick={async () => {
                    const shareData = { title, text: title, url: window.location.href };
                    if (navigator.share) {
                      try { await navigator.share(shareData); } catch (_) {}
                    } else {
                      await navigator.clipboard.writeText(window.location.href);
                      alert('Link copied to clipboard!');
                    }
                  }}
                  className="flex items-center px-3 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-medium transition-colors"
                >
                  <FaShareAlt className="mr-2" /> Share
                </button>
                <button
                  onClick={() => window.print()}
                  className="flex items-center px-3 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-medium transition-colors"
                >
                  <FaPrint className="mr-2" /> Print
                </button>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-white/20 rounded-full transition-colors ml-1"
                >
                  <FaTimes size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Article Content */}
        <div className="p-8 overflow-x-hidden min-w-0">
          <div className="max-w-3xl mx-auto">
            <div className="prose prose-lg max-w-none text-gray-900 leading-relaxed text-left" style={{ overflowWrap: 'break-word', wordBreak: 'normal' }}>
              {sections.map((section, index) => {
                // Check if section contains HTML
                if (section.includes('<h3') || section.includes('<strong>')) {
                  return (
                    <div key={index} dangerouslySetInnerHTML={{ __html: section }} />
                  );
                } else if (section.includes('â€¢')) {
                  // Handle bullet points
                  const bullets = section.split('\n').filter(line => line.trim());
                  return (
                    <ul key={index} className="list-disc pl-6 text-gray-700 space-y-2 mb-6">
                      {bullets.map((bullet, bulletIndex) => (
                        <li key={bulletIndex} className="text-gray-700">
                          {bullet.replace('â€¢', '').trim()}
                        </li>
                      ))}
                    </ul>
                  );
                } else if (section.match(/^\d+\./)) {
                  // Handle numbered lists
                  const items = section.split('\n').filter(line => line.trim());
                  return (
                    <ol key={index} className="list-decimal pl-6 text-gray-700 space-y-2 mb-6">
                      {items.map((item, itemIndex) => (
                        <li key={itemIndex} className="text-gray-700">
                          {item.replace(/^\d+\.\s*/, '')}
                        </li>
                      ))}
                    </ol>
                  );
                } else {
                  return (
                    <p key={index} className="text-gray-700 mb-6">
                      {section}
                    </p>
                  );
                }
              })}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

const ResourcesPage = () => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeDocument, setActiveDocument] = useState(null);

  useEffect(() => {
    document.title = 'Business Growth & Digital Marketing Resources | ScaleLink Alliance';

    const setMeta = (name, content) => {
      let tag = document.querySelector(`meta[name="${name}"]`);
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute('name', name);
        document.head.appendChild(tag);
      }
      tag.setAttribute('content', content);
    };

    setMeta('keywords', 'business growth resources');
  }, []);

  // CMS API State
  const [cmsResources, setCmsResources] = useState([]);
  const [cmsTypes, setCmsTypes] = useState([]);
  const [loadingCms, setLoadingCms] = useState(true);
  const [cmsFeatured, setCmsFeatured] = useState(null);
  const [archiveResources, setArchiveResources] = useState([]);
  
  // Pagination State
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const ITEMS_PER_PAGE = 9;

  useEffect(() => {
    setLoadingCms(true);
    const params = new URLSearchParams({
      page: page,
      limit: ITEMS_PER_PAGE,
      category: activeCategory
    });

    Promise.all([
      fetch(`/api/cms/resources?${params.toString()}`).then(r => r.json()).catch(() => ({ resources: [] })),
      fetch('/api/cms/resource-types').then(r => r.json()).catch(() => []),
      fetch('/api/cms/resources/featured').then(r => r.json()).catch(() => null),
      fetch('/api/cms/resources/archive').then(r => r.json()).catch(() => [])
    ]).then(([data, types, featured, archive]) => {
      if (data.resources) {
        setCmsResources(data.resources);
        setTotalPages(data.totalPages || 1);
      }
      if (Array.isArray(types)) setCmsTypes(types);
      if (featured && !featured.error) setCmsFeatured(featured);
      if (Array.isArray(archive)) setArchiveResources(archive);
    }).finally(() => setLoadingCms(false));
  }, [page, activeCategory]);

  // Reset page when category changes
  const handleCategoryChange = (catId) => {
    setActiveCategory(catId);
    setPage(1);
  };

  // Document content from your files - CORRECTED VERSIONS
  const documentResources = [
    {
      id: 1,
      type: 'guide',
      title: 'The Complete Guide to High-Converting Business Websites',
      description: 'A comprehensive strategic playbook for turning traffic into qualified sales opportunities with modern design, messaging, and automation.',
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
      date: 'Jan 2026',
      featured: true,
      category: 'Guides & Frameworks',
      author: 'David Rodriguez',
      readTime: '8 min read',
      views: '1,420 views',
      content: `The Complete Guide to High-Converting Business Websites

Most business websites function as expensive digital brochures. Visitors arrive, look around for thirty seconds, and leave without taking action. In 2026, high-performing websites operate as automated sales engines that systematically guide visitors from initial interest to booked sales calls.

<strong>1. The Clarity Principle: Answer 3 Questions in 5 Seconds</strong>

When a prospect lands on your website, they unconsciously ask three questions:
• What do you do?
• How does it make my business or life better?
• What exact action should I take next?

If your above-the-fold hero section does not answer these three questions clearly and concisely, over 70% of visitors will bounce before scrolling.

<strong>2. Streamline Your Call to Action (CTA) Hierarchy</strong>

A common mistake is offering too many competing choices:
• "Schedule a Call"
• "Read Our Whitepaper"
• "Browse Our Catalog"
• "Subscribe to Newsletter"

Decision fatigue kills conversion rates. Establish one primary call to action (e.g., "Request a Free Growth Diagnostic") and at most one secondary low-commitment pathway.

<strong>3. Build Trust with Concrete Proof Over Vague Claims</strong>

Avoid generic buzzwords like "innovative solutions" or "trusted experts." Instead, present verifiable proof:
• Real client case studies with specific metrics (e.g., "+180% inbound inquiries in 90 days")
• Verified client testimonials with full names, titles, and company logos
• Transparent delivery timelines and milestone-based guarantees

<strong>4. Automated Lead Capture and Immediate Follow-Up</strong>

A website's job is not finished when a contact form is submitted. The initial 5 minutes following an inquiry represent your highest conversion window. Integrate form submissions directly with CRM workflows and instant confirmation emails to ensure zero leads fall through the cracks.`
    },
    {
      id: 2,
      type: 'case-study',
      title: 'How a B2B Firm Generated $500K in New Pipeline Through Systems Automation',
      description: 'How an independent B2B consultancy transformed inconsistent project work into a predictable $500K pipeline by integrating web funnels with automated CRM workflows.',
      image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
      date: 'Feb 2026',
      category: 'Case Studies',
      author: 'ScaleLink Strategy Team',
      readTime: '6 min read',
      views: '980 views',
      content: `How a B2B Firm Generated $500K in New Pipeline Through Systems Automation

Most service businesses believe scaling requires hiring more salespeople or spending endlessly on generic ad campaigns. This case study illustrates how one B2B technology consulting firm unlocked $500,000 in qualified new pipeline by streamlining their digital acquisition and client follow-up infrastructure.

<strong>The Problem: Skilled, But Inconsistent Inbound</strong>

The firm possessed exceptional technical expertise, but suffered from inconsistent lead flow and manual, leaky follow-up:
• Prospects submitted inquiries and waited 24–48 hours for a reply
• High-value leads were scattered across disparate inboxes
• Proposal follow-ups were handled manually when time permitted
• Over 40% of qualified opportunities went cold before a formal proposal was reviewed

<strong>The Solution: The Done-For-You Systems Overhaul</strong>

ScaleLink implemented an end-to-end digital growth infrastructure:
1. Re-architected the company website with clear positioning, client outcomes, and interactive diagnostic booking forms.
2. Built a centralized CRM pipeline connecting web inquiries, automated scheduling, and instant qualification notifications.
3. Automated a multi-touch follow-up sequence delivering case studies and relevant insights to prospects within minutes of their inquiry.

<strong>The Results</strong>
• Inbound lead response time dropped from 28 hours to under 3 minutes
• Scheduled discovery calls increased by 160% in the first quarter
• Over $500,000 in closed new contract value attributed directly to the automated nurture funnel within 12 months.`
    },
    {
      id: 3,
      type: 'article',
      title: '5 Website Conversion Killers That Sabotage Customer Acquisition',
      description: 'Identify and fix the most common UX, copy, and performance bottlenecks that cause qualified visitors to leave without converting.',
      image: 'https://images.unsplash.com/photo-1542744095-fcf48d80b0fd?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
      date: 'Mar 2026',
      category: 'Articles & Industry Insights',
      author: 'Elena Rostova',
      readTime: '5 min read',
      views: '1,150 views',
      content: `5 Website Conversion Killers That Sabotage Customer Acquisition

Many businesses invest thousands of dollars in traffic generation—whether through search engine optimization, paid advertising, or social media—only to experience disappointing conversion rates. In most cases, the traffic is qualified, but the website itself is creating unnecessary friction.

<strong>1. Hidden or Convoluted Contact Pathways</strong>
If a prospect has to hunt through dropdown menus or fill out a 12-field form just to get in touch, they will leave for a competitor. Keep forms short (3–5 fields maximum) and place accessible call-to-action buttons in sticky headers and throughout high-intent page sections.

<strong>2. Slow Mobile Load Speeds</strong>
Over 60% of modern B2B and consumer web visits happen on mobile devices. Every 1-second delay in page load time reduces mobile conversion rates by up to 20%. Optimizing image assets, eliminating render-blocking scripts, and utilizing modern hosting infrastructure are critical prerequisites for growth.

<strong>3. Self-Centered Copy vs. Outcome-Focused Messaging</strong>
Websites that obsessively talk about "our history", "our passion", and "our awards" fail to connect. Shift your copy from "What we do" to "The specific business problems we solve for you."

<strong>4. Lack of Clear Next Steps</strong>
Leaving visitors at the bottom of a page with no clear next step causes immediate abandonment. Every page should conclude with a compelling call to action, related resources, or a free diagnostic review offer.

<strong>5. Missing Reassurance and Security Indicators</strong>
Displaying clear pricing models, milestone-based delivery guarantees, and verified customer testimonials alleviates the risk prospects perceive when hiring a new partner.`
    },
    {
      id: 4,
      type: 'guide',
      title: 'Business Lead Follow-Up & Client Onboarding Template Pack',
      description: 'Proven multi-channel email scripts, proposal follow-up sequences, and onboarding checklists designed to turn warm inquiries into committed clients.',
      image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
      date: 'Mar 2026',
      category: 'Guides & Frameworks',
      author: 'ScaleLink Systems Team',
      readTime: 'Downloadable Pack',
      views: '2,310 downloads',
      content: `Business Lead Follow-Up & Client Onboarding Template Pack

Converting a qualified inquiry into a paying client requires consistent, structured follow-up. This template pack contains battle-tested email sequences and onboarding workflows used across professional service firms.

<strong>Template 1: Instant Inbound Inquiry Response (Automated)</strong>
Subject: We received your request — here is what happens next
"Hi [First Name], thank you for reaching out regarding [Service Requested]. Our team has received your details and is conducting an initial review of your current systems. You can expect a personalized review within one business day. In the meantime, feel free to explore our recent case study on how we helped [Similar Client] achieve [Key Outcome]."

<strong>Template 2: Post-Discovery Call Summary & Next Steps</strong>
Subject: Action Plan & Scope Summary — [Company Name] + ScaleLink
"Hi [First Name], great speaking with you today. To summarize our discussion, our primary objectives are [Objective 1] and [Objective 2]. Attached is your milestone-based roadmap outlining deliverables, timelines, and fixed investment."

<strong>Template 3: Seamless Client Onboarding Checklist</strong>
• Kickoff Call scheduled within 48 hours of agreement
• Client intake questionnaire completed (brand assets, access credentials)
• Dedicated project tracking portal account generated
• Milestone 1 delivery timeline locked into production calendar.`
    },
    {
      id: 5,
      type: 'case-study',
      title: 'How a Professional Services Firm Doubled Inbound Bookings in 12 Months',
      description: 'How modernizing website architecture, clarifying service offerings, and automating booking funnels helped a financial consulting practice scale rapidly.',
      image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
      date: 'Feb 2026',
      category: 'Case Studies',
      author: 'ScaleLink Solutions Team',
      readTime: '7 min read',
      views: '1,050 views',
      content: `How a Professional Services Firm Doubled Inbound Bookings in 12 Months

For established advisory and consulting practices, growth often feels capped not by expertise, but by manual business systems. This case study breaks down how an advisory firm doubled their high-value client acquisition in 12 months.

<strong>1. The Challenge</strong>
The firm was relying on outdated static web pages, confusing service descriptions, and manual email back-and-forths to book introductory consultations. Many interested prospects dropped off during the friction-filled scheduling process.

<strong>2. Strategic Interventions</strong>
• Re-engineered the website architecture around 3 clear client starting points.
• Created dedicated service landing pages addressing specific client pain points and regulatory considerations.
• Deployed an automated calendar integration with built-in qualifying questions, ensuring only high-fit prospects booked strategy sessions.
• Implemented automated SMS and email reminders that reduced appointment no-shows from 28% to under 4%.

<strong>3. Business Impact</strong>
Within 12 months of deployment:
• Qualified strategy calls booked increased by 115%
• Prospect conversion to engaged client rose from 22% to 39%
• The firm reclaimed an estimated 15 hours per week of partner time previously wasted on manual scheduling and follow-ups.`
    },
    {
      id: 6,
      type: 'tool',
      title: 'Website ROI & Customer Acquisition Cost (CAC) Diagnostic Calculator',
      description: 'Evaluate your current website conversion rate, traffic value, and pipeline efficiency to identify where your digital funnel is losing revenue.',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
      date: 'Jan 2026',
      category: 'Tools & Worksheets',
      author: 'ScaleLink Growth Diagnostics',
      readTime: 'Interactive Tool',
      views: '1,890 uses',
      content: `Website ROI & Customer Acquisition Cost (CAC) Diagnostic Calculator

Understanding the mathematics behind your digital customer acquisition funnel is the key to predictable growth.

<strong>Core Funnel Metrics:</strong>
• <strong>Monthly Unique Visitors:</strong> Total prospective buyers visiting your web assets.
• <strong>Conversion Rate (%):</strong> Percentage of visitors who take high-intent action (submit form, request diagnostic).
• <strong>Lead-to-Opportunity Rate (%):</strong> Percentage of inquiries that meet your qualification criteria.
• <strong>Opportunity-to-Close Rate (%):</strong> Percentage of qualified opportunities that become paying clients.
• <strong>Average Client Lifetime Value (LTV):</strong> The total gross margin or revenue generated per customer.

<strong>The Multiplier Effect of System Optimization</strong>
If your site receives 2,000 monthly visitors at a 1% conversion rate (20 leads) and closes 20% (4 clients) at $5,000 value, you generate $20,000/month.
By improving your conversion rate from 1% to 2.5% through clear messaging and fast load times, your monthly revenue jumps from $20,000 to $50,000 without spending an extra dollar on traffic.

Use our complimentary Website Growth Review to evaluate your funnel metrics and identify high-leverage optimization opportunities.`
    }
  ]

  // Use CMS types if available, otherwise fall back to hardcoded
  const hasCmsData = !loadingCms && cmsResources.length > 0;

  const categories = hasCmsData
    ? [
        { id: 'all', name: 'All Resources', icon: <FaBookOpen /> },
        ...cmsTypes.map(t => ({
          id: String(t.id),
          name: t.name,
          icon: <FaTags />
        }))
      ]
    : [
        { id: 'all', name: 'All Resources', icon: <FaBookOpen /> },
        { id: 'guide', name: 'Guides & Templates', icon: <FaFileAlt /> },
        { id: 'case-study', name: 'Case Studies', icon: <FaChartLine /> },
        { id: 'article', name: 'Articles', icon: <FaNetworkWired /> },
        { id: 'tool', name: 'Tools & Calculators', icon: <FaCalculator /> }
      ];

  // Use CMS resources if available, otherwise static hardcoded
  // Note: Local filtering removed as server now handles paged category filtering
  const activeResourceList = hasCmsData
    ? cmsResources
    : (activeCategory === 'all'
        ? documentResources
        : documentResources.filter(r => r.type === activeCategory));

  // Legacy alias for static code below
  const resources = {
    all: documentResources,
    'guide': documentResources.filter(resource => resource.type === 'guide'),
    'case-study': documentResources.filter(resource => resource.type === 'case-study'),
    'article': documentResources.filter(resource => resource.type === 'article'),
    'tool': documentResources.filter(resource => resource.type === 'tool')
  };

  const filteredResources = activeResourceList;

  const typeLabels = {
    'guide': 'Guide',
    'case-study': 'Case Study',
    'article': 'Article',
    'tool': 'Tool'
  };

  const typeColors = {
    'guide': 'bg-slate-100 text-[#18264A]',
    'case-study': 'bg-green-100 text-green-800',
    'article': 'bg-purple-100 text-purple-800',
    'tool': 'bg-orange-100 text-orange-800'
  };

  // Helper: get badge label for a resource (supports both static & CMS)
  const getTypeLabel = (resource) => {
    if (resource.type?.shortForm) return resource.type.shortForm;
    return typeLabels[resource.type] || resource.type || 'Resource';
  };

  // Helper: get badge color for a resource
  const getTypeColor = (resource) => {
    if (resource.type?.shortForm) return 'bg-indigo-100 text-indigo-800';
    return typeColors[resource.type] || 'bg-gray-100 text-gray-800';
  };

  // Featured resource: prefer CMS, fall back to static
  // Use the state-managed cmsFeatured instead of searching the paged list

  const downloads = [
    {
      id: 1,
      title: 'Business Lead Follow-Up Template Pack',
      description: 'Frameworks and email scripts for capturing, nurturing, and converting business inquiries into paying clients.',
      icon: <FaFileAlt />,
      format: 'PDF / DOC • 1.2 MB'
    },
    {
      id: 2,
      title: 'Website Conversion & SEO Audit Checklist',
      description: 'A 25-point inspection checklist to identify why a business website is underperforming and how to fix it.',
      icon: <FaChartLine />,
      format: 'PDF • 1.8 MB'
    },
    {
      id: 3,
      title: 'Digital Systems & Automation Roadmap',
      description: 'Step-by-step architecture blueprint for connecting web forms, CRM pipelines, and automated client follow-ups.',
      icon: <FaCalculator />,
      format: 'PDF • 2.4 MB'
    }
  ];

  const faqs = [
    {
      question: 'What types of businesses does ScaleLink Alliance work with?',
      answer: 'We partner with growing businesses, consultants, agencies, e-commerce brands, and professional service providers who want done-for-you digital systems, high-converting websites, marketing execution, and workflow automation.'
    },
    {
      question: 'Can I purchase a single service, or do I need a full package?',
      answer: 'You can purchase individual standalone services (such as website maintenance, SEO, paid advertising, or CRM automation) or choose comprehensive end-to-end growth solutions depending on your immediate business priorities.'
    },
    {
      question: 'What is included in the complimentary Business Growth Review?',
      answer: 'Our senior specialists evaluate your existing website, user journey, conversion flow, lead capture systems, and technical health to identify actionable opportunities to attract more clients and reduce operational friction.'
    },
    {
      question: 'How do project milestones and payments work?',
      answer: 'Projects are structured around clearly defined scopes and milestone deliverables. Work is reviewed against agreed specifications, providing complete transparency, accountability, and confidence at every step.'
    },
    {
      question: 'Do you work with existing websites, or only build from scratch?',
      answer: 'Both. If you already have a website, our Scale Existing Website pathway focuses on optimization, speed, SEO, and automation. If you are starting fresh, our Start From Scratch pathway handles complete development from the ground up.'
    }
  ];

  const handleResourceClick = (resource) => {
    if (resource.slug || resource.id) {
      navigate(/resources/);
    } else if (resource.onClick) {
      resource.onClick();
    } else if (resource.richHtmlContent) {
      // CMS resource â€” render rich HTML in the DocumentArticle modal
      setActiveDocument({
        title: resource.title,
        content: resource.richHtmlContent,
        author: resource.author,
        imageUrl: resource.imageUrl,
        date: formatDate(resource.publishedDate),
        isHtml: true
      });
    } else if (resource.content) {
      setActiveDocument({
        title: resource.title,
        content: resource.content,
        author: resource.author || 'ScaleLink Alliance',
        imageUrl: resource.image,
        date: resource.date || 'Jan 2026'
      });
    }
  };

  return (
    <div className="min-h-screen">
      {/* Document Article Modal */}
      {activeDocument && (
        <DocumentArticle
          title={activeDocument.title}
          content={activeDocument.content}
          author={activeDocument.author}
          imageUrl={activeDocument.imageUrl}
          date={activeDocument.date}
          isHtml={activeDocument.isHtml}
          onClose={() => setActiveDocument(null)}
        />
      )}

      <div className="no-print">
        {/* Hero Section */}
      <section className="bg-linear-to-br from-blue-50 to-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                Resources & Insights
              </h1>
              <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto">
                Tools, guides, and actionable frameworks to build, automate, and scale your business systems
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Featured Resource */}
<section className="relative py-12 md:py-16 bg-[#18264A] resource-hero text-white overflow-hidden">
  {/* Decorative background accents to match the detail page CTA */}
  <div className="absolute -top-24 -right-24 w-72 h-72 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
  <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

  <div className="container mx-auto px-4 relative z-10">
    <div className="max-w-6xl mx-auto">
      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="mb-6 md:mb-0 md:mr-8 text-center md:text-left">
            <div className="inline-flex items-center px-4 py-1.5 bg-emerald-500/20 rounded-full mb-4 border border-emerald-400/30">
              <FaBookOpen className="mr-2 text-emerald-300" />
              <span className="font-bold text-xs uppercase tracking-wider text-emerald-300">Featured Guide</span>
            </div>
            <h2 className="text-2xl font-bold text-white mb-3">
              {cmsFeatured ? cmsFeatured.title : 'The Ultimate Guide to Referral Networking'}
            </h2>
            <p className="text-slate-200 mb-4">
              {cmsFeatured 
                ? (cmsFeatured.plainTextSnippet || cmsFeatured.description) 
                : 'Learn proven strategies to build a referral-based business and accelerate your growth.'}
            </p>
          </div>
          <Link
            to={cmsFeatured ? `/resources/${cmsFeatured.slug || cmsFeatured.id}` : '/resources/1'}
            className="shrink-0 px-8 py-3.5 bg-white text-[#18264A] font-bold rounded-xl hover:bg-gray-100 hover:scale-105 transition-all shadow-md hover:shadow-lg whitespace-nowrap inline-flex items-center justify-center"
          >
            Read Full Guide
          </Link>
        </div>
      </div>
    </div>
  </div>
</section>

      {/* Resource Categories */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-wrap justify-center gap-4 mb-12">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleCategoryChange(category.id)}
                  className={`flex items-center space-x-3 px-6 py-3 rounded-lg font-semibold transition-all ${
                    activeCategory === category.id
                      ? 'bg-[#18264A] text-white shadow-lg shadow-[#18264A]/25'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <span>{category.icon}</span>
                  <span>{category.name}</span>
                </button>
              ))}
            </div>

            {/* Resources Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {activeResourceList.map((resource, index) => {
                const targetSlug = resource.slug || resource.id;
                return (
                  <motion.div
                    key={resource.id || index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <Link
                      to={`/resources/${targetSlug}`}
                      className="group bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200 flex flex-col h-full hover:-translate-y-1 block"
                    >
                      {resource.isFeatured && (
                        <div className="absolute top-4 left-4 z-10">
                          <span className="px-3 py-1 bg-[#18264A] text-white text-xs font-semibold rounded-full shadow-sm">
                            Featured
                          </span>
                        </div>
                      )}
                      <div className="aspect-16/10 overflow-hidden bg-gray-100 relative">
                        <img 
                          src={resource.imageUrl || resource.image} 
                          alt={resource.title}
                          className={`w-full h-full ${(resource.imageUrl || resource.image)?.endsWith('#contain') ? 'object-contain' : 'object-cover'} group-hover:scale-105 transition-transform duration-500`}
                        />
                      </div>
                      <div className="p-6 flex flex-col justify-between flex-1">
                        <div>
                          <div className="flex justify-between items-start mb-3">
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getTypeColor(resource)}`}>
                              {getTypeLabel(resource)}
                            </span>
                          </div>
                          
                          <h3 className="text-xl font-bold text-gray-900 group-hover:text-[#18264A] transition-colors mb-3 line-clamp-2">
                            {resource.title}
                          </h3>
                          <p className="text-gray-600 text-sm mb-4 line-clamp-3 leading-relaxed">
                            {resource.plainTextSnippet || resource.description}
                          </p>
                        </div>
                        
                        <div className="flex justify-between items-center pt-4 border-t border-gray-100 mt-auto">
                          <span className="text-xs text-gray-500 font-medium">
                            {formatDate(resource.publishedDate || resource.date)}
                          </span>
                          <span className="inline-flex items-center space-x-2 text-[#18264A] group-hover:text-[#101c38] font-semibold text-sm">
                            <span>View Resource</span>
                            <FaArrowRight className="text-xs group-hover:translate-x-1 transition-transform" />
                          </span>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="mt-12 flex justify-center items-center space-x-2">
                <button
                  disabled={page === 1}
                  onClick={() => {
                    setPage(prev => Math.max(prev - 1, 1));
                    window.scrollTo({ top: 400, behavior: 'smooth' });
                  }}
                  className="p-3 rounded-lg border border-gray-200 text-gray-500 hover:bg-slate-100 hover:text-[#18264A] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                >
                  <FaChevronLeft />
                </button>
                
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => {
                      setPage(i + 1);
                      window.scrollTo({ top: 400, behavior: 'smooth' });
                    }}
                    className={`w-12 h-12 rounded-lg font-bold transition-all ${
                      page === (i + 1)
                        ? 'bg-[#18264A] text-white shadow-md shadow-[#18264A]/30'
                        : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}

                <button
                  disabled={page === totalPages}
                  onClick={() => {
                    setPage(prev => Math.min(prev + 1, totalPages));
                    window.scrollTo({ top: 400, behavior: 'smooth' });
                  }}
                  className="p-3 rounded-lg border border-gray-200 text-gray-500 hover:bg-slate-100 hover:text-[#18264A] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                >
                  <FaChevronRight />
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Discover More Insights (Archival Random Selection) */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Discover More Insights
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Explore a rotating selection of high-value articles and guides from our extensive archives.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {(hasCmsData ? archiveResources : documentResources.slice(0, 3)).map((resource, index) => {
                const targetSlug = resource.slug || resource.id;
                return (
                  <motion.div
                    key={resource.id || index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    whileHover={{ y: -8 }}
                    className="h-64"
                  >
                    <Link
                      to={`/resources/${targetSlug}`}
                      className="group relative h-full rounded-2xl overflow-hidden shadow-lg block"
                    >
                      {/* Background Image */}
                      <img 
                        src={resource.imageUrl || resource.image} 
                        alt={resource.title}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      
                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-linear-to-t from-gray-900 via-gray-900/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
                      
                      {/* Content Overlay */}
                      <div className="absolute inset-0 p-6 flex flex-col justify-end">
                        <h3 className="text-xl font-bold text-white group-hover:text-emerald-300 transition-colors leading-tight">
                          {resource.title}
                        </h3>
                        <div className="mt-4 flex items-center text-emerald-400 font-semibold text-sm opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all">
                          <span>Read Insight</span>
                          <FaArrowRight className="ml-2 w-3 h-3" />
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
              Frequently Asked Questions
            </h2>
            
            <div className="space-y-6">
              {faqs.map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-gray-50 rounded-xl p-6"
                >
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    {faq.question}
                  </h3>
                  <p className="text-gray-600">{faq.answer}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
);
};

export default ResourcesPage;