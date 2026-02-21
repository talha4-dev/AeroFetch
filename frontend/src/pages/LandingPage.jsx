import { useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import AnimatedBackground from '../components/AnimatedBackground';
import NavBar from '../components/NavBar';
import DownloadForm from '../components/DownloadForm';
import { useAuth } from '../context/AuthContext';

gsap.registerPlugin(ScrollTrigger);

const PLATFORMS = [
    { icon: '🎬', name: 'YouTube', color: '#ff0000' },
    { icon: '🎵', name: 'TikTok', color: '#00d4aa' },
    { icon: '📘', name: 'Facebook', color: '#1877f2' },
    { icon: '📸', name: 'Instagram', color: '#e1306c' },
    { icon: '🐦', name: 'Twitter/X', color: '#1da1f2' },
    { icon: '🎥', name: 'Vimeo', color: '#1ab7ea' },
];

const HOW_IT_WORKS = [
    { step: '01', icon: '🔗', title: 'Paste Your Link', desc: 'Copy any video URL from YouTube, TikTok, or Facebook and paste it into the input field above.' },
    { step: '02', icon: '🎯', title: 'Choose Quality', desc: 'Select your preferred format — 4K, 1080p, 720p, MP3, M4A — and let AeroFetch handle the rest.' },
    { step: '03', icon: '⬇️', title: 'Download instantly', desc: 'Click download and your file starts immediately. No signup required for public videos.' },
];

export default function LandingPage() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const heroRef = useRef(null);
    const badgesRef = useRef(null);
    const howRef = useRef(null);

    useEffect(() => {
        if (user) { navigate('/dashboard'); return; }

        const ctx = gsap.context(() => {
            gsap.from('.hero-tag', { opacity: 0, y: -20, duration: 0.6, ease: 'power2.out' });
            gsap.from('.hero-heading', { opacity: 0, y: 40, duration: 0.8, delay: 0.15, ease: 'power2.out' });
            gsap.from('.hero-sub', { opacity: 0, y: 30, duration: 0.6, delay: 0.35, ease: 'power2.out' });
            gsap.from('.hero-form', { opacity: 0, y: 40, scale: 0.98, duration: 0.7, delay: 0.5, ease: 'power3.out' });
            gsap.from('.platform-pill', { opacity: 0, y: 20, stagger: 0.08, duration: 0.5, delay: 0.9, ease: 'back.out(1.5)' });

            gsap.from('.how-step', {
                scrollTrigger: { trigger: '.how-section', start: 'top 75%' },
                opacity: 0, y: 40, stagger: 0.15, duration: 0.6, ease: 'power2.out',
            });

            gsap.from('.trust-badge', {
                scrollTrigger: { trigger: '.trust-section', start: 'top 80%' },
                opacity: 0, scale: 0.9, stagger: 0.1, duration: 0.5, ease: 'back.out(1.4)',
            });
        });

        return () => ctx.revert();
    }, [user]);

    return (
        <div className="landing-page">
            <AnimatedBackground />
            <NavBar />

            {/* ━━━ HERO ━━━ */}
            <section className="hero-section" ref={heroRef}>
                <div className="hero-inner">
                    <div className="hero-tag badge badge-brand">
                        ✨ Premium Video Downloader
                    </div>
                    <h1 className="hero-heading">
                        Download Any Video,<br />
                        <span className="gradient-text">Any Platform.</span>
                    </h1>
                    <p className="hero-sub">
                        AeroFetch gives you lightning-fast downloads from YouTube, TikTok, Facebook and more —
                        in 4K, 1080p, MP3, and every format you need.
                    </p>

                    <div className="hero-form glass-card">
                        <DownloadForm />
                    </div>

                    <div className="platform-pills">
                        {PLATFORMS.map(p => (
                            <div className="platform-pill" key={p.name}>
                                <span>{p.icon}</span>
                                <span>{p.name}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ━━━ HOW IT WORKS ━━━ */}
            <section className="how-section" id="how-it-works">
                <div className="section-container">
                    <div className="section-header">
                        <span className="badge badge-teal">Simple Process</span>
                        <h2 className="how-title">How AeroFetch Works</h2>
                        <p className="how-sub">Three steps to get your video. That's it.</p>
                    </div>
                    <div className="how-grid">
                        {HOW_IT_WORKS.map((item, i) => (
                            <div key={i} className="how-step glass-card">
                                <div className="how-step-number">{item.step}</div>
                                <div className="how-icon">{item.icon}</div>
                                <h3 className="how-step-title">{item.title}</h3>
                                <p className="how-step-desc">{item.desc}</p>
                                {i < HOW_IT_WORKS.length - 1 && <div className="how-arrow">→</div>}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ━━━ FEATURES ━━━ */}
            <section id="features" className="features-section">
                <div className="section-container">
                    <div className="section-header">
                        <span className="badge badge-brand">Why AeroFetch</span>
                        <h2 className="how-title">Built for speed. Designed for you.</h2>
                    </div>
                    <div className="features-grid">
                        {[
                            { icon: '⚡', title: 'Lightning Fast', desc: 'Powered by yt-dlp, the fastest downloading engine available.' },
                            { icon: '🎯', title: 'Multi-Platform', desc: '6+ platforms supported. YouTube, TikTok, Facebook, and more.' },
                            { icon: '🎨', title: '4K Quality', desc: 'Get the highest quality available — up to 4K Ultra HD.' },
                            { icon: '🔒', title: 'Secure & Private', desc: 'All URLs are sanitized. No data stored without your consent.' },
                            { icon: '🎵', title: 'Audio Extraction', desc: 'Extract MP3 or M4A with the best audio quality available.' },
                            { icon: '📦', title: 'Batch Downloads', desc: 'Download multiple videos at once with the batch processor.' },
                        ].map((f, i) => (
                            <div key={i} className="feature-card glass-card">
                                <div className="feature-icon">{f.icon}</div>
                                <h4 className="feature-title">{f.title}</h4>
                                <p className="feature-desc">{f.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ━━━ TRUST BADGES ━━━ */}
            <section className="trust-section">
                <div className="section-container">
                    <div className="trust-row">
                        {[
                            { icon: '🔐', text: 'SSL Secured' },
                            { icon: '🚫', text: 'No Malware' },
                            { icon: '🆓', text: 'Free to Use' },
                            { icon: '📵', text: 'No Sign-up Required' },
                            { icon: '💨', text: 'No Speed Limits' },
                        ].map((b, i) => (
                            <div key={i} className="trust-badge">
                                <span style={{ fontSize: '20px' }}>{b.icon}</span>
                                <span>{b.text}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ━━━ CTA ━━━ */}
            <section className="cta-section">
                <div className="section-container">
                    <div className="cta-card glass-card">
                        <h2>Ready to download smarter?</h2>
                        <p>Create a free account and unlock batch downloads, history, and premium quality options.</p>
                        <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
                            <Link to="/auth?mode=register" className="btn-primary" style={{ padding: '16px 36px', fontSize: '16px' }}>
                                Get Started Free →
                            </Link>
                            <Link to="/auth" className="btn-secondary" style={{ padding: '16px 28px' }}>
                                Log In
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* ━━━ FOOTER ━━━ */}
            <footer className="footer">
                <div className="section-container">
                    <div className="footer-inner">
                        <div className="footer-brand">
                            <span className="navbar-logo-text" style={{ fontSize: '18px', fontFamily: 'var(--font-display)', fontWeight: 800 }}>
                                Aero<span className="gradient-text">Fetch</span>
                            </span>
                            <p>Premium video downloads, made simple.</p>
                        </div>
                        <div className="footer-links">
                            <a href="#how-it-works">How It Works</a>
                            <a href="#features">Features</a>
                            <Link to="/auth">Login</Link>
                            <Link to="/auth?mode=register">Register</Link>
                        </div>
                    </div>
                    <p className="footer-copy">© 2024 AeroFetch. Built with ♥ for the web.</p>
                </div>
            </footer>

            <style>{`
        .landing-page { min-height: 100vh; position: relative; }
        .hero-section {
          min-height: 100vh; display: flex; align-items: center; justify-content: center;
          padding: calc(var(--navbar-height) + 60px) 24px 80px;
          position: relative; z-index: 1;
        }
        .hero-inner {
          max-width: 820px; margin: 0 auto; text-align: center;
          display: flex; flex-direction: column; align-items: center; gap: 24px;
        }
        .hero-tag { font-size: 13px; }
        .hero-heading {
          font-family: var(--font-display); font-size: clamp(42px, 7vw, 82px);
          font-weight: 900; line-height: 1.05; letter-spacing: -0.03em;
        }
        .hero-sub { font-size: clamp(16px, 2.5vw, 19px); color: var(--text-secondary); max-width: 600px; line-height: 1.7; }
        .hero-form { width: 100%; max-width: 700px; padding: 28px 32px; }
        .platform-pills { display: flex; gap: 10px; flex-wrap: wrap; justify-content: center; }
        .platform-pill {
          display: flex; align-items: center; gap: 6px;
          padding: 7px 16px; background: var(--bg-card);
          border: 1px solid var(--border-color); border-radius: var(--radius-pill);
          font-size: 13px; font-weight: 600; color: var(--text-secondary);
          transition: all var(--transition);
        }
        .platform-pill:hover { border-color: var(--brand-primary); color: var(--brand-primary); transform: translateY(-2px); }

        .section-container { max-width: 1200px; margin: 0 auto; padding: 0 24px; }
        .section-header { text-align: center; margin-bottom: 48px; display: flex; flex-direction: column; align-items: center; gap: 14px; }
        .how-title { font-size: clamp(28px, 4vw, 44px); font-weight: 800; font-family: var(--font-display); }
        .how-sub { color: var(--text-secondary); font-size: 17px; }

        .how-section { padding: 100px 0; position: relative; z-index: 1; }
        .how-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 24px; position: relative; }
        .how-step { padding: 32px 28px; display: flex; flex-direction: column; gap: 12px; position: relative; }
        .how-step-number { font-size: 11px; font-weight: 800; color: var(--brand-primary); letter-spacing: 0.1em; }
        .how-icon { font-size: 36px; }
        .how-step-title { font-size: 18px; font-weight: 700; font-family: var(--font-display); }
        .how-step-desc { font-size: 14px; color: var(--text-secondary); line-height: 1.7; }
        .how-arrow {
          position: absolute; right: -20px; top: 50%; transform: translateY(-50%);
          font-size: 24px; color: var(--text-muted); z-index: 2;
        }

        .features-section { padding: 80px 0; position: relative; z-index: 1; }
        .features-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 20px; }
        .feature-card { padding: 28px 24px; display: flex; flex-direction: column; gap: 10px; transition: transform var(--transition); }
        .feature-card:hover { transform: translateY(-4px); }
        .feature-icon { font-size: 30px; }
        .feature-title { font-size: 16px; font-weight: 700; }
        .feature-desc { font-size: 13px; color: var(--text-secondary); line-height: 1.6; }

        .trust-section { padding: 60px 0; position: relative; z-index: 1; }
        .trust-row { display: flex; gap: 16px; justify-content: center; flex-wrap: wrap; }
        .trust-badge {
          display: flex; align-items: center; gap: 8px;
          padding: 12px 20px; background: var(--bg-card);
          border: 1px solid var(--border-color); border-radius: var(--radius-pill);
          font-size: 13px; font-weight: 600; color: var(--text-secondary);
        }

        .cta-section { padding: 80px 0 100px; position: relative; z-index: 1; }
        .cta-card { padding: 60px 40px; text-align: center; display: flex; flex-direction: column; gap: 20px; align-items: center; }
        .cta-card h2 { font-size: clamp(22px, 4vw, 38px); font-weight: 800; font-family: var(--font-display); }
        .cta-card p { color: var(--text-secondary); font-size: 16px; max-width: 500px; }

        .footer { border-top: 1px solid var(--border-light); padding: 40px 0; position: relative; z-index: 1; }
        .footer-inner { display: flex; justify-content: space-between; align-items: center; gap: 24px; flex-wrap: wrap; margin-bottom: 24px; }
        .footer-brand { display: flex; flex-direction: column; gap: 6px; }
        .footer-brand p { font-size: 13px; color: var(--text-muted); }
        .footer-links { display: flex; gap: 20px; flex-wrap: wrap; }
        .footer-links a { font-size: 14px; color: var(--text-secondary); font-weight: 500; }
        .footer-links a:hover { color: var(--brand-primary); }
        .footer-copy { font-size: 12px; color: var(--text-muted); text-align: center; }

        @media (max-width: 768px) {
          .hero-form { padding: 20px; }
          .how-arrow { display: none; }
          .footer-inner { flex-direction: column; align-items: flex-start; }
        }
      `}</style>
        </div>
    );
}
