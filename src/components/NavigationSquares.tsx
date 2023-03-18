/** @jsxImportSource @emotion/react */
// https://github.com/emotion-js/emotion/issues/2752

import React from 'react';
import { consts } from 'src/consts';
import { palette } from 'src/consts/palette';

interface NavigationSquaresProps {
  variant: 'horizontal' | 'vertical';
  isActive: boolean;
}

const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
const digits = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];

export const NavigationSquares: React.FC<NavigationSquaresProps> = ({ variant, isActive }) => {
  const squares = variant === 'vertical' ? letters : digits;

  return (
    <div css={navigationSquares(variant)}>
      {squares.map((char) => (
        <div key={char} css={square} className={isActive ? 'active' : 'disabled'}>
          {char}
        </div>
      ))}
    </div>
  );
};

const navigationSquares = (variant: 'horizontal' | 'vertical') =>
  ({
    display: 'flex',
    flexFlow: variant === 'horizontal' ? 'row' : 'column',
    gap: consts.cellGap,
  } as const);

const square = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  width: '1rem',
  height: '1rem',
  fontWeight: '900',
  borderRadius: consts.cellGap,
  '&.disabled': {
    color: palette.disabled.ship,
  },
};
