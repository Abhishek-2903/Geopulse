import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export default function PaymentModal({ 
  showModal, 
  setShowModal, 
  onPaymentSuccess, 
  downloadStats,
  isLoading,
  setIsLoading 
}) {
  const router = useRouter();

  if (!showModal) return null;

  const handleGoToPricing = () => {
    setShowModal(false);
    router.push('/pricing');
  };

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
          Choose Your Plan
        </h2>
        
        <div style={{ color: '#cccccc', marginBottom: '30px', textAlign: 'center' }}>
          <p style={{ fontSize: '18px', marginBottom: '10px' }}>
            You have <strong style={{ color: '#3b82f6' }}>
              {downloadStats?.downloads_remaining || 0}
            </strong> downloads remaining
          </p>
          <p style={{ fontSize: '14px', opacity: 0.8 }}>
            Choose between one-time purchase or unlimited monthly subscription
          </p>
        </div>

        <div style={{
          background: 'rgba(59, 130, 246, 0.1)',
          border: '1px solid rgba(59, 130, 246, 0.3)',
          borderRadius: '12px',
          padding: '20px',
          marginBottom: '30px'
        }}>
          <div style={{ marginBottom: '15px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
              <span style={{ color: '#ffffff' }}>2 Downloads</span>
              <span style={{ color: '#3b82f6', fontWeight: 'bold' }}>$12</span>
            </div>
            <div style={{ color: '#cccccc', fontSize: '12px' }}>One-time purchase</div>
          </div>
          
          <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)', paddingTop: '15px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
              <span style={{ color: '#ffffff' }}>Unlimited Downloads</span>
              <span style={{ color: '#fbbf24', fontWeight: 'bold' }}>$499/month</span>
            </div>
            <div style={{ color: '#cccccc', fontSize: '12px' }}>Subscription (Cancel anytime)</div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '15px' }}>
          <button
            onClick={() => setShowModal(false)}
            style={{
              flex: 1,
              padding: '12px',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              background: 'transparent',
              color: '#ffffff',
              borderRadius: '8px',
              cursor: 'pointer'
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleGoToPricing}
            style={{
              flex: 2,
              padding: '12px',
              background: 'linear-gradient(135deg, #3b82f6, #1e40af)',
              border: 'none',
              color: '#ffffff',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            View Plans
          </button>
        </div>
      </div>
    </div>
  );
}
