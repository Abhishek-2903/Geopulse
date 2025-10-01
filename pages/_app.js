import { useEffect } from 'react';
import { createPagesBrowserClient } from '@supabase/auth-helpers-nextjs';
import { SessionContextProvider } from '@supabase/auth-helpers-react';
import { useRouter } from 'next/router';
import '../styles/globals.css';

export default function MyApp({ Component, pageProps }) {
  const supabaseClient = createPagesBrowserClient();
  const router = useRouter();

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
      if (event === 'SIGNED_OUT' && router.pathname === '/dashboard') {
        router.push('/');
      }
    });

    return () => subscription.unsubscribe();
  }, [supabaseClient, router]);

  return (
    <SessionContextProvider supabaseClient={supabaseClient} initialSession={pageProps.initialSession}>
      <Component {...pageProps} />
    </SessionContextProvider>
  );
}
