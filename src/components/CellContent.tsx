import React from 'react';
import { FaTimes } from 'react-icons/fa';
import { GoPrimitiveDot } from 'react-icons/go';
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
      return <FaTimes className="text-3xl" />;
    case CellStatus.MISSED:
      return <GoPrimitiveDot className="text-3xl" />;
    default:
      return null;
  }
};
