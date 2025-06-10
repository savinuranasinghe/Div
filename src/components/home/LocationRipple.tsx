import React from "react";

interface LocationRippleProps {
  x: number; // X position as percentage (0-100)
  y: number; // Y position as percentage (0-100)
  city: string; // City name for debugging
  delay?: number; // Animation delay in milliseconds
  labelText?: string; // Text to display near the ripple
  labelX?: number; // Label X offset in pixels from ripple center
  labelY?: number; // Label Y offset in pixels from ripple center
}

const LocationRipple: React.FC<LocationRippleProps> = ({ 
  x, 
  y, 
  city, 
  delay = 0, 
  labelText, 
  labelX = 0, 
  labelY = 0 
}) => {
  return (
    <div
      className="absolute pointer-events-none"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        transform: 'translate(-50%, -50%)', // Center the ripple on the coordinates
        animationDelay: `${delay}ms`
      }}
    >
      {/* Central Glowing Dot */}
      <div 
        className="absolute w-3 h-3 bg-neon-blue rounded-full animate-pulse"
        style={{
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          boxShadow: '0 0 10px #00FFFF, 0 0 20px #00FFFF, 0 0 30px #00FFFF',
          zIndex: 10
        }}
      />

      {/* Ripple 1 - Fastest */}
      <div 
        className="absolute rounded-full border-2 border-neon-blue animate-ripple-1"
        style={{
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          width: '6px',
          height: '6px',
          boxShadow: '0 0 5px rgba(0, 255, 255, 0.6)',
        }}
      />

      {/* Ripple 2 - Medium */}
      <div 
        className="absolute rounded-full border-2 border-cyan-400 animate-ripple-2"
        style={{
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          width: '6px',
          height: '6px',
          boxShadow: '0 0 5px rgba(0, 255, 255, 0.4)',
          animationDelay: '0.5s'
        }}
      />

      {/* Ripple 3 - Slowest */}
      <div 
        className="absolute rounded-full border-2 border-cyan-300 animate-ripple-3"
        style={{
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          width: '6px',
          height: '6px',
          boxShadow: '0 0 5px rgba(0, 255, 255, 0.2)',
          animationDelay: '1s'
        }}
      />

      {/* Label Text */}
      {labelText && (
        <div
          className="absolute text-neon-blue text-sm font-medium whitespace-nowrap"
          style={{
            left: `${labelX}px`,
            top: `${labelY}px`,
            textShadow: '0 0 10px rgba(0, 255, 255, 0.8)',
            zIndex: 11
          }}
        >
          {labelText}
        </div>
      )}
    </div>
  );
};

export default LocationRipple;