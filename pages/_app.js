import { useEffect, useState, useRef } from 'react';
import { createPagesBrowserClient } from '@supabase/auth-helpers-nextjs';
import { SessionContextProvider } from '@supabase/auth-helpers-react';
import { useRouter } from 'next/router';
import '../styles/globals.css';

export default function MyApp({ Component, pageProps }) {
  const [supabaseClient] = useState(() => createPagesBrowserClient());
  const [isNavigating, setIsNavigating] = useState(false);
  const router = useRouter();
  const navigationTimeoutRef = useRef(null);
  const lastRouteRef = useRef('');

  useEffect(() => {
    const getInitialSession = async () => {
      try {
        const { data: { session } } = await supabaseClient.auth.getSession();
        if (session) {
          console.log('Initial session found:', session.user?.email);
        } else {
          console.log('No initial session found');
          if (typeof window !== 'undefined') {
            localStorage.removeItem('supabase.auth.token');
          }
        }
      } catch (error) {
        console.warn('Session check failed:', error.message);
      }
    };

    getInitialSession();

    const { data: { subscription } } = supabaseClient.auth.onAuthStateChange((event, session) => {
      console.log('Auth state changed:', event, session?.user?.email || 'undefined');
      if (event === 'SIGNED_OUT' && router.pathname === '/dashboard' && lastRouteRef.current !== '/') {
        setIsNavigating(true);
        router.push('/').then(() => setIsNavigating(false));
      }
    });

    return () => subscription.unsubscribe();
  }, [supabaseClient, router]);

  useEffect(() => {
    const handleRouteChangeStart = (url) => {
      console.log('Navigation started to:', url);
      setIsNavigating(true);
      if (navigationTimeoutRef.current) clearTimeout(navigationTimeoutRef.current);
    };
    const handleRouteChangeComplete = (url) => {
      console.log('Navigation completed to:', url);
      lastRouteRef.current = url;
      navigationTimeoutRef.current = setTimeout(() => setIsNavigating(false), 100);
    };
    const handleRouteChangeError = (err, url) => {
      console.error('Navigation error to:', url, err);
      setIsNavigating(false);
    };
    router.events.on('routeChangeStart', handleRouteChangeStart);
    router.events.on('routeChangeComplete', handleRouteChangeComplete);
    router.events.on('routeChangeError', handleRouteChangeError);
    return () => {
      router.events.off('routeChangeStart', handleRouteChangeStart);
      router.events.off('routeChangeComplete', handleRouteChangeComplete);
      router.events.off('routeChangeError', handleRouteChangeError);
      if (navigationTimeoutRef.current) clearTimeout(navigationTimeoutRef.current);
    };
  }, [router]);

  return (
    <SessionContextProvider supabaseClient={supabaseClient} initialSession={pageProps.initialSession}>
      {isNavigating && (
        <div className="navigation-overlay">
          <div className="navigation-spinner">
            <div className="spinner"></div>
            <p>Loading...</p>
          </div>
        </div>
      )}
      <Component {...pageProps} />
      <style jsx global>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        html, body { font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; scroll-behavior: smooth; }
        body { margin: 0; padding: 0; line-height: 1.6; color: #333; }
        *:focus { outline: 2px solid #4CAF50; outline-offset: 2px; }
        button:focus { outline-offset: 4px; }
        .navigation-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(15, 15, 35, 0.95); display: flex; justify-content: center; align-items: center; z-index: 10000; backdrop-filter: blur(10px); }
        .navigation-spinner { text-align: center; color: white; }
        .navigation-spinner .spinner { width: 40px; height: 40px; border: 3px solid rgba(255, 255, 255, 0.3); border-top: 3px solid #ffffff; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 15px; }
        .navigation-spinner p { font-size: 16px; font-weight: 500; margin: 0; }
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        /* Add full CSS from original as needed */
      `}</style>
    </SessionContextProvider>
  );
}