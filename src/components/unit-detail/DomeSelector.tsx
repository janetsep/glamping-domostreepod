interface DomeSelectorProps {
  selectedDomos: number;
  setSelectedDomos: (domos: number) => void;
  availableDomos?: number;
  packageBasePrice: number;
}

export const DomeSelector = ({ 
  selectedDomos, 
  setSelectedDomos, 
  availableDomos,
  packageBasePrice 
}: DomeSelectorProps) => {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Número de domos</label>
      <div className="flex items-center space-x-4">
        <button
          onClick={() => setSelectedDomos(Math.max(1, selectedDomos - 1))}
          className="w-8 h-8 rounded-full border border-primary/20 hover:bg-primary/10 flex items-center justify-center"
          disabled={selectedDomos <= 1}
        >
          -
        </button>
        <span className="w-12 text-center font-medium">{selectedDomos}</span>
        <button
          onClick={() => setSelectedDomos(Math.min((availableDomos || 6), selectedDomos + 1))}
          className="w-8 h-8 rounded-full border border-primary/20 hover:bg-primary/10 flex items-center justify-center"
          disabled={availableDomos !== undefined && selectedDomos >= availableDomos}
        >
          +
        </button>
      </div>
      <p className="text-xs text-gray-600">
        Precio total: ${(selectedDomos * packageBasePrice).toLocaleString()} CLP
      </p>
    </div>
  );
};