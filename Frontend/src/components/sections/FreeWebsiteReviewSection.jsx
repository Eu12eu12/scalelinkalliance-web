// Frontend/src/components/sections/FreeWebsiteReviewSection.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FaCheckCircle, FaArrowRight, FaFileAlt, FaStar,
  FaSearch, FaMobileAlt, FaRocket, FaRegBuilding
} from 'react-icons/fa';

const FreeWebsiteReviewSection = () => {
  const reviewItems = [
    'Website Design', 'User Experience', 'Mobile Responsiveness',
    'SEO', 'Speed', 'Calls-to-Action',
    'Lead Generation', 'Trust & Credibility',
    'Conversion Optimization', 'Content', 'Technical Issues'
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-amber-50 via-white to-amber-50/50 border-y border-amber-100">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            
            {/* Left Column - Content */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-800 px-4 py-1.5 rounded-full text-sm font-semibold mb-4">
                <FaStar className="text-amber-500" /> No Obligation • 100% Free
              </div>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                Is Your Website Helping Your Business Grow?
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                Our team will personally review your website and identify opportunities to improve:
              </p>
              
              {/* Checklist */}
              <div className="grid grid-cols-2 gap-2 mb-8">
                {reviewItems.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-gray-700 text-sm">
                    <FaCheckCircle className="text-green-500 text-xs shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
              
              <p className="text-gray-600 text-sm mb-6">
                Then we'll send you personalized recommendations with <strong>no obligation</strong>.
              </p>
              
              <Link
                to="/free-website-review"
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-amber-400 to-amber-500 text-gray-900 font-bold rounded-xl hover:from-amber-500 hover:to-amber-600 transition-all shadow-lg shadow-amber-400/30 hover:scale-105"
              >
                Request Free Website Review
                <FaArrowRight className="ml-2" />
              </Link>
            </motion.div>
            
            {/* Right Column - Visual */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="bg-white rounded-2xl shadow-2xl p-6 border border-gray-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                    <FaFileAlt className="text-amber-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Website Review Report</p>
                    <p className="text-xs text-gray-500">Sample Preview</p>
                  </div>
                </div>
                
                {/* Report Preview */}
                <div className="space-y-2">
                  {[
                    { label: 'Design Score', value: '72%', color: 'bg-amber-400' },
                    { label: 'SEO Opportunities', value: '12', color: 'bg-blue-400' },
                    { label: 'Speed Issues', value: '4', color: 'bg-red-400' },
                    { label: 'Conversion Suggestions', value: '8', color: 'bg-green-400' }
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                      <span className="text-sm text-gray-600">{item.label}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-gray-800">{item.value}</span>
                        <div className={`w-2 h-2 rounded-full ${item.color}`}></div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-4 p-3 bg-amber-50 rounded-lg border border-amber-200">
                  <p className="text-sm text-gray-700 flex items-center gap-2">
                    <span className="font-bold text-amber-700">✓</span>
                    Personalized recommendations delivered within 24-48 hours
                  </p>
                </div>
              </div>
              
              {/* Decorative Badge */}
              <div className="absolute -bottom-3 -right-3 bg-green-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                Free Review
              </div>
              
              {/* Decorative elements */}
              <div className="absolute -top-4 -left-4 w-20 h-20 bg-amber-200/30 rounded-full blur-2xl"></div>
              <div className="absolute -bottom-8 -right-8 w-24 h-24 bg-blue-200/20 rounded-full blur-2xl"></div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FreeWebsiteReviewSection;