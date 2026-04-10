import { useState, useEffect } from 'react';
import api from '../api/client';
import SkeletonLoader from './SkeletonLoader';
import { useToast } from './ToastNotification';

const PLATFORM_ICONS = { YouTube: '🎬', TikTok: '🎵', Facebook: '📘', Instagram: '📸', 'Twitter/X': '🐦', Vimeo: '🎥' };

export default function DownloadHistory() {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const { addToast } = useToast();

    const fetchHistory = async (p = 1) => {
        setLoading(true);
        try {
            const res = await api.get(`/api/download/history?page=${p}&per_page=10`);
            setHistory(res.data.history);
            setTotalPages(res.data.pages);
            setPage(p);
        } catch {
            addToast({ type: 'error', title: 'Failed to load', message: 'Could not fetch download history' });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchHistory(); }, []);

    const handleDelete = async (id) => {
        try {
            await api.delete(`/api/download/history/${id}`);
            addToast({ type: 'success', title: 'Deleted', message: 'Entry removed from history' });
            fetchHistory(page);
        } catch {
            addToast({ type: 'error', title: 'Failed', message: 'Could not delete the entry' });
        }
    };

    const formatDate = (iso) => {
        return new Date(iso).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' });
    };

    return (
        <div className="history-wrap">
            <div className="history-header">
                <div>
                    <h2 className="section-title">Download History</h2>
                    <p className="section-sub">Your recent downloads at a glance</p>
                </div>
                <button className="btn-ghost" onClick={() => fetchHistory(page)}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="23 4 23 10 17 10" /><path d="M20.49 15a9 9 0 1 1-.49-7.5" />
                    </svg>
                    Refresh
                </button>
            </div>

            {loading ? (
                <SkeletonLoader type="row" count={6} />
            ) : history.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-icon">📂</div>
                    <h3>No downloads yet</h3>
                    <p>Your download history will appear here after your first download.</p>
                </div>
            ) : (
                <>
                    <div className="history-table">
                        {history.map((item) => (
                            <div key={item.id} className="history-row">
                                {item.thumbnail ? (
                                    <img src={item.thumbnail} alt="" className="history-thumb" />
                                ) : (
                                    <div className="history-thumb-placeholder">
                                        {PLATFORM_ICONS[item.platform] || '🎬'}
                                    </div>
                                )}
                                <div className="history-info">
                                    <p className="history-title">{item.title || 'Unknown Title'}</p>
                                    <p className="history-meta">
                                        {item.platform && <span>{PLATFORM_ICONS[item.platform]} {item.platform}</span>}
                                        {item.quality && <span>• {item.quality}</span>}
                                        {item.format && <span className="badge badge-brand" style={{ fontSize: '10px', padding: '2px 8px' }}>{item.format.toUpperCase()}</span>}
                                        <span>• {formatDate(item.created_at)}</span>
                                    </p>
                                </div>
                                <div className="history-actions">
                                    {item.duration && <span className="history-duration">{item.duration}</span>}
                                    <button
                                        className="btn-ghost"
                                        style={{ color: 'var(--brand-accent)', padding: '6px' }}
                                        onClick={() => handleDelete(item.id)}
                                        title="Remove"
                                    >
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14H6L5 6" />
                                            <path d="M10 11v6M14 11v6" /><path d="M9 6V4h6v2" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                    {totalPages > 1 && (
                        <div className="pagination">
                            <button className="btn-ghost" onClick={() => fetchHistory(page - 1)} disabled={page <= 1}>← Prev</button>
                            <span className="page-info">Page {page} of {totalPages}</span>
                            <button className="btn-ghost" onClick={() => fetchHistory(page + 1)} disabled={page >= totalPages}>Next →</button>
                        </div>
                    )}
                </>
            )}

            <style>{`
        .history-wrap { display: flex; flex-direction: column; gap: 20px; }
        .history-header { display: flex; align-items: flex-start; justify-content: space-between; gap: 16px; }
        .section-title { font-size: 22px; font-weight: 800; font-family: var(--font-display); }
        .section-sub { font-size: 14px; color: var(--text-muted); margin-top: 4px; }
        .history-table { display: flex; flex-direction: column; gap: 2px; }
        .history-row {
          display: flex; align-items: center; gap: 14px;
          padding: 14px 16px; border-radius: var(--radius-md);
          background: var(--bg-card); border: 1px solid var(--border-light);
          transition: all var(--transition);
        }
        .history-row:hover { border-color: var(--border-color); transform: translateX(2px); }
        .history-thumb {
          width: 70px; height: 50px; object-fit: cover;
          border-radius: 8px; flex-shrink: 0;
        }
        .history-thumb-placeholder {
          width: 70px; height: 50px; flex-shrink: 0;
          background: var(--bg-hover); border-radius: 8px;
          display: flex; align-items: center; justify-content: center; font-size: 22px;
        }
        .history-info { flex: 1; min-width: 0; }
        .history-title { font-size: 14px; font-weight: 600; color: var(--text-primary); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .history-meta { display: flex; align-items: center; gap: 6px; flex-wrap: wrap; font-size: 12px; color: var(--text-muted); margin-top: 4px; }
        .history-actions { display: flex; align-items: center; gap: 8px; flex-shrink: 0; }
        .history-duration { font-size: 12px; color: var(--text-muted); font-weight: 600; }
        .empty-state { text-align: center; padding: 60px 24px; color: var(--text-muted); }
        .empty-icon { font-size: 48px; margin-bottom: 16px; }
        .empty-state h3 { font-size: 18px; color: var(--text-secondary); margin-bottom: 8px; }
        .empty-state p { font-size: 14px; }
        .pagination { display: flex; align-items: center; justify-content: center; gap: 16px; padding-top: 8px; }
        .page-info { font-size: 13px; color: var(--text-muted); font-weight: 600; }
        @media (max-width: 600px) {
          .history-row { flex-wrap: wrap; }
          .history-info { min-width: calc(100% - 90px); }
        }
      `}</style>
        </div>
    );
}
