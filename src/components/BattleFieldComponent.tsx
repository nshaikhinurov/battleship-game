/** @jsxImportSource @emotion/react */
// https://github.com/emotion-js/emotion/issues/2752

import React from 'react';
import { consts } from 'src/consts';
import { palette } from 'src/consts/palette';
import { Grid } from 'src/models/BattleField';
import { Cell } from 'src/models/Cell';
import { Player } from 'src/models/GameModel';

import CellComponent from './CellComponent';
import { NavigationSquares } from './NavigationSquares';

interface BattleFieldProps {
  grid: Grid;
  handleCellClick?: (cell: Cell) => void;
  player: 'human' | 'computer';
  radarIsOn: boolean;
  isActive: boolean;
}

const BattleFieldComponent: React.FC<BattleFieldProps> = ({ grid, handleCellClick, player, radarIsOn, isActive }) => {
  return (
    <div css={battleFieldWrapperStyles}>
      <NavigationSquares variant="horizontal" isActive={isActive} />
      <div css={{ display: 'flex' }}>
        <NavigationSquares variant="vertical" isActive={isActive} />
        <div css={battleFieldStyles}>
          {grid.map((row) =>
            row.map((cell) => (
              <CellComponent
                key={cell.id}
                status={cell.getStatus()}
                player={player}
                isActive={isActive}
                radarIsOn={radarIsOn}
                onClick={() => handleCellClick?.(cell)}
              />
            ))
          )}
        </div>
      </div>
      <h3 className={isActive ? 'active' : 'disabled'}>
        {player === Player.HUMAN ? 'Your fleet' : "Opponent's fleet"}
      </h3>
    </div>
  );
};

const battleFieldWrapperStyles = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-end',

  fontSize: '0.5em',

  '& > h3': {
    fontSize: '0.4rem',
    fontWeight: '900',
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '1rem',
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: '0.2em',
    '&.disabled': {
      color: palette.disabled.ship,
    },
  },
} as const;

const battleFieldStyles = {
  borderRadius: '4px',
  overflow: 'hidden',
  display: 'grid',
  gridTemplateColumns: 'repeat(10, 1fr)',
  gridTemplateRows: 'repeat(10, 1fr)',
  gap: consts.cellGap,
};

export default BattleFieldComponent;
