  import { useState } from 'react';
  import { supabase, dbHelpers } from '../lib/Supabase';
  import { useRouter } from 'next/router';

  export default function AuthModal({ showModal, setShowModal, mapStyles }) {
    const [isSignUp, setIsSignUp] = useState(false);
    const [isForgotPassword, setIsForgotPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [mobile, setMobile] = useState('');
    const [purpose, setPurpose] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    const router = useRouter();

    const handleAuth = async (e) => {
      e.preventDefault();
      setIsLoading(true);
      setErrorMessage(null);
      setSuccessMessage(null);

      if (!email.endsWith('@gmail.com')) {
        setErrorMessage('Please use a Gmail address.');
        setIsLoading(false);
        return;
      }

      if (!isForgotPassword) {
        if (password.length < 8 || !/[A-Z]/.test(password) || !/[0-9]/.test(password)) {
          setErrorMessage('Password must be at least 8 characters with an uppercase letter and a number.');
          setIsLoading(false);
          return;
        }
      }

      if (isSignUp && mobile && !/^\+?[1-9]\d{1,14}$/.test(mobile.replace(/[\s-]/g, ''))) {
        setErrorMessage('Please enter a valid mobile number with country code (e.g., +911234567890)');
        setIsLoading(false);
        return;
      }

      try {
        if (isForgotPassword) {
          const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/reset-password`,
          });

          if (error) throw error;

          setSuccessMessage('Password reset link sent to your email. Please check your inbox.');
          setIsLoading(false);
          
          setTimeout(() => {
            setIsForgotPassword(false);
            setSuccessMessage(null);
          }, 3000);
          
          return;
        }

        if (isSignUp) {
          const { data, error } = await supabase.auth.signUp({
            email,
            password,
          });

          if (error) throw error;

          if (data.session) {
            await supabase.auth.setSession(data.session);
          } else {
            setErrorMessage('Please check your email to confirm your account.');
            setIsLoading(false);
            return;
          }

          await dbHelpers.updateUserProfile(data.user.id, {
            purpose,
            email,
            mobile_number: mobile || null,
          });

          router.push('/dashboard');
        } else {
          const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
          });

          if (error) throw error;

          sessionStorage.setItem('justSignedIn', 'true');
          router.push('/dashboard');
        }
      } catch (error) {
        console.error('Auth error:', error);
        setErrorMessage(error.message || 'An error occurred. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    if (!showModal) return null;

    return (
      <div style={mapStyles.modal} onClick={() => setShowModal(false)}>
        <div style={mapStyles.modalContent} onClick={(e) => e.stopPropagation()}>
          <h2 style={mapStyles.modalTitle}>
            {isForgotPassword ? 'Reset Password' : isSignUp ? 'Sign Up' : 'Sign In'}
          </h2>
          
          {errorMessage && <p style={mapStyles.error}>{errorMessage}</p>}
          {successMessage && (
            <p style={{...mapStyles.error, background: 'rgba(0, 128, 0, 0.1)', borderColor: 'rgba(0, 128, 0, 0.3)'}}>
              {successMessage}
            </p>
          )}
          
          <form onSubmit={handleAuth}>
            <input
              type="email"
              placeholder="Email (Gmail ID)"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={mapStyles.input}
              required
            />
            
            {!isForgotPassword && (
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={mapStyles.input}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '16px',
                    color: '#333333',
                    padding: '0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '24px',
                    height: '24px'
                  }}
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
            )}
            
            {isSignUp && !isForgotPassword && (
              <>
                <input
                  type="tel"
                  placeholder="Mobile Number (Optional, e.g., +911234567890)"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  style={mapStyles.input}
                />
                <select
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  style={mapStyles.select}
                  required
                >
                  <option value="">Select Purpose</option>
                  <option value="cycling">Cycling</option>
                  <option value="trekking">Trekking</option>
                  <option value="defence">Defence Purpose</option>
                  <option value="offline_routing">Offline Routing</option>
                  <option value="other">Other</option>
                </select>
              </>
            )}
            
            <button
              type="submit"
              disabled={isLoading}
              style={{
                ...mapStyles.primaryBtn,
                padding: '12px 24px',
                fontSize: '16px',
                width: '100%',
                marginTop: '20px'
              }}
            >
              {isLoading 
                ? 'Processing...' 
                : isForgotPassword 
                  ? 'Send Reset Link' 
                  : isSignUp 
                    ? 'Sign Up' 
                    : 'Sign In'}
            </button>
          </form>
          
          {!isForgotPassword && !isSignUp && (
            <button
              style={{...mapStyles.toggleBtn, marginTop: '8px', fontSize: '13px', color: '#666'}}
              onClick={() => {
                setIsForgotPassword(true);
                setErrorMessage(null);
                setSuccessMessage(null);
              }}
            >
              Forgot Password?
            </button>
          )}
          
          {isForgotPassword ? (
            <button
              style={mapStyles.toggleBtn}
              onClick={() => {
                setIsForgotPassword(false);
                setErrorMessage(null);
                setSuccessMessage(null);
              }}
            >
              Back to Sign In
            </button>
          ) : (
            <button
              style={mapStyles.toggleBtn}
              onClick={() => {
                setIsSignUp(!isSignUp);
                setErrorMessage(null);
                setSuccessMessage(null);
              }}
            >
              {isSignUp ? 'Already have an account? Sign In' : 'New user? Sign Up'}
            </button>
          )}
        </div>
      </div>
    );
  }