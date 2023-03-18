import React from 'react';
import { CellStatus } from 'src/models/Cell';

interface CellContentProps {
  status: CellStatus;
}

export const CellContent: React.FC<CellContentProps> = ({ status }) => {
  switch (status) {
    case CellStatus.EMPTY:
    case CellStatus.TECHNICALLY_MISSED:
    case CellStatus.SHIP:
      return null;
    case CellStatus.HIT:
    case CellStatus.SUNK:
      return <i className="fas fa-times" />;
    case CellStatus.MISSED:
      return <i className="fas fa-circle" />;
    default:
      return null;
  }
};
