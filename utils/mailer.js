const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

const sendVerificationEmail = async (email, token) => {
  const verifyUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/verify-email?token=${token}`;
  
  try {
    const { data, error } = await resend.emails.send({
      from: 'ScaleLink Alliance <onboarding@scalelinkalliance.com>',
      to: [email],
      subject: 'Verify Your Worker Account - ScaleLink Alliance',
      html: `
        <div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: 0 auto; padding: 40px; border: 1px solid #e2e8f0; border-radius: 24px; color: #1e293b;">
          <div style="text-align: center; margin-bottom: 32px;">
            <img src="https://scalelinkalliance.com/scalelink-logo.png" alt="ScaleLink Alliance" style="height: 48px; width: auto;">
          </div>
          
          <h1 style="font-size: 24px; font-weight: 800; text-align: center; color: #0f172a; margin-bottom: 16px;">Welcome to ScaleLink Alliance</h1>
          
          <p style="font-size: 16px; line-height: 1.6; color: #475569; margin-bottom: 24px;">
            Your worker account has been created by the administration. To gain access to your management dashboard, please verify your email address by clicking the button below.
          </p>
          
          <div style="text-align: center; margin-bottom: 32px;">
            <a href="${verifyUrl}" style="display: inline-block; background-color: #2563eb; color: #ffffff; padding: 14px 32px; font-weight: 700; border-radius: 12px; text-decoration: none; font-size: 14px; letter-spacing: 0.5px;">Verify Email Address</a>
          </div>
          
          <div style="background-color: #f8fafc; padding: 20px; border-radius: 16px; border: 1px solid #f1f5f9; margin-bottom: 32px;">
            <p style="font-size: 12px; color: #64748b; margin: 0; text-align: center;">
              <strong>Important:</strong> This verification link is valid for <strong>12 hours</strong>. If it expires, your account will be automatically removed and you will need to contact your administrator for a new invite.
            </p>
          </div>
          
          <hr style="border: 0; border-top: 1px solid #f1f5f9; margin-bottom: 24px;">
          
          <p style="font-size: 12px; color: #94a3b8; text-align: center; line-height: 1.5;">
            If you did not expect this invitation, please ignore this email.<br>
            &copy; 2026 ScaleLink Alliance. All rights reserved.
          </p>
        </div>
      `,
    });

    if (error) {
      console.error('❌ Resend Error:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('❌ Failed to send verification email:', error);
    throw error;
  }
};

/**
 * Sends a professional notification email to a worker
 */
const sanitizeForWorker = (str) => {
  if (!str) return str;
  // 1. Strip "Request Custom Quote - "
  let cleaned = str.replace(/Request Custom Quote - /g, '');
  
  // 2. Strip client name from title pattern: "FirstName LastName - Company"
  // If it contains " - ", we take the part after it.
  if (cleaned.includes(' - ')) {
    const parts = cleaned.split(' - ');
    if (parts.length >= 2) {
      // Check if the first part looks like a name (contains space or common name chars)
      // but only if it's the title field we're worried about.
      // To be safe, we'll just always take the last part if it matches our known pattern.
      cleaned = parts[parts.length - 1];
    }
  }
  return cleaned.trim();
};

const sendNotificationEmail = async (sentTo, type, message, jobId = null) => {
  try {
    // Send email notification for specific worker-related types
    const workerTypes = ['assignment', 'review', 'completed', 'returned', 'comment', 'file', '24h_reminder', '2h_reminder', 'overdue', 'cancelled'];
    if (workerTypes.includes(type)) {
    const db = require('../models');
    let job = null;
    if (jobId) {
      job = await db.NoticeBoardJob.findByPk(jobId);
    }

    const cleanMessage = sanitizeForWorker(message);
    let subject = 'New Notification - ScaleLink Alliance';
    let title = 'Notification Update';
    let accentColor = '#2563eb'; // Default Blue

    // Customise based on type
    switch (type) {
      case 'assignment':
        subject = `New Job Assigned: ${job ? sanitizeForWorker(job.title) : 'New Assignment'}`;
        title = 'Work Assignment';
        accentColor = '#2563eb';
        break;
      case 'review':
        subject = `Job Under Review: ${job ? sanitizeForWorker(job.title) : 'Update'}`;
        title = 'Submission Review';
        accentColor = '#4f46e5';
        break;
      case 'completed':
        subject = `Job Completed: ${job ? sanitizeForWorker(job.title) : 'Approval'}`;
        title = 'Project Approved';
        accentColor = '#059669';
        break;
      case 'returned':
        subject = `Revision Required: ${job ? sanitizeForWorker(job.title) : 'Action Required'}`;
        title = 'Job Returned';
        accentColor = '#d97706';
        break;
      case 'comment':
        subject = `New Comment on: ${job ? sanitizeForWorker(job.title) : 'Job Update'}`;
        title = 'New Communication';
        accentColor = '#6366f1';
        break;
      case 'file':
        subject = `New File Uploaded: ${job ? sanitizeForWorker(job.title) : 'Resource Update'}`;
        title = 'Resource Update';
        accentColor = '#3b82f6';
        break;
      case '24h_reminder':
        subject = `Deadline Reminder (24h): ${job ? sanitizeForWorker(job.title) : 'Action Required'}`;
        title = 'Timeline Alert';
        accentColor = '#f59e0b';
        break;
      case '2h_reminder':
        subject = `URGENT: 2h Until Deadline: ${job ? sanitizeForWorker(job.title) : 'Urgent'}`;
        title = 'Urgent Reminder';
        accentColor = '#ef4444';
        break;
      case 'overdue':
        subject = `Job Overdue: ${job ? sanitizeForWorker(job.title) : 'Immediate Action'}`;
        title = 'Overdue Alert';
        accentColor = '#7f1d1d';
        break;
      case 'cancelled':
        subject = `Assignment Cancelled: ${job ? sanitizeForWorker(job.title) : 'Update'}`;
        title = 'Work Cancelled';
        accentColor = '#ef4444';
        break;
    }

    const { data, error } = await resend.emails.send({
      from: 'ScaleLink Alliance <notifications@scalelinkalliance.com>',
      to: [sentTo],
      subject: subject,
      html: `
        <div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: 0 auto; padding: 40px; border: 1px solid #e2e8f0; border-radius: 24px; color: #1e293b;">
          <div style="text-align: center; margin-bottom: 32px;">
            <img src="https://scalelinkalliance.com/scalelink-logo.png" alt="ScaleLink Alliance" style="height: 48px; width: auto;">
          </div>
          
          <div style="display: inline-block; padding: 6px 12px; background-color: ${accentColor}15; border-radius: 8px; margin-bottom: 16px;">
            <span style="font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; color: ${accentColor};">${title}</span>
          </div>
          
          <h1 style="font-size: 22px; font-weight: 800; color: #0f172a; margin-bottom: 16px; margin-top: 0;">Notice Board Update</h1>
          
          <p style="font-size: 16px; line-height: 1.6; color: #475569; margin-bottom: 24px;">
            ${cleanMessage}
          </p>
          
          ${job ? `
          <div style="background-color: #f8fafc; padding: 24px; border-radius: 20px; border: 1px solid #f1f5f9; margin-bottom: 32px;">
            <h4 style="margin: 0 0 12px 0; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; color: #64748b;">Job Details</h4>
            <div style="display: flex; margin-bottom: 8px;">
              <span style="font-size: 14px; color: #94a3b8; width: 100px;">Project:</span>
              <span style="font-size: 14px; font-weight: 700; color: #1e293b;">${sanitizeForWorker(job.title)}</span>
            </div>
            <div style="display: flex; margin-bottom: 8px;">
              <span style="font-size: 14px; color: #94a3b8; width: 100px;">Category:</span>
              <span style="font-size: 14px; font-weight: 600; color: #1e293b;">${sanitizeForWorker(job.category)}</span>
            </div>
            <div style="display: flex;">
              <span style="font-size: 14px; color: #94a3b8; width: 100px;">Deadline:</span>
              <span style="font-size: 14px; font-weight: 600; color: #ef4444;">${new Date(job.dueAt).toLocaleDateString()}</span>
            </div>
          </div>
          ` : ''}
          
          <div style="text-align: center; margin-bottom: 32px;">
            <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/hub/notice-board" style="display: inline-block; background-color: #0f172a; color: #ffffff; padding: 14px 32px; font-weight: 700; border-radius: 12px; text-decoration: none; font-size: 14px;">View in Dashboard</a>
          </div>
          
          <hr style="border: 0; border-top: 1px solid #f1f5f9; margin-bottom: 24px;">
          
          <p style="font-size: 12px; color: #94a3b8; text-align: center; line-height: 1.5;">
            You are receiving this because your account is registered as a worker at ScaleLink Alliance.<br>
            &copy; 2026 ScaleLink Alliance. All rights reserved.
          </p>
        </div>
      `,
    });

    if (error) console.error('❌ Resend Error:', error);
    return data;
    }
  } catch (error) {
    console.error('❌ Failed to send notification email:', error);
  }
};

const sendClientNotificationEmail = async (clientEmail, subject, title, bodyMsg, job) => {
  try {
    const portalLink = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/track-job/${job.clientToken}`;
    const accentColor = '#4f46e5'; // Indigo

    const { data, error } = await resend.emails.send({
      from: 'ScaleLink Alliance <support@scalelinkalliance.com>',
      to: [clientEmail],
      subject: subject,
      html: `
        <div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: 0 auto; padding: 40px; border: 1px solid #e2e8f0; border-radius: 24px; color: #1e293b;">
          <div style="text-align: center; margin-bottom: 32px;">
            <img src="https://scalelinkalliance.com/scalelink-logo.png" alt="ScaleLink Alliance" style="height: 48px; width: auto;">
          </div>
          
          <div style="display: inline-block; padding: 6px 12px; background-color: ${accentColor}15; border-radius: 8px; margin-bottom: 16px;">
            <span style="font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; color: ${accentColor};">${title}</span>
          </div>
          
          <h1 style="font-size: 22px; font-weight: 800; color: #0f172a; margin-bottom: 16px; margin-top: 0;">Project Update</h1>
          
          <p style="font-size: 15px; line-height: 1.6; color: #475569; margin-bottom: 24px; white-space: pre-line;">
            ${bodyMsg}
          </p>
          
          <div style="background-color: #f8fafc; padding: 24px; border-radius: 20px; border: 1px solid #f1f5f9; margin-bottom: 32px;">
            <h4 style="margin: 0 0 12px 0; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; color: #64748b;">Project Info</h4>
            <div style="margin-bottom: 8px; font-size: 14px;">
              <span style="color: #94a3b8; width: 120px; display: inline-block;">Service:</span>
              <span style="font-weight: 700; color: #1e293b;">${job.category || 'Custom Service'}</span>
            </div>
            <div style="margin-bottom: 8px; font-size: 14px;">
              <span style="color: #94a3b8; width: 120px; display: inline-block;">Current Status:</span>
              <span style="font-weight: 600; color: #1e293b;">${job.clientSatisfied ? 'Completed' : 'Active'}</span>
            </div>
            <div style="font-size: 14px;">
              <span style="color: #94a3b8; width: 120px; display: inline-block;">Tracking Token:</span>
              <span style="font-weight: 600; color: #4f46e5; font-family: monospace;">${job.clientToken ? job.clientToken.substring(0, 8) + '...' : 'Generated'}</span>
            </div>
          </div>
          
          <div style="text-align: center; margin-bottom: 32px;">
            <a href="${portalLink}" style="display: inline-block; background-color: #4f46e5; color: #ffffff; padding: 14px 32px; font-weight: 700; border-radius: 12px; text-decoration: none; font-size: 14px; box-shadow: 0 4px 12px rgba(79, 70, 229, 0.2);">Access Your Project Portal</a>
          </div>
          
          <hr style="border: 0; border-top: 1px solid #f1f5f9; margin-bottom: 24px;">
          
          <p style="font-size: 12px; color: #94a3b8; text-align: center; line-height: 1.5;">
            This email contains your secure tracking link. Do not share it with third parties.<br>
            &copy; 2026 ScaleLink Alliance. All rights reserved.
          </p>
        </div>
      `,
    });

    if (error) console.error('❌ Resend Client Email Error:', error);
    return data;
  } catch (error) {
    console.error('❌ Failed to send client email notification:', error);
  }
};

