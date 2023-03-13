/** @jsxImportSource @emotion/react */
// https://github.com/emotion-js/emotion/issues/2752

import React from 'react';

interface NavigationSquaresProps {
  variant: 'horizontal' | 'vertical';
}

const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
const digits = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];

export const NavigationSquares: React.FC<NavigationSquaresProps> = ({ variant }) => {
  const squares = variant === 'vertical' ? letters : digits;
  const squareNodes = squares.map((char) => (
    <div key={char} css={square}>
      {char}
    </div>
  ));

  return (
    <div
      css={{
        display: 'flex',
        flexFlow: variant === 'horizontal' ? 'row' : 'column',
        gap: '1px',
        padding: '1px',
      }}
    >
      {squareNodes}
    </div>
  );
};

const square = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  width: '50px',
  height: '50px',
  fontWeight: 'bold',
};
