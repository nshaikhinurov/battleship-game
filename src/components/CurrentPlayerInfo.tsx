import { FaceSharp, SmartToySharp } from '@mui/icons-material';
import { Player } from 'src/models/GameModel';

interface CurrentPlayerInfoProps {
  currentPlayer: Player;
  winner: Player | null;
}

export const CurrentPlayerInfo: React.FC<CurrentPlayerInfoProps> = ({ currentPlayer, winner }) => {
  const isHuman = currentPlayer === Player.HUMAN;
  const winnerText = isHuman ? 'Wins' : <code>Wins</code>;
  const icon = isHuman ? <FaceSharp sx={{ fontSize: '40px' }} /> : <SmartToySharp sx={{ fontSize: '40px' }} />;

  return (
    <div className="flex h-10 items-center justify-center gap-2 px-5 text-xl font-bold">
      {icon}
      {winner && <b>{winnerText}</b>}
    </div>
  );
};