const sendClientOnboardingEmail = async (job) => {
  if (!job.clientEmail) return;
  const clientName = `${job.clientFirstName || ''} ${job.clientLastName || ''}`.trim() || 'Client';
  const subject = `Your ScaleLink Alliance Project is Ready to Track!`;
  const title = `Project Tracking Dashboard Active`;
  const body = `Dear ${clientName},\n\nThank you for partnering with ScaleLink Alliance.\n\nWe are pleased to inform you that we have established a dedicated tracking portal for your project request. Through this secure portal, you can monitor production steps, interact directly with your Support Representative, and download final packages when ready.\n\nNo accounts or passwords are required—simply click the access button below at any time.`;
  
  return sendClientNotificationEmail(job.clientEmail, subject, title, body, job);
};

const sendClientPhaseNotificationEmail = async (job, phase) => {
  if (!job || !job.clientEmail) return;
  const clientName = `${job.clientFirstName || ''} ${job.clientLastName || ''}`.trim() || 'Client';
  const jobTitle = sanitizeForWorker(job.title);

  let subject = '';
  let title = '';
  let body = '';

  switch (phase) {
    case 'in_production':
      subject = `Project Update: Your project is now in production! - ScaleLink Alliance`;
      title = `Production Phase Started`;
      body = `Dear ${clientName},\n\nWe are pleased to inform you that your project "${jobTitle}" has officially entered the production phase.\n\nOur specialists are now actively working on your deliverables. We will closely monitor the progress to ensure that everything conforms to our high quality standards.\n\nYou can access your tracking portal at any time to review comments, monitor live progress, or communicate with our team.`;
      break;
    case 'quality_review':
      subject = `Project Update: Quality Assurance & Review - ScaleLink Alliance`;
      title = `Quality Review Started`;
      body = `Dear ${clientName},\n\nYour project "${jobTitle}" has moved to our Quality Assurance & Review phase.\n\nOur quality control team is currently auditing all deliverables to verify accuracy, structure, and completeness. This ensures that the final package aligns perfectly with your specifications.\n\nOnce the audit is completed, the files will be released to your tracking portal for your final review.`;
      break;
    case 'delivered':
      subject = `Project Action Required: Deliverables Ready for Review - ScaleLink Alliance`;
      title = `Project Delivered`;
      body = `Dear ${clientName},\n\nWe are excited to let you know that your project "${jobTitle}" has been fully processed and is ready for your review.\n\nAll final files have been uploaded to your secure project portal. Please access the portal, review the delivered work, and click the "Approve & Complete Project" button if you are satisfied with the results.\n\nThank you for partnering with ScaleLink Alliance.`;
      break;
    case 'approved':
      subject = `Project Confirmed: Thank you for your approval! - ScaleLink Alliance`;
      title = `Project Approved & Closed`;
      body = `Dear ${clientName},\n\nWe have successfully received your project approval and confirmation for "${jobTitle}".\n\nThank you for choosing ScaleLink Alliance. Your project is now officially marked as completed and closed. You will continue to have access to your secure portal at any time to download your files or view historical communications.\n\nWe look forward to partnering with you on future endeavors.`;
      break;
  }

  return sendClientNotificationEmail(job.clientEmail, subject, title, body, job);
};

