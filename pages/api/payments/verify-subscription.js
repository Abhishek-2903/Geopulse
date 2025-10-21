
import crypto from 'crypto';
import Razorpay from 'razorpay';
import { createPagesServerClient } from '@supabase/auth-helpers-nextjs';
import { dbHelpers } from '../../../lib/Supabase';

const razorpay = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get authenticated user
    const supabase = createPagesServerClient({ req, res });
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const {
      razorpay_subscription_id,
      razorpay_payment_id,
      razorpay_signature
    } = req.body;

    if (!razorpay_subscription_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ error: 'Missing required payment details' });
    }

    // Verify signature
    const body = razorpay_payment_id + '|' + razorpay_subscription_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ error: 'Invalid payment signature' });
    }

    // Fetch subscription details from Razorpay
    const subscription = await razorpay.subscriptions.fetch(razorpay_subscription_id);
    
    if (subscription.status !== 'active') {
      return res.status(400).json({ error: 'Subscription is not active' });
    }

    // Update subscription in database
    const updateData = {
      status: subscription.status,
      current_start: subscription.current_start ? new Date(subscription.current_start * 1000).toISOString() : null,
      current_end: subscription.current_end ? new Date(subscription.current_end * 1000).toISOString() : null,
      charge_at: subscription.charge_at ? new Date(subscription.charge_at * 1000).toISOString() : null,
      subscription_data: subscription
    };

    const updatedSubscription = await dbHelpers.updateSubscription(razorpay_subscription_id, updateData);

    if (!updatedSubscription) {
      return res.status(500).json({ error: 'Failed to update subscription' });
    }

    // Create payment record for the subscription
    const subscriptionPrice = parseFloat(process.env.NEXT_PUBLIC_SUBSCRIPTION_PRICE) || 499;
    await dbHelpers.createPaymentRecord(
      user.id,
      subscriptionPrice * 100, // Convert to cents
      process.env.NEXT_PUBLIC_CURRENCY || 'USD',
      razorpay_payment_id
    );

    // Update payment status
    await dbHelpers.updatePaymentStatus(razorpay_payment_id, 'completed', razorpay_payment_id);

    res.status(200).json({
      success: true,
      subscription: {
        id: subscription.id,
        status: subscription.status,
        current_start: subscription.current_start,
        current_end: subscription.current_end
      }
    });

  } catch (error) {
    console.error('Subscription verification error:', error);
    res.status(500).json({ 
      error: 'Failed to verify subscription',
      details: error.message 
    });
  }
}