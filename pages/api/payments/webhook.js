
import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';
import { dbHelpers } from '../../../lib/Supabase';

// Use service role client for webhook operations
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const body = JSON.stringify(req.body);
    const signature = req.headers['x-razorpay-signature'];

    // Verify webhook signature if secret is configured
    if (process.env.RAZORPAY_WEBHOOK_SECRET) {
      const expectedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET)
        .update(body)
        .digest('hex');

      if (expectedSignature !== signature) {
        return res.status(400).json({ error: 'Invalid webhook signature' });
      }
    }

    const event = req.body;
    const eventType = event.event;

    switch (eventType) {
      case 'subscription.activated':
        await handleSubscriptionActivated(event.payload.subscription.entity);
        break;
      
      case 'subscription.charged':
        await handleSubscriptionCharged(event.payload.subscription.entity, event.payload.payment.entity);
        break;
      
      case 'subscription.cancelled':
        await handleSubscriptionCancelled(event.payload.subscription.entity);
        break;
      
      case 'subscription.completed':
        await handleSubscriptionCompleted(event.payload.subscription.entity);
        break;
      
      case 'subscription.halted':
        await handleSubscriptionHalted(event.payload.subscription.entity);
        break;
      
      default:
        console.log(`Unhandled webhook event: ${eventType}`);
    }

    res.status(200).json({ status: 'ok' });

  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
}

async function handleSubscriptionActivated(subscription) {
  try {
    const updateData = {
      status: 'active',
      current_start: subscription.current_start ? new Date(subscription.current_start * 1000).toISOString() : null,
      current_end: subscription.current_end ? new Date(subscription.current_end * 1000).toISOString() : null,
      charge_at: subscription.charge_at ? new Date(subscription.charge_at * 1000).toISOString() : null,
      subscription_data: subscription
    };

    await dbHelpers.updateSubscription(subscription.id, updateData);
    console.log(`Subscription activated: ${subscription.id}`);
  } catch (error) {
    console.error('Error handling subscription activation:', error);
  }
}

async function handleSubscriptionCharged(subscription, payment) {
  try {
    // Update subscription data
    const updateData = {
      current_start: subscription.current_start ? new Date(subscription.current_start * 1000).toISOString() : null,
      current_end: subscription.current_end ? new Date(subscription.current_end * 1000).toISOString() : null,
      charge_at: subscription.charge_at ? new Date(subscription.charge_at * 1000).toISOString() : null,
      subscription_data: subscription
    };

    await dbHelpers.updateSubscription(subscription.id, updateData);

    // Get user ID from subscription notes or fetch from database
    const { data: subscriptionRecord } = await supabase
      .from('subscriptions')
      .select('user_id')
      .eq('razorpay_subscription_id', subscription.id)
      .single();

    if (subscriptionRecord && payment) {
      // Create payment record for recurring charge
      await dbHelpers.createPaymentRecord(
        subscriptionRecord.user_id,
        payment.amount,
        payment.currency.toUpperCase(),
        payment.id
      );

      await dbHelpers.updatePaymentStatus(payment.id, 'completed', payment.id);
    }

    console.log(`Subscription charged: ${subscription.id}`);
  } catch (error) {
    console.error('Error handling subscription charge:', error);
  }
}

async function handleSubscriptionCancelled(subscription) {
  try {
    const updateData = {
      status: 'cancelled',
      subscription_data: subscription
    };

    await dbHelpers.updateSubscription(subscription.id, updateData);
    console.log(`Subscription cancelled: ${subscription.id}`);
  } catch (error) {
    console.error('Error handling subscription cancellation:', error);
  }
}

async function handleSubscriptionCompleted(subscription) {
  try {
    const updateData = {
      status: 'completed',
      subscription_data: subscription
    };

    await dbHelpers.updateSubscription(subscription.id, updateData);
    console.log(`Subscription completed: ${subscription.id}`);
  } catch (error) {
    console.error('Error handling subscription completion:', error);
  }
}

async function handleSubscriptionHalted(subscription) {
  try {
    const updateData = {
      status: 'halted',
      subscription_data: subscription
    };

    await dbHelpers.updateSubscription(subscription.id, updateData);
    console.log(`Subscription halted: ${subscription.id}`);
  } catch (error) {
    console.error('Error handling subscription halt:', error);
  }
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '1mb',
    },
  },
};