import React from 'react';

const Footer = () => {
  return (
    <footer style={{
      marginTop: '2rem',
      padding: '1rem',
      textAlign: 'center',
      backgroundColor: '#1e1e1e',
      color: '#ccc',
      fontSize: '0.9rem'
    }}>
      <p>
        🚀 CosmoQuery by Aman Singh &nbsp;|&nbsp;
        <a href="https://github.com/AmanSingh16072002" target="_blank" rel="noopener noreferrer" style={{ color: '#00d1ff', textDecoration: 'none' }}>
          GitHub
        </a>
      </p>
      <p>© {new Date().getFullYear()} All rights reserved.</p>
    </footer>
  );
};

export default Footer;
