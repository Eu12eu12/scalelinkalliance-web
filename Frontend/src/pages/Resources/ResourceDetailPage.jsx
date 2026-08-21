// src/pages/Resources/ResourceDetailPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import {
  FaArrowLeft, FaFileAlt, FaShareAlt, FaPrint, FaCopy, FaCheck,
  FaLinkedin, FaFacebook, FaWhatsapp, FaEnvelope,
  FaCalendarAlt, FaUser, FaClock, FaBookOpen, FaTags, FaArrowRight
} from 'react-icons/fa';

// Official X (formerly Twitter) Icon SVG
const XIcon = ({ size = 16, className = "" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    aria-hidden="true"
  >
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

// Helper to format dates to "Month DD, YYYY"
const formatDate = (dateString) => {
  if (!dateString) return 'January 04, 2026';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: '2-digit',
    year: 'numeric'
  }).format(date);
};

// Replaces regular hyphens between letters with Non-Breaking Hyphen (U+2011)
// so the browser cannot use them as line-break opportunities.
// Safely skips HTML tags and attributes.
const fixCompoundHyphens = (html) => {
  if (!html) return html;
  return html
    .split(/(<[^>]+>)/)
    .map((segment) => {
      if (segment.startsWith('<')) return segment;
      return segment.replace(/([a-zA-Z])-([a-zA-Z])/g, '$1\u2011$2');
    })
    .join('');
};

// Estimate reading time from HTML/text content
const calculateReadingTime = (content) => {
  if (!content) return 3;
  const text = content.replace(/<[^>]+>/g, ' ');
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
};

const ResourceDetailPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [resource, setResource] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    setLoading(true);
    setError(null);

    fetch(`/api/cms/resources/by-slug/${slug}`)
      .then(async (res) => {
        if (!res.ok) {
          throw new Error('Resource not found');
        }
        return res.json();
      })
      .then((data) => {
        if (data.resource) {
          setResource(data.resource);
          setRelated(data.related || []);
        } else {
          setError('Resource not found');
        }
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [slug]);

  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';
  const pageTitle = resource ? `${resource.title} | Scale Link Alliance` : 'Resource | Scale Link Alliance';
  const description = resource?.plainTextSnippet || 'Actionable guides, insights, and frameworks from Scale Link Alliance.';
  const readingTime = calculateReadingTime(resource?.richHtmlContent);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (_) {
      alert('Link copied to clipboard!');
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share && resource) {
      try {
        await navigator.share({
          title: resource.title,
          text: resource.plainTextSnippet || resource.title,
          url: currentUrl
        });
      } catch (_) {}
    } else {
      handleCopyLink();
    }
  };

  // Social share intent links
  const shareUrls = {
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentUrl)}`,
    x: `https://twitter.com/intent/tweet?text=${encodeURIComponent(resource?.title || '')}&url=${encodeURIComponent(currentUrl)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`,
    whatsapp: `https://api.whatsapp.com/send?text=${encodeURIComponent(`${resource?.title} - ${currentUrl}`)}`,
    email: `mailto:?subject=${encodeURIComponent(resource?.title || 'Resource from Scale Link Alliance')}&body=${encodeURIComponent(`Check out this resource: ${currentUrl}`)}`
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-24">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mb-4"></div>
          <p className="text-gray-600 font-medium">Loading resource...</p>
        </div>
      </div>
    );
  }

  if (error || !resource) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-24 px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center border border-gray-100">
          <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaBookOpen size={28} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Resource Not Found</h2>
          <p className="text-gray-600 mb-6">
            The resource you are looking for may have been moved or is no longer available.
          </p>
          <Link
            to="/resources"
            className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors shadow-md"
          >
            <FaArrowLeft className="mr-2" /> Back to All Resources
          </Link>
        </div>
      </div>
    );
  }

  const categoryName = resource.type?.name || 'Resource';

  return (
    <div className="min-h-screen bg-white">
      {/* Dynamic SEO & Open Graph Meta Tags via Helmet */}
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={currentUrl} />

        {/* Open Graph / Facebook / LinkedIn / WhatsApp */}
        <meta property="og:type" content="article" />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={resource.imageUrl ? resource.imageUrl.split('#')[0] : 'https://scalelinkalliance.com/logo.png'} />
        <meta property="og:url" content={currentUrl} />
        <meta property="og:site_name" content="Scale Link Alliance" />

        {/* X / Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={resource.imageUrl ? resource.imageUrl.split('#')[0] : 'https://scalelinkalliance.com/logo.png'} />
      </Helmet>

      {/* Top Breadcrumb Navigation */}
      <div className="bg-gray-50/80 border-b border-gray-200 no-print">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3.5 max-w-7xl">
          <nav className="flex items-center space-x-2 text-xs md:text-sm text-gray-500 overflow-x-auto whitespace-nowrap">
            <Link to="/" className="hover:text-blue-600 transition-colors">Home</Link>
            <span className="text-gray-400">/</span>
            <Link to="/resources" className="hover:text-blue-600 transition-colors">Resources</Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900 font-medium truncate max-w-xs md:max-w-xl">{resource.title}</span>
          </nav>
        </div>
      </div>

      {/* Hero Header Section */}
      <section className="relative bg-linear-to-br from-blue-950 via-blue-900 to-indigo-950 text-white overflow-hidden py-12 md:py-16">
        {resource.imageUrl && (
          <img
            src={resource.imageUrl}
            alt={resource.title}
            className={`absolute inset-0 w-full h-full ${resource.imageUrl.endsWith('#contain') ? 'object-contain' : 'object-cover'} opacity-20 filter blur-xs`}
          />
        )}
        <div className="absolute inset-0 bg-linear-to-t from-gray-950/90 via-blue-950/60 to-transparent" />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl relative z-10">
          <Link
            to="/resources"
            className="inline-flex items-center space-x-2 text-blue-200 hover:text-white mb-5 text-sm font-semibold transition-colors no-print"
          >
            <FaArrowLeft className="text-xs" />
            <span>Back to All Resources</span>
          </Link>

          <div className="inline-flex items-center px-3.5 py-1 bg-white/15 backdrop-blur-md rounded-full text-xs font-semibold uppercase tracking-wider text-blue-100 mb-4 border border-white/20">
            <FaTags className="mr-1.5" />
            {categoryName}
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-extrabold leading-tight tracking-tight mb-6 max-w-5xl">
            {resource.title}
          </h1>

          {/* Article Meta row */}
          <div className="flex flex-wrap items-center gap-y-3 gap-x-6 text-sm text-blue-100/90 pt-3 border-t border-white/15">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-xs">
                <FaUser />
              </div>
              <span className="font-semibold text-white">{resource.author || 'Scale Link Alliance'}</span>
            </div>

            <div className="flex items-center space-x-2">
              <FaCalendarAlt className="text-blue-300" />
              <span>{formatDate(resource.publishedDate)}</span>
            </div>

            <div className="flex items-center space-x-2">
              <FaClock className="text-blue-300" />
              <span>{readingTime} min read</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area + Sticky Share Bar with Expanded Width */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl py-10 md:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          
          {/* Main Article Column with Generous Width */}
          <main className="lg:col-span-8 xl:col-span-9 min-w-0">
            
            {/* Featured Cover Image */}
            {resource.imageUrl && (
              <div className="mb-8 rounded-2xl overflow-hidden shadow-md border border-gray-100 bg-gray-100 max-h-[460px]">
                <img
                  src={resource.imageUrl}
                  alt={resource.title}
                  className={`w-full h-full max-h-[460px] ${resource.imageUrl.endsWith('#contain') ? 'object-contain' : 'object-cover'}`}
                />
              </div>
            )}

            {/* Lead Preview Snippet */}
            {resource.plainTextSnippet && (
              <div className="text-lg md:text-xl text-gray-800 font-medium leading-relaxed mb-8 p-6 bg-blue-50/70 rounded-2xl border-l-4 border-blue-600">
                {resource.plainTextSnippet}
              </div>
            )}

            {/* Rich HTML Content */}
            <article
              className="prose prose-lg md:prose-xl max-w-none text-gray-900 leading-relaxed prose-headings:font-bold prose-headings:text-gray-950 prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline prose-img:rounded-2xl"
              style={{ overflowWrap: 'break-word', wordBreak: 'normal' }}
              dangerouslySetInnerHTML={{ __html: fixCompoundHyphens(resource.richHtmlContent) }}
            />

            {/* Call to Action Banner */}
            <div className="mt-14 p-8 md:p-10 bg-linear-to-r from-blue-600 via-blue-700 to-indigo-800 rounded-3xl text-white shadow-xl no-print">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                  <span className="inline-block px-3 py-1 bg-white/20 rounded-full text-xs font-bold uppercase tracking-wider mb-3">
                    Scale Link Alliance Network
                  </span>
                  <h3 className="text-2xl md:text-3xl font-extrabold mb-2">
                    Ready to Scale Your Referral Network?
                  </h3>
                  <p className="text-blue-100 max-w-2xl text-sm md:text-base">
                    Join vetted professionals across 50+ exclusive industry categories and accelerate your business growth.
                  </p>
                </div>
                <Link
                  to="/membership"
                  className="px-8 py-3.5 bg-white text-blue-700 font-bold rounded-xl hover:bg-gray-100 transition-all shadow-md hover:shadow-lg whitespace-nowrap"
                >
                  Join the Alliance
                </Link>
              </div>
            </div>
          </main>

          {/* Sidebar: Social Share Tools & Quick Info */}
          <aside className="lg:col-span-4 xl:col-span-3 space-y-6 no-print">
            <div className="sticky top-24 space-y-6">
              
              {/* Share Card */}
              <div className="bg-gray-50/90 border border-gray-200 rounded-2xl p-5 shadow-xs">
                <h3 className="text-sm font-bold text-gray-900 mb-3.5 flex items-center space-x-2">
                  <FaShareAlt className="text-blue-600" />
                  <span>Share This Resource</span>
                </h3>

                {/* Social Share Icon Buttons with Modern X Logo */}
                <div className="grid grid-cols-5 gap-2 mb-4">
                  <a
                    href={shareUrls.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Share on LinkedIn"
                    title="Share on LinkedIn"
                    className="flex items-center justify-center p-3 bg-white border border-gray-200 rounded-xl text-[#0A66C2] hover:bg-blue-50 hover:border-blue-300 transition-all shadow-xs"
                  >
                    <FaLinkedin size={18} />
                  </a>
                  <a
                    href={shareUrls.x}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Share on X"
                    title="Share on X"
                    className="flex items-center justify-center p-3 bg-white border border-gray-200 rounded-xl text-black hover:bg-gray-100 hover:border-black transition-all shadow-xs"
                  >
                    <XIcon size={16} />
                  </a>
                  <a
                    href={shareUrls.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Share on Facebook"
                    title="Share on Facebook"
                    className="flex items-center justify-center p-3 bg-white border border-gray-200 rounded-xl text-[#1877F2] hover:bg-blue-50 hover:border-blue-300 transition-all shadow-xs"
                  >
                    <FaFacebook size={18} />
                  </a>
                  <a
                    href={shareUrls.whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Share on WhatsApp"
                    title="Share on WhatsApp"
                    className="flex items-center justify-center p-3 bg-white border border-gray-200 rounded-xl text-[#25D366] hover:bg-green-50 hover:border-green-300 transition-all shadow-xs"
                  >
                    <FaWhatsapp size={18} />
                  </a>
                  <a
                    href={shareUrls.email}
                    aria-label="Share via Email"
                    title="Share via Email"
                    className="flex items-center justify-center p-3 bg-white border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-100 hover:border-gray-400 transition-all shadow-xs"
                  >
                    <FaEnvelope size={18} />
                  </a>
                </div>

                {/* Direct Link Copy Button */}
                <button
                  onClick={handleCopyLink}
                  className={`w-full flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl font-semibold text-xs transition-all border ${
                    copied
                      ? 'bg-green-50 text-green-700 border-green-300 shadow-xs'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100 shadow-xs'
                  }`}
                >
                  {copied ? <FaCheck className="text-green-600" /> : <FaCopy />}
                  <span>{copied ? 'Link Copied!' : 'Copy Resource Link'}</span>
                </button>

                {/* Secondary Actions */}
                <div className="mt-2.5 flex items-center gap-2">
                  <button
                    onClick={handleNativeShare}
                    className="flex-1 flex items-center justify-center space-x-1.5 px-3 py-2 bg-white hover:bg-gray-100 border border-gray-200 rounded-lg text-xs font-medium text-gray-700 transition-colors"
                  >
                    <FaShareAlt className="text-xs text-blue-600" />
                    <span>Quick Share</span>
                  </button>
                  <button
                    onClick={() => window.print()}
                    className="flex-1 flex items-center justify-center space-x-1.5 px-3 py-2 bg-white hover:bg-gray-100 border border-gray-200 rounded-lg text-xs font-medium text-gray-700 transition-colors"
                  >
                    <FaPrint className="text-xs text-gray-600" />
                    <span>Print</span>
                  </button>
                </div>
              </div>

              {/* Author / Publication Card */}
              <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-xs">
                <div className="flex items-center space-x-3 mb-2.5">
                  <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
                    <FaFileAlt />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm">{resource.author || 'Scale Link Alliance'}</h4>
                    <p className="text-[11px] text-gray-500">Official Knowledge Publication</p>
                  </div>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Published by Scale Link Alliance to empower professionals with actionable referral networking strategies.
                </p>
              </div>

            </div>
          </aside>
        </div>
      </div>

      {/* Related Resources Section */}
      {related.length > 0 && (
        <section className="bg-gray-50 border-t border-gray-200 py-14 no-print">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900">
                  Related Insights & Guides
                </h2>
                <p className="text-gray-600 text-sm mt-1">
                  Continue exploring topics in {categoryName}
                </p>
              </div>
              <Link
                to="/resources"
                className="hidden sm:inline-flex items-center space-x-2 text-blue-600 hover:text-blue-800 font-semibold text-sm"
              >
                <span>View all</span>
                <FaArrowRight className="text-xs" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {related.map((rel) => (
                <Link
                  key={rel.id}
                  to={`/resources/${rel.slug || rel.id}`}
                  className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md border border-gray-200 flex flex-col transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="aspect-16/10 overflow-hidden bg-gray-100 relative">
                    <img
                      src={rel.imageUrl || 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=800&q=80'}
                      alt={rel.title}
                      className={`w-full h-full ${rel.imageUrl?.endsWith('#contain') ? 'object-contain' : 'object-cover'} group-hover:scale-105 transition-transform duration-500`}
                    />
                    <span className="absolute top-3 left-3 px-2.5 py-0.5 bg-blue-600/90 text-white text-[11px] font-bold rounded-full backdrop-blur-xs">
                      {rel.type?.shortForm || 'Guide'}
                    </span>
                  </div>

                  <div className="p-5 flex flex-col justify-between flex-1">
                    <div>
                      <h3 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2 mb-2 text-base">
                        {rel.title}
                      </h3>
                      <p className="text-xs text-gray-600 line-clamp-2">
                        {rel.plainTextSnippet || rel.title}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                      <span>{formatDate(rel.publishedDate)}</span>
                      <span className="font-semibold text-blue-600 group-hover:translate-x-0.5 transition-transform">Read &rarr;</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default ResourceDetailPage;