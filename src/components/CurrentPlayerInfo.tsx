/** @jsxImportSource @emotion/react */

import { FaceSharp, SmartToySharp } from '@mui/icons-material';
import { Player } from 'src/models/GameModel';

interface CurrentPlayerInfoProps {
  currentPlayer: Player;
  winner: Player | null;
}

export const CurrentPlayerInfo: React.FC<CurrentPlayerInfoProps> = ({ currentPlayer, winner }) => {
  const isHuman = currentPlayer === Player.HUMAN;
  const winnerText = isHuman ? 'Wins' : <code>Wins</code>;
  const icon = isHuman ? <FaceSharp sx={{ fontSize: '1rem' }} /> : <SmartToySharp sx={{ fontSize: '1rem' }} />;

  return (
    <div css={currentPlayerInfoStyles}>
      {icon}
      {winner && <b>{winnerText}</b>}
    </div>
  );
};
const currentPlayerInfoStyles = {
  height: '1rem',
  padding: '0 0.5em',

  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  gap: '0.5em',
  fontSize: '0.5rem',
  fontWeight: 'bold',
} as const;
