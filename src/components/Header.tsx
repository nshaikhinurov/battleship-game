import battleshipLogo from 'src/assets/battleshipLogo.png';

export const Header = () => {
  return (
    <header className="flex items-center justify-center gap-8">
      <img src={battleshipLogo} alt="Battleship" className="h-16 w-16" />
      <h1 className="text-6xl font-black uppercase tracking-[0.5em]">Battleship</h1>
    </header>
  );
};
