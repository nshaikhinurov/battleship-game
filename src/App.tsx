/** @jsxImportSource @emotion/react */

import { useState } from 'react';

import battleshipLogo from './assets/battleshipLogo.png';
import radar from './assets/radar.png';
import BattleField from './BattleField';
import { CellStatus, GameModel } from './Model';
import { useToggle } from './useToggle';

function App() {
  const [model, setModel] = useState<GameModel>(new GameModel());
  const [state, setState] = useState(model.state);
  const { humansBattleField, computersBattleField, currentPlayer } = state;
  const [radarIsOn, toggleRadar] = useToggle(true);

  function restart() {
    const model = new GameModel();
    setModel(model);
    setState(model.state);
  }

  function handleClick(rank: number, file: number) {
    // eslint-disable-next-line no-console
    console.log(`Shoot ${String.fromCharCode(65 + rank)}${file + 1}`);

    if (currentPlayer !== 'human') {
      return;
    }

    const shotCell = state.computersBattleField.grid[rank][file];
    if (shotCell === CellStatus.EMPTY) {
      model.setCellStatus(rank, file, CellStatus.MISSED);
    }
    if (shotCell === CellStatus.SHIP) {
      model.setCellStatus(rank, file, CellStatus.HIT);
    }

    setState(model.state);
  }

  return (
    <div css={appContainerStyles}>
      <header css={headerStyles}>
        <img src={battleshipLogo} alt="Battleship" />
        <h1>Battleship</h1>
      </header>
      {humansBattleField && (
        <div css={{ display: 'flex' }}>
          <BattleField radarIsOn={radarIsOn} player="human" grid={humansBattleField.grid} />
          <BattleField
            radarIsOn={radarIsOn}
            player="computer"
            grid={computersBattleField.grid}
            handleCellClick={handleClick}
          />
        </div>
      )}
      <div css={buttonsWrapperStyles}>
        <button css={buttonStyles} type="button" onClick={toggleRadar}>
          <img src={radar} alt="Radar" />
          <span>Toggle Radar (cheating)</span>
        </button>
        <button css={buttonStyles} type="button" onClick={restart}>
          <i className="fas fa-times" />
          Restart
        </button>
      </div>
    </div>
  );
}

export default App;

const appContainerStyles = {
  width: '100vw',
  height: '100vh',
  padding: '1em',
  backgroundColor: '#eee',

  fontSize: '50px',
  color: '#333',

  display: 'flex',
  flexFlow: 'column',
  justifyContent: 'flex-start',
  alignItems: 'center',
  gap: '1em',
};

const headerStyles = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  gap: '0.75em',

  '& img': {
    width: '1.5em',
    height: '1.5em',
  },

  '& h1': {
    textTransform: 'uppercase',
    fontSize: '1.5em',
    letterSpacing: '0.5em',
  },
} as const;

const buttonsWrapperStyles = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  gap: '1em',
};

const buttonStyles = {
  fontSize: '0.5em',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  gap: '0.5em',
  padding: '0.5em 1em',
  backgroundColor: '#1F3C88',
  color: '#fff',
  textTransform: 'uppercase',
  cursor: 'pointer',
  borderRadius: '4px',
  border: 'none',
  '&:hover': {
    backgroundColor: '#F7B633',
  },
  '& img': {
    width: '1em',
    height: '1em',
  },
} as const;
