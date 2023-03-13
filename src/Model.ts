import * as R from 'ramda';

import { consts } from './consts';

export enum CellStatus {
  EMPTY,
  SHIP,
  HIT,
  MISSED,
  SUNK,
}

export type GameState = {
  humansBattleField: BattleField;
  computersBattleField: BattleField;
  currentPlayer: 'human' | 'computer';
};

type Grid = CellStatus[][];

type BattleField = {
  grid: Grid;
  ships: Ship[];
};

type Ship = {
  size: number;
  position: ShipPosition;
};

type ShipPosition = {
  rank: number;
  file: number;
};

export class GameModel {
  state: GameState = {} as GameState;

  constructor() {
    this.state = {
      humansBattleField: this.generateBattleField(),
      computersBattleField: this.generateBattleField(),
      currentPlayer: 'human',
    };
  }

  private generateBattleField(): BattleField {
    const emptyGrid = this.getEmptyGrid();
    const remainingShipsToPlace = this.getRemainingShipsToPlace();
    const initialBattleField: BattleField = {
      grid: emptyGrid,
      ships: [],
    };

    const finalBattleField = this.createBattleFieldRecursive(initialBattleField, remainingShipsToPlace);

    if (!finalBattleField) {
      throw new Error('Не удалось сгенерировать поле');
    }

    return finalBattleField;
  }

  private getEmptyGrid(): Grid {
    return R.times(() => R.times(() => CellStatus.EMPTY, consts.fieldSize), consts.fieldSize);
  }

  private getRemainingShipsToPlace(): Omit<Ship, 'position'>[] {
    const remainingShipsToPlace = [];

    for (let shipSize = 4; shipSize >= 1; shipSize--) {
      const numberOfShips = 5 - shipSize;

      for (let i = 0; i < numberOfShips; i++) {
        remainingShipsToPlace.push({
          size: shipSize,
        });
      }
    }

    return remainingShipsToPlace;
  }

  private createBattleFieldRecursive(
    currentBattleField: BattleField,
    shipsToPlace: Omit<Ship, 'position'>[]
  ): BattleField | null {
    /*
      ===== Рекурсивный алгоритм генерации расположения кораблей на поле =====
      Кратко: идея алгоритма та же, что и в решении задачи о восьми ферзях — поиск с возвратом.
      
      Подробнее:
      Имеем стек кораблей, которые нужно расположить на поле и карту с данными о расположении кораблей.
      Берем очередной корабль из стека, ищем все доступные для него позиции на поле с учетом текущей карты.
      Выбираем случайную позицию из доступных, и располагаем корабль там. Углубляемся в рекурсию, передавая в нее новый стек кораблей и новую карту.
      Если корабль расположить было некуда, возвращаем текущий и предыдущий корабль из карты обратно в стек.
      Повторяем алгоритм, пока не расположим все корабли.
      */

    if (R.isEmpty(shipsToPlace)) return currentBattleField;

    const [currentShip, ...remainingShipsToPlace] = shipsToPlace;

    const shipType = Math.random() < 0.5 ? 'horizontal' : 'vertical';
    const possibleShipPositions =
      shipType === 'horizontal'
        ? this.getPossibleHorizontalShipPositions(currentBattleField.grid, currentShip.size)
        : this.getPossibleVerticalShipPositions(currentBattleField.grid, currentShip.size);

    let newBattleField: BattleField | null = null;

    while (newBattleField === null && !R.isEmpty(possibleShipPositions)) {
      const shipPosition = popRandomElement(possibleShipPositions);

      if (shipPosition) {
        const newShip: Ship = {
          size: currentShip.size,
          position: shipPosition,
        };

        const newGrid =
          shipType === 'horizontal'
            ? this.placeShipHorizontally(currentBattleField.grid, currentShip.size, shipPosition)
            : this.placeShipVertically(currentBattleField.grid, currentShip.size, shipPosition);

        newBattleField = this.createBattleFieldRecursive(
          {
            ships: [...currentBattleField.ships, newShip],
            grid: newGrid,
          },
          remainingShipsToPlace
        );
      }
    }

    return newBattleField;
  }

