export default function SkeletonLoader({ type = 'card', count = 1 }) {
    const renderSkeleton = (key) => {
        if (type === 'card') {
            return (
                <div key={key} style={{ padding: '20px', borderRadius: '14px', background: 'var(--bg-card)', border: '1px solid var(--border-light)' }}>
                    <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                        <div className="skeleton" style={{ width: '80px', height: '60px', borderRadius: '10px', flexShrink: 0 }} />
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <div className="skeleton" style={{ height: '16px', width: '70%', borderRadius: '6px' }} />
                            <div className="skeleton" style={{ height: '12px', width: '45%', borderRadius: '6px' }} />
                            <div className="skeleton" style={{ height: '12px', width: '30%', borderRadius: '6px' }} />
                        </div>
                    </div>
                </div>
            );
        }
        if (type === 'row') {
            return (
                <div key={key} style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '14px 0', borderBottom: '1px solid var(--border-light)' }}>
                    <div className="skeleton" style={{ width: '56px', height: '40px', borderRadius: '8px', flexShrink: 0 }} />
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <div className="skeleton" style={{ height: '14px', width: '60%', borderRadius: '5px' }} />
                        <div className="skeleton" style={{ height: '11px', width: '35%', borderRadius: '5px' }} />
                    </div>
                    <div className="skeleton" style={{ width: '60px', height: '28px', borderRadius: '20px' }} />
                </div>
            );
        }
        if (type === 'metadata') {
            return (
                <div key={key} style={{ padding: '24px', borderRadius: '16px', background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
                    <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
                        <div className="skeleton" style={{ width: '160px', height: '90px', borderRadius: '12px', flexShrink: 0 }} />
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            <div className="skeleton" style={{ height: '20px', width: '80%', borderRadius: '8px' }} />
                            <div className="skeleton" style={{ height: '14px', width: '50%', borderRadius: '6px' }} />
                            <div className="skeleton" style={{ height: '14px', width: '40%', borderRadius: '6px' }} />
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="skeleton" style={{ width: '100px', height: '36px', borderRadius: '20px' }} />
                        ))}
                    </div>
                </div>
            );
        }
        if (type === 'text') {
            return (
                <div key={key} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div className="skeleton" style={{ height: '16px', width: '90%', borderRadius: '6px' }} />
                    <div className="skeleton" style={{ height: '16px', width: '75%', borderRadius: '6px' }} />
                    <div className="skeleton" style={{ height: '16px', width: '60%', borderRadius: '6px' }} />
                </div>
            );
        }
        return null;
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[...Array(count)].map((_, i) => renderSkeleton(i))}
        </div>
    );
}
