import { BattleField } from './BattleField';
import { Player } from './GameModel';

export class GameState {
  humansBattleField: BattleField;
  computersBattleField: BattleField;
  currentPlayer: Player;
  winner: Player | null;

  constructor(humansBattleField: BattleField, computersBattleField: BattleField, currentPlayer: Player) {
    this.humansBattleField = humansBattleField;
    this.computersBattleField = computersBattleField;
    this.currentPlayer = currentPlayer;
    this.winner = null;
  }

  clone(): GameState {
    return new GameState(
      BattleField.clone(this.humansBattleField),
      BattleField.clone(this.computersBattleField),
      this.currentPlayer
    );
  }
}