  private getPossibleHorizontalShipPositions(grid: Grid, shipSize: number): ShipPosition[] {
    // Позицию корабля будем определять индексом его левой клетки в массиве
    const possibleHorizontalShipPositions: ShipPosition[] = [...new Array(consts.fieldSize * consts.fieldSize)]
      .map((_, i) => ({
        rank: Math.floor(i / consts.fieldSize),
        file: i % consts.fieldSize,
      }))
      .filter(({ rank, file }) => this.isPossibleHorizontalShipPosition(rank, file, grid, shipSize));

    return possibleHorizontalShipPositions;
  }

  private isPossibleHorizontalShipPosition(rank: number, file: number, grid: Grid, shipSize: number) {
    const maxShipFile = file + shipSize - 1;
    if (maxShipFile >= consts.fieldSize) return false; // корабль выйдет за границы поля

    // нельзя пересекать другие корабли, соприкасаться бортами или углами
    const minAdjacentRank = R.clamp(0, consts.fieldSize - 1, rank - 1);
    const minAdjacentFile = R.clamp(0, consts.fieldSize - 1, file - 1);
    const maxAdjacentRank = R.clamp(0, consts.fieldSize - 1, rank + 1);
    const maxAdjacentFile = R.clamp(0, consts.fieldSize - 1, maxShipFile + 1);

    for (let row = minAdjacentRank; row <= maxAdjacentRank; row++) {
      for (let col = minAdjacentFile; col <= maxAdjacentFile; col++) {
        if (grid[row][col] !== CellStatus.EMPTY) return false;
      }
    }

    return true;
  }

  private getPossibleVerticalShipPositions(grid: Grid, shipSize: number) {
    // Позицию корабля будем определять индексом его верхней клетки в массиве
    const possibleVerticalShipPositions: ShipPosition[] = [...new Array(consts.fieldSize * consts.fieldSize)]
      .map((_, i) => ({
        rank: Math.floor(i / consts.fieldSize),
        file: i % consts.fieldSize,
      }))
      .filter(({ rank, file }) => this.isPossibleVerticalShipPosition(rank, file, grid, shipSize));

    return possibleVerticalShipPositions;
  }

  private isPossibleVerticalShipPosition(rank: number, file: number, grid: Grid, shipSize: number) {
    const maxShipRank = rank + shipSize - 1;
    if (maxShipRank >= consts.fieldSize) return false; // корабль выйдет за границы поля

    // нельзя пересекать другие корабли, соприкасаться бортами или углами
    const minAdjacentRank = R.clamp(0, consts.fieldSize - 1, rank - 1);
    const minAdjacentFile = R.clamp(0, consts.fieldSize - 1, file - 1);
    const maxAdjacentRank = R.clamp(0, consts.fieldSize - 1, maxShipRank + 1);
    const maxAdjacentFile = R.clamp(0, consts.fieldSize - 1, file + 1);

    for (let row = minAdjacentRank; row <= maxAdjacentRank; row++) {
      for (let col = minAdjacentFile; col <= maxAdjacentFile; col++) {
        if (grid[row][col] !== CellStatus.EMPTY) return false;
      }
    }

    return true;
  }

  private placeShipHorizontally(grid: Grid, shipSize: number, position: ShipPosition): Grid {
    const newGrid = structuredClone(grid);
    newGrid[position.rank].fill(CellStatus.SHIP, position.file, position.file + shipSize);

    return newGrid;
  }

  private placeShipVertically(grid: Grid, shipSize: number, position: ShipPosition): Grid {
    const newGrid = structuredClone(grid);

    for (let row = position.rank; row < position.rank + shipSize; row++) {
      newGrid[row][position.file] = CellStatus.SHIP;
    }

    return newGrid;
  }

  setCellStatus(rank: number, file: number, status: CellStatus) {
    this.state = structuredClone(this.state);
    this.state.computersBattleField.grid[rank][file] = status;
  }
}

function popRandomElement<T>(array: T[]): T | null {
  if (array.length === 0) return null;

  const randomIndex = Math.floor(Math.random() * array.length);
  const [element] = array.splice(randomIndex, 1);

  return element;
}

// async function sleep(ms: number) {
//   return new Promise((resolve) => setTimeout(resolve, ms));
// }
