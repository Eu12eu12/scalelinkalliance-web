// src/pages/ResourcesPage.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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
// Only processes text — safely skips HTML tags and their attributes.
const fixCompoundHyphens = (html) => {
  if (!html) return html;
  // Split on HTML tags (< ... >). Process text segments only.
  return html
    .split(/(<[^>]+>)/)
    .map((segment) => {
      // Skip HTML tags — they start with '<'
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
          <div className="relative aspect-[2/1] md:aspect-[3/1] bg-linear-to-r from-blue-600 to-blue-800">
            {imageUrl && (
              <img 
                src={imageUrl} 
                alt={title}
                className={`absolute inset-0 w-full h-full ${imageUrl?.endsWith('#contain') ? 'object-contain' : 'object-cover'} opacity-30`}
              />
            )}
            <div className="relative z-10 p-8 text-white h-full flex flex-col justify-between">
              <div className="flex justify-between items-start">
                <div className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full">
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
                <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center mr-3 border border-blue-100">
                  <FaFileAlt className="text-blue-600" />
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
                className="prose prose-lg prose-blue prose-premium max-w-none text-gray-900 leading-relaxed text-left"
                style={{ overflowWrap: 'break-word', wordBreak: 'normal' }}
                dangerouslySetInnerHTML={{ __html: fixCompoundHyphens(content) }}
              />
            </div>

            {/* Call to Action - restored from backup */}
            <div className="mt-16 p-8 bg-linear-to-r from-blue-50 to-blue-100 rounded-2xl border border-blue-100 no-print">
              <div className="flex flex-col md:flex-row items-center justify-between">
                <div className="mb-6 md:mb-0">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    Ready to Implement These Strategies?
                  </h3>
                  <p className="text-gray-700">
                    Join Scale Link Alliance and start building your referral network today.
                  </p>
                </div>
                <Link
                  to="/membership"
                  onClick={onClose}
                  className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all shadow-md hover:shadow-lg whitespace-nowrap"
                >
                  Join Now
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
      if (line.trim().startsWith('•') || line.trim().startsWith('-')) {
        // Remove multiple bullets and ensure single bullet
        const cleanLine = line.replace(/^[•\-]\s*/, '').replace(/[•\-]/g, '').trim();
        return `• ${cleanLine}`;
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
    .replace(/---+/g, '—')
    // Clean up multiple bullet points in same line
    .replace(/•.*•/g, match => {
      const bullets = match.split('•').filter(b => b.trim());
      return bullets.map(b => `• ${b.trim()}`).join('\n');
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
        <div className="relative aspect-[2/1] md:aspect-[3/1] bg-linear-to-r from-blue-600 to-blue-800">
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
                } else if (section.includes('•')) {
                  // Handle bullet points
                  const bullets = section.split('\n').filter(line => line.trim());
                  return (
                    <ul key={index} className="list-disc pl-6 text-gray-700 space-y-2 mb-6">
                      {bullets.map((bullet, bulletIndex) => (
                        <li key={bulletIndex} className="text-gray-700">
                          {bullet.replace('•', '').trim()}
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
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeDocument, setActiveDocument] = useState(null);

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
      title: 'The Ultimate Guide to Referral Networking',
      description: 'Complete guide to building a referral-based business with proven strategies and templates.',
      image: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
      date: 'Jan 2026',
      featured: true,
      onClick: () => setShowArticle(true)
    },
    {
      id: 2,
      type: 'case-study',
      title: 'How a Tech Consultant Generated $500K in New Business',
      description: 'Case study on how strategic networking led to massive growth for a technology consulting firm.',
      image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
      date: 'Feb 28, 2024',
      content: `How a Tech Consultant Generated $500K in New Business Through Strategic Networking

Most tech consultants believe growth comes from more ads, more outreach, or lowering prices. This case study tells a different story. It is the story of how one independent technology consultant transformed inconsistent project work into $500,000 in new business—not by working more hours, but by building a strategic referral network.

<strong>The Starting Point: Skilled, But Stuck</strong>

Alex was a highly skilled technology consultant specializing in cloud infrastructure and systems optimization for mid-sized businesses. The problem was not talent. The problem was predictability.

• Referrals came randomly
• Sales cycles were inconsistent
• Growth depended on constant prospecting
• Each new client felt like starting over

Alex was respected but invisible outside immediate circles.

<strong>The Shift: From Networking Events to Strategic Networking</strong>

Like many professionals, Alex attended networking events regularly. Business cards were exchanged. Conversations were polite. Follow-ups were inconsistent. Nothing changed.

The breakthrough came when Alex stopped networking and started networking with intent. Instead of asking "How can I find more clients?" Alex asked "Who already serves my ideal clients and how can we grow together?"

<strong>Building a Referral Ecosystem</strong>

Alex identified five non-competing professionals who served the same audience:

• Managed service providers
• Cybersecurity consultants
• Business operations advisors
• CFO consultants
• Digital transformation strategists

Each had trust. Each had access. None were direct competitors. Rather than pitching services, Alex focused on understanding their clients' pain points, sharing insights and value, and creating clarity around who Alex was best suited to help. Within weeks, introductions started happening naturally.

<strong>The Snowball Effect</strong>

The first referral led to a $40,000 project. That client referred another. That partner introduced Alex to a larger organization. Within 12 months:

• Multiple six-figure contracts were secured
• Referral partners became consistent lead sources
• Sales conversations were shorter and warmer
• Alex stopped cold outreach entirely

By the end of the year, over $500,000 in new business came directly from referral relationships. No ads. No aggressive selling. Just trust, alignment, and structure.

<strong>Why This Worked</strong>

Three factors made the difference:

<strong>Trust Transfer</strong> — Every referral came with built-in credibility. Prospects arrived ready to listen.

<strong>Clear Positioning</strong> — Referral partners knew exactly when and why to introduce Alex.

<strong>Consistent Relationship Management</strong> — Follow-ups were intentional. Relationships were nurtured, not neglected.

This was not luck. It was a system.

<strong>How Scale Link Alliance Could Multiply This Growth</strong>

Alex's results came from intentional effort but imagine if the system already existed. That is exactly what Scale Link Alliance membership is designed to provide.

<strong>Instant Access to Aligned Professionals</strong> — Instead of searching for the right partners, members enter a network built around mutual growth and referrals.

<strong>Structured Referral Standards</strong> — Members understand how to give, receive, and qualify referrals eliminating guesswork.

<strong>Built-In Credibility</strong> — Introductions carry more weight when they come from a trusted alliance.

<strong>Repeatable Growth Opportunities</strong> — Referrals do not happen by chance they are facilitated through intentional collaboration.

For consultants like Alex, Scale Link Alliance removes years of trial and error and replaces it with a ready-made referral ecosystem.

<strong>The Bigger Lesson</strong>

The fastest-growing consultants are not chasing leads. They are building networks that send leads to them. Strategic referral networking turns individual effort into collective leverage. And when supported by the right alliance, it becomes one of the most powerful growth engines a business can have.

<strong>Imagine the Results When You Do Not Build Alone</strong>

Alex built this system manually. Scale Link Alliance helps you plug into one. If your business relies on trust, expertise, and long-term relationships, referral networking is not optional it is essential. And the right alliance can be the difference between inconsistent growth and your next $500,000 year.`
    },
    {
      id: 3,
      type: 'article',
      title: '5 Networking Mistakes Even Experienced Professionals Make',
      description: 'Common pitfalls in business networking and how to avoid them for better results.',
      image: 'https://images.unsplash.com/photo-1542744095-fcf48d80b0fd?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
      date: 'Apr 2, 2024',
      content: `5 Networking Mistakes Even Experienced Professionals Make and How to Fix Them

Most professionals think networking stops being a problem once you have been in business long enough. It does not. In fact, experienced professionals often make the most damaging networking mistakes not because they do not know better, but because bad habits feel normal.

If networking has not produced the results you expected, one of these mistakes is likely the reason.

<strong>Mistake 1: Treating Networking Like Lead Hunting</strong>

Even seasoned professionals fall into this trap. They attend events thinking "Who can I get business from?" instead of "Who can I build a relationship with?"

<strong>Why this hurts results</strong>

People can sense when they are being evaluated as a transaction. Conversations stay surface-level, trust never forms, and follow-ups get ignored.

<strong>How to fix it</strong>

Shift your mindset:

• Focus on understanding, not pitching
• Ask about their clients, challenges, and goals
• Think in terms of long-term alignment, not immediate ROI

The best referrals often come weeks or months later, not the same day.

<strong>Mistake 2: Being Too Vague About What You Do</strong>

Many professionals think they are being flexible by keeping their message broad. In reality, vagueness kills referrals. If someone cannot clearly explain who you help, what problem you solve, and when to refer you they will not refer you at all.

<strong>How to fix it</strong>

Create a clear referral identity:

• "I help this type of client with this specific problem"
• Use real examples, not generic titles
• Make it easy for others to recognize opportunities for you

Clarity creates confidence and confidence creates referrals.

<strong>Mistake 3: Inconsistent or Weak Follow-Up</strong>

Experienced professionals are busy, which often leads to late follow-ups, generic messages, or no follow-up at all. This quietly kills momentum.

<strong>Why it matters</strong>

Networking conversations fade fast. Without intentional follow-up, even strong connections lose relevance.

<strong>How to fix it</strong>

• Follow up within 24 to 48 hours
• Reference the actual conversation
• Keep it relationship-focused, not sales-focused

Consistency beats charisma every time.

<strong>Mistake 4: Relying on Random Networking Instead of Structure</strong>

Attending events without structure feels productive but rarely is. Many professionals jump between groups, attend events with no strategy, and build shallow connections everywhere. The result is lots of contacts and very few outcomes.

<strong>How to fix it</strong>

Adopt structured networking:

• Focus on a smaller, aligned network
• Build depth instead of breadth
• Engage consistently with the same professionals

This is where Scale Link Alliance becomes powerful by providing a framework where referrals are intentional, not accidental.

<strong>Mistake 5: Expecting Results Without Reciprocity</strong>

Even experienced professionals sometimes forget this rule: Networking is an exchange, not a shortcut. If you are always receiving and rarely giving, people notice.

<strong>How to fix it</strong>

• Look for ways to help before asking
• Share introductions freely
• Become known as a connector

The professionals who receive the most referrals are usually the ones who give the most value first.

<strong>The Real Reason Networking Fails</strong>

Networking does not fail because people are not skilled. It fails because there is no structure, no clarity, no consistency, and no accountability. Casual networking produces casual results.

<strong>How to Network for Better Results</strong>

High-performing professionals do not network more they network better. They build intentional relationships, operate inside trusted ecosystems, use structured follow-up, and focus on mutual growth.

That is why professional alliances like Scale Link Alliance exist to eliminate the guesswork and help members turn relationships into consistent opportunities.

<strong>Final Thought</strong>

If networking has not delivered the results you expected, it is not a sign to stop. It is a sign to upgrade how you network. Avoid these five mistakes, apply structure, and surround yourself with professionals who understand referrals not just business cards. That is when networking starts working the way it was always supposed to.`
    },
    {
      id: 4,
      type: 'guide',
      title: 'Effective Follow-Up Template Pack',
      description: 'Email templates and scripts for effective follow-up after networking events.',
      image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
      date: 'Mar 5, 2024',
      content: `Effective Follow-Up Template Pack

Email Scripts for Turning Networking Conversations Into Real Business Opportunities

Most networking does not fail because of a lack of connections. It fails because of poor follow-up. You meet great people at events, exchange contact information, and even have strong conversations yet nothing happens afterward. Opportunities go cold, momentum is lost, and potential referrals disappear.

That is why effective follow-up systems are essential for anyone serious about referral networking. The Effective Follow-Up Template Pack inside Scale Link Alliance is designed to help members stay top-of-mind, build trust, and move conversations forward without sounding pushy or sales-driven.

<strong>Why Follow-Up Matters More Than the Event Itself</strong>

Networking events create opportunity, but follow-up creates results. Effective follow-up:

• Reinforces trust after the initial meeting
• Turns casual conversations into relationships
• Positions you as professional and intentional
• Increases referral and collaboration opportunities

Most people either do not follow up at all, follow-up too late, or follow up with generic, forgettable messages. Structured follow-up is what separates networkers from business builders.

<strong>What the Effective Follow-Up Template Pack Helps You Do</strong>

This resource gives Scale Link Alliance members proven follow-up frameworks that feel natural, not salesy, respect the relationship-building process, keep conversations moving without pressure, and increase response rates and referrals.

Below are three example follow-up templates, along with exact situations where each one applies.

<strong>Three Effective Follow-Up Examples and When to Use Them</strong>

<strong>1. Post-Event Connection Follow-Up</strong>

<strong>When it applies:</strong> Use this within 24 to 48 hours after a networking event when you have had a good conversation but no immediate business discussion.

<strong>Purpose:</strong> Reinforce the connection, stay memorable, and open the door for future conversations.

<strong>Example:</strong>

Subject: Great meeting you at the event

Hi [Name],

It was great connecting with you at [event name]. I enjoyed our conversation about [specific topic you discussed].

I always like staying connected with professionals who value strong relationships and long-term growth. Let us keep in touch and continue the conversation.

Looking forward to staying connected,
[Your Name]

<strong>Why this works:</strong> It is personal, respectful, and relationship-focused without asking for anything.

<strong>2. Relationship-Building Follow-Up</strong>

<strong>When it applies:</strong> Use this after an initial follow-up when you want to deepen the relationship or explore alignment.

<strong>Purpose:</strong> Move beyond small talk, identify collaboration or referral potential, and build trust without pitching.

<strong>Example:</strong>

Subject: Continuing our conversation

Hi [Name],

I have been thinking about our conversation around [shared interest or challenge]. It sounds like we are both focused on building meaningful, long-term business relationships.

I would love to learn more about what you are currently working on and see where our paths might align. If you are open to it, we can set up a quick conversation.

Best,
[Your Name]

<strong>Why this works:</strong> It feels intentional, curious, and professional without pressure.

<strong>3. Referral-Focused Follow-Up</strong>

<strong>When it applies:</strong> Use this after trust has been established, especially within a referral network or alliance environment.

<strong>Purpose:</strong> Clarify referral intent, position yourself as referral-ready, and encourage mutual opportunity.

<strong>Example:</strong>

Subject: Exploring referral opportunities

Hi [Name],

As I continue growing my referral relationships, I wanted to better understand the type of connections that are most valuable to you.

If it makes sense, I would be happy to share who I typically work with as well, so we can support each other when opportunities come up.

Looking forward to collaborating,
[Your Name]

<strong>Why this works:</strong> It frames referrals as mutual value, not a favor or request.

<strong>Why Scale Link Alliance Members Get Better Results</strong>

Anyone can send emails. But Scale Link Alliance members operate inside a system where follow-up is expected and encouraged, relationships are built intentionally, members understand referral standards, and conversations lead somewhere.

The Effective Follow-Up Template Pack is most powerful when paired with a structured referral ecosystem, not random networking. That is what allows members to turn introductions into opportunities, build long-term referral relationships, and grow without aggressive selling.

<strong>Build Relationships That Actually Convert</strong>

Networking is not about collecting contacts. It is about building momentum through relationships. With the right follow-up systems and the right alliance behind you, every conversation becomes a growth opportunity. The Effective Follow-Up Template Pack helps Scale Link Alliance members turn networking into a repeatable business advantage.`
    },
    {
      id: 5,
      type: 'case-study',
      title: 'Financial Advisor Doubles Client Base in 12 Months',
      description: 'How a financial advisor used structured networking to dramatically expand their practice.',
      image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q',
      date: 'Feb 10, 2024',
      content: `How a Financial Advisor Doubled Their Client Base in 12 Months Through Structured Networking

For many financial advisors, growth feels capped. Not because of lack of expertise but because trust takes time, referrals are inconsistent, and prospecting feels like an endless grind.

This case study explores how one independent financial advisor doubled their client base in just 12 months by shifting from casual networking to a structured referral system and how a network like Scale Link Alliance could help replicate this kind of growth.

<strong>The Starting Point: Strong Skills, Slow Growth</strong>

Jordan was a licensed financial advisor serving professionals and small business owners. Clients were happy. Retention was solid. Results were strong. But growth was slow.

• New clients came mostly from word-of-mouth
• Referrals were unpredictable
• Networking events felt busy but unproductive
• Time spent prospecting cut into client service

Jordan's biggest challenge was not performance it was scale.

<strong>The Insight That Changed Everything</strong>

After reflecting on where the best clients came from, one pattern stood out: The highest-quality clients were introduced, not acquired. Accountants. Attorneys. Business consultants. These referrals converted faster, trusted more deeply, and stayed longer.

So Jordan stopped asking "How do I find more clients?" and started asking "How do I build a system that creates referrals consistently?"

<strong>Implementing Structured Networking</strong>

Instead of attending random events, Jordan focused on intentional relationship building. The approach was simple but disciplined:

• Identify professionals who already serve ideal clients
• Build relationships without selling
• Clarify exactly who Jordan helps best
• Stay visible through consistent follow-up

Jordan prioritized quality connections over quantity, meeting fewer people but building deeper alignment with each one.

<strong>The Referral Flywheel Takes Shape</strong>

Within the first few months:

• An accountant introduced Jordan to three clients
• A business consultant sent a steady stream of warm leads
• A legal professional referred high-net-worth prospects

Each new client strengthened the advisor's credibility inside the network. Referrals began feeding more referrals. By month 12:

• The client base had doubled
• Prospecting time dropped significantly
• Revenue became more predictable
• Trust replaced persuasion in sales conversations

<strong>Why This Strategy Worked</strong>

Three factors drove the outcome:

<strong>Trust Was Borrowed, Not Built from Scratch</strong> — Introductions came with credibility attached.

<strong>Referral Clarity</strong> — Partners knew exactly when to refer and when not to.

<strong>Consistent Relationship Management</strong> — No one was forgotten. Every connection was nurtured intentionally.

This was not luck. It was structured networking.

<strong>How Scale Link Alliance Could Create Similar Growth</strong>

Jordan built this system manually over time. Now imagine starting inside an ecosystem already designed for it. That is where Scale Link Alliance membership comes in.

<strong>Curated Professional Connections</strong> — Members connect with aligned professionals who understand referrals, not casual networking.

<strong>Clear Referral Standards</strong> — No awkward asks. Members know how to give and receive referrals professionally.

<strong>Credibility by Association</strong> — Introductions carry more weight inside a trusted alliance.

<strong>Repeatable Referral Opportunities</strong> — Growth does not rely on chance it is facilitated through structure and consistency.

For financial advisors, this removes years of trial-and-error and replaces it with immediate leverage.

<strong>The Bigger Lesson for Advisors</strong>

The fastest-growing advisors are not chasing leads. They are building networks that send leads to them. Structured referral networking turns trust into scale and alliances multiply that effect.

<strong>Do Not Build Your Practice Alone</strong>

Jordan doubled a client base by shifting from hustle to structure. With the right alliance, that kind of growth becomes repeatable, predictable, and sustainable. For advisors focused on long-term trust and consistent growth, Scale Link Alliance provides the framework that makes it possible.`
    },
   {
  id: 6,
  type: 'tool',
  title: 'ROI Calculator for Networking Groups',
  description: 'Interactive calculator to measure the return on investment from networking activities.',
  image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
  date: 'Jan 20, 2024',
  content: `ROI Calculator for Networking Groups

How to Measure the Real Return on Your Networking Activities

Networking takes time, energy, and money but most professionals never stop to ask a critical question: Is this actually worth it?

An ROI (Return on Investment) Calculator for Networking Groups helps bring clarity to that question by turning networking activity into measurable business outcomes. When used correctly, it can reveal which relationships, groups, and efforts truly drive growth and which ones quietly drain resources.

<strong>What Is an ROI Calculator for Networking?</strong>

An ROI calculator for networking groups is a tool that helps you evaluate whether the time and cost invested in networking produce meaningful business returns. It typically measures:

• Membership fees
• Time spent attending meetings and events
• Revenue generated from referrals
• Deals influenced by networking relationships
• Long-term client value

The goal is not perfection it is better decision-making.

<strong>Why Measuring Networking ROI Matters</strong>

Many professionals rely on gut feeling: "This group feels valuable." But feelings do not scale businesses. An ROI calculator helps you:

• Identify high-performing networking groups
• Justify time spent networking
• Compare networking against other growth channels
• Improve focus and efficiency

When networking becomes measurable, it becomes strategic.

<strong>How an ROI Calculator Typically Works</strong>

A simple networking ROI formula looks like this:

(Revenue Generated from Networking − Cost of Networking) ÷ Cost of Networking

Where costs may include:

• Membership fees
• Event tickets
• Travel expenses
• Time value (hours × hourly rate)

Revenue includes:

• Closed deals from referrals
• Clients influenced by introductions
• Long-term value of referred clients

Even an estimated calculation can provide powerful insights.

<strong>The Pros of Using an ROI Calculator</strong>

<strong>Clarity</strong> — You can clearly see which groups and relationships are contributing to growth.

<strong>Focus</strong> — It helps you double down on high-impact networking and reduce low-return activity.

<strong>Accountability</strong> — You become intentional instead of passively attending events.

<strong>Strategic Growth</strong> — Networking shifts from nice to have to a measurable growth channel.

<strong>The Cons and Limitations of Networking ROI</strong>

ROI calculators are powerful but imperfect.

<strong>Delayed Returns</strong> — Networking often produces results months or even years later. Early ROI may look negative even when long-term value is high.

<strong>Hard-to-Measure Trust</strong> — Not all value is immediate revenue. Credibility, reputation, and access are difficult to quantify.

<strong>Attribution Challenges</strong> — A client may come through multiple touchpoints, not just one introduction.

This is why ROI should guide decisions not dictate them blindly.

<strong>How to Properly Use an ROI Calculator</strong>

The biggest mistake professionals make is using ROI too narrowly.

<strong>Track Trends, Not Just Numbers</strong> — Look at ROI over time, not just a single period.

<strong>Separate Short-Term and Long-Term Value</strong> — Some groups generate quick wins. Others build pipelines.

<strong>Evaluate Quality, Not Just Quantity</strong> — One strong referral partner can outperform dozens of casual contacts.

<strong>Use ROI as a Filter, Not a Verdict</strong> — ROI helps prioritize not eliminate relationship-building.

<strong>Why Structured Networking Improves ROI</strong>

ROI improves dramatically when networking is intentional and structured.

Unstructured networking:

• Produces random results
• Lacks accountability
• Makes ROI unclear

Structured networking:

• Clarifies referral expectations
• Encourages consistency
• Improves referral quality
• Shortens the path to revenue

This is where alliances like Scale Link Alliance stand out by providing a framework where networking outcomes are easier to track and improve.

<strong>Networking ROI Is About Leverage, Not Just Math</strong>

The most valuable networking groups do not just generate revenue they create leverage:

• Access to trusted introductions
• Faster deal cycles
• Higher-quality clients
• Compounding referral relationships

An ROI calculator helps you see that leverage more clearly but only when paired with the right environment.

<strong>Final Thought</strong>

If networking feels busy but unproductive, the issue is not effort it is measurement and structure. An ROI Calculator for Networking Groups helps you stop guessing, start optimizing, and make smarter growth decisions. Used properly, it does not just tell you if networking works it shows you how to make it work better.`
}
  ];

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
    'guide': 'bg-blue-100 text-blue-800',
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
      title: 'Referral Tracking Template',
      description: 'Excel template to track referrals, follow-ups, and revenue generated from networking.',
      icon: <FaFileAlt />,
      format: 'Excel • 45 KB'
    },
    {
      id: 2,
      title: 'Network Mapping Guide',
      description: 'Step-by-step guide to mapping your professional network and identifying growth opportunities.',
      icon: <FaNetworkWired />,
      format: 'PDF • 2.1 MB'
    },
    {
      id: 3,
      title: 'Introduction Scripts',
      description: 'Professional scripts for making effective introductions and asking for referrals.',
      icon: <FaHandshake />,
      format: 'PDF • 1.5 MB'
    }
  ];

  const faqs = [
    {
      question: 'How does ScaleLink Alliance differ from other networking groups?',
      answer: 'ScaleLink Alliance focuses on structured, results-driven networking with industry exclusivity, weekly accountability, and referral tracking. Unlike social networking groups, we measure success by the actual business generated through our system.'
    },
    {
      question: 'What industries are represented in ScaleLink Alliance?',
      answer: 'We represent over 50 industries including legal services, financial advisory, real estate, technology, marketing, healthcare, consulting, insurance, accounting, and many B2B service providers. Each chapter maintains industry exclusivity to prevent competition.'
    },
    {
      question: 'How much time commitment is required?',
      answer: 'Members commit to 90-minute weekly meetings, plus 2-3 hours per week for follow-ups and relationship building. Most successful members report that this investment yields a significant return in new business opportunities.'
    },
    {
      question: 'What if my industry is already taken in my local chapter?',
      answer: 'We maintain a waiting list for popular industries. You can join the waitlist for your preferred chapter, or we can help you find another nearby chapter with an opening. We also help members explore adjacent industry categories that might be available.'
    },
    {
      question: 'How are referrals tracked and measured?',
      answer: 'We use a proprietary tracking system where members log referrals given and received. This includes status tracking (introduced, meeting scheduled, deal closed) and revenue generated. Members receive quarterly ROI reports showing their networking effectiveness.'
    },
    {
      question: 'Can I visit a chapter before joining?',
      answer: 'Yes! We encourage all prospective members to visit a chapter meeting as our guest. This allows you to experience our format, meet current members, and see the value firsthand. Contact us to schedule a visit.'
    }
  ];

  const handleResourceClick = (resource) => {
    if (resource.onClick) {
      resource.onClick();
    } else if (resource.richHtmlContent) {
      // CMS resource — render rich HTML in the DocumentArticle modal
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
                Tools, guides, and knowledge to help you maximize your networking success
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Featured Resource */}
      <section className="py-8 bg-linear-to-r from-blue-600 to-blue-800">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8">
              <div className="flex flex-col md:flex-row items-center justify-between">
                <div className="mb-6 md:mb-0 md:mr-8">
                  <div className="inline-flex items-center px-4 py-2 bg-white/20 rounded-full mb-4">
                    <FaBookOpen className="mr-2 text-white" />
                    <span className="font-semibold text-white">Featured Guide</span>
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-3">
                    {cmsFeatured ? cmsFeatured.title : 'The Ultimate Guide to Referral Networking'}
                  </h2>
                  <p className="text-white/90 mb-4">
                    {cmsFeatured 
                      ? (cmsFeatured.plainTextSnippet || cmsFeatured.description) 
                      : 'Learn proven strategies to build a referral-based business and accelerate your growth.'}
                  </p>
                </div>
                <button
                  onClick={() => {
                    if (cmsFeatured) {
                      handleResourceClick(cmsFeatured);
                    }
                  }}
                  className="px-8 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors whitespace-nowrap"
                >
                  Read Full Guide
                </button>
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
                      ? 'bg-linear-to-r from-blue-600 to-blue-700 text-white shadow-lg'
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
              {activeResourceList.map((resource, index) => (
                <motion.div
                  key={resource.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow overflow-hidden border border-gray-200 cursor-pointer relative"
                  onClick={() => handleResourceClick(resource)}
                >
                  {resource.featured && (
                    <div className="absolute top-4 left-4 z-10">
                      <span className="px-3 py-1 bg-blue-600 text-white text-xs font-semibold rounded-full">
                        Featured
                      </span>
                    </div>
                  )}
                  <div className="aspect-[3/2] overflow-hidden bg-gray-100">
                    <img 
                      src={resource.imageUrl || resource.image} 
                      alt={resource.title}
                      className={`w-full h-full ${(resource.imageUrl || resource.image)?.endsWith('#contain') ? 'object-contain' : 'object-cover'} hover:scale-105 transition-transform duration-500`}
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getTypeColor(resource)}`}>
                        {getTypeLabel(resource)}
                      </span>
                    </div>
                    
                    <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                      {resource.title}
                    </h3>
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {resource.plainTextSnippet || resource.description}
                    </p>
                    
                    <div className="flex justify-between items-center mt-6">
                      <span className="text-sm text-gray-500">{resource.date}</span>
                      <button className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 font-semibold">
                        <span>View Resource</span>
                        <FaArrowRight />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
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
                  className="p-3 rounded-lg border border-gray-200 text-gray-500 hover:bg-blue-50 hover:text-blue-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
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
                        ? 'bg-blue-600 text-white shadow-md'
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
                  className="p-3 rounded-lg border border-gray-200 text-gray-500 hover:bg-blue-50 hover:text-blue-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
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
              {(hasCmsData ? archiveResources : documentResources.slice(0, 3)).map((resource, index) => (
                <motion.div
                  key={resource.id || index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ y: -8 }}
                  className="group relative h-64 rounded-2xl overflow-hidden cursor-pointer shadow-lg"
                  onClick={() => handleResourceClick(resource)}
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
                    <h3 className="text-xl font-bold text-white group-hover:text-blue-200 transition-colors leading-tight">
                      {resource.title}
                    </h3>
                    <div className="mt-4 flex items-center text-blue-400 font-semibold text-sm opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all">
                      <span>Read Insight</span>
                      <FaArrowRight className="ml-2 w-3 h-3" />
                    </div>
                  </div>
                </motion.div>
              ))}
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