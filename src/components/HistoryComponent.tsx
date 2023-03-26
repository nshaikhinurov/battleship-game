/** @jsxImportSource @emotion/react */

import { useEffect, useRef } from 'react';
import { FaceSharp, SmartToySharp } from '@mui/icons-material';
import { consts } from 'src/consts';
import { palette } from 'src/consts/palette';
import { History, Player } from 'src/models/GameModel';

interface HistoryComponentProps {
  history: History;
}

export const HistoryComponent: React.FC<HistoryComponentProps> = ({ history }) => {
  const listRef = useRef<HTMLOListElement>(null);
  useEffect(
    function scrollLastEntryIntoView() {
      if (listRef.current) {
        listRef.current.lastElementChild?.scrollIntoView({
          behavior: 'smooth',
          block: 'end',
          inline: 'nearest',
        });
      }
    },
    [history.length]
  );

  return (
    <div css={historyStyles}>
      <ol ref={listRef}>
        {history.map(({ move, player }, i) => {
          const number = (
            <span css={{ marginRight: '0.5em', textAlign: 'right', fontFamily: 'monospace' }}>{i + 1}.</span>
          );
          const icon = (
            <div css={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
              {player === Player.HUMAN ? <FaceSharp sx={iconStyles} /> : <SmartToySharp sx={iconStyles} />}
            </div>
          );

          const moveId = <span css={{ fontFamily: 'monospace' }}>{move.id}</span>;
          const status = (
            <div
              css={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <div
                css={{
                  width: '1.5rem',
                  fontSize: '0.5em',
                  textAlign: 'center',
                  borderRadius: consts.cellGap,
                  padding: '0.5em 1em',
                  '&.hit': {
                    color: 'white',
                    backgroundColor: palette.active.hit,
                  },
                  '&.missed': {
                    backgroundColor: palette.active.missed,
                  },
                  '&.sunk': {
                    color: 'white',
                    backgroundColor: palette.active.sunk,
                  },
                }}
                className={move.getStatus().toLowerCase()}
              >
                {move.getStatus()}
              </div>
            </div>
          );

          return (
            <li key={`${player}-${move.id}`} className="entry">
              {number}
              {icon}
              {moveId}
              {status}
            </li>
          );
        })}
      </ol>
    </div>
  );
};

const historyStyles = {
  flex: '1 1 0',
  display: 'flex',
  flexFlow: 'column',
  fontSize: '0.5rem',
  'overflow-y': 'scroll',

  '&::-webkit-scrollbar': {
    width: `calc( 2 * ${consts.cellGap} )`,
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  '&::-webkit-scrollbar-thumb': {
    backgroundColor: palette.text,
    borderRadius: consts.cellGap,
  },

  '& .entry': {
    padding: `${consts.cellGap} calc(2 * ${consts.cellGap})`,
    display: 'grid',
    gap: `calc(2 * ${consts.cellGap})`,
    gridTemplateColumns: '15% 1fr 1fr auto',
    '&:nth-of-type(even)': {
      backgroundColor: 'rgba(0,0,0,0.05)',
    },
  },
};

const iconStyles = {
  fontSize: '0.5rem',
} as const;
