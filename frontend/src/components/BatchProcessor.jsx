import { useState, useRef } from 'react';
import { useToast } from './ToastNotification';
import api from '../api/client';
import ProgressBar from './ProgressBar';

const QUALITY_OPTIONS = [
    { value: 'bestvideo+bestaudio/best', label: '1080p MP4', ext: 'mp4' },
    { value: 'bestvideo[height<=720]+bestaudio/best', label: '720p MP4', ext: 'mp4' },
    { value: 'bestaudio/best', label: 'MP3 Audio', ext: 'mp3' },
];

export default function BatchProcessor() {
    const [urls, setUrls] = useState('');
    const [rows, setRows] = useState([]);
    const [globalQuality, setGlobalQuality] = useState(QUALITY_OPTIONS[0].value);
    const [batchState, setBatchState] = useState('idle'); // idle | running | done
    const { addToast } = useToast();

    const parseUrls = () => {
        const lines = urls.split('\n').map(l => l.trim()).filter(Boolean);
        if (lines.length === 0) { addToast({ type: 'warning', title: 'No URLs', message: 'Add at least one URL' }); return; }
        if (lines.length > 10) { addToast({ type: 'warning', title: 'Too many URLs', message: 'Maximum 10 URLs per batch' }); return; }
        setRows(lines.map((url, i) => ({
            id: i, url,
            quality: globalQuality,
            status: 'pending', // pending | fetching | queued | downloading | done | error
            title: '',
            error: '',
            progress: 0,
        })));
    };

    const updateRow = (id, patch) => {
        setRows(prev => prev.map(r => r.id === id ? { ...r, ...patch } : r));
    };

    const runBatch = async () => {
        if (rows.length === 0) { addToast({ type: 'warning', title: 'No URLs', message: 'Parse URLs first' }); return; }
        setBatchState('running');

        for (const row of rows) {
            updateRow(row.id, { status: 'fetching', progress: 10 });
            try {
                const info = await api.post('/api/download/info', { url: row.url });
                const title = info.data.data?.title || 'Unknown';
                updateRow(row.id, { status: 'downloading', title, progress: 40 });

                const qualityObj = QUALITY_OPTIONS.find(q => q.value === row.quality) || QUALITY_OPTIONS[0];
                const res = await api.post('/api/download/file', {
                    url: row.url,
                    format_id: row.quality,
                    output_format: qualityObj.ext,
                    quality: qualityObj.label,
                }, { responseType: 'blob', timeout: 180000 });

                const blobUrl = window.URL.createObjectURL(new Blob([res.data]));
                const link = document.createElement('a');
                link.href = blobUrl;
                link.setAttribute('download', `${title.replace(/[^\w\s-]/g, '')}.${qualityObj.ext}`);
                document.body.appendChild(link);
                link.click();
                link.remove();
                window.URL.revokeObjectURL(blobUrl);

                updateRow(row.id, { status: 'done', progress: 100 });
            } catch (err) {
                const msg = err.response?.data?.error || 'Download failed';
                updateRow(row.id, { status: 'error', error: msg, progress: 0 });
            }

            // Small delay between items
            await new Promise(r => setTimeout(r, 500));
        }
        setBatchState('done');
        addToast({ type: 'success', title: 'Batch Complete', message: 'All downloads finished!' });
    };

    const statusIcon = { pending: '⏳', fetching: '🔍', queued: '📋', downloading: '📥', done: '✅', error: '❌' };
    const statusColor = { pending: 'var(--text-muted)', fetching: 'var(--brand-primary)', queued: 'var(--brand-primary)', downloading: 'var(--brand-secondary)', done: '#00c882', error: 'var(--brand-accent)' };

    return (
        <div className="batch-wrap">
            <div>
                <h2 className="section-title">Batch Processor</h2>
                <p className="section-sub">Download multiple videos at once — up to 10 URLs</p>
            </div>

            <div className="batch-input-area">
                <label style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '8px', display: 'block' }}>
                    Paste URLs (one per line)
                </label>
                <textarea
                    className="input-field"
                    rows={6}
                    value={urls}
                    onChange={e => setUrls(e.target.value)}
                    placeholder={"https://www.youtube.com/watch?v=...\nhttps://www.tiktok.com/@user/video/...\nhttps://www.facebook.com/watch?v=..."}
                    style={{ resize: 'vertical', fontFamily: 'monospace', fontSize: '13px' }}
                />
            </div>

            <div className="batch-controls">
                <div style={{ flex: 1 }}>
                    <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>Global Quality</label>
                    <div className="select-wrap">
                        <select className="select-field" value={globalQuality} onChange={e => setGlobalQuality(e.target.value)}>
                            {QUALITY_OPTIONS.map(q => <option key={q.value} value={q.value}>{q.label}</option>)}
                        </select>
                    </div>
                </div>
                <button className="btn-secondary" onClick={parseUrls} style={{ flexShrink: 0 }}>
                    📋 Parse URLs
                </button>
                <button
                    className="btn-primary"
                    onClick={runBatch}
                    disabled={batchState === 'running' || rows.length === 0}
                    style={{ flexShrink: 0 }}
                >
                    {batchState === 'running' ? '⏳ Running...' : '🚀 Download All'}
                </button>
            </div>

            {rows.length > 0 && (
                <div className="batch-list">
                    {rows.map(row => (
                        <div key={row.id} className="batch-item">
                            <div className="batch-item-header">
                                <span className="batch-status-icon" style={{ color: statusColor[row.status] }}>
                                    {statusIcon[row.status]}
                                </span>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <p className="batch-title">{row.title || row.url}</p>
                                    {row.error && <p style={{ fontSize: '11px', color: 'var(--brand-accent)', marginTop: '2px' }}>{row.error}</p>}
                                </div>
                                <span className="badge badge-brand" style={{ fontSize: '11px' }}>{row.status}</span>
                            </div>
                            {(row.status === 'downloading' || row.status === 'fetching') && (
                                <div style={{ marginTop: '8px' }}>
                                    <ProgressBar value={row.progress} />
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            <style>{`
        .batch-wrap { display: flex; flex-direction: column; gap: 20px; }
        .batch-input-area { display: flex; flex-direction: column; }
        .batch-controls { display: flex; gap: 12px; align-items: flex-end; flex-wrap: wrap; }
        .select-wrap { position: relative; }
        .select-wrap::after {
          content: '▾'; position: absolute; right: 14px; top: 50%;
          transform: translateY(-50%); pointer-events: none; color: var(--text-muted);
        }
        .batch-list { display: flex; flex-direction: column; gap: 8px; }
        .batch-item {
          padding: 14px 16px; border-radius: var(--radius-md);
          background: var(--bg-card); border: 1px solid var(--border-light);
        }
        .batch-item-header { display: flex; align-items: center; gap: 12px; }
        .batch-status-icon { font-size: 18px; flex-shrink: 0; }
        .batch-title { font-size: 13px; font-weight: 600; color: var(--text-primary); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        @media (max-width: 600px) {
          .batch-controls { flex-direction: column; }
          .batch-controls > * { width: 100%; }
        }
      `}</style>
        </div>
    );
}
