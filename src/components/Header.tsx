/** @jsxImportSource @emotion/react */

import battleshipLogo from 'src/assets/battleshipLogo.png';

export const Header = () => {
  return (
    <header css={headerStyles}>
      <img src={battleshipLogo} alt="Battleship" />
      <h1>Battleship</h1>
    </header>
  );
};

const headerStyles = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  gap: '0.75em',

  '& img': {
    width: '1.5em',
    height: '1.5em',
  },

  '& h1': {
    fontWeight: '900',
    textTransform: 'uppercase',
    fontSize: '1.5rem',
    letterSpacing: '0.5em',
  },
} as const;
