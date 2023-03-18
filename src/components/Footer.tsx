/** @jsxImportSource @emotion/react */

export const Footer = () => {
  return (
    <footer css={footerStyles}>
      Coded with ❤ by <a href="https://github.com/nshaikhinurov">nshaikhinurov</a>
    </footer>
  );
};

const footerStyles = {
  padding: '0.5rem',
  color: '#666',
  fontSize: '16px',
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", "Noto Sans", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji"',

  '& a': {
    color: 'inherit',
    fontWeight: '600',
    textDecoration: 'none',
  },
} as const;
