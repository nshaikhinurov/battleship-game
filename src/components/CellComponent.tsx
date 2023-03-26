/** @jsxImportSource @emotion/react */
// https://github.com/emotion-js/emotion/issues/2752

import React from 'react';
import cx from 'classnames';
import { palette } from 'src/consts/palette';
import { CellStatus } from 'src/models/Cell';

import { CellContent } from './CellContent';

interface CellProps {
  isActive: boolean;
  status: CellStatus;
  onClick: () => void;
  player: 'human' | 'computer';
  radarIsOn: boolean;
}

function getCellClassName({ status, player, radarIsOn }: CellProps) {
  switch (status) {
    case CellStatus.EMPTY:
      return 'water';
    case CellStatus.SHIP:
      return player === 'human' ? 'ship' : radarIsOn ? 'ship' : 'water';
    case CellStatus.HIT:
      return 'hit';
    case CellStatus.SUNK:
      return 'sunk';
    case CellStatus.MISSED:
      return 'missed';
    case CellStatus.TECHNICALLY_MISSED:
      return 'technically-missed';
    default:
      return 'water';
  }
}

const CellComponent: React.FC<CellProps> = (props) => {
  const { status, onClick, player, isActive } = props;

  return (
    <div
      onClick={() => {
        [CellStatus.EMPTY, CellStatus.SHIP, CellStatus.TECHNICALLY_MISSED].includes(status) && onClick();
      }}
      css={cellStyles(isActive ? 'active' : 'disabled')}
      className={cx(player, getCellClassName(props))}
    >
      <CellContent status={status} />
    </div>
  );
};

const cellStyles = (activityType: 'active' | 'disabled') => {
  const isActive = activityType === 'active';

  return {
    transition: 'font-size 0.25s ease, background-color 0.2s ease',
    backgroundColor: 'lemon',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: '2px',

    width: '1rem',
    height: '1rem',

    color: '#fff',
    fontSize: '0.5em',

    '&.water': {
      backgroundColor: palette[activityType].water,
    },
    '&.missed, &.technically-missed': {
      fontSize: '0.4rem',
      color: palette[activityType].missed,
      backgroundColor: palette[activityType].water,
    },
    '&.ship': {
      backgroundColor: palette[activityType].ship,
    },
    '&.hit': {
      fontSize: '1.5em',
      backgroundColor: palette[activityType].hit,
    },
    '&.sunk': {
      fontSize: '1.5em',
      backgroundColor: palette[activityType].sunk,
    },
    ...(isActive && {
      '&.computer.water:hover, &.computer.ship:hover, &.computer.technically-missed:hover': {
        backgroundColor: palette.active.missed,
      },
    }),
  };
};

export default CellComponent;
