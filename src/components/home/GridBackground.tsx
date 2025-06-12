import React from 'react';

interface GridBackgroundProps {
  cellSize?: number;
  opacity?: number;
  animated?: boolean;
}

export const GridBackground: React.FC<GridBackgroundProps> = ({
  cellSize = 50,
  opacity = 0.12,
  animated = true
}) => {
  return (
    <div className="absolute inset-0 pointer-events-none z-[1]">
      {/* Static Grid Pattern */}
      <div 
        className={`absolute inset-0 ${animated ? 'animate-grid-pulse' : ''}`}
        style={{
          backgroundImage: `
            linear-gradient(rgba(0, 255, 255, ${opacity}) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 255, 255, ${opacity}) 1px, transparent 1px)
          `,
          backgroundSize: `${cellSize}px ${cellSize}px`,
        }}
      />
      
      {/* Grid Glow Effect */}
      <div 
        className={`absolute inset-0 ${animated ? 'animate-grid-glow' : ''}`}
        style={{
          backgroundImage: `
            linear-gradient(rgba(0, 255, 255, ${opacity * 0.3}) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 255, 255, ${opacity * 0.3}) 1px, transparent 1px)
          `,
          backgroundSize: `${cellSize}px ${cellSize}px`,
          backgroundPosition: '1px 1px',
          filter: 'blur(1px)'
        }}
      />
    </div>
  );
};