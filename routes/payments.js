// routes/payments.js
import express from 'express';
import Stripe from 'stripe';

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// POST /api/payments/create-checkout-session
router.post('/create-checkout-session', async (req, res) => {
  try {
    const { items, serviceSlug, packageTier, successUrl, cancelUrl } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'No items provided' });
    }

    // Build Stripe line items from cart
    const lineItems = items.map((item) => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.name,
          description: item.description || '',
        },
        unit_amount: Math.round(item.price * 100), // Stripe uses cents
      },
      quantity: item.quantity || 1,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: successUrl || `${process.env.CLIENT_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}&service=${serviceSlug}&package=${packageTier}`,
      cancel_url: cancelUrl || `${process.env.CLIENT_URL}/services/${serviceSlug}`,
      metadata: {
        serviceSlug: serviceSlug || '',
        packageTier: packageTier || '',
      },
      billing_address_collection: 'auto',
      phone_number_collection: { enabled: true },
    });

    res.json({ url: session.url, sessionId: session.id });
  } catch (error) {
    console.error('Stripe checkout error:', error);
    res.status(500).json({ error: error.message });
  }
});

// POST /api/payments/save-project-details
// Saves the post-payment project details form submission
router.post('/save-project-details', async (req, res) => {
  try {
    const {
      sessionId,
      serviceSlug,
      packageTier,
      addOns,
      businessName,
      contactName,
      email,
      phone,
      websiteUrl,
      projectGoal,
      timeline,
      budgetNotes,
      additionalNotes,
    } = req.body;

    // Verify the Stripe session is actually paid before saving
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== 'paid') {
      return res.status(400).json({ error: 'Payment not confirmed' });
    }

    // Log the project details (replace with DB save when ready)
    console.log('✅ New paid project submission:', {
      sessionId,
      serviceSlug,
      packageTier,
      addOns,
      businessName,
      contactName,
      email,
      phone,
      websiteUrl,
      projectGoal,
      timeline,
      budgetNotes,
      additionalNotes,
      paidAmount: session.amount_total / 100,
      currency: session.currency,
      customerEmail: session.customer_details?.email,
      submittedAt: new Date().toISOString(),
    });

    // TODO: Save to DB when models are ready
    // await ProjectSubmission.create({ ... });

    res.json({
      success: true,
      message: 'Project details received. We will be in touch within 24 hours.',
    });
  } catch (error) {
    console.error('Save project details error:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/payments/verify-session/:sessionId
// Frontend calls this on PaymentSuccess page to confirm payment
router.get('/verify-session/:sessionId', async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.retrieve(req.params.sessionId);
    res.json({
      paid: session.payment_status === 'paid',
      customerEmail: session.customer_details?.email,
      amountTotal: session.amount_total / 100,
      currency: session.currency,
      metadata: session.metadata,
    });
  } catch (error) {
    console.error('Verify session error:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;