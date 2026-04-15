export default function Home() {
  return (
    <main>
      {/* NAV */}
      <nav>
        <a className="nav-logo" href="/">
          <img src="/logo.png" alt="The Pickleball Helpline logo" />
          <span>The Pickleball Helpline</span>
        </a>
      </nav>

      {/* HERO */}
      <section className="hero">
        <div className="hero-inner">
          <div className="hero-pill">
            <span className="pill-dot"></span>
            Remote Pickleball Coaching
          </div>
          <h1>See What You've Been Missing</h1>
          <div className="hero-image">
            <img src="/hero.png" alt="Remote pickleball coaching session" />
          </div>
          <p className="hero-sub">
            When you're playing, everything moves too fast to process.<br />
            We’ll watch your game together and break down exactly what’s happening—and what to do instead.
          </p>
          <a href="/booking" className="btn-primary">
            Book a Session
          </a>
        </div>
      </section>

      {/* WHAT TO EXPECT */}
      <section id="what-to-expect" className="what-you-get">
        <h2>What to Expect</h2>
        <div className="cards">
          <div className="card">
            <h3>45-Minute Coaching Session</h3>
            <p>A live, one-on-one session where we pause and review key moments in your game.</p>
          </div>
          <div className="card">
            <h3>Personalized Feedback</h3>
            <p>We look at your technique, court positioning, and shot decisions.</p>
          </div>
          <div className="card">
            <h3>Written Action Plan</h3>
            <p>A follow-up summary with key takeaways and drills based on your session.</p>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section id="testimonials" className="testimonials">
        <h2>What Players Are Saying</h2>
        <div className="testimonial-carousel">
          <div className="testimonial-track-wrap">
            <div className="testimonial-track">
              <div className="testimonial-page">
                <div className="testimonial">
                  <p className="testimonial-text">
                    "Working with AJ remotely has been a game changer. I finally understood what was going wrong and why."
                  </p>
                  <p className="testimonial-author">— Lille F.</p>
                </div>
              </div>
              <div className="testimonial-page">
                <div className="testimonial">
                  <p className="testimonial-text">
                    "Seeing my actual patterns, decision-making, and positioning on video gave me a level of awareness I just couldn't get while playing in real time"
                  </p>
                  <p className="testimonial-author">— Marcel P.</p>
                </div>
              </div>
              <div className="testimonial-page">
                <div className="testimonial">
                  <p className="testimonial-text">
                    "Instead of general advice, AJ showed me exactly where I could improve."
                  </p>
                  <p className="testimonial-author">— Molly D.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="about">
        <div className="about-inner">
          <h2>Coach AJ</h2>
          <div className="coach-photo">
            <img src="/coach.jpg" alt="Coach AJ" loading="lazy" />
          </div>
          <p className="about-text">
            <strong>Founder of The Pickleball Helpline</strong>
            <span className="pipe"> | </span>
            <strong>PPR Certified</strong>
            <span className="pipe"> | </span>
            <strong>
              Coach at{" "}
              <a
                href="https://smashdinkpickleball.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                Smash Dink
              </a>
            </strong>
          </p>
          <h2 className="contact-title">Got a pickleball question?</h2>
          <a href="mailto:aj@thepickleballhelpline.com" className="contact-email">
            aj@thepickleballhelpline<span className="nowrap">.com</span>
          </a>
        </div>
      </section>

      {/* FOOTER */}
      <footer>
        <div className="footer-socials">
          <a
            href="https://www.instagram.com/pickleballhelpline/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
          >
            Instagram
          </a>
          <a
            href="https://www.facebook.com/groups/pickleballhelplinecommunity"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Facebook"
          >
            Facebook
          </a>
          <a
            href="https://www.youtube.com/@thepickleballhelpline"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="YouTube"
          >
            YouTube
          </a>
          <a
            href="https://www.tiktok.com/@pickleballhelpline"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="TikTok"
          >
            TikTok
          </a>
        </div>
        <p className="footer-copy">© 2026 The Pickleball Helpline. All rights reserved.</p>
      </footer>
    </main>
  );
}