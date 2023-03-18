import { Grid } from './BattleField';
import { Cell, CellPosition } from './Cell';

export class Ship {
  size: number;
  type: 'horizontal' | 'vertical';
  bowPosition: CellPosition;

  constructor(size: number, type: 'horizontal' | 'vertical', bowPosition: CellPosition) {
    this.size = size;
    this.type = type;
    this.bowPosition = bowPosition;
  }

  getCells(grid: Grid): Cell[] {
    return grid.flat().filter((cell) => {
      if (this.type === 'horizontal') {
        return (
          cell.position.rank === this.bowPosition.rank &&
          inRange(cell.position.file, this.bowPosition.file, this.bowPosition.file + this.size)
        );
      } else {
        return (
          cell.position.file === this.bowPosition.file &&
          inRange(cell.position.rank, this.bowPosition.rank, this.bowPosition.rank + this.size)
        );
      }
    });
  }
}

function inRange(value: number, min: number, max: number): boolean {
  return min <= value && value < max;
}
