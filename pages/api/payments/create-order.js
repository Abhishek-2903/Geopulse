import Razorpay from 'razorpay';
import { createPagesServerClient } from '@supabase/auth-helpers-nextjs';
import { createClient } from '@supabase/supabase-js';
import { dbHelpers } from '../../../lib/Supabase';

const razorpay = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Create service role client for bypassing RLS
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Verify user authentication
    const supabase = createPagesServerClient({ req, res });
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();

    if (sessionError || !session) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { amount, currency = process.env.CURRENCY, downloadCount = 25 } = req.body;

    if (!amount || amount < 1) {
      return res.status(400).json({ error: 'Invalid amount' });
    }

    if (![25, 100].includes(downloadCount)) {
      return res.status(400).json({ error: 'Invalid download package' });
    }

    // Create Razorpay order
    const order = await razorpay.orders.create({
      amount: amount * 100, // Razorpay expects amount in paise
      currency: currency,
      receipt: `order_${Date.now()}`,
      notes: {
        user_id: session.user.id,
        downloads: downloadCount
      }
    });

    // Save payment record to database using admin client
    await dbHelpers.createPaymentRecordServer(
      supabaseAdmin,
      session.user.id,
      amount,
      currency,
      order.id,
      downloadCount
    );

    res.status(200).json(order);
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ error: 'Failed to create payment order' });
  }
}
