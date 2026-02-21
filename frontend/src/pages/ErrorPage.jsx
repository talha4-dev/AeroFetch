import { Link, useRouteError } from 'react-router-dom';
import NavBar from '../components/NavBar';

export default function ErrorPage() {
    const error = useRouteError?.();
    const is404 = error?.status === 404 || !error;

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', display: 'flex', flexDirection: 'column' }}>
            <NavBar />
            <div style={{
                flex: 1, display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
                padding: 'calc(var(--navbar-height) + 40px) 24px 60px',
                textAlign: 'center',
            }}>
                <div style={{ fontSize: '100px', lineHeight: 1, marginBottom: '24px', animation: 'float 3s ease-in-out infinite' }}>
                    {is404 ? '🌌' : '⚙️'}
                </div>
                <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(60px, 10vw, 120px)', fontWeight: 900, lineHeight: 1 }} className="gradient-text">
                    {is404 ? '404' : '500'}
                </h1>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(22px, 3vw, 32px)', fontWeight: 700, marginTop: '16px' }}>
                    {is404 ? 'Page Not Found' : 'Something Went Wrong'}
                </h2>
                <p style={{ color: 'var(--text-secondary)', marginTop: '12px', fontSize: '16px', maxWidth: '460px', lineHeight: 1.7 }}>
                    {is404
                        ? "The page you're looking for doesn't exist or has been moved. Let's get you back on track."
                        : "An unexpected error occurred. Our team has been notified. Please try again."}
                </p>
                <div style={{ display: 'flex', gap: '14px', marginTop: '36px', flexWrap: 'wrap', justifyContent: 'center' }}>
                    <Link to="/" className="btn-primary" style={{ padding: '14px 32px', fontSize: '15px' }}>
                        🏠 Back to Home
                    </Link>
                    <button className="btn-secondary" onClick={() => window.history.back()} style={{ padding: '14px 24px' }}>
                        ← Go Back
                    </button>
                </div>
                {error?.statusText && <p style={{ marginTop: '24px', fontSize: '12px', color: 'var(--text-muted)', fontFamily: 'monospace' }}>{error.statusText}</p>}
            </div>
            <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-12px); }
        }
      `}</style>
        </div>
    );
}
