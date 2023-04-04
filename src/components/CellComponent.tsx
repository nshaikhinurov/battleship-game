import React from 'react';
import cx from 'classnames';
import { CellStatus } from 'src/models/Cell';
import { Player } from 'src/models/GameModel';

import { CellContent } from './CellContent';

interface CellProps {
  isActive: boolean;
  status: CellStatus;
  onClick: () => void;
  player: 'human' | 'computer';
  radarIsOn: boolean;
}

function getCellClassName({ status, player, radarIsOn, isActive }: CellProps) {
  switch (status) {
    case CellStatus.EMPTY:
      return isActive ? `bg-sky-100` : `bg-slate-100`;

    case CellStatus.SHIP: {
      if (player === 'human' || radarIsOn) {
        return isActive ? `text-2xl bg-sky-500` : `text-2xl bg-slate-300`;
      }

      return isActive ? `text-2xl bg-sky-100` : `text-2xl bg-slate-100`;
    }

    case CellStatus.HIT:
      return `text-4xl ${isActive ? 'bg-red-600 text-red-50' : 'bg-slate-300 text-slate-50'}`;

    case CellStatus.SUNK:
      return `text-4xl ${isActive ? 'bg-sky-950 text-sky-50' : 'bg-slate-300 text-slate-50'}`;

    case CellStatus.MISSED:
    case CellStatus.TECHNICALLY_MISSED:
      return `text-4xl ${isActive ? 'text-sky-300 bg-sky-100' : 'text-slate-300 bg-slate-100'}`;
  }
}

const CellComponent: React.FC<CellProps> = (props) => {
  const { status, onClick, player, isActive } = props;

  return (
    <div
      onClick={() => {
        [CellStatus.EMPTY, CellStatus.SHIP, CellStatus.TECHNICALLY_MISSED].includes(status) && onClick();
      }}
      className={cx(
        'flex h-10 w-10 items-center justify-center rounded-sm transition-[background-color,font-size] duration-200',
        getCellClassName(props),
        isActive &&
          player === Player.COMPUTER &&
          [CellStatus.EMPTY, CellStatus.SHIP, CellStatus.TECHNICALLY_MISSED].includes(status) &&
          'text-sky-300 hover:bg-sky-300'
      )}
    >
      <CellContent status={status} />
    </div>
  );
};

export default CellComponent;
