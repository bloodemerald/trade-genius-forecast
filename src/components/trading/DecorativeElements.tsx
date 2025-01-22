interface DecorativeElementsProps {
  children: React.ReactNode;
}

export const DecorativeElements = ({ children }: DecorativeElementsProps) => {
  return (
    <div className="relative">
      {/* Glowing line effect */}
      <div className="absolute h-[1px] w-full left-0 top-0 bg-gradient-to-r from-transparent via-[#9b87f5]/50 to-transparent" />
      
      {/* Decorative corner elements */}
      <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-[#9b87f5]/30" />
      <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-[#9b87f5]/30" />
      <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-[#9b87f5]/30" />
      <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-[#9b87f5]/30" />
      
      {children}
    </div>
  );
};