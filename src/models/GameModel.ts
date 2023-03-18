import * as R from 'ramda';
import { logger } from 'src/utils/logger';
import { popRandomElement } from 'src/utils/popRandomElement';

import { BattleField } from './BattleField';
import { Cell, CellStatus } from './Cell';
import { GameState } from './State';

export enum Player {
  HUMAN = 'human',
  COMPUTER = 'computer',
}

export type History = {
  state: GameState;
  move: Cell;
  player: Player;
}[];

export class GameModel {
  state: GameState;
  history: History;

  constructor() {
    const humansBattleField = BattleField.generateBattleField();
    const computersBattleField = BattleField.generateBattleField();
    // const currentPlayer = Math.random() < 0.5 ? Player.HUMAN : Player.COMPUTER;
    const currentPlayer = Player.COMPUTER;

    this.state = new GameState(humansBattleField, computersBattleField, currentPlayer);
    this.history = [];
  }

  private setCellStatus(cell: Cell, status: CellStatus) {
    cell.setStatus(status);
  }

  setMissedShot(cell: Cell): void {
    this.setCellStatus(cell, CellStatus.MISSED);
  }

  setHitShot(cell: Cell) {
    const getBattleField = () => {
      const player = this.state.currentPlayer === Player.HUMAN ? Player.COMPUTER : Player.HUMAN;
      return this.state[player === Player.HUMAN ? 'humansBattleField' : 'computersBattleField'];
    };

    if (!getBattleField()) {
      throw new Error('Cell not found');
    }

    this.setCellStatus(cell, CellStatus.HIT);

    const adjacentDiagonallyEmptyCells = getBattleField()
      .grid.flat()
      .filter((maybeAdjacentCell) => {
        return maybeAdjacentCell.isEmpty() && Cell.areAdjacentDiagonally(maybeAdjacentCell, cell);
      });

    adjacentDiagonallyEmptyCells.forEach((adjacentCell) => {
      this.setCellStatus(adjacentCell, CellStatus.TECHNICALLY_MISSED);
    });

    const ships = getBattleField().ships;
    const sunkShip = ships.find((ship) => ship.getCells(getBattleField().grid).every((cell) => cell.isHit()));

    if (sunkShip) {
      sunkShip.getCells(getBattleField().grid).forEach((cell) => {
        this.setSunkShot(cell);
      });

      const adjacentCells = getBattleField()
        .grid.flat()
        .filter((cell) => {
          return (
            cell.isEmpty() &&
            sunkShip.getCells(getBattleField().grid).some((shipCell) => Cell.areAdjacent(cell, shipCell))
          );
        });

      adjacentCells.forEach((cell) => {
        this.setCellStatus(cell, CellStatus.TECHNICALLY_MISSED);
      });
    }
  }

  setSunkShot(cell: Cell) {
    this.setCellStatus(cell, CellStatus.SUNK);

    const opponentsBattleField =
      this.state.currentPlayer === Player.HUMAN ? this.state.computersBattleField : this.state.humansBattleField;
    const { grid } = opponentsBattleField;

    if (!grid.flat().some((cell) => cell.isShip())) {
      this.state.winner = this.state.currentPlayer;
    }
  }

  togglePlayer() {
    this.state.currentPlayer = this.state.currentPlayer === Player.HUMAN ? Player.COMPUTER : Player.HUMAN;
  }

  makeComputersShot(): Cell {
    const { grid } = this.state.humansBattleField;
    const possibleShots: Cell[] = grid.flat().filter((cell) => cell.isEmpty() || cell.isShip());
    const {
      EMPTY: emptyCells,
      SHIP: shipCells,
      HIT: hitCells,
    } = R.tap(
      logger.log,
      R.groupBy((cell) => cell.getStatus(), grid.flat())
    );

    let shotCell: Cell | null;

    if (hitCells && !R.isEmpty(hitCells)) {
      const adjacentCells = possibleShots.filter((cell) => {
        return hitCells.some((hitCell) => Cell.areAdjacent(cell, hitCell));
      });
      logger.log('🚀 ~ file: GameModel.ts:101 ~ GameModel ~ makeComputersShot ~ hitCells:', {
        hitCells,
        possibleShots,
        adjacentCells,
      });
      shotCell = popRandomElement(adjacentCells);
    } else {
      const shipPossibilityAdjasted = (1.25 * shipCells.length) / possibleShots.length;
      logger.log(
        '🚀 ~ file: GameModel.ts:121 ~ GameModel ~ makeComputersShot ~ shipPossibilityAdjasted:',
        shipPossibilityAdjasted
      );
      shotCell = popRandomElement(Math.random() < shipPossibilityAdjasted ? shipCells : emptyCells);
    }

    if (!shotCell) throw new Error('No possible shots');
    logger.log('🚀 ~ file: GameModel.ts:101 ~ GameModel ~ makeComputersShot ~ shotCell:', shotCell);

    if (shotCell.isShip()) {
      this.setHitShot(shotCell);
    } else {
      this.setMissedShot(shotCell);
    }

    return shotCell;
  }
}

export async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
