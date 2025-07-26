// Iconos auténticos de las plataformas de reseñas

export const AirbnbIcon = ({ className }: { className?: string }) => (
  <div className={`inline-flex items-center justify-center w-5 h-5 rounded-full bg-red-500 text-white font-bold text-xs ${className}`}>
    <span className="text-[10px]">A</span>
  </div>
);

export const GoogleIcon = ({ className }: { className?: string }) => (
  <div className={`inline-flex items-center justify-center w-5 h-5 rounded-full bg-blue-500 text-white font-bold text-xs ${className}`}>
    <span className="text-[10px]">G</span>
  </div>
);

export const BookingIcon = ({ className }: { className?: string }) => (
  <div className={`inline-flex items-center justify-center w-5 h-5 rounded bg-blue-800 text-white font-bold text-xs ${className}`}>
    <span className="text-[10px]">B</span>
  </div>
);

export const TripadvisorIcon = ({ className }: { className?: string }) => (
  <div className={`inline-flex items-center justify-center w-5 h-5 rounded-full bg-green-500 text-white font-bold text-xs ${className}`}>
    <span className="text-[10px]">T</span>
  </div>
);
