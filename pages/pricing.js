import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { dbHelpers } from '../lib/Supabase';

export default function PricingPage() {
  const [user, setUser] = useState(null);
  const [downloadStats, setDownloadStats] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);
  const router = useRouter();
  const supabase = createClientComponentClient();

  const oneTimePrice = parseInt(process.env.NEXT_PUBLIC_DOWNLOAD_PRICE_PER_100) || 12;
  const subscriptionPrice = parseFloat(process.env.NEXT_PUBLIC_SUBSCRIPTION_PRICE) || 499;

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/auth');
        return;
      }
      setUser(user);
      
      const stats = await dbHelpers.getUserDownloadStats(user.id);
      setDownloadStats(stats);
    };

    getUser();

    // Load Razorpay script
    if (typeof window !== 'undefined') {
      if (window.Razorpay) {
        setRazorpayLoaded(true);
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => setRazorpayLoaded(true);
      document.head.appendChild(script);
    }
  }, [supabase, router]);

  const handleOneTimePayment = async () => {
    if (!razorpayLoaded || !window.Razorpay) {
      alert('Payment system not loaded. Please refresh and try again.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/payments/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          amount: oneTimePrice, 
          currency: 'USD',
          type: 'one_time'
        })
      });

      const order = await response.json();
      if (!response.ok) throw new Error(order.error);

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: 'GeoPulse',
        description: '2 Map Downloads',
        order_id: order.id,
        handler: async function(response) {
          try {
            const verifyResponse = await fetch('/api/payments/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                type: 'one_time'
              })
            });

            const result = await verifyResponse.json();
            if (result.success) {
              router.push('/dashboard?payment=success');
            } else {
              throw new Error(result.error);
            }
          } catch (error) {
            alert('Payment verification failed. Please contact support.');
          }
        },
        prefill: {
          name: user?.user_metadata?.full_name || 'GeoPulse User',
          email: user?.email
        },
        theme: { color: '#3b82f6' }
      };

      new window.Razorpay(options).open();
    } catch (error) {
      alert('Failed to initiate payment. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubscription = async () => {
    if (!razorpayLoaded || !window.Razorpay) {
      alert('Payment system not loaded. Please refresh and try again.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/payments/create-subscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plan_id: process.env.NEXT_PUBLIC_RAZORPAY_PLAN_ID
        })
      });

      const subscription = await response.json();
      if (!response.ok) throw new Error(subscription.error);

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        subscription_id: subscription.id,
        name: 'GeoPulse',
        description: 'Unlimited Monthly Downloads',
        handler: async function(response) {
          try {
            const verifyResponse = await fetch('/api/payments/verify-subscription', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_subscription_id: response.razorpay_subscription_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature
              })
            });

            const result = await verifyResponse.json();
            if (result.success) {
              router.push('/dashboard?subscription=success');
            } else {
              throw new Error(result.error);
            }
          } catch (error) {
            alert('Subscription verification failed. Please contact support.');
          }
        },
        prefill: {
          name: user?.user_metadata?.full_name || 'GeoPulse User',
          email: user?.email
        },
        theme: { color: '#3b82f6' }
      };

      new window.Razorpay(options).open();
    } catch (error) {
      alert('Failed to initiate subscription. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!user || !downloadStats) {
    return <div style={{ color: '#ffffff', textAlign: 'center', padding: '50px' }}>Loading...</div>;
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', padding: '40px 20px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <h1 style={{ color: '#ffffff', textAlign: 'center', marginBottom: '20px', fontSize: '48px' }}>
          Choose Your Plan
        </h1>
        <p style={{ color: '#cccccc', textAlign: 'center', marginBottom: '60px', fontSize: '18px' }}>
          You currently have <strong style={{ color: '#3b82f6' }}>
            {downloadStats.is_subscribed ? 'Unlimited' : downloadStats.downloads_remaining}
          </strong> downloads remaining
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '30px' }}>
          {/* One-time Purchase */}
          <div style={{
            background: 'linear-gradient(135deg, #1a1a1a, #2a2a2a)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            borderRadius: '20px',
            padding: '40px',
            textAlign: 'center'
          }}>
            <h3 style={{ color: '#ffffff', marginBottom: '20px', fontSize: '24px' }}>One-Time Purchase</h3>
            <div style={{ color: '#3b82f6', fontSize: '48px', fontWeight: 'bold', marginBottom: '10px' }}>
              ${oneTimePrice}
            </div>
            <p style={{ color: '#cccccc', marginBottom: '30px' }}>2 Downloads</p>
            
            <ul style={{ color: '#cccccc', textAlign: 'left', marginBottom: '40px', listStyle: 'none', padding: 0 }}>
              <li style={{ marginBottom: '10px' }}>✓ 2 offline map downloads</li>
              <li style={{ marginBottom: '10px' }}>✓ High-quality tiles up to zoom 19</li>
              <li style={{ marginBottom: '10px' }}>✓ Multiple export formats</li>
              <li style={{ marginBottom: '10px' }}>✓ One-time payment</li>
            </ul>

            <button
              onClick={handleOneTimePayment}
              disabled={isLoading || !razorpayLoaded}
              style={{
                width: '100%',
                padding: '15px',
                background: 'linear-gradient(135deg, #374151, #4b5563)',
                border: 'none',
                color: '#ffffff',
                borderRadius: '10px',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '16px',
                opacity: (isLoading || !razorpayLoaded) ? 0.5 : 1
              }}
            >
              {isLoading ? 'Processing...' : `Purchase for $${oneTimePrice}`}
            </button>
          </div>

          {/* Subscription */}
          <div style={{
            background: 'linear-gradient(135deg, #1e3a8a, #3b82f6)',
            border: '2px solid #3b82f6',
            borderRadius: '20px',
            padding: '40px',
            textAlign: 'center',
            position: 'relative'
          }}>
            <div style={{
              position: 'absolute',
              top: '-15px',
              left: '50%',
              transform: 'translateX(-50%)',
              background: '#fbbf24',
              color: '#000000',
              padding: '5px 20px',
              borderRadius: '20px',
              fontSize: '14px',
              fontWeight: 'bold'
            }}>
              RECOMMENDED
            </div>

            <h3 style={{ color: '#ffffff', marginBottom: '20px', fontSize: '24px' }}>Monthly Subscription</h3>
            <div style={{ color: '#ffffff', fontSize: '48px', fontWeight: 'bold', marginBottom: '10px' }}>
              ${subscriptionPrice}
            </div>
            <p style={{ color: '#e5e7eb', marginBottom: '30px' }}>per month</p>
            
            <ul style={{ color: '#e5e7eb', textAlign: 'left', marginBottom: '40px', listStyle: 'none', padding: 0 }}>
              <li style={{ marginBottom: '10px' }}>✓ Unlimited downloads</li>
              <li style={{ marginBottom: '10px' }}>✓ High-quality tiles up to zoom 19</li>
              <li style={{ marginBottom: '10px' }}>✓ Multiple export formats</li>
              <li style={{ marginBottom: '10px' }}>✓ Cancel anytime</li>
              <li style={{ marginBottom: '10px' }}>✓ Priority support</li>
            </ul>

            <button
              onClick={handleSubscription}
              disabled={isLoading || !razorpayLoaded || downloadStats.is_subscribed}
              style={{
                width: '100%',
                padding: '15px',
                background: downloadStats.is_subscribed ? '#6b7280' : 'linear-gradient(135deg, #ffffff, #f3f4f6)',
                border: 'none',
                color: '#000000',
                borderRadius: '10px',
                cursor: downloadStats.is_subscribed ? 'not-allowed' : 'pointer',
                fontWeight: 'bold',
                fontSize: '16px',
                opacity: (isLoading || !razorpayLoaded) ? 0.5 : 1
              }}
            >
              {downloadStats.is_subscribed ? 'Already Subscribed' : 
               isLoading ? 'Processing...' : 
               `Subscribe for $${subscriptionPrice}/month`}
            </button>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '40px' }}>
          <button
            onClick={() => router.push('/dashboard')}
            style={{
              padding: '12px 24px',
              background: 'transparent',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              color: '#ffffff',
              borderRadius: '8px',
              cursor: 'pointer'
            }}
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
