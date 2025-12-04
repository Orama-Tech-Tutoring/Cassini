import React from 'react';

const SelectionIndicator = ({ count }) => {
    if (count === 0) return null;

    return (
        <div className="glass" style={{
            position: 'fixed',
            bottom: '20px',
            left: '20px',
            padding: '8px 16px',
            borderRadius: 'var(--radius-lg)',
            fontSize: '14px',
            fontWeight: 500,
            color: 'rgba(255, 255, 255, 0.9)',
            pointerEvents: 'none',
            animation: 'fadeIn 0.2s ease',
            zIndex: 999
        }}>
            {count} selected
        </div>
    );
};

export default SelectionIndicator;
