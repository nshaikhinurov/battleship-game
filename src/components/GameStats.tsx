/** @jsxImportSource @emotion/react */

import { RefreshSharp } from '@mui/icons-material';
import radar from 'src/assets/radar.png';
import { consts } from 'src/consts';
import { palette } from 'src/consts/palette';
import { History, Player } from 'src/models/GameModel';

import { CurrentPlayerInfo } from './CurrentPlayerInfo';
import { HistoryComponent } from './HistoryComponent';

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
    <div css={gameStatsWrapperStyles}>
      <div css={gameStatsStyles}>
        <div className="header">Game Stats</div>
        <CurrentPlayerInfo currentPlayer={currentPlayer} winner={winner} />
        <HistoryComponent history={history} />
        <div className="header">Move {moveNumber}</div>
      </div>

      <button css={buttonStyles} type="button" onClick={toggleRadar}>
        <img src={radar} alt="Radar" />
        <span>Turn Radar {radarIsOn ? 'Off' : 'On'}</span>
      </button>

      <button css={buttonStyles} type="button" onClick={restart}>
        <RefreshSharp style={{ fontSize: '1em', transform: 'scale(1.5,1.5)' }} />
        <span>Restart Game</span>
      </button>
    </div>
  );
};

const gameStatsWrapperStyles = {
  width: '6rem',
  height: `calc(10rem + 9 * ${consts.cellGap})`,
  margin: '1rem 0 1rem 0.25rem',
  display: 'flex',
  flexFlow: 'column',
  gap: consts.cellGap,
} as const;

const gameStatsStyles = {
  flex: '1 1 0',
  backgroundColor: 'rgba(0,0,0,0.05)',
  borderRadius: '4px',
  overflow: 'hidden',

  display: 'flex',
  flexFlow: 'column',
  gap: consts.cellGap,

  '& .header': {
    height: '1rem',
    display: 'flex',
    flexFlow: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.5rem',
    textTransform: 'uppercase',
    fontWeight: 'bold',
    color: 'white',
    backgroundColor: palette.text,
  },

  '& .content': {
    flex: '1 1 0',
    display: 'flex',
    flexFlow: 'column',
    alignItems: 'stretch',
    justifyContent: 'space-between',
  },
} as const;

const buttonStyles = {
  height: '1rem',
  fontSize: '0.4rem',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  gap: '0.5em',
  backgroundColor: palette.button,
  color: '#fff',
  textTransform: 'uppercase',
  fontWeight: 'bold',
  cursor: 'pointer',
  borderRadius: '4px',
  border: 'none',
  transition: 'all 0.2s linear',
  '&:hover': {
    backgroundColor: palette.buttonHover,
    letterSpacing: '0.03em',
  },

  '& img': {
    width: '1em',
    height: '1em',
  },
} as const;
