'use client';

import { useState, useEffect } from 'react';
import styles from './page.module.css';

// Supabase Configuration
const SUPABASE_URL = 'https://cvlbsdzdrwdpdhpehgos.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN2bGJzZHpkcndkcGRocGVoZ29zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ4ODAyMTEsImV4cCI6MjA4MDQ1NjIxMX0.4cGYEpAlEdPQJImAmgi3uf8V18vG5qn3Hzu_9r5HJTs';

export default function Home() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [signupCount, setSignupCount] = useState(0);
  const [error, setError] = useState('');

  // Load signup count on mount
  useEffect(() => {
    loadSignupCount();
  }, []);

  async function loadSignupCount() {
    try {
      const response = await fetch(`${SUPABASE_URL}/rest/v1/waitlist?select=id`, {
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setSignupCount(data.length || 0);
      }
    } catch (err) {
      console.log('Could not load count:', err);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    
    const trimmedEmail = email.trim().toLowerCase();
    if (!trimmedEmail || !isValidEmail(trimmedEmail)) {
      setError('Please enter a valid email');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${SUPABASE_URL}/rest/v1/waitlist`, {
        method: 'POST',
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify({ email: trimmedEmail })
      });

      if (response.ok || response.status === 201 || response.status === 409) {
        setIsSuccess(true);
        setSignupCount(prev => prev + 1);
      } else {
        const data = await response.json();
        if (data.code === '23505') {
          // Duplicate - still show success
          setIsSuccess(true);
        } else {
          setError('Something went wrong. Please try again.');
        }
      }
    } catch (err) {
      console.error('Network error:', err);
      setError('Connection error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }

  function isValidEmail(email: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  return (
    <div className={styles.page}>
      {/* Header */}
      <header className={styles.header}>
        <div className={`container ${styles.headerContent}`}>
          <div className={styles.logo}>
            <span>Ellua</span>
          </div>
        </div>
      </header>

      {/* Main One-Pager Content */}
      <main className={styles.main}>
        <div className={`container ${styles.contentGrid}`}>
          
          {/* Left Column: Text & Form */}
          <div className={styles.textContent}>
            <h1 className={styles.title}>
              Quiet the <span className={styles.highlight}>food noise</span>
            </h1>
            <p className={styles.subtitle}>
              Stop fighting the urge. Start understanding it. <br/>
              A compassionate space to break the binge-shame cycle.
            </p>

            {/* Key Benefits (Condensed) */}
            <ul className={styles.benefitsList}>
              <li className={styles.benefitItem}>
                <span className={styles.benefitIcon}>⏸️</span>
                <span><strong>Catch the autopilot</strong> before it takes over</span>
              </li>
              <li className={styles.benefitItem}>
                <span className={styles.benefitIcon}>❤️</span>
                <span><strong>End the shame spiral</strong> with zero judgment</span>
              </li>
              <li className={styles.benefitItem}>
                <span className={styles.benefitIcon}>💡</span>
                <span><strong>See hidden patterns</strong> behind your cravings</span>
              </li>
            </ul>

            {/* Waitlist Form */}
            {!isSuccess ? (
              <form onSubmit={handleSubmit} className={styles.waitlistForm}>
                <div className={styles.formRow}>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    disabled={isLoading}
                  />
                  <button 
                    type="submit" 
                    className={`btn btn-primary ${isLoading ? styles.loading : ''}`}
                    disabled={isLoading}
                  >
                    {isLoading ? 'Join Waitlist' : 'Join Waitlist'}
                  </button>
                </div>
                {error && <p className={styles.error}>{error}</p>}
                
                <p className={styles.formNote}>
                  {signupCount > 0 ? `🎉 ${signupCount} people joined` : 'Be first to know when we launch.'} • No spam, ever.
                </p>
              </form>
            ) : (
              <div className={styles.successMessage}>
                <span className={styles.successIcon}>✨</span>
                <h3>You&apos;re on the list!</h3>
                <p>We&apos;ll notify you when your safe space is ready.</p>
              </div>
            )}
          </div>

          {/* Right Column: Visual */}
          <div className={styles.visualContent}>
             {/* Screenshot Placeholder */}
             <div className={styles.screenshotPlaceholder}>
              <span className={styles.placeholderText}>App Screenshot</span>
              <div className={styles.placeholderIcon}>📱</div>
            </div>
            {/* Subtle logo behind screenshot */}
            <div className={styles.decorCircle}></div>
          </div>

        </div>
      </main>

      {/* Footer (Minimal) */}
      <footer className={styles.footer}>
        <p className={styles.footerText}>
          © 2024 Ellua. Not a medical advice app.
        </p>
      </footer>
    </div>
  );
}
