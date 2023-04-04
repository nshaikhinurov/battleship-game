import React from 'react';
import cx from 'classnames';
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
    <div className="flex flex-col items-end">
      <NavigationSquares variant="horizontal" isActive={isActive} />
      <div className="flex">
        <NavigationSquares variant="vertical" isActive={isActive} />
        <div className="grid-rows-10 grid grid-cols-10 gap-1 overflow-hidden rounded ">
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
      <h3
        className={cx(
          'flex h-10 w-full items-center justify-center text-center text-base font-black uppercase tracking-[0.2em]',
          isActive ? 'text-text' : 'text-ship-disabled'
        )}
      >
        {player === Player.HUMAN ? 'Your fleet' : "Opponent's fleet"}
      </h3>
    </div>
  );
};

export default BattleFieldComponent;
