import { useState } from 'react';
import { supabase, dbHelpers } from '../lib/Supabase';
import { useRouter } from 'next/router';

export default function AuthModal({ showModal, setShowModal, mapStyles }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [purpose, setPurpose] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const router = useRouter();

  const handleAuth = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    if (!email.endsWith('@gmail.com')) {
      setErrorMessage('Please use a Gmail address.');
      setIsLoading(false);
      return;
    }
    if (password.length < 8 || !/[A-Z]/.test(password) || !/[0-9]/.test(password)) {
      setErrorMessage('Password must be at least 8 characters with an uppercase letter and a number.');
      setIsLoading(false);
      return;
    }

    try {
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
        });

        router.push('/dashboard');
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;

        // Store a flag that we just signed in
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
        <h2 style={mapStyles.modalTitle}>{isSignUp ? 'Sign Up' : 'Sign In'}</h2>
        {errorMessage && <p style={mapStyles.error}>{errorMessage}</p>}
        <form onSubmit={handleAuth}>
          <input
            type="email"
            placeholder="Email (Gmail ID)"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={mapStyles.input}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={mapStyles.input}
            required
          />
          {isSignUp && (
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
            {isLoading ? 'Processing...' : isSignUp ? 'Sign Up' : 'Sign In'}
          </button>
        </form>
        <button
          style={mapStyles.toggleBtn}
          onClick={() => setIsSignUp(!isSignUp)}
        >
          {isSignUp ? 'Already have an account? Sign In' : 'New user? Sign Up'}
        </button>
      </div>
    </div>
  );
}