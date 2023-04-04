import { useEffect, useRef } from 'react';
import { FaceSharp, SmartToySharp } from '@mui/icons-material';
import cx from 'classnames';
import { History, Player } from 'src/models/GameModel';

interface HistoryComponentProps {
  history: History;
}

export const HistoryComponent: React.FC<HistoryComponentProps> = ({ history }) => {
  const listRef = useRef<HTMLOListElement>(null);
  useEffect(
    function autoScrollHistory() {
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
    <div className="flex max-h-[calc(5*theme('spacing.10')+4*theme('spacing.1'))] flex-1 flex-col overflow-y-scroll text-xl scrollbar-thin scrollbar-thumb-sky-950 scrollbar-thumb-rounded-full">
      <ol ref={listRef}>
        {history.map(({ move, player }, i) => {
          const number = <span className="text-right font-mono text-xl text-slate-400">{i + 1}.</span>;
          const icon = (
            <div className="flex items-center justify-end text-xl">
              {player === Player.HUMAN ? <FaceSharp /> : <SmartToySharp />}
            </div>
          );

          const moveId = <span className="font-mono text-xl font-black">{move.id}</span>;
          const status = (
            <div
              className={cx(
                'flex w-16 items-center justify-center rounded px-3 py-1 text-xs font-semibold ',
                {
                  HIT: 'bg-red-600 text-red-100',
                  MISSED: 'bg-sky-300 text-sky-800',
                  SUNK: 'bg-sky-950 text-sky-100',
                  EMPTY: '',
                  SHIP: '',
                  TECHNICALLY_MISSED: '',
                }[move.getStatus()]
              )}
            >
              {move.getStatus()}
            </div>
          );

          return (
            <li
              key={`${player}-${move.id}`}
              className="grid grid-cols-[36px_1fr_1fr_auto] gap-2 px-2 py-1 even:bg-slate-200"
            >
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
