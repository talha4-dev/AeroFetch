const NAV_ITEMS = [
    { id: 'download', icon: '⬇️', label: 'Download' },
    { id: 'history', icon: '📋', label: 'History' },
    { id: 'batch', icon: '🗂️', label: 'Batch' },
    { id: 'settings', icon: '⚙️', label: 'Settings' },
];

export default function Sidebar({ activeTab, onTabChange }) {
    return (
        <aside className="sidebar">
            <div className="sidebar-section-label">COMMAND CENTER</div>
            <nav className="sidebar-nav">
                {NAV_ITEMS.map(item => (
                    <button
                        key={item.id}
                        className={`sidebar-item${activeTab === item.id ? ' active' : ''}`}
                        onClick={() => onTabChange(item.id)}
                        aria-current={activeTab === item.id ? 'page' : undefined}
                    >
                        <span className="sidebar-icon">{item.icon}</span>
                        <span className="sidebar-label">{item.label}</span>
                        {activeTab === item.id && <span className="sidebar-indicator" />}
                    </button>
                ))}
            </nav>

            <div className="sidebar-footer">
                <div className="sidebar-promo">
                    <div style={{ fontSize: '22px', marginBottom: '8px' }}>⚡</div>
                    <p style={{ fontWeight: 700, fontSize: '13px' }}>AeroFetch Pro</p>
                    <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>Unlimited downloads, 4K quality</p>
                </div>
            </div>

            <style>{`
        .sidebar {
          width: var(--sidebar-width);
          height: calc(100vh - var(--navbar-height));
          position: fixed;
          top: var(--navbar-height);
          left: 0;
          background: var(--bg-sidebar);
          border-right: 1px solid var(--border-light);
          display: flex;
          flex-direction: column;
          padding: 24px 12px;
          gap: 4px;
          overflow-y: auto;
          transition: transform var(--transition), background var(--transition);
          z-index: 100;
        }
        .sidebar-section-label {
          font-size: 10px; font-weight: 800; letter-spacing: 0.12em;
          color: var(--text-muted); padding: 0 12px 12px;
          text-transform: uppercase;
        }
        .sidebar-nav { display: flex; flex-direction: column; gap: 2px; flex: 1; }
        .sidebar-item {
          display: flex; align-items: center; gap: 12px;
          padding: 11px 14px; border-radius: var(--radius-md);
          background: none; border: none; cursor: pointer;
          color: var(--text-secondary); font-size: 14px; font-weight: 500;
          font-family: var(--font-body); transition: all var(--transition);
          position: relative; text-align: left; width: 100%;
        }
        .sidebar-item:hover { background: var(--bg-hover); color: var(--text-primary); }
        .sidebar-item.active {
          background: var(--bg-hover);
          color: var(--brand-primary); font-weight: 700;
        }
        .sidebar-icon { font-size: 18px; flex-shrink: 0; }
        .sidebar-label { flex: 1; }
        .sidebar-indicator {
          width: 4px; height: 20px; border-radius: var(--radius-pill);
          background: var(--gradient-brand); position: absolute;
          left: -12px;
        }
        .sidebar-footer { padding-top: 16px; border-top: 1px solid var(--border-light); }
        .sidebar-promo {
          padding: 16px; border-radius: var(--radius-md);
          background: linear-gradient(135deg, rgba(108,99,255,0.1), rgba(0,212,170,0.1));
          border: 1px solid rgba(108,99,255,0.2); text-align: center;
        }
        @media (max-width: 768px) {
          .sidebar {
            transform: translateX(-100%);
            width: 260px;
          }
          .sidebar.open { transform: translateX(0); }
        }
      `}</style>
        </aside>
    );
}
