import { useState, useEffect } from 'react';
import { supabase } from '../lib/Supabase';
import { useRouter } from 'next/router';

export default function ResetPassword() {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [isValidLink, setIsValidLink] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const initializeSession = async () => {
      try {
        // First, check if there's already a session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (session) {
          console.log('Existing session found');
          setIsValidLink(true);
          return;
        }

        // If no session, try to get tokens from URL hash
        const hash = window.location.hash;
        console.log('URL Hash:', hash);

        if (!hash || hash.length <= 1) {
          setIsValidLink(false);
          setErrorMessage('Invalid password reset link. Please request a new one.');
          return;
        }

        // Parse hash parameters
        const hashParams = new URLSearchParams(hash.substring(1));
        const accessToken = hashParams.get('access_token');
        const refreshToken = hashParams.get('refresh_token');
        const type = hashParams.get('type');

        console.log('Access Token:', accessToken ? 'Present' : 'Missing');
        console.log('Refresh Token:', refreshToken ? 'Present' : 'Missing');
        console.log('Type:', type);

        if (!accessToken) {
          setIsValidLink(false);
          setErrorMessage('Invalid reset link. No access token found.');
          return;
        }

        if (type !== 'recovery') {
          setIsValidLink(false);
          setErrorMessage('Invalid link type. This is not a password recovery link.');
          return;
        }

        // Set the session using the tokens from URL
        const { data, error } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken || ''
        });

        if (error) {
          console.error('Set session error:', error);
          setIsValidLink(false);
          setErrorMessage(`Session error: ${error.message}. The link may have expired.`);
          return;
        }

        if (data.session) {
          console.log('Session successfully set!');
          setIsValidLink(true);
          
          // Clear the hash from URL for security
          window.history.replaceState(null, '', window.location.pathname);
        } else {
          setIsValidLink(false);
          setErrorMessage('Failed to create session. Please request a new reset link.');
        }
      } catch (error) {
        console.error('Initialization error:', error);
        setIsValidLink(false);
        setErrorMessage(`Error: ${error.message}`);
      }
    };

    // Small delay to ensure DOM is ready
    const timer = setTimeout(() => {
      initializeSession();
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  const handleResetPassword = async (e) => {
    if (e) e.preventDefault();
    
    setIsLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    // Validate password strength
    if (newPassword.length < 8) {
      setErrorMessage('Password must be at least 8 characters long.');
      setIsLoading(false);
      return;
    }

    if (!/[A-Z]/.test(newPassword)) {
      setErrorMessage('Password must contain at least one uppercase letter.');
      setIsLoading(false);
      return;
    }

    if (!/[0-9]/.test(newPassword)) {
      setErrorMessage('Password must contain at least one number.');
      setIsLoading(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      setIsLoading(false);
      return;
    }

    try {
      // Verify we have a session before attempting update
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        setErrorMessage('Auth session missing! Please request a new reset link.');
        setIsLoading(false);
        return;
      }

      console.log('Updating password for user:', session.user.id);

      const { data, error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) {
        console.error('Update password error:', error);
        throw error;
      }

      console.log('Password updated successfully:', data);
      setSuccessMessage('Password updated successfully! Redirecting to home...');
      
      // Sign out and redirect
      setTimeout(async () => {
        await supabase.auth.signOut();
        router.push('/');
      }, 2000);
    } catch (error) {
      console.error('Password reset error:', error);
      
      if (error.message.includes('session')) {
        setErrorMessage('Your reset link has expired. Please request a new one.');
      } else {
        setErrorMessage(error.message || 'Failed to reset password. Please try again.');
      }
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
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      padding: '20px'
    },
    card: {
      background: 'rgba(255, 255, 255, 0.95)',
      borderRadius: '20px',
      padding: '40px',
      width: '400px',
      maxWidth: '100%',
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
    inputContainer: {
      position: 'relative',
      marginBottom: '16px'
    },
    input: {
      width: '100%',
      padding: '12px 40px 12px 16px',
      borderRadius: '8px',
      border: '1px solid rgba(0, 0, 0, 0.2)',
      background: 'rgba(0, 0, 0, 0.05)',
      color: '#000000',
      fontSize: '16px',
      boxSizing: 'border-box'
    },
    togglePasswordBtn: {
      position: 'absolute',
      right: '12px',
      top: '50%',
      transform: 'translateY(-50%)',
      background: 'transparent',
      border: 'none',
      cursor: 'pointer',
      fontSize: '16px',
      color: '#333',
      padding: 0,
      width: '24px',
      height: '24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
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
      marginTop: '8px',
      opacity: 1
    },
    buttonDisabled: {
      opacity: 0.6,
      cursor: 'not-allowed'
    },
    error: {
      color: '#dc2626',
      background: 'rgba(220, 38, 38, 0.1)',
      padding: '12px',
      borderRadius: '8px',
      marginBottom: '16px',
      fontSize: '14px',
      border: '1px solid rgba(220, 38, 38, 0.3)',
      textAlign: 'center',
      lineHeight: '1.5'
    },
    success: {
      color: '#16a34a',
      background: 'rgba(22, 163, 74, 0.1)',
      padding: '12px',
      borderRadius: '8px',
      marginBottom: '16px',
      fontSize: '14px',
      border: '1px solid rgba(22, 163, 74, 0.3)',
      textAlign: 'center'
    },
    backLink: {
      display: 'block',
      textAlign: 'center',
      marginTop: '16px',
      color: '#333333',
      textDecoration: 'none',
      fontSize: '14px',
      cursor: 'pointer'
    },
    passwordRequirements: {
      fontSize: '12px',
      color: '#666',
      marginBottom: '16px',
      padding: '8px 12px',
      background: 'rgba(0, 0, 0, 0.03)',
      borderRadius: '6px',
      lineHeight: '1.6'
    },
    invalidMessage: {
      textAlign: 'center',
      color: '#666',
      marginTop: '16px',
      lineHeight: '1.6'
    },
    loader: {
      textAlign: 'center',
      padding: '20px',
      color: '#666',
      fontSize: '16px'
    }
  };

  // Show loading state while checking the link
  if (isValidLink === null) {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <h1 style={styles.title}>Reset Your Password</h1>
          <div style={styles.loader}>
            <div style={{ marginBottom: '12px' }}>🔄</div>
            Verifying reset link...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Reset Your Password</h1>
        
        {errorMessage && <p style={styles.error}>{errorMessage}</p>}
        {successMessage && <p style={styles.success}>{successMessage}</p>}
        
        {isValidLink ? (
          <div>
            <div style={styles.passwordRequirements}>
              <strong>Password Requirements:</strong>
              <br />• Minimum 8 characters
              <br />• At least one uppercase letter (A-Z)
              <br />• At least one number (0-9)
            </div>
            
            <div style={styles.inputContainer}>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                style={styles.input}
                onKeyPress={(e) => e.key === 'Enter' && handleResetPassword()}
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={styles.togglePasswordBtn}
                tabIndex={-1}
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
            
            <div style={styles.inputContainer}>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Confirm New Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                style={styles.input}
                onKeyPress={(e) => e.key === 'Enter' && handleResetPassword()}
                autoComplete="new-password"
              />
            </div>
            
            <button
              onClick={handleResetPassword}
              disabled={isLoading || !newPassword || !confirmPassword}
              style={{
                ...styles.button,
                ...(isLoading || !newPassword || !confirmPassword ? styles.buttonDisabled : {})
              }}
            >
              {isLoading ? 'Resetting Password...' : 'Reset Password'}
            </button>
          </div>
        ) : (
          <div style={styles.invalidMessage}>
            <p style={{ marginBottom: '12px', fontWeight: '600' }}>
              ❌ Invalid or Expired Link
            </p>
            <p style={{ marginBottom: '8px' }}>
              The password reset link is invalid or has expired.
            </p>
            <p>
              Please return to the home page and request a new password reset link.
            </p>
          </div>
        )}
        
        <a href="/" style={styles.backLink}>← Back to Home</a>
      </div>
    </div>
  );
}