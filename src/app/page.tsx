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
      {/* HEADER */}
      <header className={styles.header}>
        <div className={`container ${styles.headerContent}`}>
          <div className={styles.logo}>Ellua</div>
        </div>
      </header>

      {/* HERO SECTION (Two Columns) */}
      <section className={styles.hero}>
        <div className={`container ${styles.heroGrid}`}>
          
          {/* Left: Text Content */}
          <div className={styles.heroText}>
            <h1 className={styles.title}>
              Quiet the <span className={styles.highlight}>food noise</span>
            </h1>
            <p className={styles.subtitle}>
              Because &quot;just stop eating&quot; was never good advice.
            </p>
            
            <p className={styles.painText}>
              The late-night fridge. The shame. The &quot;why did I do that again?&quot;
              <br />
              <strong>It&apos;s not weakness—it&apos;s a pattern. And patterns can be unlearned.</strong>
            </p>

            {/* Benefits */}
            <ul className={styles.benefits}>
              <li>⏸️ <strong>Catches you</strong> before the craving takes over</li>
              <li>💛 <strong>No judgment</strong>—just a space to understand</li>
              <li>🧠 <strong>Learns your patterns</strong> to meet you where you are</li>
            </ul>

            {/* Waitlist Form */}
            {!isSuccess ? (
              <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.formRow}>
                  <input
                    type="email"
                    className={styles.input}
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
                    {isLoading ? 'Joining...' : 'Join Waitlist'}
                  </button>
                </div>
                {error && <p className={styles.error}>{error}</p>}
                <p className={styles.formNote}>
                  {signupCount > 0 ? `🎉 ${signupCount} people waiting` : 'Be first to know.'} • No spam.
                </p>
              </form>
            ) : (
              <div className={styles.success}>
                <span>✨</span>
                <div>
                  <strong>You&apos;re on the list!</strong>
                  <p>We&apos;ll notify you when Ellua is ready.</p>
                </div>
              </div>
            )}
          </div>

          {/* Right: Screenshot Placeholder */}
          <div className={styles.heroVisual}>
            <div className={styles.phone}>
              <span className={styles.phoneLabel}>App Screenshot</span>
              <div className={styles.phoneIcon}>📱</div>
            </div>
            <div className={styles.phoneShadow}></div>
          </div>
        </div>
      </section>

      {/* QUOTE SECTION */}
      <section className={styles.quote}>
        <div className="container">
          <blockquote>
            &quot;Willpower is not part of the equation. Habits are automatic. Awareness is the key.&quot;
          </blockquote>
          <cite>— Dr. Judson Brewer, Neuroscientist</cite>
        </div>
      </section>

      {/* FOOTER / DISCLAIMER */}
      <footer className={styles.footer}>
        <div className="container">
          <p className={styles.disclaimer}>
            Ellua is a self-care tool for emotional eating awareness. 
            Not a medical app. Not a replacement for therapy.
          </p>
          <p className={styles.copyright}>© 2024 Ellua</p>
        </div>
      </footer>
    </div>
  );
}
