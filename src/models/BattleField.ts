import * as R from 'ramda';
import { consts } from 'src/consts';
import { deepClone } from 'src/utils/deepClone';
import { logger } from 'src/utils/logger';
import { popRandomElement } from 'src/utils/popRandomElement';

import { Cell, CellPosition, CellStatus } from './Cell';
import { Ship } from './Ship';

export type Grid = Cell[][];

export class BattleField {
  grid: Grid;
  ships: Ship[];

  constructor(grid: Grid, ships: Ship[]) {
    this.grid = grid;
    this.ships = ships;
  }

  static clone(battleField: BattleField): BattleField {
    return new BattleField(
      battleField.grid.map((row) => row.map((cell) => cell.clone())),
      battleField.ships
    );
  }

  static generateBattleField(): BattleField {
    const emptyGrid = this.getEmptyGrid();
    const remainingShipSizesToPlace = this.getRemainingShipSizesToPlace();
    const initialBattleField: BattleField = new BattleField(emptyGrid, []);

    const finalBattleField = this.createBattleFieldRecursive(initialBattleField, remainingShipSizesToPlace);

    if (!finalBattleField) {
      throw new Error('Не удалось сгенерировать поле');
    }

    return finalBattleField;
  }

  private static getEmptyGrid(): Grid {
    return R.times(
      (rank) =>
        R.times(
          (file) =>
            new Cell(CellStatus.EMPTY, {
              rank,
              file,
            }),
          consts.fieldSize
        ),
      consts.fieldSize
    );
  }

  private static getRemainingShipSizesToPlace(): number[] {
    const remainingShipsToPlace: number[] = [];

    R.range(1, 5).forEach((shipSize) => {
      const numberOfShips = 5 - shipSize;

      R.range(0, numberOfShips).forEach(() => {
        remainingShipsToPlace.push(shipSize);
      });
    });

    return remainingShipsToPlace.reverse();
  }

  private static createBattleFieldRecursive(
    currentBattleField: BattleField,
    shipSizesToPlace: number[]
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

    logger.debug('================\n', 'Рекурсия:', {
      currentBattleField: {
        ships: currentBattleField.ships.map((ship) => ship.toString()),
        grid: currentBattleField.grid.map((row) => row.map((cell) => cell.toString())),
      },
      shipSizesToPlace,
    });

    if (R.isEmpty(shipSizesToPlace)) return currentBattleField;

    const [currentShipSize, ...remainingShipSizesToPlace] = shipSizesToPlace;

    const shipType = Math.random() < 0.5 ? 'horizontal' : 'vertical';
    const possibleShipPositions =
      shipType === 'horizontal'
        ? this.getPossibleHorizontalShipCells(currentBattleField.grid, currentShipSize)
        : this.getPossibleVerticalShipCells(currentBattleField.grid, currentShipSize);

    logger.debug(
      'Возможные позиции:',
      possibleShipPositions.map((cell) => cell.id)
    );

    let newBattleField: BattleField | null = null;

    while (newBattleField === null && !R.isEmpty(possibleShipPositions)) {
      const shipPosition = popRandomElement(possibleShipPositions);

      if (shipPosition) {
        logger.debug(
          'Попытка разместить корабль на позиции: ',
          shipPosition.id,
          'типа: ',
          shipType,
          'размера: ',
          currentShipSize
        );
        const newShip = new Ship(currentShipSize, shipType, shipPosition.position);

        const newGrid =
          shipType === 'horizontal'
            ? this.placeShipHorizontally(currentBattleField.grid, newShip, shipPosition.position)
            : this.placeShipVertically(currentBattleField.grid, newShip, shipPosition.position);

        logger.debug(
          'Результат:',
          newGrid.map((row) => row.map((cell) => cell.toString()))
        );

        newBattleField = this.createBattleFieldRecursive(
          {
            ships: [...currentBattleField.ships, newShip],
            grid: newGrid,
          },
          remainingShipSizesToPlace
        );
      }
    }

    return newBattleField;
  }

