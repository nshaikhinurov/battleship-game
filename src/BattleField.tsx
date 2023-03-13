/** @jsxImportSource @emotion/react */
// https://github.com/emotion-js/emotion/issues/2752

import React from 'react';

import Cell from './Cell';
import { CellStatus } from './Model';
import { NavigationSquares } from './NavigationSquares';

interface BattleFieldProps {
  grid: CellStatus[][];
  handleCellClick?: (rank: number, file: number) => void;
  player: 'human' | 'computer';
  radarIsOn: boolean;
}

const BattleField: React.FC<BattleFieldProps> = ({ grid, handleCellClick, player, radarIsOn }) => {
  return (
    <div css={battleFieldWrapperStyles}>
      <NavigationSquares variant="horizontal" />
      <div css={{ display: 'flex' }}>
        <NavigationSquares variant="vertical" />
        <div css={battleFieldStyles}>
          {grid.map((row, rank) =>
            row.map((cellStatus, file) => (
              <Cell
                key={`${file}-${rank}`}
                status={cellStatus}
                player={player}
                radarIsOn={radarIsOn}
                onClick={() => handleCellClick?.(rank, file)}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

const battleFieldWrapperStyles = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-end',

  fontSize: '0.5em',
} as const;

const battleFieldStyles = {
  borderRadius: '4px',
  overflow: 'hidden',
  display: 'grid',
  gridTemplateColumns: 'repeat(10, 1fr)',
  gridTemplateRows: 'repeat(10, 1fr)',

  border: '1px solid #000',
  backgroundColor: '#1F3C88',
  gap: '1px',
  width: '511px',
  height: '511px',
};

export default BattleField;
