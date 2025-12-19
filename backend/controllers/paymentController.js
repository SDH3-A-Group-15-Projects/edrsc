import stripe from '../utils/stripe.js';
import { db } from '../utils/firebaseConfig.js';

export const createCheckoutSession = async (req, res) => {
  try {
    const { patientId } = req.body;

    if (!patientId) {
      return res.status(400).json({ error: "patientId is required" });
    }

    const snapshot = await db.ref(`payments/${patientId}`).once("value");
    if (snapshot.exists() && snapshot.val().paid) {
      return res.json({ paid: true, message: "Payment already completed" });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: {
              name: "Neuromind Cognitive Report",
              description: "Comprehensive cognitive assessment report",
            },
            unit_amount: 5000, 
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `http://localhost:3000/report-success?patientId=${patientId}`,
      cancel_url: `http://localhost:3000/risk-dashboard`,
      metadata: { patientId },
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error("Stripe error:", error);
    res.status(500).json({ error: "Checkout failed" });
  }
};

export const checkPayment = async (req, res) => {
  try {
    const { patientId } = req.params;

    if (!patientId) {
      return res.status(400).json({ error: "patientId is required" });
    }

    const snapshot = await db.ref(`payments/${patientId}`).once("value");
    
    if (snapshot.exists() && snapshot.val().paid) {
      return res.json({ paid: true, data: snapshot.val() });
    }

    return res.json({ paid: false });
  } catch (error) {
    console.error("Payment check error:", error);
    res.status(500).json({ error: "Check failed" });
  }
};

export const verifyPayment = async (req, res) => {
  try {
    const { patientId } = req.params;

    if (!patientId) {
      return res.status(400).json({ error: "patientId is required" });
    }

    const snapshot = await db.ref(`payments/${patientId}`).once("value");
    
    if (snapshot.exists() && snapshot.val().paid) {
      return res.json({ paid: true, data: snapshot.val() });
    }

    return res.json({ paid: false });
  } catch (error) {
    console.error("Payment verification error:", error);
    res.status(500).json({ error: "Verification failed" });
  }
};

export const stripeWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const endpointSecret = "whsec_b85505e6b14e8e2cc801bdcda21113423946fae4a4e0e2f8bd97b35568714136";

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      endpointSecret
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const patientId = session.metadata.patientId;

    console.log(` Payment confirmed for patient ${patientId}`);
    console.log(`   Session ID: ${session.id}`);
    console.log(`   Amount: €${(session.amount_total / 100).toFixed(2)}`);

    await db.ref(`payments/${patientId}`).set({
      paid: true,
      sessionId: session.id,
      amount: session.amount_total,
      currency: session.currency,
      createdAt: Date.now(),
      timestamp: new Date().toISOString(),
    });

    console.log(`   ✓ Saved to Firebase: payments/${patientId}`);
  }

  res.json({ received: true });
};