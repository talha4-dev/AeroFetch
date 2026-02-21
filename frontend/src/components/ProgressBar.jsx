export default function ProgressBar({ value = 0, label = '' }) {
    return (
        <div style={{ width: '100%' }}>
            {label && (
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: 500 }}>{label}</span>
                    <span style={{ fontSize: '13px', color: 'var(--brand-primary)', fontWeight: 700 }}>{Math.round(value)}%</span>
                </div>
            )}
            <div className="progress-bar-track">
                <div
                    className="progress-bar-fill"
                    style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
                    role="progressbar"
                    aria-valuenow={value}
                    aria-valuemin={0}
                    aria-valuemax={100}
                />
            </div>
        </div>
    );
}
