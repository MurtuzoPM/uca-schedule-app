import React from 'react';

const Footer = () => {
    return (
        <footer style={{
            padding: '15px 0',
            marginTop: 'auto', // Pushes footer to bottom if using Flexbox in App.jsx
            width: '100%',
            borderTop: '1px solid #eaeaea', // Subtle line to match modern UI
            backgroundColor: 'transparent',
            fontFamily: 'inherit', // Automatically uses the same font as your app
            color: '#666',
            fontSize: '12px' // Smaller, discreet size
        }}>
            <div style={{
                maxWidth: '1200px',
                margin: '0 auto',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '0 20px'
            }}>
                <div>
                    © {new Date().getFullYear()} <strong>UCA Schedule App</strong>.
                    Created by <span style={{ color: '#333', fontWeight: '500' }}>[Your Name]</span>
                </div>

                <div style={{ display: 'flex', gap: '15px' }}>
                    <a href="YOUR_LINKEDIN_URL" target="_blank" rel="noreferrer" style={{ color: '#007bff', textDecoration: 'none' }}>LinkedIn</a>
                    <a href="YOUR_GITHUB_URL" target="_blank" rel="noreferrer" style={{ color: '#333', textDecoration: 'none' }}>GitHub</a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;