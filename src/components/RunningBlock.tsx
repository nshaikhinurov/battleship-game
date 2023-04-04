export const RunningBlock = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex h-10 flex-col items-center justify-center bg-text text-xl font-bold uppercase text-sky-50">
      {children}
    </div>
  );
};
