import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export default function PaymentModal({ 
  showModal, 
  setShowModal, 
  onPaymentSuccess, 
  downloadStats,
  isLoading,
  setIsLoading 
}) {
  const price = parseInt(process.env.NEXT_PUBLIC_DOWNLOAD_PRICE_PER_100) || 999;
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const supabase = createClientComponentClient();
  

  useEffect(() => {
    if (typeof window !== 'undefined' && showModal) {
      // Get current user info
      const getCurrentUser = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        setCurrentUser(user);
      };
      getCurrentUser();

      // Check if Razorpay is already loaded
      if (window.Razorpay) {
        setRazorpayLoaded(true);
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => setRazorpayLoaded(true);
      script.onerror = () => {
        console.error('Failed to load Razorpay script');
        alert('Failed to load payment system. Please refresh and try again.');
      };
      document.head.appendChild(script);
      
      return () => {
        // Don't remove script as it might be used by other components
      };
    }
  }, [showModal, supabase]);

  const handlePayment = async () => {
    if (!razorpayLoaded || !window.Razorpay) {
      alert('Payment system not loaded. Please refresh and try again.');
      return;
    }

    setIsLoading(true);

    try {
      // Create order on backend
      const response = await fetch('/api/payments/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: price, currency: process.env.CURRENCY || 'USD' })
      });

      const order = await response.json();

      if (!response.ok) {
        throw new Error(order.error || 'Failed to create payment order');
      }

      // Extract user info for prefill
      const userEmail = currentUser?.email || 'user@example.com';
      const userName = currentUser?.user_metadata?.full_name || 
                      currentUser?.user_metadata?.name || 
                      'GeoPulse User';

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: 'GeoPulse',
        description: '100 Map Downloads',
        order_id: order.id,
        handler: async function(response) {
          try {
            // Verify payment on backend
            const verifyResponse = await fetch('/api/payments/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature
              })
            });

            const verifyResult = await verifyResponse.json();

            if (verifyResponse.ok && verifyResult.success) {
              onPaymentSuccess();
              setShowModal(false);
            } else {
              throw new Error(verifyResult.error || 'Payment verification failed');
            }
          } catch (error) {
            console.error('Payment verification error:', error);
            alert('Payment verification failed. Please contact support.');
          }
        },
        prefill: {
          name: userName,
          email: userEmail
        },
        theme: {
          color: '#3b82f6'
        },
        modal: {
          ondismiss: () => {
            setIsLoading(false);
          }
        }
      };

      const rzpInstance = new window.Razorpay(options);
      rzpInstance.open();
    } catch (error) {
      console.error('Payment error:', error);
      alert('Failed to initiate payment. Please try again.');
      setIsLoading(false);
    }
  };

  if (!showModal) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.8)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 10000
    }}>
      <div style={{
        background: '#1a1a1a',
        borderRadius: '20px',
        padding: '40px',
        maxWidth: '500px',
        width: '90%',
        border: '1px solid rgba(255, 255, 255, 0.15)',
        backdropFilter: 'blur(15px)'
      }}>
        <h2 style={{ color: '#ffffff', marginBottom: '20px', textAlign: 'center' }}>
          Purchase Download
        </h2>
        
        <div style={{ color: '#cccccc', marginBottom: '30px', textAlign: 'center' }}>
          <p style={{ fontSize: '18px', marginBottom: '10px' }}>
            You have <strong style={{ color: '#3b82f6' }}>
              {downloadStats?.downloads_remaining || 0}
            </strong> downloads remaining
          </p>
          <p style={{ fontSize: '14px', opacity: 0.8 }}>
            Purchase 100 more downloads to continue generating maps
          </p>
        </div>

        <div style={{
          background: 'rgba(59, 130, 246, 0.1)',
          border: '1px solid rgba(59, 130, 246, 0.3)',
          borderRadius: '12px',
          padding: '20px',
          marginBottom: '30px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span style={{ color: '#ffffff' }}>100 Downloads</span>
            <span style={{ color: '#3b82f6', fontWeight: 'bold' }}>${price}</span>
          </div>
          <div style={{ color: '#cccccc', fontSize: '14px' }}>
            • Generate up to 100 offline maps
            • High-quality tiles up to zoom level 18
            • Multiple export formats (MBTiles, ZIP)
          </div>
        </div>

        <div style={{ display: 'flex', gap: '15px' }}>
          <button
            onClick={() => setShowModal(false)}
            disabled={isLoading}
            style={{
              flex: 1,
              padding: '12px',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              background: 'transparent',
              color: '#ffffff',
              borderRadius: '8px',
              cursor: 'pointer',
              opacity: isLoading ? 0.5 : 1
            }}
          >
            Cancel
          </button>
          <button
            onClick={handlePayment}
            disabled={isLoading || !razorpayLoaded}
            style={{
              flex: 2,
              padding: '12px',
              background: 'linear-gradient(135deg, #3b82f6, #1e40af)',
              border: 'none',
              color: '#ffffff',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 'bold',
              opacity: (isLoading || !razorpayLoaded) ? 0.5 : 1
            }}
          >
            {isLoading ? 'Processing...' : !razorpayLoaded ? 'Loading...' : `Pay $${price}`}
          </button>
        </div>
      </div>
    </div>
  );
}
