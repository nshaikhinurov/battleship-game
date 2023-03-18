/* eslint-disable @typescript-eslint/no-non-null-assertion */
/** @jsxImportSource @emotion/react */

import { useCallback, useEffect, useRef, useState } from 'react';

import BattleFieldComponent from './components/BattleFieldComponent';
import { Footer } from './components/Footer';
import { GameStats } from './components/GameStats';
import { Header } from './components/Header';
import { consts } from './consts';
import { palette } from './consts/palette';
import { Cell, CellStatus } from './models/Cell';
import { GameModel, Player, sleep } from './models/GameModel';
import { logger } from './utils/logger';
import { useToggle } from './utils/useToggle';

function App() {
  const renderCountRef = useRef(0);
  const [, forceRerender] = useToggle(false);
  const [radarIsOn, toggleRadar] = useToggle(false);
  const [moveNumber, setMoveNumber] = useState(1);
  const [model, setModel] = useState<GameModel>(() => new GameModel());
  const { state, history } = model;
  const { humansBattleField, computersBattleField, currentPlayer, winner } = state;

  renderCountRef.current += 1;
  logger.log(`App rerendered ${renderCountRef.current} times`, model);

  function restart() {
    const model = new GameModel();
    setModel(model);
    setMoveNumber(1);
  }

  const initNextTurn = useCallback(async () => {
    await sleep(consts.computerTurnDelayMs);
    model.togglePlayer();
    forceRerender();
  }, [forceRerender, model]);

  const handleClick = useCallback(
    function (cell: Cell) {
      if (currentPlayer === Player.COMPUTER || winner) {
        return;
      }

      logger.log(`Shoot ${cell.id}`);

      if (cell.isEmpty() || cell.isTechnicallyMissed()) {
        model.setMissedShot(cell);
      }

      if (cell.isShip()) {
        model.setHitShot(cell);
      }

      model.history.push({
        state: model.state.clone(),
        move: cell.clone(),
        player: currentPlayer,
      });
      setMoveNumber((moveNumber) => moveNumber + 1);

      if (cell.isMissed()) {
        initNextTurn();
      }
    },
    [currentPlayer, initNextTurn, model, winner]
  );

  useEffect(
    function makeComputersShot() {
      if (winner || currentPlayer === Player.HUMAN) {
        return;
      }

      (async () => {
        // eslint-disable-next-line no-constant-condition
        while (true) {
          await sleep(consts.computerTurnDelayMs);

          const shotCell = model.makeComputersShot();

          model.history.push({
            state: model.state.clone(),
            move: shotCell.clone(),
            player: currentPlayer,
          });
          setMoveNumber((moveNumber) => moveNumber + 1);

          if (shotCell.isMissed()) {
            break;
          }
        }
        initNextTurn();
      })();
    },
    [currentPlayer, initNextTurn, model, winner]
  );

  return (
    <div css={appContainerWrapperStyles}>
      <div css={appContainerStyles}>
        <Header />

        <main css={mainWrapperStyles}>
          <BattleFieldComponent
            radarIsOn={radarIsOn}
            player="human"
            grid={humansBattleField.grid}
            isActive={!winner && currentPlayer === Player.COMPUTER}
          />
          <GameStats
            winner={winner}
            moveNumber={moveNumber}
            currentPlayer={currentPlayer}
            radarIsOn={radarIsOn}
            toggleRadar={toggleRadar}
            restart={restart}
            history={history.filter((entry) => entry.move.getStatus() !== CellStatus.TECHNICALLY_MISSED)}
          />
          <BattleFieldComponent
            radarIsOn={radarIsOn}
            player="computer"
            isActive={!winner && currentPlayer === Player.HUMAN}
            grid={computersBattleField.grid}
            handleCellClick={handleClick}
          />
        </main>
      </div>

      <Footer />
    </div>
  );
}

const appContainerWrapperStyles = {
  maxWidth: '100vw',
  minHeight: '100vh',
  color: palette.text,
  backgroundColor: palette.paper,

  display: 'flex',
  flexFlow: 'column',
  alignItems: 'center',
};

const appContainerStyles = {
  flex: '1 1 auto',
  display: 'flex',
  flexFlow: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  gap: '1rem',
};

const mainWrapperStyles = {
  display: 'flex',
  alignItems: 'stretch',
};

export default App;
