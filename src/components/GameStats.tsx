import { BiRadar } from 'react-icons/bi';
import { RefreshSharp } from '@mui/icons-material';
import { History, Player } from 'src/models/GameModel';

import { CurrentPlayerInfo } from './CurrentPlayerInfo';
import { HistoryComponent } from './HistoryComponent';
import { RunningBlock } from './RunningBlock';

interface GameStatsProps {
  moveNumber: number;
  currentPlayer: Player;
  radarIsOn: boolean;
  toggleRadar: () => void;
  restart: () => void;
  history: History;
  winner: Player | null;
}

export const GameStats: React.FC<GameStatsProps> = ({
  moveNumber,
  currentPlayer,
  toggleRadar,
  radarIsOn,
  restart,
  history,
  winner,
}) => {
  return (
    <div className="my-10 ml-2 flex w-60 flex-col gap-1">
      <div className="flex grow flex-col gap-1 overflow-hidden rounded bg-slate-100">
        <RunningBlock>Game Stats</RunningBlock>
        <CurrentPlayerInfo currentPlayer={currentPlayer} winner={winner} />
        <HistoryComponent history={history} />
        <RunningBlock>Move {moveNumber}</RunningBlock>
      </div>

      <button
        className="flex h-10 cursor-pointer items-center justify-center gap-4 rounded border-none bg-button text-base font-bold uppercase text-white transition-all duration-200 ease-linear hover:bg-button-hover hover:tracking-wide"
        type="button"
        onClick={toggleRadar}
      >
        <BiRadar className="text-2xl" />
        <span>Turn Radar {radarIsOn ? 'Off' : 'On'}</span>
      </button>

      <button
        className="flex h-10 cursor-pointer items-center justify-center gap-4 rounded border-none bg-button text-base font-bold uppercase text-white transition-all duration-200 ease-linear hover:bg-button-hover hover:tracking-wide"
        type="button"
        onClick={restart}
      >
        <RefreshSharp className="scale-125 " />
        <span>Restart Game</span>
      </button>
    </div>
  );
};
