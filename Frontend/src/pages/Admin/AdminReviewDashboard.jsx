// Frontend/src/pages/Admin/AdminReviewDashboard.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { 
  FaSearch, FaStar, FaCheckCircle, FaClock, FaUser, 
  FaGlobe, FaArrowRight, FaChartLine, FaMobile,
  FaDesktop, FaShieldAlt, FaRocket, FaEnvelope,
  FaTrash, FaPlus, FaTimes, FaEye, FaSpinner
} from 'react-icons/fa';

const AdminReviewDashboard = () => {
  const [leads, setLeads] = useState([]);
  const [selectedLead, setSelectedLead] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [filter, setFilter] = useState('pending'); // pending, completed, all
  
  const [reviewData, setReviewData] = useState({
    scores: {
      design: 0,
      ux: 0,
      seo: 0,
      performance: 0,
      mobile: 0,
      content: 0,
      leadGeneration: 0,
      conversion: 0
    },
    findings: [],
    strengths: [],
    opportunities: [],
    executiveSummary: '',
    technicalDetails: ''
  });
  
  const [newFinding, setNewFinding] = useState({
    category: '',
    issue: '',
    severity: 'medium',
    recommendation: '',
    impact: ''
  });
  const [newStrength, setNewStrength] = useState('');
  const [newOpportunity, setNewOpportunity] = useState('');

  // Get auth token from localStorage (using your cms_token)
  const getAuthToken = () => {
    return localStorage.getItem('cms_token') || '';
  };

  useEffect(() => {
    fetchReviews();
  }, [filter]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const token = getAuthToken();
      
      let url = '/api/admin/reviews';
      if (filter === 'pending') {
        url = '/api/admin/reviews/pending';
      } else if (filter === 'completed') {
        url = '/api/admin/reviews/completed';
      }
      
      const response = await axios.get(url, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      setLeads(response.data.data || []);
      setError(null);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      setError(error.response?.data?.message || 'Failed to load reviews');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectLead = (lead) => {
    setSelectedLead(lead);
    if (lead.reviewResults) {
      setReviewData(lead.reviewResults);
    } else {
      // Reset review data
      setReviewData({
        scores: {
          design: 0,
          ux: 0,
          seo: 0,
          performance: 0,
          mobile: 0,
          content: 0,
          leadGeneration: 0,
          conversion: 0
        },
        findings: [],
        strengths: [],
        opportunities: [],
        executiveSummary: '',
        technicalDetails: ''
      });
    }
    setError(null);
    setSuccess(null);
  };

  const handleScoreChange = (category, value) => {
    setReviewData(prev => ({
      ...prev,
      scores: {
        ...prev.scores,
        [category]: parseInt(value) || 0
      }
    }));
  };

  const addFinding = () => {
    if (newFinding.issue && newFinding.category) {
      setReviewData(prev => ({
        ...prev,
        findings: [...prev.findings, { ...newFinding, id: Date.now() }]
      }));
      setNewFinding({ category: '', issue: '', severity: 'medium', recommendation: '', impact: '' });
    }
  };

  const removeFinding = (index) => {
    setReviewData(prev => ({
      ...prev,
      findings: prev.findings.filter((_, i) => i !== index)
    }));
  };

  const addStrength = () => {
    if (newStrength.trim()) {
      setReviewData(prev => ({
        ...prev,
        strengths: [...prev.strengths, newStrength.trim()]
      }));
      setNewStrength('');
    }
  };

  const removeStrength = (index) => {
    setReviewData(prev => ({
      ...prev,
      strengths: prev.strengths.filter((_, i) => i !== index)
    }));
  };

  const addOpportunity = () => {
    if (newOpportunity.trim()) {
      setReviewData(prev => ({
        ...prev,
        opportunities: [...prev.opportunities, newOpportunity.trim()]
      }));
      setNewOpportunity('');
    }
  };

  const removeOpportunity = (index) => {
    setReviewData(prev => ({
      ...prev,
      opportunities: prev.opportunities.filter((_, i) => i !== index)
    }));
  };

  const submitReview = async () => {
    if (!selectedLead) return;
    
    try {
      setSubmitting(true);
      setError(null);
      
      const token = getAuthToken();
      await axios.put(`/api/reviews/submit/${selectedLead._id}`, {
        reviewResults: reviewData,
        reviewStatus: 'completed'
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      setSuccess('Review submitted successfully! Email notification sent to client.');
      
      // Refresh list after a delay
      setTimeout(() => {
        fetchReviews();
        setSelectedLead(null);
        setSuccess(null);
      }, 3000);
      
    } catch (error) {
      console.error('Error submitting review:', error);
      setError(error.response?.data?.message || 'Error submitting review');
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: 'bg-amber-100 text-amber-700',
      in_progress: 'bg-blue-100 text-blue-700',
      completed: 'bg-green-100 text-green-700',
      sent: 'bg-purple-100 text-purple-700'
    };
    return badges[status] || 'bg-gray-100 text-gray-700';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Website Review Dashboard
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Manage and complete website reviews for your clients
            </p>
          </div>
          <div className="flex items-center gap-3">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-4 py-2 border rounded-lg text-sm bg-white"
            >
              <option value="pending">Pending Reviews</option>
              <option value="completed">Completed</option>
              <option value="all">All Reviews</option>
            </select>
            <button
              onClick={fetchReviews}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm flex items-center gap-2"
            >
              <FaSpinner className={loading ? 'animate-spin' : ''} />
              Refresh
            </button>
          </div>
        </div>

        {/* Error/Success Messages */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 flex items-center gap-2">
            <FaTimes className="text-red-500" />
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg text-green-600 flex items-center gap-2">
            <FaCheckCircle className="text-green-500" />
            {success}
          </div>
        )}

        {!selectedLead ? (
          // ─── Lead List ──────────────────────────────────────────
          <div className="grid gap-4">
            {leads.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-100">
                <FaCheckCircle className="text-4xl text-green-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900">All Caught Up!</h3>
                <p className="text-gray-500">No {filter === 'pending' ? 'pending' : ''} reviews to complete</p>
              </div>
            ) : (
              leads.map((lead) => (
                <motion.div
                  key={lead._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition cursor-pointer border border-gray-100 hover:border-blue-300"
                  onClick={() => handleSelectLead(lead)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 min-w-0">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center shrink-0">
                        <FaUser className="text-blue-600" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-semibold text-gray-900">
                          {lead.firstName} {lead.lastName}
                        </h3>
                        <p className="text-sm text-gray-500 truncate">{lead.email}</p>
                        <p className="text-sm text-gray-400 truncate flex items-center gap-1">
                          <FaGlobe className="text-xs shrink-0" /> 
                          <span className="truncate">{lead.websiteUrl}</span>
                        </p>
                      </div>
                    </div>
                    <div className="text-right shrink-0 ml-4">
                      <span className={`inline-block px-3 py-1 text-xs rounded-full ${getStatusBadge(lead.reviewStatus)}`}>
                        {lead.reviewStatus || 'pending'}
                      </span>
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(lead.dateSubmitted).toLocaleDateString()}
                      </p>
                      {lead.businessName && (
                        <p className="text-xs text-gray-400 truncate max-w-[120px]">{lead.businessName}</p>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        ) : (
          // ─── Review Form ─────────────────────────────────────────
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-start justify-between mb-6 pb-4 border-b border-gray-200">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Review: {selectedLead.firstName} {selectedLead.lastName}
                </h2>
                <p className="text-sm text-gray-500 flex items-center gap-2 mt-1">
                  <FaGlobe className="text-xs" /> 
                  <a href={selectedLead.websiteUrl} target="_blank" rel="noopener noreferrer" 
                     className="text-blue-600 hover:underline">
                    {selectedLead.websiteUrl}
                  </a>
                </p>
                <p className="text-sm text-gray-400">{selectedLead.email}</p>
                {selectedLead.businessName && (
                  <p className="text-sm text-gray-400">{selectedLead.businessName}</p>
                )}
                {selectedLead.industry && (
                  <p className="text-sm text-gray-400">Industry: {selectedLead.industry}</p>
                )}
              </div>
              <button
                onClick={() => setSelectedLead(null)}
                className="px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition text-sm"
              >
                ← Back to List
              </button>
            </div>

            {/* Scores Grid */}
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-3">Scores (0-100)</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(reviewData.scores).map(([category, score]) => (
                  <div key={category} className="bg-gray-50 rounded-lg p-3">
                    <label className="block text-xs font-medium text-gray-600 capitalize mb-1">
                      {category.replace(/([A-Z])/g, ' $1').trim()}
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={score}
                      onChange={(e) => handleScoreChange(category, e.target.value)}
                      className="w-full accent-blue-600"
                    />
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-400">0</span>
                      <span className="font-bold text-blue-600">{score}%</span>
                      <span className="text-gray-400">100</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Findings */}
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-3">Findings</h3>
              <div className="space-y-2 mb-3 max-h-60 overflow-y-auto">
                {reviewData.findings.length === 0 ? (
                  <p className="text-sm text-gray-400 italic">No findings added yet</p>
                ) : (
                  reviewData.findings.map((finding, index) => (
                    <div key={index} className="flex items-start gap-3 bg-gray-50 p-3 rounded-lg">
                      <div className="flex-1">
                        <span className={`inline-block px-2 py-0.5 text-xs rounded-full ${
                          finding.severity === 'critical' ? 'bg-red-100 text-red-700' :
                          finding.severity === 'high' ? 'bg-orange-100 text-orange-700' :
                          finding.severity === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-blue-100 text-blue-700'
                        }`}>
                          {finding.severity}
                        </span>
                        <p className="text-sm font-medium text-gray-900 mt-1">{finding.category}</p>
                        <p className="text-sm text-gray-600">{finding.issue}</p>
                        {finding.recommendation && (
                          <p className="text-xs text-blue-600 mt-1">→ {finding.recommendation}</p>
                        )}
                      </div>
                      <button
                        onClick={() => removeFinding(index)}
                        className="text-red-500 hover:text-red-700 p-1"
                      >
                        <FaTimes />
                      </button>
                    </div>
                  ))
                )}
              </div>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="Category"
                  value={newFinding.category}
                  onChange={(e) => setNewFinding(prev => ({ ...prev, category: e.target.value }))}
                  className="px-3 py-2 border rounded-lg text-sm"
                />
                <input
                  type="text"
                  placeholder="Issue"
                  value={newFinding.issue}
                  onChange={(e) => setNewFinding(prev => ({ ...prev, issue: e.target.value }))}
                  className="px-3 py-2 border rounded-lg text-sm"
                />
                <select
                  value={newFinding.severity}
                  onChange={(e) => setNewFinding(prev => ({ ...prev, severity: e.target.value }))}
                  className="px-3 py-2 border rounded-lg text-sm"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
                <input
                  type="text"
                  placeholder="Recommendation"
                  value={newFinding.recommendation}
                  onChange={(e) => setNewFinding(prev => ({ ...prev, recommendation: e.target.value }))}
                  className="px-3 py-2 border rounded-lg text-sm"
                />
                <button
                  onClick={addFinding}
                  className="col-span-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm flex items-center justify-center gap-2"
                >
                  <FaPlus /> Add Finding
                </button>
              </div>
            </div>

            {/* Strengths */}
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-3">Strengths</h3>
              <div className="flex flex-wrap gap-2 mb-2">
                {reviewData.strengths.map((strength, index) => (
                  <span key={index} className="flex items-center gap-1 bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                    {strength}
                    <button onClick={() => removeStrength(index)} className="text-green-500 hover:text-green-700">×</button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Add strength..."
                  value={newStrength}
                  onChange={(e) => setNewStrength(e.target.value)}
                  className="flex-1 px-3 py-2 border rounded-lg text-sm"
                  onKeyPress={(e) => e.key === 'Enter' && addStrength()}
                />
                <button onClick={addStrength} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm">
                  <FaPlus />
                </button>
              </div>
            </div>

            {/* Opportunities */}
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-3">Opportunities</h3>
              <div className="flex flex-wrap gap-2 mb-2">
                {reviewData.opportunities.map((opportunity, index) => (
                  <span key={index} className="flex items-center gap-1 bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm">
                    {opportunity}
                    <button onClick={() => removeOpportunity(index)} className="text-purple-500 hover:text-purple-700">×</button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Add opportunity..."
                  value={newOpportunity}
                  onChange={(e) => setNewOpportunity(e.target.value)}
                  className="flex-1 px-3 py-2 border rounded-lg text-sm"
                  onKeyPress={(e) => e.key === 'Enter' && addOpportunity()}
                />
                <button onClick={addOpportunity} className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition text-sm">
                  <FaPlus />
                </button>
              </div>
            </div>

            {/* Executive Summary */}
            <div className="mb-6">
              <label className="block font-semibold text-gray-900 mb-2">
                Executive Summary
              </label>
              <textarea
                value={reviewData.executiveSummary}
                onChange={(e) => setReviewData(prev => ({ ...prev, executiveSummary: e.target.value }))}
                rows="4"
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
                placeholder="Write a summary of the website review..."
              />
            </div>

            {/* Technical Details */}
            <div className="mb-6">
              <label className="block font-semibold text-gray-900 mb-2">
                Technical Details <span className="text-sm text-gray-400">(optional)</span>
              </label>
              <textarea
                value={reviewData.technicalDetails}
                onChange={(e) => setReviewData(prev => ({ ...prev, technicalDetails: e.target.value }))}
                rows="3"
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
                placeholder="Additional technical notes..."
              />
            </div>

            {/* Submit */}
            <button
              onClick={submitReview}
              disabled={submitting}
              className="w-full px-6 py-3 bg-gradient-to-r from-amber-400 to-amber-500 text-gray-900 font-bold rounded-xl hover:from-amber-500 hover:to-amber-600 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900"></div>
                  Submitting...
                </>
              ) : (
                <>
                  <FaRocket /> Submit Review & Notify Client
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminReviewDashboard;