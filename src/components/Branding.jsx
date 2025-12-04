import React from 'react';

const Branding = () => {
    return (
        <div style={{
            position: 'absolute',
            bottom: 20,
            left: 20,
            zIndex: 1000,
            fontFamily: 'var(--font-primary)',
            fontSize: '14px',
            color: 'rgba(255, 255, 255, 0.6)',
            userSelect: 'none',
            letterSpacing: '0.5px'
        }}>
            <img
                src="/logo.png"
                alt="Cassini"
                style={{
                    height: '20px',
                    width: 'auto',
                    objectFit: 'contain',
                    filter: 'brightness(0) invert(1) opacity(0.6)'
                }}
            />
        </div>
    );
};

export default Branding;
