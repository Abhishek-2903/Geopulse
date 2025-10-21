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
    // Verify user authentication
    const supabase = createPagesServerClient({ req, res });
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();

    if (sessionError || !session) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { amount, currency = process.env.NEXT_PUBLIC_CURRENCY } = req.body;

    if (!amount || amount < 1) {
      return res.status(400).json({ error: 'Invalid amount' });
    }

    // Create Razorpay order
    const order = await razorpay.orders.create({
      amount: amount * 100, // Razorpay expects amount in paise
      currency: currency,
      receipt: `order_${Date.now()}`,
      notes: {
        user_id: session.user.id,
        downloads: 2
      }
    });

    // Save payment record to database
    await dbHelpers.createPaymentRecord(
      session.user.id,
      amount,
      currency,
      order.id
    );

    res.status(200).json(order);
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ error: 'Failed to create payment order' });
  }
}
