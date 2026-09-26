// src/pages/Legal.jsx
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

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
    { id: 'escrow', title: 'Milestone-Based Payment' },
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
      id: 'purpose',
      title: 'Purpose of Milestone-Based Payment Protection',
      content: `ScaleLink Alliance uses milestone-based payments to provide greater transparency and accountability throughout a project. Whenever reasonably appropriate, a project will be divided into defined stages or milestones. Each milestone may identify:`,
      list: [
        'The work to be completed',
        'The expected deliverables',
        'The amount associated with that milestone',
        'The estimated completion period',
        'Any information, materials, approvals, or access required from the Client',
        'The number or type of revisions included',
        'The conditions required before work proceeds to the next milestone',
        'The purpose of this structure is to ensure that Clients can review meaningful project progress while ScaleLink receives payment for work performed and resources committed to the project',
      ],
    },
    {
      id: 'not-banking',
      title: 'This Is Not a Banking or Escrow Service',
      content: `ScaleLink's Milestone-Based Payment Protection should not be interpreted as a representation that ScaleLink Alliance is a bank, financial institution, licensed escrow agent, fiduciary, or regulated escrow provider. Unless ScaleLink expressly identifies an independent third-party escrow provider in writing, payments made to ScaleLink are payments for contracted services and are not deposited into a separate legal escrow or trust account. Payment protection is instead provided through:`,
      list: [
        'Defined project milestones',
        'Staged payments',
        'Documented project progress',
        'Client review and approval opportunities',
        'Defined revision procedures',
        'Project tracking',
        'Dispute procedures',
        'Refund protections for qualifying unearned amounts',
      ],
    },
    {
      id: 'proposal-scope',
      title: 'Project Proposal and Scope of Work',
      content: `Before substantial project work begins, ScaleLink may provide the Client with a proposal, order form, statement of work, service agreement, project specification, invoice, or similar document describing the project. The project documentation may contain:`,
      list: [
        'Project scope',
        'Deliverables',
        'Total project price',
        'Milestone payment amounts',
        'Estimated timelines',
        'Revision allowances',
        'Client responsibilities',
        'Third-party costs',
        'Recurring fees',
        'Maintenance or support terms',
        'Any special project conditions',
        'The Client should review the project documentation carefully before approving the project or making payment',
      ],
    },
    {
      id: 'order-precedence',
      title: 'Order of Precedence',
      content: `If a specific Project Agreement, Statement of Work, or accepted Proposal contains terms that are different from this Agreement, the project-specific document will control with respect to those specific project terms. Unless expressly stated otherwise, the following order applies:`,
      list: [
        'Signed or expressly accepted Project Agreement or Statement of Work',
        'Accepted project proposal or order form',
        'This Milestone-Based Payment Protection Agreement',
        "ScaleLink Alliance's general website terms and policies",
        'Nothing in a project document will be interpreted as overriding this Agreement unless the different term is clearly stated',
      ],
    },
    {
      id: 'initial-milestone',
      title: 'Initial Milestone Payment',
      content: `Unless otherwise stated in the project proposal, the first milestone payment must be received before ScaleLink is required to begin project work. The initial milestone may include activities such as:`,
      list: [
        'Discovery',
        'Research',
        'Strategy',
        'Planning',
        'Technical setup',
        'Project architecture',
        'Design concepts',
        'Account configuration',
        'Content planning',
        'Resource allocation',
        'Initial development',
        'Once work on an initial milestone has begun, the portion of the payment attributable to work already performed, resources reserved, or authorized third-party costs may become earned and non-refundable',
      ],
    },
    {
      id: 'subsequent-milestones',
      title: 'Subsequent Milestone Payments',
      content: `Additional payments will become due according to the milestone schedule established for the project. ScaleLink is not required to begin a new milestone until:`,
      list: [
        'The previous milestone has been completed or otherwise resolved',
        'Required Client feedback or approval has been received',
        'Any payment due for the next milestone has been received',
        'Required Client information, credentials, content, or materials have been provided',
        'ScaleLink may pause work when a required milestone payment has not been made. A project timeline automatically adjusts for reasonable delays caused by late payments, delayed approvals, missing Client materials, change requests, or other circumstances outside ScaleLink\u2019s reasonable control',
      ],
    },
    {
      id: 'client-review',
      title: 'Client Review of Milestones',
      content: `When a milestone is ready for review, ScaleLink will notify the Client through the project portal, email, or another agreed communication method. The Client should review the milestone promptly and either approve the milestone, or provide specific written feedback identifying work that the Client reasonably believes does not conform to the agreed scope. Unless another review period appears in the project agreement, Clients should provide approval or revision requests within 7 calendar days after receiving notice that the milestone is ready for review.`,
    },
    {
      id: 'no-response',
      title: 'No Response to a Completed Milestone',
      content: `If the Client does not approve the milestone or provide specific revision requests within the applicable review period, ScaleLink may send a reminder requesting a response. If the Client continues not to respond, ScaleLink may, to the extent permitted by applicable law:`,
      list: [
        'Treat the milestone as accepted for scheduling and administrative purposes',
        'Pause the project',
        'Adjust the delivery schedule',
        'Reassign project resources',
        'Proceed according to the terms of the applicable Project Agreement',
        "ScaleLink will not intentionally use a Client's temporary lack of response to avoid correcting work that clearly fails to meet the agreed project scope",
      ],
    },
    {
      id: 'revisions',
      title: 'Revisions',
      content: `ScaleLink will provide revisions according to the revision allowance stated in the applicable proposal, project agreement, service description, or statement of work. A revision is generally a reasonable modification to work already performed within the originally agreed scope. A request may be treated as additional work rather than a revision when it:`,
      list: [
        'Introduces a new feature',
        'Changes the original project direction',
        'Adds new pages, products, systems, integrations, or functionality',
        'Requires substantial redesign',
        'Changes previously approved work',
        'Requires work not included in the original scope',
        'Results from new Client requirements',
        'ScaleLink will notify the Client when a request is considered outside the original scope. Additional work may require a written change order, additional payment, and an updated completion schedule. No additional charge will be imposed for material out-of-scope work without informing the Client',
      ],
    },
    {
      id: 'milestone-approval',
      title: 'Milestone Approval',
      content: `Approval may occur through:`,
      list: [
        'Written approval',
        'Approval through the ScaleLink project portal',
        'Email confirmation',
        'Approval through another agreed electronic method',
        'Another clear written indication that the Client accepts the milestone',
        'Once a milestone has been approved, requests to substantially modify that approved work may be considered additional work and may require additional payment. Approval does not eliminate ScaleLink\u2019s obligation to correct a genuine defect or omission that clearly falls within the agreed scope and was not reasonably discoverable during the ordinary review process',
      ],
    },
    {
      id: 'dispute-protection',
      title: 'Payment Protection During a Dispute',
      content: `If the Client believes that a milestone materially fails to satisfy the agreed scope, the Client should notify ScaleLink in writing and identify: the disputed milestone; the specific deliverable or requirement involved; what the Client believes is incomplete or incorrect; and the correction the Client believes is required under the agreed scope. ScaleLink will review the matter and may:`,
      list: [
        'Correct the work',
        'Provide clarification',
        'Request additional information',
        'Propose an alternative resolution',
        'Adjust the milestone when appropriate',
        'Determine that the requested work falls outside the agreed scope',
        'While a legitimate milestone dispute is being reviewed, ScaleLink may pause the affected portion of the project. Amounts that are not reasonably disputed remain payable according to the project agreement',
      ],
    },
    {
      id: 'good-faith',
      title: 'Good-Faith Resolution Process',
      content: `Both parties agree to make a reasonable good-faith effort to resolve project and payment disagreements before escalating the matter. When a formal dispute is submitted, ScaleLink and the Client should first attempt to resolve it through direct communication. Whenever reasonably possible, ScaleLink will attempt to provide a written response or proposed resolution within 10 business days after receiving sufficient information concerning the dispute. Complex disputes may require additional time.`,
    },
    {
      id: 'chargebacks',
      title: 'Chargebacks and Payment Disputes',
      content: `If the Client believes a payment was incorrect or that ScaleLink failed to satisfy an agreed payment obligation, the Client is encouraged to contact ScaleLink first so that the issue can be investigated and, where appropriate, corrected. Except in cases of suspected payment fraud, unauthorized transactions, or where applicable law provides otherwise, the Client agrees to make a reasonable effort to use ScaleLink's dispute process before initiating a payment reversal or chargeback. Fraudulent, knowingly false, or abusive chargebacks may result in:`,
      list: [
        'Suspension of project work',
        'Suspension of account or project access',
        'Termination of services',
        'Recovery of amounts lawfully owed, including reasonable costs where permitted by law',
        'Nothing in this Agreement eliminates any non-waivable rights available to a Client under applicable payment-card, banking, or consumer-protection laws',
      ],
    },
    {
      id: 'cancellation-client',
      title: 'Cancellation by the Client',
      content: `A Client may request cancellation of a project by providing written notice. The financial treatment of cancellation will depend on the project's progress.`,
      list: [
        'Before Work Begins: If ScaleLink has not begun work and has not incurred authorized third-party costs or specifically disclosed non-refundable setup expenses, amounts paid toward unperformed services may be eligible for refund',
        'After Work Has Begun: ScaleLink is entitled to payment for work actually completed, reasonable work in progress, services already performed, resources reasonably committed to the project, authorized third-party expenses, and approved non-refundable costs stated in the project documentation. Any remaining unearned balance that is refundable under the applicable project terms will be returned to the Client',
        'Completed and Approved Milestones: Payments associated with properly completed and approved milestones are generally considered earned and non-refundable, except where ScaleLink materially breached the applicable agreement or a refund is otherwise required by law',
      ],
    },
    {
      id: 'cancellation-scalelink',
      title: 'Cancellation or Suspension by ScaleLink',
      content: `ScaleLink may suspend or terminate a project when reasonably necessary, including when:`,
      list: [
        'Required payments remain unpaid',
        'The Client repeatedly fails to provide required information',
        'The project remains inactive for an unreasonable period',
        'The Client requests unlawful or prohibited work',
        'The Client materially breaches the project agreement',
        'Continued work creates a security, legal, or compliance risk',
        'The parties mutually agree that the project should end',
        'ScaleLink will not use termination to improperly retain payment for services that were never performed. If ScaleLink terminates a project without Client fault, ScaleLink will determine any refund due for prepaid but unperformed services after deducting amounts properly earned or committed',
      ],
    },
    {
      id: 'client-delays',
      title: 'Client Delays and Inactive Projects',
      content: `Project completion depends on timely Client participation. If ScaleLink is waiting for materials, approvals, credentials, content, decisions, or payments, the project timeline may be paused. A significant Client delay may cause:`,
      list: [
        "The project's completion date to change",
        'Assigned personnel to become temporarily unavailable',
        'Work to be rescheduled',
        'Previously quoted timelines to become invalid',
        'A project to be classified as inactive',
        'If a project remains inactive for 30 days or more because required Client action has not occurred, ScaleLink may administratively close or archive the project after providing reasonable notice. Reactivation may be subject to revised scheduling and any reactivation fee that was disclosed in the applicable project agreement',
      ],
    },
    {
      id: 'third-party-costs',
      title: 'Third-Party Costs',
      content: `Some projects require third-party products or services, including:`,
      list: [
        'Domain registrations',
        'Website hosting',
        'Software',
        'Plugins',
        'Applications',
        'Advertising',
        'APIs',
        'Stock assets',
        'Payment-processing services',
        'Cloud services',
        'Premium integrations',
        "Third-party costs are separate from ScaleLink's service fees unless expressly included in the proposal. Once a third-party purchase has been authorized and incurred, that amount may be non-refundable if the third-party provider does not provide a refund. ScaleLink is not responsible for a third party's independent refund policy, service interruption, price change, or terms of service",
      ],
    },
    {
      id: 'ownership',
      title: 'Ownership of Completed Work',
      content: `Unless a separate agreement states otherwise, ownership rights in custom final deliverables created specifically for the Client transfer only after all amounts due for those deliverables have been paid in full. ScaleLink retains ownership of:`,
      list: [
        'Pre-existing materials',
        'Internal tools',
        'Processes',
        'Systems',
        'General methodologies',
        'Templates',
        'Frameworks',
        'Reusable components',
        'Know-how',
        "Intellectual property developed independently of the Client's specific project",
        "Where these materials are incorporated into a final Client deliverable, the Client will receive the rights reasonably necessary to use the completed deliverable for its intended purpose, subject to applicable third-party licenses. Client-owned content, trademarks, data, photographs, and materials remain the Client's property",
      ],
    },
    {
      id: 'results-performance',
      title: 'Results and Performance',
      content: `ScaleLink agrees to perform contracted services professionally and according to the agreed scope. However, unless ScaleLink expressly guarantees a specific result in a written project agreement, payment is for the work and services performed rather than a guaranteed business outcome. For services such as advertising, SEO, marketing, lead generation, consulting, automation, business development, and digital strategy, results can be affected by factors outside ScaleLink's control. These may include:`,
      list: [
        'Market conditions',
        'Competition',
        'Search engine algorithms',
        'Advertising platforms',
        'Client pricing',
        "Client's sales processes",
        'Consumer behavior',
        'Website history',
        'Third-party services',
        'Changes made by the Client or other providers',
        'ScaleLink therefore does not guarantee specific sales, revenue, search rankings, traffic levels, leads, conversion rates, or other commercial results unless such a guarantee is expressly included in a written agreement',
      ],
    },
    {
      id: 'recurring-services',
      title: 'Recurring Services',
      content: `Recurring monthly services may operate differently from fixed milestone projects. For services such as maintenance, SEO, advertising management, CRM support, automation management, content services, or ongoing marketing, the applicable proposal or subscription agreement may establish recurring billing periods instead of individual project milestones. Unless otherwise stated, payment for an upcoming service period may be required before that service period begins. Cancellation of recurring services will be governed by the applicable subscription or service agreement.`,
    },
    {
      id: 'taxes',
      title: 'Taxes and Government Charges',
      content: `The Client is responsible for applicable sales, use, value-added, withholding, or similar taxes or government charges associated with the Client's purchase, except taxes imposed directly on ScaleLink's income. Where ScaleLink is legally required to collect a tax, the applicable amount may be added to the Client's invoice.`,
    },
    {
      id: 'electronic-records',
      title: 'Electronic Records and Acceptance',
      content: `To the extent permitted by applicable law, electronic records and electronic acceptance may be used in connection with ScaleLink projects. A Client may demonstrate acceptance of applicable project terms by actions including:`,
      list: [
        'Electronically signing an agreement',
        'Clicking an acceptance button',
        'Approving a proposal',
        'Paying a project invoice after receiving the applicable terms',
        'Approving a project through the project portal',
        'Providing another clear written authorization for work to proceed',
        'ScaleLink may retain electronic records documenting approvals, payments, communications, revisions, milestone submissions, and project activity',
      ],
    },
    {
      id: 'relationship-policies',
      title: 'Relationship With Other ScaleLink Policies',
      content: `This Agreement should be read together with any applicable:`,
      list: [
        'Terms of Service',
        'Privacy Policy',
        'Project Agreement',
        'Statement of Work',
        'Accepted Proposal',
        'Subscription Terms',
        "Other policies specifically incorporated into the Client's transaction",
        'Nothing in this Agreement is intended to eliminate legal rights that cannot lawfully be waived',
      ],
    },
    {
      id: 'governing-law',
      title: 'Governing Law',
      content: `Unless a project-specific written agreement states otherwise, this Agreement will be governed by the laws of the State of Illinois, United States, without regard to conflict-of-law principles, subject to any mandatory laws that may apply to a particular Client or transaction. The parties agree to make a reasonable good-faith effort to resolve disputes directly before commencing formal legal proceedings. Nothing in this section prevents either party from exercising rights or remedies that cannot legally be restricted by contract.`,
    },
    {
      id: 'severability',
      title: 'Severability and Maximum Lawful Enforcement',
      content: `If any provision of this Agreement is found by a court or other authority of competent jurisdiction to be illegal, invalid, unenforceable, or inconsistent with applicable law, that provision will be interpreted, limited, or modified to the minimum extent necessary to make it lawful and enforceable while preserving its original purpose as closely as reasonably possible. If the provision cannot lawfully be modified, the invalid or unenforceable portion will be severed. All remaining lawful provisions will continue in full force and effect and will remain enforceable to the maximum extent permitted by law. The invalidity or unenforceability of one provision will not invalidate the Agreement as a whole.`,
    },
    {
      id: 'no-waiver',
      title: 'No Waiver',
      content: `If ScaleLink or the Client does not immediately enforce a provision of this Agreement, that does not constitute a permanent waiver of that provision or of the right to enforce it later. A waiver concerning one matter will not automatically constitute a waiver concerning another matter.`,
    },
    {
      id: 'changes-terms',
      title: 'Changes to These Terms',
      content: `ScaleLink may update this Agreement periodically to reflect changes in its services, payment practices, business operations, or applicable legal requirements. The current version will display the applicable "Last Updated" date. Material changes will generally apply prospectively and will not retroactively change the agreed price or completed payment obligations of an existing project unless the Client and ScaleLink agree otherwise or a change is required by law.`,
    },
    {
      id: 'contact-scalelink',
      title: 'Contact ScaleLink Alliance',
      content: `Questions concerning milestone payments, payment protection, project disputes, cancellations, or refunds should be directed to ScaleLink Alliance, 2250 Point Blvd, Elgin, IL 60123, United States. Email: contact@scalelinkalliance.com. Phone: +1 815-669-0642.`,
    },
    {
      id: 'commitment',
      title: 'Our Payment Protection Commitment',
      content: `ScaleLink Alliance believes that professional projects should have clear expectations on both sides. Our milestone-based approach is intended to provide Clients with:`,
      list: [
        'Clear Scope \u2014 Know what is being delivered before significant work begins',
        'Defined Milestones \u2014 Large projects are divided into manageable stages whenever appropriate',
        'Progress Visibility \u2014 Review project progress through established communication and project-tracking processes',
        'Approval Opportunities \u2014 Review milestone deliverables and request appropriate corrections before proceeding',
        'Controlled Payments \u2014 Payments are connected to defined stages of the project rather than an undefined promise of future work',
        'Documented Dispute Resolution \u2014 If something does not meet the agreed scope, there is a defined process for raising and resolving the issue',
        'Protection for Both Parties \u2014 Clients receive greater visibility and accountability while ScaleLink receives fair payment for work completed and resources committed',
        'Milestone-Based Payment Protection \u2014 Clear Work. Clear Progress. Clear Payments.',
      ],
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
                    <h2 className="text-3xl font-bold text-gray-900">Milestone-Based Payment Protection</h2>
                    <p className="text-gray-600 mt-2">How ScaleLink structures milestone payments to protect Clients and ScaleLink alike</p>
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
                      {section.id === 'contact-scalelink' && (
                        <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                          <p className="text-gray-700">
                            For payment-related inquiries: <strong>contact@scalelinkalliance.com</strong>
                          </p>
                        </div>
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
    </div>
  );
};

export default Legal;