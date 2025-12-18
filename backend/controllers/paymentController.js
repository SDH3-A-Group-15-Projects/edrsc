
import stripe from '../utils/stripe.js';
import { db } from '../utils/firebaseConfig.js';
import Stripe from 'stripe';

const endpointSecret = "whsec_b85505e6b14e8e2cc801bdcda21113423946fae4a4e0e2f8bd97b35568714136";

export const createCheckoutSession = async (req, res) => {
  try {
    const { patientId } = req.body;

    if (!patientId) {
      return res.status(400).json({ error: "patientId is required" });
    }

    const snapshot = await db.ref(`payments/${patientId}`).once("value");
    if (snapshot.exists() && snapshot.val().paid) {
      return res.json({ paid: true });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: {
              name: "Neuromind Cognitive Report",
            },
            unit_amount: 5000,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `http://localhost:3000/report-success?patientId=${patientId}`,
      cancel_url: "http://localhost:3000/risk-dashboard",
      metadata: { patientId },
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error("Stripe error:", error);
    res.status(500).json({ error: "Checkout failed" });
  }
};
export const stripeWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];

  let event;

  try {
    event = Stripe.webhooks.constructEvent(
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

    await db.ref(`payments/${patientId}`).set({
      paid: true,
      sessionId: session.id,
      amount: session.amount_total,
      createdAt: Date.now(),
    });
  }

  res.json({ received: true });
};
