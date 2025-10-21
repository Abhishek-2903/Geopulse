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

    const { plan_id } = req.body;

    if (!plan_id) {
      return res.status(400).json({ error: 'Plan ID is required' });
    }

    // Check if user already has an active subscription using service client
    const { data: existingSubscription } = await serviceClient
      .from('subscriptions')
      .select('*')
      .eq('user_id', user.id)
      .eq('status', 'active')
      .single();

    if (existingSubscription) {
      return res.status(400).json({ error: 'User already has an active subscription' });
    }

    // Create subscription with Razorpay
    const subscriptionOptions = {
      plan_id: plan_id,
      customer_notify: 1,
      quantity: 1,
      total_count: 12, // 12 months
      notes: {
        user_id: user.id,
        user_email: user.email
      }
    };

    const subscription = await razorpay.subscriptions.create(subscriptionOptions);

    // Store subscription in database using service client
    const { data: subscriptionRecord, error: createError } = await serviceClient
      .from('subscriptions')
      .insert({
        user_id: user.id,
        razorpay_subscription_id: subscription.id,
        plan_id: subscription.plan_id,
        status: subscription.status,
        current_start: subscription.current_start ? new Date(subscription.current_start * 1000).toISOString() : null,
        current_end: subscription.current_end ? new Date(subscription.current_end * 1000).toISOString() : null,
        charge_at: subscription.charge_at ? new Date(subscription.charge_at * 1000).toISOString() : null,
        subscription_data: subscription
      })
      .select()
      .single();

    if (createError) {
      console.error('Subscription creation error:', createError);
      throw createError;
    }

    res.status(200).json({
      id: subscription.id,
      status: subscription.status,
      plan_id: subscription.plan_id
    });

  } catch (error) {
    console.error('Subscription creation error:', error);
    res.status(500).json({ 
      error: 'Failed to create subscription',
      details: error.message 
    });
  }
}