  private static getShipCells(
    grid: Grid,
    shipSize: number,
    shipPosition: Cell,
    shipType: 'horizontal' | 'vertical'
  ): Cell[] {
    const shipCells: Cell[] = [];

    for (let i = 0; i < shipSize; i++) {
      const cellPosition = {
        rank: shipType === 'horizontal' ? shipPosition.position.rank : shipPosition.position.rank + i,
        file: shipType === 'horizontal' ? shipPosition.position.file + i : shipPosition.position.file,
      };
      shipCells.push(grid[cellPosition.rank][cellPosition.file]);
    }

    return shipCells;
  }

  private static getPossibleHorizontalShipCells(grid: Grid, shipSize: number): Cell[] {
    // Позицию корабля будем определять индексом его левой клетки в массиве
    const possibleHorizontalShipCells: Cell[] = grid
      .flat()
      .filter((cell) => this.isPossibleHorizontalShipPosition(cell, grid, shipSize));

    return possibleHorizontalShipCells;
  }

  private static isPossibleHorizontalShipPosition(cell: Cell, grid: Grid, shipSize: number) {
    const { rank, file } = cell.position;
    const maxShipFile = file + shipSize - 1;
    if (maxShipFile >= consts.fieldSize) return false; // корабль выйдет за границы поля

    // нельзя пересекать другие корабли, соприкасаться бортами или углами
    const minAdjacentRank = R.clamp(0, consts.fieldSize - 1, rank - 1);
    const minAdjacentFile = R.clamp(0, consts.fieldSize - 1, file - 1);
    const maxAdjacentRank = R.clamp(0, consts.fieldSize - 1, rank + 1);
    const maxAdjacentFile = R.clamp(0, consts.fieldSize - 1, maxShipFile + 1);

    for (let row = minAdjacentRank; row <= maxAdjacentRank; row++) {
      for (let col = minAdjacentFile; col <= maxAdjacentFile; col++) {
        if (!grid[row][col].isEmpty()) return false;
      }
    }

    return true;
  }

  private static getPossibleVerticalShipCells(grid: Grid, shipSize: number): Cell[] {
    // Позицию корабля будем определять индексом его верхней клетки в массиве
    const possibleVerticalShipCells: Cell[] = grid
      .flat()
      .filter((cell) => this.isPossibleVerticalShipCell(cell, grid, shipSize));

    return possibleVerticalShipCells;
  }

  private static isPossibleVerticalShipCell(cell: Cell, grid: Grid, shipSize: number) {
    const { rank, file } = cell.position;
    const maxShipRank = rank + shipSize - 1;
    if (maxShipRank >= consts.fieldSize) return false; // корабль выйдет за границы поля

    // нельзя пересекать другие корабли, соприкасаться бортами или углами
    const minAdjacentRank = R.clamp(0, consts.fieldSize - 1, rank - 1);
    const minAdjacentFile = R.clamp(0, consts.fieldSize - 1, file - 1);
    const maxAdjacentRank = R.clamp(0, consts.fieldSize - 1, maxShipRank + 1);
    const maxAdjacentFile = R.clamp(0, consts.fieldSize - 1, file + 1);

    for (let row = minAdjacentRank; row <= maxAdjacentRank; row++) {
      for (let col = minAdjacentFile; col <= maxAdjacentFile; col++) {
        if (!grid[row][col].isEmpty()) return false;
      }
    }

    return true;
  }

  private static placeShipHorizontally(grid: Grid, ship: Ship, position: CellPosition): Grid {
    const { size } = ship;
    const newGrid = deepClone(grid);

    for (let file = position.file; file < position.file + size; file++) {
      const newShipCell = new Cell(CellStatus.SHIP, { rank: position.rank, file });
      newGrid[position.rank][file] = newShipCell;
    }

    return newGrid;
  }

  private static placeShipVertically(grid: Grid, ship: Ship, position: CellPosition): Grid {
    const { size } = ship;
    const newGrid = deepClone(grid);

    for (let rank = position.rank; rank < position.rank + size; rank++) {
      const newShipCell = new Cell(CellStatus.SHIP, { rank, file: position.file });
      newGrid[rank][position.file] = newShipCell;
    }

    return newGrid;
  }
}
