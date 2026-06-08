// src/pages/Legal.jsx
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Footer from '../components/layout/Footer';

const Legal = () => {
  const location = useLocation();
  const getActiveTab = (search) => {
    const params = new URLSearchParams(search);
    const tab = params.get('tab');
    if (tab && ['privacy', 'terms', 'escrow'].includes(tab)) {
      return tab;
    }
    return 'privacy';
  };

  const [activeSection, setActiveSection] = useState(getActiveTab(location.search));

  useEffect(() => {
    setActiveSection(getActiveTab(location.search));
  }, [location.search]);

  const sections = [
    { id: 'privacy', title: 'Privacy Policy' },
    { id: 'terms', title: 'Terms of Service' },
    { id: 'escrow', title: 'Payment & Escrow Terms' },
  ];

  const privacyPolicyContent = [
    {
      id: 'introduction',
      title: 'Introduction',
      content: `Scale Link Alliance ("we," "us," "our") operates scalelinkalliance.com (the "Website"). This Privacy Policy explains how we collect, use, disclose, and protect your information.`,
    },
    {
      id: 'information-collected',
      title: 'Information We Collect',
      content: `We may collect:`,
      list: [
        'Personal Information - Name, email address, phone number, company or professional affiliation, contact form submissions',
        'Usage Information - IP address, device type, browser info, pages visited, time on site, click data',
        'Cookies & Tracking - We use cookies and similar technologies to improve site performance and user experience',
      ],
    },
    {
      id: 'information-use',
      title: 'How We Use Your Information',
      content: `We use your data to:`,
      list: [
        'Respond to inquiries and messages',
        'Provide services, support, and engagement',
        'Improve the Website and offerings',
        'Send newsletters or updates (with consent)',
        'We do not sell your personal information',
      ],
    },
    {
      id: 'data-sharing',
      title: 'Data Sharing',
      content: `We may share data with:`,
      list: [
        'Service providers (hosting, analytics, email delivery)',
        'Legal authorities if required by law',
        'Business partners where applicable',
        'We will not share your personal information with third parties for marketing without consent',
      ],
    },
    {
      id: 'cookies',
      title: 'Cookies & Analytics',
      content: `We use cookies to:`,
      list: [
        'Remember preferences',
        'Analyze traffic and trends',
        'You may disable cookies in your browser, but this may impact functionality',
      ],
    },
    {
      id: 'your-rights',
      title: 'Your Choices & Rights',
      content: `You may:`,
      list: [
        'Access, correct, or delete your personal information',
        'Opt out of marketing communications',
        'To exercise these rights, contact: Email: support@scalelinkalliance.com',
      ],
    },
    {
      id: 'security',
      title: 'Security',
      content: `We implement reasonable technical and organizational measures to protect your information. No system is perfectly secure, and we cannot guarantee absolute security.`,
    },
    {
      id: 'children',
      title: "Children's Privacy",
      content: `Our Website is not directed to individuals under 16, and we do not knowingly collect information from children.`,
    },
    {
      id: 'changes',
      title: 'Changes to This Policy',
      content: `We may update this policy. The date at the top will reflect the latest version. Continued use constitutes acceptance.`,
    },
  ];

  const termsContent = [
    {
      id: 'acceptance',
      title: 'Acceptance of Terms',
      content: `By accessing or using scalelinkalliance.com ("Website"), you agree to these Terms of Service ("Terms"). If you do not agree, do not use the Website.`,
    },
    {
      id: 'services',
      title: 'Services Offered',
      content: `Scale Link Alliance provides professional business support, networking facilitation, and growth services ("Services"). Services may be offered via Website, email, or other communication. Use of Services may require registration or submission of information.`,
    },
    {
      id: 'conduct',
      title: 'User Conduct',
      content: `You agree not to:`,
      list: [
        'Use the Website for unlawful purposes',
        'Impersonate others or misrepresent information',
        'Upload harmful software or malware',
        'Violate the rights of others',
        'We may restrict access or terminate accounts for violations',
      ],
    },
    {
      id: 'property',
      title: 'Intellectual Property',
      content: `All content on the Website (text, graphics, logos, images) belongs to Scale Link Alliance or licensors and is protected by copyright and other intellectual property laws. You may not reproduce or distribute content without permission.`,
    },
    {
      id: 'disclaimers',
      title: 'Disclaimers',
      content: `The Website and Services are provided "as is." We make no warranties or guarantees about accuracy, completeness, or suitability. We are not responsible for third-party content or links.`,
    },
    {
      id: 'liability',
      title: 'Limitation of Liability',
      content: `To the maximum extent permitted by law, Scale Link Alliance and its affiliates are not liable for:`,
      list: [
        'Indirect, incidental, or consequential damages',
        'Loss of data, revenue, opportunity, or profits',
        'Total liability is limited to the amount paid (if any) for the Services',
      ],
    },
    {
      id: 'governing',
      title: 'Governing Law',
      content: `These Terms are governed by the laws of the State of Illinois, without regard to conflict of law principles.`,
    },
    {
      id: 'changes',
      title: 'Changes to Terms',
      content: `We may update these Terms. We will notify users of material changes, and continued use signifies acceptance.`,
    },
    {
      id: 'contact',
      title: 'Contact Information',
      content: `If you have questions about these policies, contact: Scale Link Alliance at support@scalelinkalliance.com`,
    },
  ];

  const escrowContent = [
    {
      id: 'quote-approval',
      title: 'Project Quote and Approval',
      content: `Before work begins, ScaleLink Alliance will provide the client with a quote, proposal, invoice, or written project summary. This may include the project scope, services included, estimated timeline, payment amount, deposit requirement, milestone schedule, and deliverables. Work will begin only after the client approves the project terms and submits the required payment or deposit.`,
    },
    {
      id: 'deposits-milestones',
      title: 'Deposits, Milestone Payments, and Escrow-Based Payments',
      content: `Depending on the size and type of project, ScaleLink Alliance may require one of the following payment methods:`,
      list: [
        'Full upfront payment',
        'Partial deposit before work begins',
        'Milestone payments based on project progress',
        'Escrow-based payment for larger or custom projects',
        'Escrow-based milestone payments are designed to protect both the client and ScaleLink Alliance by making sure funds are connected to agreed project stages and deliverables.',
      ],
    },
    {
      id: 'release-conditions',
      title: 'Payment Release Conditions',
      content: `Funds may be released or applied when one or more of the following occurs:`,
      list: [
        'A project milestone is completed',
        'A deliverable is submitted to the client',
        'The client approves the work',
        'The project reaches the agreed completion stage',
        'The client does not respond within the stated review period',
        'The payment release condition stated in the quote or agreement is met',
      ],
    },
    {
      id: 'review-period',
      title: 'Client Review Period',
      content: `After ScaleLink Alliance submits a milestone, draft, or deliverable, the client will have a reasonable review period, unless otherwise stated in writing. A standard review period may be 3 to 7 business days. If the client does not respond within the review period, the work may be considered approved, and the next phase may continue.`,
    },
    {
      id: 'revisions',
      title: 'Revisions',
      content: `Each project will include the number of revisions stated in the quote or project agreement. Revisions must relate to the original approved scope. Additional revisions, major changes, or requests outside the original scope may require an additional fee.`,
    },
    {
      id: 'scope-changes',
      title: 'Scope Changes',
      content: `Any work not included in the original project scope may require a revised quote or written approval before it is completed. Examples of scope changes include:`,
      list: [
        'Adding new pages, features, designs, or services',
        'Changing the project direction after work has started',
        'Requesting extra revisions beyond the included amount',
        'Adding new integrations, automation, or advanced functionality',
        'Requesting urgent or rush delivery',
      ],
    },
    {
      id: 'refunds',
      title: 'Refunds',
      content: `Refund eligibility depends on the project stage, work completed, and payment terms agreed to before the project begins. Deposits, completed milestones, approved deliverables, completed strategy work, purchased tools, third-party costs, and time already spent on the project may be non-refundable. If a refund request is made, ScaleLink Alliance will review the project status and determine whether any refund is available based on work completed and the written agreement.`,
    },
    {
      id: 'third-party',
      title: 'Third-Party Costs',
      content: `Some projects may require third-party tools, hosting, plugins, software subscriptions, stock assets, advertising spend, email platforms, CRM tools, domain services, or other external costs. Unless clearly stated otherwise, third-party costs are not included in ScaleLink Alliance service fees and are the responsibility of the client.`,
    },
    {
      id: 'delays',
      title: 'Project Delays',
      content: `Project timelines may be affected if the client does not provide required information, content, approvals, access, feedback, or payments on time. ScaleLink Alliance is not responsible for delays caused by missing client materials, delayed approvals, third-party platforms, or changes requested after the project begins.`,
    },
    {
      id: 'delivery',
      title: 'Final Delivery',
      content: `Final files, completed deliverables, website access, campaign materials, or project assets may be delivered after the payment terms are satisfied. ScaleLink Alliance may withhold final delivery if required payments are incomplete or if the project agreement has not been fulfilled.`,
    },
    {
      id: 'disputes',
      title: 'Disputes',
      content: `If there is a disagreement about payment, project scope, milestones, or deliverables, both parties agree to first attempt to resolve the matter in writing. ScaleLink Alliance may pause work during a dispute until the issue is resolved.`,
    },
    {
      id: 'acceptance',
      title: 'Acceptance of Terms',
      content: `By approving a quote, submitting payment, checking the agreement box, or allowing work to begin, the client confirms that they understand and agree to these Payment & Escrow Terms.`,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-linear-to-br from-blue-500 to-blue-700 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">SA</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900">ScaleLink Alliance</h1>
            </Link>
            <nav className="hidden md:flex space-x-8">
              <Link to="/" className="text-gray-700 hover:text-blue-600 transition-colors">
                Home
              </Link>
              <Link to="/about" className="text-gray-700 hover:text-blue-600 transition-colors">
                About Us
              </Link>
              <Link to="/contact" className="text-gray-700 hover:text-blue-600 transition-colors">
                Contact
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Legal Information</h1>
          <p className="text-gray-600 max-w-3xl mx-auto">
            Welcome to ScaleLink Alliance's legal documentation. Please review our policies carefully.
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          {/* Section Navigation */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                  activeSection === section.id
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {section.title}
              </button>
            ))}
          </div>

          {/* Effective Date Banner */}
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-8">
            <div className="flex items-start">
              <div className="shrink-0">
                <svg className="h-5 w-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-blue-700">
                  <strong>Effective Date:</strong> January 2026
                </p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
            {activeSection === 'privacy' && (
              <div>
                <div className="flex items-center mb-8">
                  <div className="p-3 bg-blue-100 rounded-lg mr-4">
                    <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900">Privacy Policy</h2>
                    <p className="text-gray-600 mt-2">How we collect, use, and protect your information</p>
                  </div>
                </div>

                {privacyPolicyContent.map((section, index) => (
                  <div key={section.id} className="mb-10" id={section.id}>
                    <div className="flex items-center mb-4">
                      <div className="shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold mr-3">
                        {index + 1}
                      </div>
                      <h3 className="text-2xl font-semibold text-gray-900">{section.title}</h3>
                    </div>
                    <div className="ml-11">
                      <p className="text-gray-700 mb-3">{section.content}</p>
                      {section.list && (
                        <ul className="space-y-2 mb-4">
                          {section.list.map((item, idx) => (
                            <li key={idx} className="flex items-start">
                              <span className="text-blue-600 mr-2">•</span>
                              <span className="text-gray-700">{item}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                      {section.id === 'contact' && (
                        <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                          <p className="text-gray-700">
                            For privacy-related inquiries: <strong>support@scalelinkalliance.com</strong>
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeSection === 'terms' && (
              <div>
                <div className="flex items-center mb-8">
                  <div className="p-3 bg-blue-100 rounded-lg mr-4">
                    <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900">Terms of Service</h2>
                    <p className="text-gray-600 mt-2">Rules and guidelines for using our services</p>
                  </div>
                </div>

                {termsContent.map((section, index) => (
                  <div key={section.id} className="mb-10" id={section.id}>
                    <div className="flex items-center mb-4">
                      <div className="shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold mr-3">
                        {index + 1}
                      </div>
                      <h3 className="text-2xl font-semibold text-gray-900">{section.title}</h3>
                    </div>
                    <div className="ml-11">
                      <p className="text-gray-700 mb-3">{section.content}</p>
                      {section.list && (
                        <ul className="space-y-2 mb-4">
                          {section.list.map((item, idx) => (
                            <li key={idx} className="flex items-start">
                              <span className="text-blue-600 mr-2">•</span>
                              <span className="text-gray-700">{item}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                      {section.id === 'contact' && (
                        <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                          <p className="text-gray-700">
                            For terms-related questions: <strong>support@scalelinkalliance.com</strong>
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeSection === 'escrow' && (
              <div>
                <div className="flex items-center mb-8">
                  <div className="p-3 bg-blue-100 rounded-lg mr-4">
                    <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900">Payment & Escrow Terms</h2>
                    <p className="text-gray-600 mt-2">Policies regarding deposits, milestone payments, and escrow protection</p>
                  </div>
                </div>

                {escrowContent.map((section, index) => (
                  <div key={section.id} className="mb-10" id={section.id}>
                    <div className="flex items-center mb-4">
                      <div className="shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold mr-3">
                        {index + 1}
                      </div>
                      <h3 className="text-2xl font-semibold text-gray-900">{section.title}</h3>
                    </div>
                    <div className="ml-11">
                      <p className="text-gray-700 mb-3">{section.content}</p>
                      {section.list && (
                        <ul className="space-y-2 mb-4">
                          {section.list.map((item, idx) => (
                            <li key={idx} className="flex items-start">
                              <span className="text-blue-600 mr-2">•</span>
                              <span className="text-gray-700">{item}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Quick Navigation */}
            <div className="mt-12 pt-8 border-t border-gray-200">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Quick Navigation</h4>
              <div className="flex flex-wrap gap-3">
                {(activeSection === 'privacy' ? privacyPolicyContent : activeSection === 'terms' ? termsContent : escrowContent).map((section) => (
                  <a
                    key={section.id}
                    href={`#${section.id}`}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    {section.title}
                  </a>
                ))}
              </div>
            </div>

            {/* Contact Card */}
            <div className="mt-12 bg-linear-to-r from-blue-50 to-blue-100 rounded-xl p-6">
              <div className="flex flex-col md:flex-row items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Have Questions?</h3>
                  <p className="text-gray-700 mb-4 md:mb-0">
                    Contact our legal team for clarification on any policy.
                  </p>
                </div>
                <a
                  href="mailto:support@scalelinkalliance.com"
                  className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Email Legal Team
                </a>
              </div>
            </div>
          </div>

          {/* Bottom Navigation */}
          <div className="mt-8 flex justify-center space-x-6">
            <Link
              to="/"
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              ← Return to Home
            </Link>
            <Link
              to="/contact"
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Contact Us →
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Legal;