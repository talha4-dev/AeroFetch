import { useState, useEffect, useRef } from 'react';
import { Navigate } from 'react-router-dom';
import NavBar from '../components/NavBar';
import Sidebar from '../components/Sidebar';
import DownloadForm from '../components/DownloadForm';
import DownloadHistory from '../components/DownloadHistory';
import BatchProcessor from '../components/BatchProcessor';
import AnimatedBackground from '../components/AnimatedBackground';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

function SettingsTab({ user }) {
    const { theme, toggleTheme } = useTheme();
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div>
                <h2 className="section-title">Settings</h2>
                <p className="section-sub">Manage your preferences and account</p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {/* Account info */}
                <div style={{ padding: '20px 24px', background: 'var(--bg-card)', borderRadius: '14px', border: '1px solid var(--border-light)', display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: 'var(--gradient-brand)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: '20px' }}>
                        {(user?.name || user?.email || 'U')[0].toUpperCase()}
                    </div>
                    <div>
                        <p style={{ fontWeight: 700, fontSize: '16px' }}>{user?.name || 'User'}</p>
                        <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{user?.email}</p>
                    </div>
                    <span className="badge badge-brand" style={{ marginLeft: 'auto' }}>Free Plan</span>
                </div>
                {/* Theme setting */}
                <div style={{ padding: '20px 24px', background: 'var(--bg-card)', borderRadius: '14px', border: '1px solid var(--border-light)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                        <p style={{ fontWeight: 700 }}>Appearance</p>
                        <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Currently: {theme === 'dark' ? '🌙 Dark' : '☀️ Light'} mode</p>
                    </div>
                    <button className="btn-secondary" onClick={toggleTheme} style={{ padding: '10px 20px' }}>
                        {theme === 'dark' ? '☀️ Switch to Light' : '🌙 Switch to Dark'}
                    </button>
                </div>
                {/* Stats */}
                <div style={{ padding: '20px 24px', background: 'var(--bg-card)', borderRadius: '14px', border: '1px solid var(--border-light)' }}>
                    <p style={{ fontWeight: 700, marginBottom: '12px' }}>Account Statistics</p>
                    <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
                        <div>
                            <p style={{ fontSize: '24px', fontWeight: 800, color: 'var(--brand-primary)' }}>{user?.download_count || 0}</p>
                            <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Downloads</p>
                        </div>
                        <div>
                            <p style={{ fontSize: '24px', fontWeight: 800, color: 'var(--brand-secondary)' }}>∞</p>
                            <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Storage</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Render tab content inline so each tab always gets a fresh instance
function TabContent({ activeTab, user }) {
    if (activeTab === 'download') return <DownloadForm />;
    if (activeTab === 'history') return <DownloadHistory />;
    if (activeTab === 'batch') return <BatchProcessor />;
    if (activeTab === 'settings') return <SettingsTab user={user} />;
    return null;
}

export default function Dashboard() {
    const { user, loading } = useAuth();
    const [activeTab, setActiveTab] = useState('download');
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const mainRef = useRef(null);
    const contentRef = useRef(null);

    // Use CSS-based entry animation — avoids GSAP StrictMode double-invoke bug
    useEffect(() => {
        if (mainRef.current) {
            mainRef.current.style.opacity = '0';
            mainRef.current.style.transform = 'translateY(20px)';
            mainRef.current.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            // rAF ensures paint happens before setting final state
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    if (mainRef.current) {
                        mainRef.current.style.opacity = '1';
                        mainRef.current.style.transform = 'translateY(0)';
                    }
                });
            });
        }
    }, []);

    // Animate tab content on tab switch (CSS only, safe in StrictMode)
    useEffect(() => {
        if (contentRef.current) {
            contentRef.current.style.opacity = '0';
            contentRef.current.style.transform = 'translateY(12px)';
            contentRef.current.style.transition = 'none';
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    if (contentRef.current) {
                        contentRef.current.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                        contentRef.current.style.opacity = '1';
                        contentRef.current.style.transform = 'translateY(0)';
                    }
                });
            });
        }
    }, [activeTab]);

    if (loading) {
        return (
            <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ textAlign: 'center' }}>
                    <div className="spinner" style={{ width: '40px', height: '40px', margin: '0 auto 16px', border: '3px solid rgba(108,99,255,0.2)', borderTopColor: 'var(--brand-primary)' }} />
                    <p style={{ color: 'var(--text-muted)' }}>Loading...</p>
                </div>
            </div>
        );
    }

    if (!user) return <Navigate to="/auth" replace />;

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        setSidebarOpen(false);
    };

    const hour = new Date().getHours();
    const greeting = hour < 12 ? 'Morning' : hour < 17 ? 'Afternoon' : 'Evening';

    return (
        <div className="dashboard-page">
            <NavBar />
            <AnimatedBackground />
            <Sidebar activeTab={activeTab} onTabChange={handleTabChange} isOpen={sidebarOpen} />

            {/* Mobile overlay */}
            {sidebarOpen && (
                <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />
            )}

            <main className="dashboard-main" ref={mainRef}>
                {/* Welcome Banner */}
                <div className="welcome-banner">
                    <div className="welcome-text">
                        <h1 className="welcome-title">
                            Good {greeting},{' '}
                            <span className="gradient-text">{user.name || user.email.split('@')[0]}</span> 👋
                        </h1>
                        <p className="welcome-sub">
                            Your download command center. {user.download_count || 0} downloads completed.
                        </p>
                    </div>
                    {/* Mobile sidebar toggle */}
                    <button
                        className="mobile-sidebar-toggle"
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        aria-label="Toggle menu"
                    >
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="3" y1="12" x2="21" y2="12" />
                            <line x1="3" y1="6" x2="21" y2="6" />
                            <line x1="3" y1="18" x2="21" y2="18" />
                        </svg>
                    </button>
                </div>

                {/* Tab Content */}
                <div className="tab-content" ref={contentRef}>
                    <TabContent activeTab={activeTab} user={user} />
                </div>
            </main>

            <style>{`
        .dashboard-page { min-height: 100vh; background: var(--bg-primary); position: relative; }
        .dashboard-main {
          margin-left: var(--sidebar-width);
          margin-top: var(--navbar-height);
          padding: 32px;
          min-height: calc(100vh - var(--navbar-height));
          position: relative; z-index: 5;
        }
        .welcome-banner {
          display: flex; align-items: flex-start; justify-content: space-between;
          gap: 16px; margin-bottom: 32px;
        }
        .welcome-title { font-size: clamp(24px, 3vw, 34px); font-weight: 900; font-family: var(--font-display); line-height: 1.2; }
        .welcome-sub { font-size: 14px; color: var(--text-muted); margin-top: 6px; }
        .tab-content { max-width: 900px; }
        .sidebar-overlay {
          position: fixed; inset: 0; background: rgba(0,0,0,0.5);
          z-index: 99; backdrop-filter: blur(4px);
        }
        .mobile-sidebar-toggle {
          display: none; padding: 10px; background: var(--bg-card);
          border: 1px solid var(--border-color); border-radius: var(--radius-md);
          cursor: pointer; color: var(--text-primary); flex-shrink: 0;
        }
        .spinner {
          border-radius: 50%; animation: spin 0.8s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        .section-title { font-size: 22px; font-weight: 800; font-family: var(--font-display); }
        .section-sub { font-size: 14px; color: var(--text-muted); margin-top: 4px; }
        @media (max-width: 768px) {
          .dashboard-main { margin-left: 0; padding: 20px 16px; }
          .mobile-sidebar-toggle { display: flex; align-items: center; }
        }
      `}</style>
        </div>
    );
}
