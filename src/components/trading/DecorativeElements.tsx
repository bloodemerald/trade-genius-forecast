interface DecorativeElementsProps {
  children: React.ReactNode;
}

export const DecorativeElements = ({ children }: DecorativeElementsProps) => {
  return (
    <div className="relative">
      {/* Glowing line effect */}
      <div className="absolute h-[1px] w-full left-0 top-0 bg-gradient-to-r from-transparent via-trading-accent/20 to-transparent" />
      
      {/* Decorative corner elements */}
      <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-trading-accent/30" />
      <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-trading-accent/30" />
      <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-trading-accent/30" />
      <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-trading-accent/30" />
      
      {children}
    </div>
  );
};