const sendQuoteEmail = async (job) => {
  if (!job.clientEmail) return;
  const clientName = `${job.clientFirstName || ''} ${job.clientLastName || ''}`.trim() || 'Client';
  const businessName = job.client || 'Your Business';
  const title = job.title || 'Custom Solution';
  const description = job.description || '';
  const portalLink = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/track-job/${job.clientToken}`;
  const checkoutLink = job.stripeCheckoutUrl;

  const totalQuoteFormatted = job.customQuoteAmount ? `$${(job.customQuoteAmount / 100).toLocaleString()}` : '$0.00';
  const depositRequiredFormatted = job.depositRequired ? `$${(job.depositRequired / 100).toLocaleString()}` : '$0.00';
  const balanceDueFormatted = (job.customQuoteAmount && job.depositRequired) 
    ? `$${((job.customQuoteAmount - job.depositRequired) / 100).toLocaleString()}` 
    : totalQuoteFormatted;

  const expirationDateFormatted = job.quoteExpirationDate ? new Date(job.quoteExpirationDate).toLocaleDateString() : 'N/A';

  // Format Included Services as HTML bullet list
  let includedHtml = '';
  if (job.includedServices) {
    includedHtml = job.includedServices
      .split('\n')
      .filter(line => line.trim())
      .map(line => `<li style="margin-bottom: 8px;">${line.replace(/^-\s*/, '')}</li>`)
      .join('');
  } else {
    includedHtml = '<li style="margin-bottom: 8px;">Custom operational deliverables as discussed.</li>';
  }

  // Exclusions
  let notIncludedHtml = '';
  if (job.notIncluded) {
    notIncludedHtml = `
      <div style="margin-top: 20px; border-top: 1px solid #f1f5f9; padding-top: 16px;">
        <h4 style="margin: 0 0 10px 0; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px; color: #94a3b8;">What is NOT included</h4>
        <ul style="margin: 0; padding-left: 20px; font-size: 14px; color: #64748b; line-height: 1.6;">
          ${job.notIncluded.split('\n').filter(line => line.trim()).map(line => `<li style="margin-bottom: 6px;">${line.replace(/^-\s*/, '')}</li>`).join('')}
        </ul>
      </div>
    `;
  }

  // Optional Add-ons
  let addOnsHtml = '';
  let addOns = [];
  if (job.optionalAddOns) {
    try {
      addOns = typeof job.optionalAddOns === 'string' ? JSON.parse(job.optionalAddOns) : job.optionalAddOns;
    } catch (e) {
      console.error('Failed to parse optionalAddOns in mailer', e);
    }
  }
  if (Array.isArray(addOns) && addOns.length > 0) {
    addOnsHtml = `
      <div style="margin-top: 20px; border-top: 1px solid #f1f5f9; padding-top: 16px;">
        <h4 style="margin: 0 0 10px 0; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px; color: #94a3b8;">Optional Add-ons</h4>
        <table style="width: 100%; border-collapse: collapse; font-size: 13px; color: #475569; margin-top: 8px;">
          ${addOns.map(add => `
            <tr>
              <td style="padding: 4px 0; font-weight: 600;">+ ${add.name}</td>
              <td style="padding: 4px 0; text-align: right; font-weight: 700; color: #4f46e5;">$${(add.price / 100).toLocaleString()}</td>
            </tr>
          `).join('')}
        </table>
      </div>
    `;
  }

  const subject = `ScaleLink Alliance Quote Proposal - ${businessName}`;

  const htmlContent = `
    <div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: 0 auto; padding: 40px; border: 1px solid #e2e8f0; border-radius: 24px; color: #1e293b;">
      <div style="text-align: center; margin-bottom: 32px;">
        <img src="https://scalelinkalliance.com/scalelink-logo.png" alt="ScaleLink Alliance" style="height: 48px; width: auto;">
      </div>
      
      <div style="display: inline-block; padding: 6px 12px; background-color: #4f46e515; border-radius: 8px; margin-bottom: 16px;">
        <span style="font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; color: #4f46e5;">Official Quote Proposal</span>
      </div>
      
      <h1 style="font-size: 22px; font-weight: 800; color: #0f172a; margin-bottom: 8px; margin-top: 0;">Quote: ${title}</h1>
      <p style="font-size: 14px; color: #64748b; margin-top: 0; margin-bottom: 24px;">Prepared for <strong>${clientName}</strong> at <strong>${businessName}</strong></p>
      
      <div style="background-color: #f8fafc; padding: 24px; border-radius: 20px; border: 1px solid #f1f5f9; margin-bottom: 24px;">
        <h4 style="margin: 0 0 12px 0; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; color: #64748b;">Financial Summary</h4>
        
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 12px;">
          <tr>
            <td style="font-size: 14px; color: #475569; padding: 6px 0;">Total Project Quote:</td>
            <td style="font-size: 16px; font-weight: 700; color: #0f172a; text-align: right; padding: 6px 0;">${totalQuoteFormatted}</td>
          </tr>
          <tr>
            <td style="font-size: 14px; color: #475569; padding: 6px 0; border-bottom: 1px dashed #e2e8f0;">Deposit Required:</td>
            <td style="font-size: 16px; font-weight: 700; color: #4f46e5; text-align: right; padding: 6px 0; border-bottom: 1px dashed #e2e8f0;">${depositRequiredFormatted}</td>
          </tr>
          <tr>
            <td style="font-size: 14px; color: #475569; padding: 12px 0 0 0; font-weight: 600;">Balance Due Upon Completion:</td>
            <td style="font-size: 16px; font-weight: 700; color: #0f172a; text-align: right; padding: 12px 0 0 0;">${balanceDueFormatted}</td>
          </tr>
        </table>
        
        <div style="font-size: 12px; color: #94a3b8; display: flex; justify-content: space-between; border-top: 1px solid #e2e8f0; padding-top: 12px;">
          <span><strong>Timeline:</strong> ${job.estimatedCompletionTime || job.clientTimeline || 'Flexible'}</span>
          <span><strong>Quote Expires:</strong> ${expirationDateFormatted}</span>
        </div>
      </div>
      
      <div style="margin-bottom: 32px;">
        <h3 style="font-size: 15px; font-weight: 700; color: #0f172a; margin-top: 0; margin-bottom: 12px;">Recommended Solution Summary</h3>
        <p style="font-size: 14px; line-height: 1.6; color: #475569; margin: 0 0 16px 0;">
          ${description}
        </p>
        
        <h4 style="margin: 16px 0 10px 0; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px; color: #94a3b8;">Included Services & Deliverables</h4>
        <ul style="margin: 0; padding-left: 20px; font-size: 14px; color: #475569; line-height: 1.6;">
          ${includedHtml}
        </ul>
        
        ${notIncludedHtml}
        
        ${addOnsHtml}
      </div>

      <div style="background-color: #eff6ff; border: 1px solid #bfdbfe; padding: 20px; border-radius: 16px; margin-bottom: 32px;">
        <h4 style="margin: 0 0 8px 0; font-size: 13px; color: #1e3a8a; font-weight: 700;">Next Steps to Begin:</h4>
        <p style="font-size: 13px; color: #1e40af; margin: 0 0 16px 0; line-height: 1.5;">
          To accept this proposal and schedule production, please approve the quote and pay the deposit using the secure Stripe Checkout link below. Alternatively, you can view the full proposal details on your portal.
        </p>
        
        <div style="text-align: center; margin-bottom: 12px;">
          <a href="${checkoutLink}" style="display: block; background-color: #2563eb; color: #ffffff; padding: 14px 24px; font-weight: 700; border-radius: 12px; text-decoration: none; font-size: 14px; box-shadow: 0 4px 12px rgba(37, 99, 235, 0.25);">Approve Proposal & Pay Deposit</a>
        </div>
        
        <div style="text-align: center;">
          <a href="${portalLink}" style="display: inline-block; color: #2563eb; font-weight: 600; text-decoration: none; font-size: 13px; margin-top: 8px;">View Full Proposal in Portal</a>
        </div>
      </div>
      
      <hr style="border: 0; border-top: 1px solid #f1f5f9; margin-bottom: 24px;">
      
      <p style="font-size: 12px; color: #94a3b8; text-align: center; line-height: 1.5;">
        You are receiving this quote because you submitted a service request to ScaleLink Alliance.<br>
        &copy; 2026 ScaleLink Alliance. All rights reserved.
      </p>
    </div>
  `;

  try {
    const { data, error } = await resend.emails.send({
      from: 'ScaleLink Alliance <support@scalelinkalliance.com>',
      to: [job.clientEmail],
      subject: subject,
      html: htmlContent
    });

    if (error) {
      console.error('❌ Resend Quote Email Error:', error);
      throw error;
    }
    return data;
  } catch (error) {
    console.error('❌ Failed to send quote email notification:', error);
    throw error;
  }
};

module.exports = {
  sendVerificationEmail,
  sendNotificationEmail,
  sendClientNotificationEmail,
  sendClientOnboardingEmail,
  sendClientPhaseNotificationEmail,
  sendQuoteEmail
};
