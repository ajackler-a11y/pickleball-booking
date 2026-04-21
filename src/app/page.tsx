"use client";
import { useState } from "react";

function VideoCard({ id }: { id: string }) {
  const [playing, setPlaying] = useState(false);
  const thumbnail = `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;

  return (
    <div className="video-card" onClick={() => setPlaying(true)}>
      <div className="video-wrapper">
        {playing ? (
          <iframe
            src={`https://www.youtube.com/embed/${id}?autoplay=1&rel=0`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <>
            <img
              src={thumbnail}
              alt="Video thumbnail"
              style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", objectFit: "cover", cursor: "pointer" }}
            />
            <div className="play-button">
              <svg viewBox="0 0 24 24" fill="white" width="32" height="32">
                <path d="M8 5v14l11-7z"/>
              </svg>
            </div>
          </>
        )}
      </div>
    </div>
  );
}


export default function Home() {
  const videos = [
    { id: "2OUkve3bNsU", tag: "Tip", title: "Quick tip from Coach AJ" },
    { id: "k6Di8zB4VKU", tag: "Tip", title: "Quick tip from Coach AJ" },
    { id: "Skr4ihSPyAQ", tag: "Tip", title: "Quick tip from Coach AJ" },
  ];

  return (
    <main>
      {/* NAV */}
      <nav>
        <a className="nav-logo" href="/">
          <img src="/logo.png" alt="The Pickleball Helpline logo" />
          <span>The Pickleball Helpline</span>
        </a>
        <div className="nav-socials">
          <span className="nav-socials-label">Follow for pickleball tips</span>
          <a href="https://www.instagram.com/pickleballhelpline/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M7 2C4.2 2 2 4.2 2 7v10c0 2.8 2.2 5 5 5h10c2.8 0 5-2.2 5-5V7c0-2.8-2.2-5-5-5H7zm10 2c1.7 0 3 1.3 3 3v10c0 1.7-1.3 3-3 3H7c-1.7 0-3-1.3-3-3V7c0-1.7 1.3-3 3-3h10zm-5 3a5 5 0 100 10 5 5 0 000-10zm0 2.5a2.5 2.5 0 110 5 2.5 2.5 0 010-5zm4.8-2.8a1 1 0 100 2 1 1 0 000-2z"/></svg>
          </a>
          <a href="https://www.facebook.com/groups/pickleballhelplinecommunity" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M22 12a10 10 0 10-11.6 9.9v-7H8v-3h2.4V9.7c0-2.4 1.4-3.7 3.5-3.7 1 0 2 .2 2 .2v2.2h-1.1c-1.1 0-1.4.7-1.4 1.4V12H16l-.4 3h-2.3v7A10 10 0 0022 12z"/></svg>
          </a>
          <a href="https://www.youtube.com/@thepickleballhelpline" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M23 7s-.2-1.5-.8-2.2c-.7-.8-1.5-.8-1.9-.9C17.7 3.5 12 3.5 12 3.5s-5.7 0-8.3.4c-.4 0-1.2.1-1.9.9C1.2 5.5 1 7 1 7S.8 8.8.8 10.6v1.7c0 1.8.2 3.6.2 3.6s.2 1.5.8 2.2c.7.8 1.7.8 2.1.9 1.5.1 6.1.4 8.1.4s5.7 0 8.3-.4c.4 0 1.2-.1 1.9-.9.6-.7.8-2.2.8-2.2s.2-1.8.2-3.6v-1.7C23.2 8.8 23 7 23 7zM9.8 14.6V8.9l5.6 2.8-5.6 2.9z"/></svg>
          </a>
          <a href="https://www.tiktok.com/@pickleballhelpline" target="_blank" rel="noopener noreferrer" aria-label="TikTok">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2c1.1 0 2 .9 2 2v2.3c1.2 1 2.7 1.7 4.3 1.7v3.2c-1.7 0-3.3-.5-4.8-1.3v6.6c0 3.3-2.7 6-6 6S1.5 19.8 1.5 16.5 4.2 10.5 7.5 10.5c.5 0 1 .1 1.5.2v3.3c-.4-.2-.9-.3-1.5-.3-1.6 0-2.8 1.3-2.8 2.8S5.9 19.3 7.5 19.3 10.3 18 10.3 16.5V2H12z"/></svg>
          </a>
        </div>
      </nav>

      {/* HERO */}
      <section className="hero">
        <div className="hero-media">
          <img src="/hero.jpg" alt="" className="hero-img hero-img-desktop" />
          <div className="hero-overlay" />
        </div>
        <div className="hero-inner">
          <h1>Frustrated with{" "}<br className="mobile-break" />your pickleball game?</h1>
          <p className="hero-sub">We review your gameplay together so you can clearly see what's going on and fix it.</p>
          <div className="hero-cta-group">
            <a href="#booking" className="btn-primary">Get My Game Reviewed <span>→</span></a>
            <p className="hero-price">45-minute session · $120</p>
          </div>
          <div className="hero-testimonial">
            <img src="/Lille.png" alt="Lille Formigli" className="hero-testimonial-photo" />
            <div className="hero-testimonial-text">
              <p className="hero-testimonial-quote">"I recognized habits I didn't even know I had."</p>
              <p className="hero-testimonial-name">— Lille F.</p>
            </div>
          </div>
        </div>
      </section>

      {/* BOOKING */}
<section id="booking" className="booking">
  <div className="booking-inner">
    <h2>Book Your Game Review</h2>
    <p>Choose a time and let's break down your game together.</p>

    {/* TEMP BUTTON (replace later with real booking system) */}
    <a href="mailto:aj@thepickleballhelpline.com" className="btn-primary">
      Book via Email →
    </a>
  </div>
</section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="how-it-works">
        <h2>How It Works</h2>
        <div className="cards">
          <div className="card">
            <h3>1. Send Me Your Game</h3>
            <p>Film one full game on your phone and send me the link. No editing needed.</p>
          </div>
          <div className="card">
            <h3>2. We Review It Together</h3>
            <p>We review your footage live on a 45-minute call. Pause key moments and clearly see what's actually happening.</p>
          </div>
          <div className="card">
            <h3>3. Get Your Action Plan</h3>
            <p>You leave with clear takeaways and what to focus on next. Plus drills you can start using right away.</p>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section id="testimonials" className="testimonials">
        <h2>What Players Are Saying</h2>
        <div className="testimonials-grid">
          <div className="testimonial">
            <p className="testimonial-text">AJ pauses at key moments, and explains the small adjustments that make a big difference.</p>
            <div className="testimonial-footer">
              <img src="/marcell.png" alt="Marcel P." className="testimonial-photo" />
              <span className="testimonial-author">Marcel P.</span>
            </div>
          </div>
          <div className="testimonial">
            <p className="testimonial-text">The follow-up summary and suggested drills made it really easy to turn those insights into real improvement.</p>
            <div className="testimonial-footer">
              <img src="/lille.png" alt="Lille F." className="testimonial-photo" />
              <span className="testimonial-author">Lille F.</span>
            </div>
          </div>
          <div className="testimonial">
            <p className="testimonial-text">Seeing the footage slowed down made everything clear.</p>
            <div className="testimonial-footer">
              <img src="/lille.png" alt="Michael R." className="testimonial-photo" />
              <span className="testimonial-author">Michael R.</span>
            </div>
          </div>
        </div>
        <div className="section-cta">
          <p className="section-cta-text">Stop guessing. Start improving.</p>
          <a href="#booking" className="btn-primary">Get My Game Reviewed →</a>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="about">
        <div className="about-inner">
          <div className="about-layout">
            <div className="about-image-wrap">
              <img src="/coach.jpg" alt="Coach AJ" className="coach-photo" />
            </div>
            <div className="about-content">
              <h2>Coach AJ</h2>
              <p className="coach-credentials">The Pickleball Helpline</p>
              <p className="coach-description">With over 25 years in the health and fitness industry, AJ is a PPR Certified Coach and Smash Dink Instructor who combines technique, strategy, and mindset — and loves that moment when it finally clicks for a player.</p>
              <p className="coach-brand-line">Have a question before you book?</p>
              <a href="mailto:aj@thepickleballhelpline.com" className="coach-email">aj@thepickleballhelpline.com</a>
            </div>
          </div>
        </div>
      </section>

      {/* VIDEOS */}
<section className="videos">
  <h2 className="videos-title">Quick tips from Coach AJ</h2>
  <div className="videos-grid">
    {videos.map((video) => (
      <VideoCard key={video.id} id={video.id} />
    ))}
  </div>
</section>

      {/* FOOTER */}
      <footer>
        <div className="footer-socials">
          <a href="https://www.instagram.com/pickleballhelpline/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M7 2C4.2 2 2 4.2 2 7v10c0 2.8 2.2 5 5 5h10c2.8 0 5-2.2 5-5V7c0-2.8-2.2-5-5-5H7zm10 2c1.7 0 3 1.3 3 3v10c0 1.7-1.3 3-3 3H7c-1.7 0-3-1.3-3-3V7c0-1.7 1.3-3 3-3h10zm-5 3a5 5 0 100 10 5 5 0 000-10zm0 2.5a2.5 2.5 0 110 5 2.5 2.5 0 010-5zm4.8-2.8a1 1 0 100 2 1 1 0 000-2z"/></svg>
          </a>
          <a href="https://www.facebook.com/groups/pickleballhelplinecommunity" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M22 12a10 10 0 10-11.6 9.9v-7H8v-3h2.4V9.7c0-2.4 1.4-3.7 3.5-3.7 1 0 2 .2 2 .2v2.2h-1.1c-1.1 0-1.4.7-1.4 1.4V12H16l-.4 3h-2.3v7A10 10 0 0022 12z"/></svg>
          </a>
          <a href="https://www.youtube.com/@thepickleballhelpline" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M23 7s-.2-1.5-.8-2.2c-.7-.8-1.5-.8-1.9-.9C17.7 3.5 12 3.5 12 3.5s-5.7 0-8.3.4c-.4 0-1.2.1-1.9.9C1.2 5.5 1 7 1 7S.8 8.8.8 10.6v1.7c0 1.8.2 3.6.2 3.6s.2 1.5.8 2.2c.7.8 1.7.8 2.1.9 1.5.1 6.1.4 8.1.4s5.7 0 8.3-.4c.4 0 1.2-.1 1.9-.9.6-.7.8-2.2.8-2.2s.2-1.8.2-3.6v-1.7C23.2 8.8 23 7 23 7zM9.8 14.6V8.9l5.6 2.8-5.6 2.9z"/></svg>
          </a>
          <a href="https://www.tiktok.com/@pickleballhelpline" target="_blank" rel="noopener noreferrer" aria-label="TikTok">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2c1.1 0 2 .9 2 2v2.3c1.2 1 2.7 1.7 4.3 1.7v3.2c-1.7 0-3.3-.5-4.8-1.3v6.6c0 3.3-2.7 6-6 6S1.5 19.8 1.5 16.5 4.2 10.5 7.5 10.5c.5 0 1 .1 1.5.2v3.3c-.4-.2-.9-.3-1.5-.3-1.6 0-2.8 1.3-2.8 2.8S5.9 19.3 7.5 19.3 10.3 18 10.3 16.5V2H12z"/></svg>
          </a>
        </div>
        <p className="footer-copy">© 2026 The Pickleball Helpline</p>
      </footer>
    </main>
  );
}