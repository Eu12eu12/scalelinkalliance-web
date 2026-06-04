import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaHandshake, FaCheckCircle, FaLink, FaBuilding, FaImage, FaTimes } from 'react-icons/fa';

const MARQUEE_CSS = `
@keyframes nb-marquee {
  0%   { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}
.nb-marquee-track {
  display: flex;
  align-items: center;
  width: max-content;
  animation: nb-marquee 35s linear infinite;
}
.nb-marquee-track:hover { animation-play-state: paused; }
`;

const BusinessPartnersPage = () => {
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formStatus, setFormStatus] = useState({ type: null, message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [logoPreview, setLogoPreview] = useState(null);
  const [descCount, setDescCount] = useState(0);
  const DESC_MAX = 80;

  useEffect(() => {
    fetch('/api/cms/partners')
      .then(r => r.json())
      .then(data => { if (Array.isArray(data)) setPartners(data); })
      .catch(err => console.error('Failed to fetch partners', err))
      .finally(() => setLoading(false));
  }, []);

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (!file) { setLogoPreview(null); return; }
    if (file.size > 16 * 1024 * 1024) {
      setFormStatus({ type: 'error', message: 'Logo file size must be less than 16MB.' });
      e.target.value = '';
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => setLogoPreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormStatus({ type: null, message: '' });

    if (!logoPreview) {
      setFormStatus({ type: 'error', message: 'Please upload your company logo to continue.' });
      setIsSubmitting(false);
      return;
    }

    const form = e.target;
    const payload = {
      businessName: form.businessName.value,
      category: form.category.value,
      contactEmail: form.contactEmail.value,
      websiteUrl: form.websiteUrl.value,
      linkPlacementUrl: form.linkPlacementUrl.value,
      description: form.description.value,
      logoUrl: logoPreview,
    };

    try {
      const res = await fetch('/api/cms/partners', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        setFormStatus({ type: 'success', message: 'Your application has been submitted and is pending review. Thank you!' });
        setLogoPreview(null);
        setDescCount(0);
        form.reset();
      } else {
        const err = await res.json();
        setFormStatus({ type: 'error', message: err.error || 'Something went wrong. Please try again.' });
      }
    } catch {
      setFormStatus({ type: 'error', message: 'Failed to connect to the server.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Duplicate list for seamless loop — need at least 2 copies
  const loopItems = partners.length > 0
    ? [...partners, ...partners, ...partners]
    : [];

  return (
    <div className="bg-white min-h-screen">
      <style>{MARQUEE_CSS}</style>

      {/* ── Hero ───────────────────────────────────────────────────────── */}
      <section className="relative py-28 bg-slate-900 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/80 via-slate-900 to-black z-10" />
          <img
            src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
            alt="Business Partner Network"
            className="w-full h-full object-cover opacity-40"
          />
        </div>
        <div className="container mx-auto px-4 relative z-20 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6 leading-tight">
              Business Growth <span className="text-blue-400">Partner Network</span>
            </h1>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              We partner with high-quality businesses to create strategic collaborations,
              qualified referrals, and scalable growth opportunities.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── Featured Partners — Logo Ticker ────────────────────────────── */}
      <section className="py-20 bg-slate-50 border-t border-slate-100 overflow-hidden">
        <div className="container mx-auto px-4 text-center mb-14">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-extrabold text-slate-900 mb-3">Featured Partners</h2>
            <div className="w-16 h-1 bg-blue-600 rounded-full mx-auto" />
          </motion.div>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-600" />
          </div>

        ) : partners.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-md mx-auto text-center px-4 py-4"
          >
            <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 mx-auto mb-6 border border-blue-100">
              <FaHandshake size={36} />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-3">Our partner network is launching soon.</h3>
            <p className="text-slate-500">Apply now to be among the first featured partners.</p>
          </motion.div>

        ) : partners.length < 5 ? (
          /* Static row for small count */
          <div className="flex justify-center items-center gap-20 px-8 flex-wrap">
            {partners.map((p) => (
              <a
                key={p.id}
                href={p.websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                title={p.businessName}
                className="flex items-center justify-center h-20 transition-all duration-300"
              >
                {p.logoUrl
                  ? <img src={p.logoUrl} alt={p.businessName} className="h-20 w-auto max-w-[200px] object-contain" />
                  : <div className="flex flex-col items-center gap-2"><FaBuilding className="text-5xl text-slate-300" /><span className="text-slate-500 text-sm">{p.businessName}</span></div>
                }
              </a>
            ))}
          </div>

        ) : (
          /* Infinite scrolling marquee */
          <div className="relative">
            {/* Left fade */}
            <div className="absolute left-0 top-0 bottom-0 w-48 bg-gradient-to-r from-slate-50 to-transparent z-10 pointer-events-none" />
            {/* Right fade */}
            <div className="absolute right-0 top-0 bottom-0 w-48 bg-gradient-to-l from-slate-50 to-transparent z-10 pointer-events-none" />

            <div className="overflow-hidden">
              <div className="nb-marquee-track">
                {loopItems.map((p, idx) => (
                  <a
                    key={idx}
                    href={p.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={p.businessName}
                    className="flex-shrink-0 mx-16 flex items-center justify-center transition-all duration-300"
                  >
                    {p.logoUrl
                      ? <img src={p.logoUrl} alt={p.businessName} className="h-20 w-auto max-w-[200px] object-contain" />
                      : <div className="flex flex-col items-center gap-2"><FaBuilding className="text-5xl text-slate-300" /><span className="text-slate-500 text-sm font-medium">{p.businessName}</span></div>
                    }
                  </a>
                ))}
              </div>
            </div>
          </div>
        )}
      </section>

      {/* ── Become a Featured Partner ───────────────────────────────────── */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-16 items-center">

            {/* Content */}
            <div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">
                Become a Featured Partner
              </h2>
              <p className="text-lg text-slate-600 mb-10 leading-relaxed">
                Partner with us to reach new audiences, generate qualified referrals,
                and grow through strategic collaborations.
              </p>

              <div className="space-y-6 mb-10">
                {[
                  { title: 'Add ScaleLink to Your Site', body: 'Link to ScaleLink Alliance from your website to demonstrate our partnership.' },
                  { title: 'Submit for Review', body: 'Fill out our submission form with your business details and the link placement URL.' },
                  { title: 'Get Featured', body: 'Once approved, your business logo will be featured in our high-traffic growth network.' },
                ].map((item) => (
                  <div key={item.title} className="flex items-start">
                    <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center text-green-600 shrink-0 mr-4">
                      <FaCheckCircle />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900">{item.title}</h4>
                      <p className="text-slate-600 text-sm">{item.body}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-6 bg-slate-900 rounded-2xl text-white">
                <h4 className="font-bold mb-3 flex items-center">
                  <FaLink className="mr-2 text-blue-400" />ScaleLink Badge Code
                </h4>
                <code className="block bg-slate-800 p-3 rounded-lg text-sm text-blue-400 break-all">
                  &lt;a href="https://scalelinkalliance.com"&gt;ScaleLink Alliance – Business Growth Network&lt;/a&gt;
                </code>
              </div>
            </div>

            {/* Form */}
            <div className="bg-slate-50 rounded-3xl p-8 md:p-12 shadow-inner border border-slate-100">
              <h3 className="text-2xl font-bold text-slate-900 mb-8">Apply for Partnership</h3>
              <form onSubmit={handleSubmit} className="space-y-5">

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Business Name *</label>
                  <input name="businessName" required type="text" placeholder="Enter your company name"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white transition-all" />
                </div>

                <div className="grid md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Primary Category *</label>
                    <input name="category" required type="text" placeholder="e.g. Marketing Agency"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white transition-all" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Work Email *</label>
                    <input name="contactEmail" required type="email" placeholder="hello@company.com"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white transition-all" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Website URL *</label>
                  <input name="websiteUrl" required type="url" placeholder="https://yourwebsite.com"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white transition-all" />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Link Placement URL *</label>
                  <input name="linkPlacementUrl" required type="url" placeholder="Where is the ScaleLink badge?"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white transition-all" />
                  <p className="text-[10px] text-slate-400 mt-1">The specific page where you've added our link.</p>
                </div>

                {/* Logo upload */}
                <div className="grid md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Company Logo *</label>
                    <input type="file" name="logo" accept="image/jpeg,image/png,image/webp"
                      onChange={handleLogoChange} className="hidden" id="logo-upload" />
                    <label htmlFor="logo-upload"
                      className="flex items-center justify-center w-full px-4 py-3 rounded-xl border border-dashed border-slate-300 hover:border-blue-500 hover:bg-blue-50 transition-all cursor-pointer bg-white">
                      <div className="flex items-center space-x-2 text-slate-400">
                        <FaImage /><span className="text-sm">Upload Logo (Max 16MB)</span>
                      </div>
                    </label>
                    <p className="text-[10px] text-slate-400 mt-1">JPG, PNG, or WebP accepted. Max 16MB.</p>
                  </div>
                  {logoPreview && (
                    <div className="flex flex-col items-center justify-center p-3 bg-white rounded-xl border border-slate-200 shadow-sm relative">
                      <button type="button" onClick={() => { setLogoPreview(null); document.getElementById('logo-upload').value = ''; }}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-red-600">
                        <FaTimes size={11} />
                      </button>
                      <img src={logoPreview} alt="Logo preview" className="h-14 w-auto object-contain rounded" />
                      <p className="text-[10px] text-slate-400 mt-2">Logo Preview</p>
                    </div>
                  )}
                </div>

                {/* Description — internal only */}
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    Brief Description
                    <span className="ml-1 font-normal text-slate-400 text-xs">(internal — not shown publicly)</span>
                  </label>
                  <input name="description" required type="text" maxLength={DESC_MAX}
                    placeholder="e.g. Cloud-based HR solutions for SMEs"
                    onChange={(e) => setDescCount(e.target.value.length)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white transition-all" />
                  <p className="text-[10px] text-slate-400 mt-1 text-right">{descCount}/{DESC_MAX} characters</p>
                </div>

                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" disabled={isSubmitting}
                  className={`w-full py-4 rounded-xl font-bold text-white transition-all shadow-lg ${isSubmitting ? 'bg-slate-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 shadow-blue-500/20'}`}>
                  {isSubmitting ? 'Submitting…' : 'Submit Partnership Application'}
                </motion.button>

                <AnimatePresence>
                  {formStatus.message && (
                    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                      className={`p-4 rounded-xl text-sm font-medium border ${formStatus.type === 'success' ? 'bg-green-50 text-green-700 border-green-100' : 'bg-red-50 text-red-700 border-red-100'}`}>
                      {formStatus.message}
                    </motion.div>
                  )}
                </AnimatePresence>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BusinessPartnersPage;
