import crypto from 'crypto';
import { createPagesServerClient } from '@supabase/auth-helpers-nextjs';
import { createClient } from '@supabase/supabase-js';
import { dbHelpers } from '../../../lib/Supabase';

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
    const supabase = createPagesServerClient({ req, res });
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();

    if (sessionError || !session) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ error: 'Missing payment details' });
    }

    // Verify signature
    const hmac = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET);
    hmac.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const generatedSignature = hmac.digest('hex');

    if (generatedSignature !== razorpay_signature) {
      // Update payment status as failed using admin client
      await dbHelpers.updatePaymentStatusServer(supabaseAdmin, razorpay_order_id, 'failed');
      return res.status(400).json({ error: 'Invalid payment signature' });
    }

    // Update payment status as completed using admin client
    await dbHelpers.updatePaymentStatusServer(
      supabaseAdmin,
      razorpay_order_id, 
      'completed', 
      razorpay_payment_id
    );

    // Get the download count from the payment record using admin client
    const { data: paymentRecord, error: paymentError } = await supabaseAdmin
      .from('payments')
      .select('downloads_purchased')
      .eq('razorpay_order_id', razorpay_order_id)
      .single();

    if (paymentError) {
      console.error('Failed to fetch payment record:', paymentError);
      return res.status(500).json({ error: 'Payment verification failed' });
    }

    const downloadCount = paymentRecord?.downloads_purchased || 25;

    // Add downloads to user account
    const result = await dbHelpers.addDownloads(session.user.id, downloadCount);

    if (!result) {
      throw new Error('Failed to add downloads to user account');
    }

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Payment verification error:', error);
    res.status(500).json({ error: 'Payment verification failed' });
  }
}
