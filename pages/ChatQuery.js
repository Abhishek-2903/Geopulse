import { useState } from 'react';
import { supabase } from '../lib/Supabase';

export default function ChatQuery({ mapStyles }) {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const toggleChatbox = () => {
    setIsOpen(!isOpen);
    if (successMessage) setSuccessMessage(null);
    if (errorMessage) setErrorMessage(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    // Basic validation
    if (!name.trim()) {
      setErrorMessage('Name is required.');
      setIsLoading(false);
      return;
    }
    if (!email.match(/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/)) {
      setErrorMessage('Please enter a valid email address.');
      setIsLoading(false);
      return;
    }
    if (!message.trim()) {
      setErrorMessage('Message is required.');
      setIsLoading(false);
      return;
    }

    try {
      // Insert query into Supabase
      const { data: { user } } = await supabase.auth.getUser();
      const { error: dbError } = await supabase.from('user_queries').insert([
        {
          user_id: user?.id || null,
          name: name.trim(),
          email: email.trim(),
          message: message.trim(),
        },
      ]);

      if (dbError) throw new Error(`Database error: ${dbError.message}`);

      setSuccessMessage('Your query has been submitted successfully! We will get back to you soon.');
      setName('');
      setEmail('');
      setMessage('');
    } catch (error) {
      console.error('Query submission error:', {
        message: error.message,
        stack: error.stack,
      });
      setErrorMessage('Failed to submit query. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      left: '20px',
      zIndex: 1000,
    }}>
      <style jsx>{`
        @keyframes slideIn {
          from { transform: translateX(-100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOut {
          from { transform: translateX(0); opacity: 1; }
          to { transform: translateX(-100%); opacity: 0; }
        }
        .chatbox {
          animation: ${isOpen ? 'slideIn' : 'slideOut'} 0.3s ease-in-out forwards;
        }
        .chat-button:hover {
          transform: scale(1.1);
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
        }
      `}</style>

      {/* Toggle Button */}
      <button
        onClick={toggleChatbox}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '60px',
          height: '60px',
          background: '#000000',
          color: '#ffffff',
          border: 'none',
          borderRadius: '50%',
          fontSize: '24px',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
        }}
        className="chat-button"
      >
        {isOpen ? '✕' : '💬'}
      </button>

      {/* Chatbox */}
      {isOpen && (
        <div
          className="chatbox"
          style={{
            width: '320px',
            background: 'rgba(255, 255, 255, 0.95)',
            borderRadius: '16px',
            padding: '24px',
            boxShadow: '0 8px 30px rgba(0, 0, 0, 0.2)',
            border: '1px solid rgba(0, 0, 0, 0.2)',
            marginTop: '12px',
            maxHeight: '500px',
            overflowY: 'auto',
          }}
        >
          <h3 style={{ ...mapStyles.contactTitle, color: '#000000' }}>Send Us a Query</h3>
          {errorMessage && (
            <p style={{ ...mapStyles.error, color: '#000000', background: 'rgba(255, 0, 0, 0.2)', borderColor: 'rgba(255, 0, 0, 0.4)' }}>
              {errorMessage}
            </p>
          )}
          {successMessage && (
            <p style={{ ...mapStyles.error, background: 'rgba(0, 128, 0, 0.2)', borderColor: 'rgba(0, 128, 0, 0.4)', color: '#000000' }}>
              {successMessage}
            </p>
          )}
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Your Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{ ...mapStyles.input, marginBottom: '12px' }}
              required
            />
            <input
              type="email"
              placeholder="Your Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ ...mapStyles.input, marginBottom: '12px' }}
              required
            />
            <textarea
              placeholder="Your Message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              style={{
                ...mapStyles.input,
                minHeight: '100px',
                resize: 'vertical',
                marginBottom: '12px',
              }}
              required
            />
            <button
              type="submit"
              disabled={isLoading}
              style={{
                ...mapStyles.primaryBtn,
                padding: '12px 24px',
                fontSize: '16px',
                width: '100%',
              }}
              className="hover-scale hover-glow"
            >
              {isLoading ? 'Submitting...' : 'Send Query'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}