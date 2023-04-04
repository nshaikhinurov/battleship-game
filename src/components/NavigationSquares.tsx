import React from 'react';
import cx from 'classnames';

interface NavigationSquaresProps {
  variant: 'horizontal' | 'vertical';
  isActive: boolean;
}

const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
const digits = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];

export const NavigationSquares: React.FC<NavigationSquaresProps> = ({ variant, isActive }) => {
  const squares = variant === 'vertical' ? letters : digits;

  return (
    <div className={cx('flex gap-1', variant === 'vertical' ? 'flex-col' : 'flex-row')}>
      {squares.map((char) => (
        <div
          key={char}
          className={cx(
            { 'text-ship-disabled': !isActive },
            'flex h-10 w-10 items-center justify-center rounded text-xl font-black'
          )}
        >
          {char}
        </div>
      ))}
    </div>
  );
};
