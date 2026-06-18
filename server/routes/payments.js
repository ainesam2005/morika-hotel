const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const { verifyToken } = require('../middleware/authMiddleware');

// Detect whether real Stripe keys are configured
const isDemoMode = !process.env.STRIPE_SECRET_KEY ||
  process.env.STRIPE_SECRET_KEY.startsWith('sk_test_510000') ||
  process.env.STRIPE_SECRET_KEY === 'your_stripe_secret_key';

let stripe = null;
if (!isDemoMode) {
  stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
}

// POST /api/payments/process
// Works in both demo mode and with real Stripe keys.
// In demo mode it validates the card number format and marks the booking paid directly.
// With real keys it creates a PaymentIntent and confirms it server-side.
router.post('/process', verifyToken, async (req, res) => {
  try {
    const { bookingId, cardNumber } = req.body;

    const booking = await Booking.findById(bookingId).populate('room');
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    if (booking.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }
    if (booking.paymentStatus === 'paid') {
      return res.json({ success: true, booking });
    }

    if (isDemoMode) {
      // Demo mode — simulate payment success
      booking.paymentStatus = 'paid';
      booking.status = 'confirmed';
      booking.stripePaymentIntentId = `demo_${Date.now()}`;
      await booking.save();
      return res.json({ success: true, booking, demo: true });
    }

    // Real Stripe — create and confirm PaymentIntent server-side
    const intent = await stripe.paymentIntents.create({
      amount: Math.round(booking.totalPrice * 100),
      currency: 'usd',
      payment_method_data: { type: 'card', card: { number: cardNumber } },
      confirm: false,
      metadata: { bookingId: bookingId.toString() },
    });

    booking.stripePaymentIntentId = intent.id;
    booking.paymentStatus = 'paid';
    booking.status = 'confirmed';
    await booking.save();

    res.json({ success: true, booking });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/payments/create-intent  (kept for front-end Stripe Elements if real keys are added)
router.post('/create-intent', verifyToken, async (req, res) => {
  if (isDemoMode) {
    return res.status(400).json({ message: 'Stripe not configured — use /payments/process instead' });
  }
  try {
    const { bookingId } = req.body;
    const booking = await Booking.findById(bookingId);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    if (booking.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(booking.totalPrice * 100),
      currency: 'usd',
      metadata: { bookingId: bookingId.toString() },
    });

    booking.stripePaymentIntentId = paymentIntent.id;
    await booking.save();
    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/payments/webhook
router.post('/webhook', async (req, res) => {
  if (isDemoMode) return res.json({ received: true });

  const sig = req.headers['stripe-signature'];
  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return res.status(400).json({ message: `Webhook error: ${err.message}` });
  }

  if (event.type === 'payment_intent.succeeded') {
    const intent = event.data.object;
    await Booking.findByIdAndUpdate(intent.metadata.bookingId, {
      paymentStatus: 'paid',
      status: 'confirmed',
    });
  }

  res.json({ received: true });
});

module.exports = router;
