/** @jsxImportSource @emotion/react */
// https://github.com/emotion-js/emotion/issues/2752

import React from 'react';
import cx from 'classnames';

import { CellStatus } from './Model';
interface CellProps {
  status: CellStatus;
  onClick: () => void;
  player: 'human' | 'computer';
  radarIsOn: boolean;
}

const Cell: React.FC<CellProps> = ({ status, onClick, player, radarIsOn }) => {
  let cellContent;
  switch (status) {
    case CellStatus.EMPTY:
      cellContent = '';
      break;
    case CellStatus.SHIP:
      cellContent = '';
      break;
    case CellStatus.HIT:
      cellContent = <i className="fas fa-times" />;
      break;
    case CellStatus.SUNK:
      cellContent = <i className="fas fa-times" />;
      break;
    case CellStatus.MISSED:
      cellContent = <i className="fas fa-circle" />;
      break;
    default:
      cellContent = '';
      break;
  }

  let cellClassName;
  switch (status) {
    case CellStatus.EMPTY:
      cellClassName = 'empty';
      break;
    case CellStatus.SHIP:
      player === 'human' ? (cellClassName = 'ship') : (cellClassName = radarIsOn ? 'ship' : 'empty');
      break;
    case CellStatus.HIT:
      cellClassName = 'hit';
      break;
    case CellStatus.SUNK:
      cellClassName = 'sunk';
      break;
    case CellStatus.MISSED:
      cellClassName = 'missed';
      break;
    default:
      cellClassName = 'empty';
      break;
  }

  return (
    <div onClick={onClick} css={cellStyles} className={cx(player, cellClassName)}>
      {cellContent}
    </div>
  );
};

const cellStyles = {
  backgroundColor: '#ddd',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',

  width: '50px',
  height: '50px',

  color: '#fff',
  fontSize: '0.5em',

  '&.empty': {
    backgroundColor: '#5893D4',
  },
  '&.missed': {
    backgroundColor: '#5893D4',
  },
  '&.ship': {
    backgroundColor: '#1F3C88',
  },
  '&.hit': {
    fontSize: '1.5em',
    backgroundColor: '#F7B633',
  },
  '&.sunk': {
    fontSize: '1.5em',
    backgroundColor: '#070D59',
  },
  '&.computer.empty:hover, &.computer.ship:hover': {
    boxShadow: 'inset 0 0 0 6px #fff',
  },
};

export default Cell;
