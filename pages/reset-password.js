import { useState, useEffect } from 'react';
import { supabase } from '../lib/Supabase';
import { useRouter } from 'next/router';

export default function ResetPassword() {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const router = useRouter();

  useEffect(() => {
    // Check if user came from password reset email
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const accessToken = hashParams.get('access_token');
    const type = hashParams.get('type');

    if (type !== 'recovery') {
      setErrorMessage('Invalid password reset link. Please request a new one.');
    }
  }, []);

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    if (newPassword.length < 8 || !/[A-Z]/.test(newPassword) || !/[0-9]/.test(newPassword)) {
      setErrorMessage('Password must be at least 8 characters with an uppercase letter and a number.');
      setIsLoading(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      setIsLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) throw error;

      setSuccessMessage('Password updated successfully! Redirecting to dashboard...');
      
      setTimeout(() => {
        router.push('/dashboard');
      }, 2000);
    } catch (error) {
      console.error('Password reset error:', error);
      setErrorMessage(error.message || 'An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const styles = {
    container: {
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#ffffff',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    },
    card: {
      background: 'rgba(255, 255, 255, 0.95)',
      borderRadius: '20px',
      padding: '40px',
      width: '400px',
      maxWidth: '90%',
      border: '1px solid rgba(0, 0, 0, 0.2)',
      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)'
    },
    title: {
      fontSize: '28px',
      fontWeight: '700',
      margin: '0 0 24px 0',
      color: '#000000',
      textAlign: 'center'
    },
    input: {
      width: '100%',
      padding: '12px 16px',
      borderRadius: '8px',
      border: '1px solid rgba(0, 0, 0, 0.2)',
      background: 'rgba(0, 0, 0, 0.05)',
      color: '#000000',
      fontSize: '16px',
      marginBottom: '16px',
      boxSizing: 'border-box'
    },
    button: {
      width: '100%',
      padding: '14px 24px',
      background: '#000000',
      color: '#ffffff',
      border: 'none',
      borderRadius: '50px',
      fontSize: '16px',
      fontWeight: '700',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      marginTop: '8px'
    },
    error: {
      color: '#000000',
      background: 'rgba(255, 0, 0, 0.1)',
      padding: '12px',
      borderRadius: '8px',
      marginBottom: '16px',
      fontSize: '14px',
      border: '1px solid rgba(255, 0, 0, 0.3)',
      textAlign: 'center'
    },
    success: {
      color: '#000000',
      background: 'rgba(0, 128, 0, 0.1)',
      padding: '12px',
      borderRadius: '8px',
      marginBottom: '16px',
      fontSize: '14px',
      border: '1px solid rgba(0, 128, 0, 0.3)',
      textAlign: 'center'
    },
    backLink: {
      display: 'block',
      textAlign: 'center',
      marginTop: '16px',
      color: '#333333',
      textDecoration: 'none',
      fontSize: '14px'
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Reset Your Password</h1>
        
        {errorMessage && <p style={styles.error}>{errorMessage}</p>}
        {successMessage && <p style={styles.success}>{successMessage}</p>}
        
        <form onSubmit={handleResetPassword}>
          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            style={styles.input}
            required
          />
          
          <input
            type="password"
            placeholder="Confirm New Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            style={styles.input}
            required
          />
          
          <button
            type="submit"
            disabled={isLoading}
            style={styles.button}
          >
            {isLoading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>
        
        <a href="/" style={styles.backLink}>Back to Home</a>
      </div>
    </div>
  );
}