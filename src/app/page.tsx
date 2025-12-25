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
      {/* ============================================
          HEADER
          ============================================ */}
      <header className={styles.header}>
        <div className={`container ${styles.headerContent}`}>
          <div className={styles.logo}>
            <span>Ellua</span>
          </div>
        </div>
      </header>

      {/* ============================================
          SECTION 1: HERO
          ============================================ */}
      <section className={styles.hero}>
        <div className="container">
          <h1 className={styles.heroTitle}>
            Quiet the <span className={styles.highlight}>food noise</span>
          </h1>
          <p className={styles.heroSubtitle}>
            Because &quot;just stop eating&quot; was never good advice.
          </p>
        </div>
      </section>

      {/* ============================================
          SECTION 2: PAIN ACKNOWLEDGMENT
          ============================================ */}
      <section className={styles.section}>
        <div className="container">
          <h2 className={styles.sectionTitle}>
            You&apos;re not broken.<br />
            <span className={styles.highlight}>Your brain is just stuck in a loop.</span>
          </h2>
          <p className={styles.sectionBody}>
            The late-night fridge visit. The &quot;why did I do that again?&quot; the next morning.
            The promise to do better. The slip. The shame.
          </p>
          <p className={styles.sectionBody}>
            It&apos;s not weakness. It&apos;s a pattern your brain learned to survive stress.
            <br /><strong>And patterns can be unlearned.</strong>
          </p>
        </div>
      </section>

      {/* ============================================
          SECTION 3: ROOT CAUSE
          ============================================ */}
      <section className={`${styles.section} ${styles.sectionAlt}`}>
        <div className="container">
          <h2 className={styles.sectionTitle}>
            The noise isn&apos;t the problem.<br />
            <span className={styles.highlight}>It&apos;s a signal.</span>
          </h2>
          <p className={styles.sectionBody}>
            When you feel stressed, bored, or overwhelmed, your brain remembers:
            <em>&quot;Food helped before.&quot;</em>
          </p>
          <p className={styles.sectionBody}>
            That memory becomes a craving. The craving becomes a tunnel.
            By the time you notice, you&apos;re already at the fridge.
          </p>
          <p className={styles.sectionEmphasis}>
            The only way out? Catching the signal before it becomes a tunnel.
          </p>
        </div>
      </section>

      {/* ============================================
          SECTION 4: OUTCOME VISION
          ============================================ */}
      <section className={styles.section}>
        <div className="container">
          <h2 className={styles.sectionTitle}>
            What if you could just... <span className={styles.highlight}>notice?</span>
          </h2>
          <p className={styles.sectionBody}>
            Imagine waking up without the weight of last night&apos;s choices.
            Feeling a craving rise—and watching it pass, like a wave.
            Not fighting. Not failing. Just... aware.
          </p>
          <p className={styles.sectionEmphasis}>
            That&apos;s what freedom from food noise feels like.
          </p>
        </div>
      </section>

      {/* ============================================
          SECTION 5: HOW ELLUA HELPS
          ============================================ */}
      <section className={`${styles.section} ${styles.sectionAlt}`}>
        <div className="container">
          <h2 className={styles.sectionTitle}>
            A quiet companion<br />
            <span className={styles.highlight}>for the loud moments.</span>
          </h2>
          <ul className={styles.benefitsList}>
            <li className={styles.benefitItem}>
              <span className={styles.benefitIcon}>⏸️</span>
              <span><strong>Catches you before the tunnel closes.</strong> A gentle nudge when your stress patterns spike.</span>
            </li>
            <li className={styles.benefitItem}>
              <span className={styles.benefitIcon}>💛</span>
              <span><strong>No judgment. No tracking. No diets.</strong> Just a space to understand what&apos;s really going on.</span>
            </li>
            <li className={styles.benefitItem}>
              <span className={styles.benefitIcon}>🧠</span>
              <span><strong>Learns your patterns.</strong> So it can meet you where you are—not where you &quot;should&quot; be.</span>
            </li>
          </ul>
        </div>
      </section>

      {/* ============================================
          SECTION 6: QUOTE / AUTHORITY
          ============================================ */}
      <section className={styles.quoteSection}>
        <div className="container">
          <blockquote className={styles.quote}>
            &quot;Willpower is not part of the equation. Habits are automatic. Awareness is the key.&quot;
          </blockquote>
          <p className={styles.quoteAuthor}>
            — Dr. Judson Brewer, Neuroscientist & Author of <em>The Craving Mind</em>
          </p>
        </div>
      </section>

      {/* ============================================
          SECTION 7: WAITLIST CTA
          ============================================ */}
      <section className={styles.ctaSection}>
        <div className="container">
          <h2 className={styles.ctaTitle}>Join when you&apos;re ready.</h2>
          <p className={styles.ctaSubtitle}>
            We&apos;re building Ellua for people who are tired of fighting themselves.
            <br />No spam. No pressure. Just early access when we launch.
          </p>

          {!isSuccess ? (
            <form onSubmit={handleSubmit} className={styles.waitlistForm}>
              <div className={styles.formRow}>
                <input
                  type="email"
                  className={styles.inputField}
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
                {signupCount > 0 ? `🎉 ${signupCount} people already waiting` : 'Be first to know when we launch.'} • No spam, ever.
              </p>
            </form>
          ) : (
            <div className={styles.successMessage}>
              <span className={styles.successIcon}>✨</span>
              <h3>You&apos;re on the list!</h3>
              <p>We&apos;ll notify you when your quiet space is ready.</p>
            </div>
          )}
        </div>
      </section>

      {/* ============================================
          FOOTER / DISCLAIMER
          ============================================ */}
      <footer className={styles.footer}>
        <div className="container">
          <p className={styles.disclaimer}>
            <strong>Important:</strong> Ellua is a self-care tool for building awareness around emotional eating. 
            It is not a medical app, does not diagnose or treat eating disorders, and is not a replacement for professional therapy. 
            If you&apos;re in crisis, please reach out to a healthcare provider.
          </p>
          <p className={styles.footerText}>
            © 2024 Ellua
          </p>
        </div>
      </footer>
    </div>
  );
}
