const db = require('../models');

async function seed() {
  await db.sequelize.sync();

  const cats = [
    { name: 'Guides & Frameworks', shortForm: 'Guide' },
    { name: 'Member Case Studies', shortForm: 'Case Study' },
    { name: 'Articles & Industry Insights', shortForm: 'Article' },
    { name: 'Tools & Calculators', shortForm: 'Tool' }
  ];

  const typesMap = {};
  for (const c of cats) {
    const [rec] = await db.ResourceType.findOrCreate({ where: { name: c.name }, defaults: c });
    typesMap[c.shortForm] = rec.id;
  }

  const items = [
    {
      title: 'The 90-Day Referral Engine: Systematic B2B Client Acquisition',
      shortForm: 'Guide',
      author: 'Scale Link Strategy Team',
      publishedDate: '2026-03-01',
      isFeatured: true,
      status: 'published',
      imageUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=2070&q=80',
      plainTextSnippet: 'A step-by-step master framework for establishing non-competing partner networks, weekly touchpoint cadences, and qualifying high-ticket referral prospects.',
      richHtmlContent: `<h2>Building a Predictable Referral Engine in 90 Days</h2><p>Most professional service firms rely on accidental word-of-mouth rather than engineered referral generation. When referrals arrive unpredictably, pipeline planning becomes guesswork.</p><h3>Phase 1 (Days 1–30): The Partner Alignment Matrix</h3><p>The first 30 days are dedicated to identifying 5–8 non-competing professionals who already have deep, trusted relationships with your ideal client profile. For example:</p><ul><li><strong>Corporate Attorneys</strong> ↔ <strong>CPA / Tax Advisory Firms</strong></li><li><strong>Cybersecurity Consultants</strong> ↔ <strong>Managed IT Service Providers (MSPs)</strong></li><li><strong>Commercial Real Estate Brokers</strong> ↔ <strong>Office Interior & Infrastructure Architects</strong></li></ul><h3>Phase 2 (Days 31–60): The Trust Transfer Protocol</h3><p>Never ask for referrals in your first conversation. Instead, focus entirely on understanding the partner's growth bottlenecks and identifying opportunities where you can deliver value first. Trust transfers exponentially faster when reciprocity is initiated early.</p><h3>Phase 3 (Days 61–90): Structured Cadence & Accountability</h3><p>Implement a monthly pipeline synchronization meeting with your alliance circle. Review introductions made, feedback on mutual prospects, and market intelligence on enterprise budgets.</p><blockquote><p>"Referrals do not happen by chance—they happen by design when aligned professionals share a common standard of excellence."</p></blockquote><h3>Key Takeaways</h3><p>By shifting from random networking breakfasts to a structured alliance, our members report an average 3.8x increase in closed deal size and a 60% reduction in sales cycle length.</p>`
    },
    {
      title: 'How a Boutique Accounting Firm Generated $320k via Cross-Industry Alliances',
      shortForm: 'Case Study',
      author: 'Elena Rostova, CPA',
      publishedDate: '2026-02-18',
      isFeatured: false,
      status: 'published',
      imageUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=2070&q=80',
      plainTextSnippet: 'How an independent accounting practice broke free of tax-season cyclicality by creating strategic alliances with M&A attorneys and wealth managers.',
      richHtmlContent: `<h2>Case Study: Scaling Beyond the Tax Season Trap</h2><p>For seven years, Rostova Advisory operated in a feast-or-famine revenue cycle dictated by quarterly tax filing deadlines. Client acquisition through traditional digital marketing produced low-margin commodity work.</p><h3>The Strategic Pivot</h3><p>In early 2025, the firm joined Scale Link Alliance and shifted focus toward mid-market corporate advisory. They established direct referral agreements with three specialized partners:</p><ol><li>A boutique M&A legal advisory firm</li><li>A commercial debt financing brokerage</li><li>An executive exit-planning consultancy</li></ol><h3>The Financial Impact</h3><p>Within 12 months of systematic cross-referrals:</p><ul><li><strong>14 new retainer clients</strong> were onboarded with zero outbound ad spend.</li><li><strong>$320,000 in new annual recurring revenue (ARR)</strong> was generated.</li><li>Average client retention increased from 14 months to 36+ months due to multi-partner engagement.</li></ul><h3>Conclusion</h3><p>When high-trust service providers unite under an exclusive alliance, client acquisition costs drop to near zero while deal quality rises substantially.</p>`
    },
    {
      title: 'The Psychology of Referral Introductions: Why Cold Outreach Fails in 2026',
      shortForm: 'Article',
      author: 'Marcus Vance',
      publishedDate: '2026-02-05',
      isFeatured: false,
      status: 'published',
      imageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=2070&q=80',
      plainTextSnippet: 'An analysis of buyer psychology, social capital dynamics, and why warm trust-transfers convert at 7x the rate of automated cold outreach.',
      richHtmlContent: `<h2>The Diminishing Returns of Cold Acquisition</h2><p>In an era saturated by automated AI email campaigns, LinkedIn bots, and cold calls, decision-maker resistance is at an all-time high. Modern executives do not need more pitches; they need trusted filters.</p><h3>Social Proof vs. Borrowed Trust</h3><p>When a prospect receives cold communication, their default posture is skepticism and risk mitigation. In contrast, when an existing trusted advisor says, <em>"You need to speak with Marcus—he solved this exact infrastructure issue for us,"</em> the recipient inherits that baseline trust immediately.</p><h3>The Triad of High-Converting Introductions</h3><ul><li><strong>Contextual Relevance:</strong> The introduction is triggered by an active pain point, not a generic catch-up.</li><li><strong>Double Opt-In Respect:</strong> Both parties are consulted beforehand, preserving executive etiquette.</li><li><strong>Shared Reputation:</strong> The referring party puts their credibility on the line, signaling superior confidence.</li></ul><h3>Summary</h3><p>Investing in your referral network is an investment in durable social capital that compounds year over year, unlike advertising spend which stops generating returns the moment you pause the budget.</p>`
    },
    {
      title: 'Strategic Alliance Opportunity Scorecard & Due Diligence Matrix',
      shortForm: 'Tool',
      author: 'Scale Link Strategy Group',
      publishedDate: '2026-01-28',
      isFeatured: false,
      status: 'published',
      imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=2070&q=80',
      plainTextSnippet: 'A practical scoring framework to assess prospective referral partners for target audience alignment, client value symmetry, and reciprocity velocity.',
      richHtmlContent: `<h2>Evaluating Potential Referral Alliances</h2><p>Not every professional is an ideal alliance partner. Using a structured evaluation scorecard prevents wasted time and ensures your referral network remains high-caliber.</p><h3>The 4 Core Evaluation Pillars</h3><ol><li><strong>Audience Overlap (25% Weight):</strong> Do they serve the exact decision-maker (e.g. CMO, CFO, VP Engineering) you target, without offering competing services?</li><li><strong>Deal Size Symmetry (25% Weight):</strong> Are both businesses operating at comparable transaction tiers (e.g., $10k–$50k contracts)?</li><li><strong>Delivery Excellence (30% Weight):</strong> Do they possess a verifiable track record and sterling client satisfaction metrics?</li><li><strong>Reciprocity Readiness (20% Weight):</strong> Are they actively looking to send business outward, or simply seeking inbound leads?</li></ol><h3>Scoring Thresholds</h3><ul><li><strong>85–100 Points:</strong> Tier-1 Anchor Partner (Initiate formal monthly cadence).</li><li><strong>70–84 Points:</strong> Tier-2 Collaborative Partner (Occasional cross-introductions).</li><li><strong>Below 70 Points:</strong> Low Synergy (Decline or maintain casual contact).</li></ul>`
    },
    {
      title: 'Scaling from Solo Consultant to Agency Model via Referral Pods',
      shortForm: 'Case Study',
      author: 'David Chen, Enterprise Architect',
      publishedDate: '2026-01-15',
      isFeatured: false,
      status: 'published',
      imageUrl: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=2070&q=80',
      plainTextSnippet: 'How an independent cloud architect formed a 4-person referral pod to collectively bid on and win $150k+ enterprise modernization contracts.',
      richHtmlContent: `<h2>Case Study: The Power of Collaborative Bidding</h2><p>Solo practitioners frequently face an upper ceiling on contract size: enterprise procurement departments hesitate to award multi-hundred-thousand dollar projects to individual operators.</p><h3>The Formation of the "Modern Tech Pod"</h3><p>Through Scale Link Alliance, four solo specialists united under a joint-pitch framework:</p><ul><li>David Chen (Cloud & DevOps Architecture)</li><li>Sarah Miller (Full-Stack UI/UX Engineering)</li><li>Kavita Patel (Cybersecurity & SOC-2 Compliance)</li><li>Julian Thorne (Data Engineering & Analytics)</li></ul><h3>The Outcome</h3><p>While retaining 100% independence in their respective business entities, the pod positioned themselves as an integrated enterprise modernization team. In their first 6 months, they captured two enterprise contracts valued at $185,000 and $240,000.</p><blockquote><p>"We did not need to merge companies or take on payroll overhead. We leveraged collective credibility through our alliance."</p></blockquote>`
    },
    {
      title: 'The Executive Follow-Up Playbook: Turning First Meetings into Deal Flow',
      shortForm: 'Guide',
      author: 'Sarah Jenkins',
      publishedDate: '2026-01-05',
      isFeatured: false,
      status: 'published',
      imageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=2070&q=80',
      plainTextSnippet: 'A proven 4-stage follow-up cadence, email templates, and CRM tagging strategies to turn initial networking discussions into productive business partnerships.',
      richHtmlContent: `<h2>Mastering the Post-Meeting Follow-Up</h2><p>80% of networking value is lost within the first 48 hours due to lack of structured follow-up. A casual "great meeting you" email rarely creates lasting traction.</p><h3>The 4-Stage Executive Cadence</h3><h4>Stage 1: The 24-Hour Recap (Precision & Synthesis)</h4><p>Send a prompt note recapping 1–2 specific insights shared during the conversation, accompanied by a relevant resource or introduction you promised.</p><h4>Stage 2: The Value-Add Touchpoint (Day 10)</h4><p>Share an industry report, article, or market observation directly relevant to an initiative they mentioned.</p><h4>Stage 3: The Referral Trigger Check-in (Day 30)</h4><p>Re-engage with a specific client archetype: <em>"Hey [Name], I recently spoke with a commercial real estate firm facing [Challenge]. It reminded me of your service—are you currently accepting new advisory clients in that sector?"</em></p><h4>Stage 4: Quarterly Rhythm</h4><p>Schedule a recurring 20-minute quarterly alignment coffee to review mutual objectives.</p><h3>Conclusion</h3><p>Follow-up is not about persistence; it is about consistent demonstration of competence and generosity.</p>`
    }
  ];

  for (const item of items) {
    const { shortForm, ...data } = item;
    data.typeId = typesMap[shortForm];
    const existing = await db.Resource.findOne({ where: { title: data.title } });
    if (existing) {
      await existing.update(data);
      console.log('✅ Updated: ' + data.title);
    } else {
      await db.Resource.create(data);
      console.log('✨ Created: ' + data.title);
    }
  }

  const count = await db.Resource.count();
  console.log('\n🎉 Success! Database now contains ' + count + ' resources.');
  process.exit(0);
}

seed().catch(e => { console.error('❌ Seeding error:', e); process.exit(1); });