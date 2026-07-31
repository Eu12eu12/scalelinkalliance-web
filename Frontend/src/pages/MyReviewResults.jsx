// Frontend/src/pages/MyReviewResults.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FaCheckCircle, FaStar, FaChartLine, FaMobileAlt,
  FaDesktop, FaShieldAlt, FaRocket, FaEnvelope,
  FaDownload, FaArrowRight, FaUser
} from 'react-icons/fa';
import axios from 'axios';

const MyReviewResults = () => {
  const { leadId } = useParams();
  const location = useLocation();
  const [review, setReview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const email = new URLSearchParams(location.search).get('email');
    if (email) {
      fetchReview(leadId, email);
    } else {
      setError('Missing email verification');
      setLoading(false);
    }
  }, [leadId, location]);

  const fetchReview = async (id, email) => {
    try {
      const response = await axios.get(`/api/reviews/my-review/${id}?email=${encodeURIComponent(email)}`);
      setReview(response.data.data);
    } catch (error) {
      console.error('Error fetching review:', error);
      setError(error.response?.data?.message || 'Review not found or not completed yet');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  if (error || !review) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">🔍</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Review Not Found</h1>
          <p className="text-gray-600">{error || 'Your review is not ready yet. We\'ll email you when it\'s complete.'}</p>
        </div>
      </div>
    );
  }

  const { websiteUrl, reviewResults, reviewCompleted } = review;
  const { scores, findings, strengths, opportunities, executiveSummary } = reviewResults;

  // Calculate average score
  const scoreValues = Object.values(scores);
  const averageScore = Math.round(scoreValues.reduce((a, b) => a + b, 0) / scoreValues.length);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-1.5 rounded-full text-sm font-semibold mb-4">
            <FaCheckCircle /> Review Complete
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Your Website Review Results
          </h1>
          <p className="text-gray-500">{websiteUrl}</p>
          <p className="text-sm text-gray-400 mt-1">
            Completed: {new Date(reviewCompleted).toLocaleDateString()}
          </p>
        </motion.div>

        {/* Overall Score */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl shadow-xl p-8 mb-8 text-center"
        >
          <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 text-white text-5xl font-bold mb-4">
            {averageScore}%
          </div>
          <h2 className="text-2xl font-bold text-gray-900">
            Overall Website Score
          </h2>
          <p className="text-gray-500">
            {averageScore >= 80 ? 'Great job! Your website performs well.' :
             averageScore >= 60 ? 'Good foundation with room for improvement.' :
             'Significant opportunities for improvement.'}
          </p>
        </motion.div>

        {/* Scores Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        >
          {Object.entries(scores).map(([category, score]) => (
            <div key={category} className="bg-white rounded-xl shadow-sm p-4 text-center border border-gray-100">
              <p className="text-sm text-gray-500 capitalize">
                {category.replace(/([A-Z])/g, ' $1').trim()}
              </p>
              <p className="text-2xl font-bold text-gray-900">{score}%</p>
            </div>
          ))}
        </motion.div>

        {/* Executive Summary */}
        {executiveSummary && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl shadow-sm p-6 mb-8 border border-gray-100"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-3">Executive Summary</h2>
            <p className="text-gray-600 leading-relaxed">{executiveSummary}</p>
          </motion.div>
        )}

        {/* Strengths */}
        {strengths && strengths.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-green-50 rounded-2xl p-6 mb-8 border border-green-200"
          >
            <h2 className="text-xl font-bold text-green-800 mb-3 flex items-center gap-2">
              <FaCheckCircle className="text-green-600" /> Strengths
            </h2>
            <ul className="list-disc list-inside space-y-1 text-green-700">
              {strengths.map((strength, index) => (
                <li key={index}>{strength}</li>
              ))}
            </ul>
          </motion.div>
        )}

        {/* Opportunities */}
        {opportunities && opportunities.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-purple-50 rounded-2xl p-6 mb-8 border border-purple-200"
          >
            <h2 className="text-xl font-bold text-purple-800 mb-3 flex items-center gap-2">
              <FaRocket className="text-purple-600" /> Opportunities
            </h2>
            <ul className="list-disc list-inside space-y-1 text-purple-700">
              {opportunities.map((opportunity, index) => (
                <li key={index}>{opportunity}</li>
              ))}
            </ul>
          </motion.div>
        )}

        {/* Findings */}
        {findings && findings.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-2xl shadow-sm p-6 mb-8 border border-gray-100"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-4">Detailed Findings</h2>
            <div className="space-y-4">
              {findings.map((finding, index) => (
                <div key={index} className="border-b border-gray-100 pb-3 last:border-0">
                  <div className="flex items-start gap-3">
                    <span className={`px-2 py-0.5 text-xs rounded-full ${
                      finding.severity === 'critical' ? 'bg-red-100 text-red-700' :
                      finding.severity === 'high' ? 'bg-orange-100 text-orange-700' :
                      finding.severity === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>
                      {finding.severity}
                    </span>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{finding.category}</p>
                      <p className="text-sm text-gray-600">{finding.issue}</p>
                      {finding.recommendation && (
                        <p className="text-sm text-blue-600 mt-1">→ {finding.recommendation}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="text-center bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-8 text-white"
        >
          <h2 className="text-2xl font-bold mb-3">
            Ready to Improve Your Website?
          </h2>
          <p className="text-blue-100 mb-6">
            Let's discuss how we can implement these recommendations and grow your business.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/contact"
              className="px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition"
            >
              Schedule a Discovery Call
            </a>
            <a
              href="/services"
              className="px-6 py-3 bg-transparent border-2 border-white text-white font-semibold rounded-lg hover:bg-white/10 transition"
            >
              Browse Our Services
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default MyReviewResults;