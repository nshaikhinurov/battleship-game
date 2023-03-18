export enum CellStatus {
  EMPTY = 'EMPTY',
  SHIP = 'SHIP',
  HIT = 'HIT',
  MISSED = 'MISSED',
  TECHNICALLY_MISSED = 'TECHNICALLY_MISSED',
  SUNK = 'SUNK',
}

export type CellPosition = {
  rank: number;
  file: number;
};

export class Cell {
  readonly id: string;
  private status: CellStatus;
  readonly position: CellPosition;

  static areAdjacent(cell1: Cell, cell2: Cell): boolean {
    if (cell1 === cell2) {
      return false;
    }

    const { rank: rank1, file: file1 } = cell1.position;
    const { rank: rank2, file: file2 } = cell2.position;

    return Math.abs(rank1 - rank2) + Math.abs(file1 - file2) === 1;
  }

  static areAdjacentDiagonally(cell1: Cell, cell2: Cell): boolean {
    if (cell1 === cell2) {
      return false;
    }

    const { rank: rank1, file: file1 } = cell1.position;
    const { rank: rank2, file: file2 } = cell2.position;

    return Math.abs(rank1 - rank2) === 1 && Math.abs(file1 - file2) === 1;
  }

  constructor(status: CellStatus, position: CellPosition) {
    this.status = status;
    this.position = position;
    this.id = `${String.fromCharCode(65 + position.rank)}${position.file + 1}`;
  }

  clone(): Cell {
    return new Cell(this.status, this.position);
  }

  isEmpty(): boolean {
    return this.status === CellStatus.EMPTY;
  }

  isMissed(): boolean {
    return this.status === CellStatus.MISSED;
  }

  isTechnicallyMissed(): boolean {
    return this.status === CellStatus.TECHNICALLY_MISSED;
  }

  isShip(): boolean {
    return this.status === CellStatus.SHIP;
  }

  isHit(): boolean {
    return this.status === CellStatus.HIT;
  }

  isSunk(): boolean {
    return this.status === CellStatus.SUNK;
  }

  getStatus(): CellStatus {
    return this.status;
  }

  setStatus(status: CellStatus) {
    this.status = status;
  }

  toString(): string {
    switch (this.status) {
      case CellStatus.EMPTY:
        return ' ';
      case CellStatus.SHIP:
        return '□';
      case CellStatus.HIT:
        return 'X';
      case CellStatus.MISSED:
        return '•';
      case CellStatus.TECHNICALLY_MISSED:
        return '○';
      case CellStatus.SUNK:
        return '☠';
      default:
        return ' ';
    }
  }
}
