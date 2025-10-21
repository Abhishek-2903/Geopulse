import crypto from 'crypto';
import Razorpay from 'razorpay';
import { createPagesServerClient } from '@supabase/auth-helpers-nextjs';
import { createClient } from '@supabase/supabase-js';

const razorpay = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Service role client for subscription operations
const serviceClient = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

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
    
    console.log('Subscription status from Razorpay:', subscription.status);
    console.log('Full subscription data:', JSON.stringify(subscription, null, 2));

    // Accept multiple valid statuses for new subscriptions
    const validStatuses = ['active', 'authenticated', 'created'];
    if (!validStatuses.includes(subscription.status)) {
      return res.status(400).json({ 
        error: `Subscription status "${subscription.status}" is not valid`,
        subscription_status: subscription.status
      });
    }

    // Update subscription in database using service client
    const updateData = {
      status: subscription.status === 'authenticated' ? 'active' : subscription.status,
      current_start: subscription.current_start ? new Date(subscription.current_start * 1000).toISOString() : null,
      current_end: subscription.current_end ? new Date(subscription.current_end * 1000).toISOString() : null,
      charge_at: subscription.charge_at ? new Date(subscription.charge_at * 1000).toISOString() : null,
      subscription_data: subscription
    };

    const { data: updatedSubscription, error: updateError } = await serviceClient
      .from('subscriptions')
      .update(updateData)
      .eq('razorpay_subscription_id', razorpay_subscription_id)
      .select()
      .single();

    if (updateError) {
      console.error('Subscription update error:', updateError);
      return res.status(500).json({ error: 'Failed to update subscription' });
    }

    // Create payment record for the subscription
    const subscriptionPrice = parseFloat(process.env.NEXT_PUBLIC_SUBSCRIPTION_PRICE) || 499;
    const { data: paymentRecord, error: paymentError } = await serviceClient
      .from('payments')
      .insert({
        user_id: user.id,
        amount: subscriptionPrice * 100, // Convert to cents
        currency: process.env.NEXT_PUBLIC_CURRENCY || 'USD',
        razorpay_order_id: razorpay_payment_id,
        razorpay_payment_id: razorpay_payment_id,
        status: 'completed',
        downloads_purchased: null // Unlimited for subscriptions
      })
      .select()
      .single();

    if (paymentError) {
      console.error('Payment record creation error:', paymentError);
    }

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