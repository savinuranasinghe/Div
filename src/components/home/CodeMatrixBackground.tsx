import React, { useEffect, useRef, useState } from 'react';

interface MatrixColumn {
  id: number;
  x: number;
  y: number;
  speed: number;
  characters: string[];
  opacities: number[];
  color: string;
  fontSize: number;
  length: number;
  lastUpdate: number;
}

const CodeMatrixBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationRef = useRef<number | null>(null);
  const columnsRef = useRef<MatrixColumn[]>([]);
  const isMobileRef = useRef(typeof window !== 'undefined' && window.innerWidth < 768);
  
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1920,
    height: typeof window !== 'undefined' ? window.innerHeight : 1080,
  });

  // Brand colors with low opacity
  const COLORS = ['#00FFFF', '#8A2BE2', '#FF2EF5']; // Cyan, Purple, Pink
  
  // Code characters and snippets for the matrix effect
  const CODE_CHARACTERS = [
    // Programming symbols
    '{', '}', '[', ']', '(', ')', '<', '>', '/', '\\', '|', '&', '*', '+', '-', '=', '?', ':', ';', '.', ',', '"', "'", '`',
    // Numbers
    '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
    // Letters (mixed case)
    'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
    'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
    // Special programming characters
    '$', '#', '@', '%', '^', '~', '_',
    // Code snippets (single characters from common keywords)
    'i', 'f', 'e', 'l', 's', 'r', 'n', 't', 'u', 'c', 'o', 'n', 'v', 'a', 'r', 'f', 'o', 'r', 'w', 'h', 'i', 'l', 'e'
  ];

  // Configuration based on device
  const getConfig = () => ({
    columnCount: isMobileRef.current ? Math.floor(windowSize.width / 25) : Math.floor(windowSize.width / 20),
    minSpeed: isMobileRef.current ? 1 : 2,
    maxSpeed: isMobileRef.current ? 3 : 6,
    fontSize: isMobileRef.current ? 12 : 14,
    opacity: isMobileRef.current ? 0.08 : 0.12, // Very low opacity
    maxColumnLength: isMobileRef.current ? 15 : 25,
    minColumnLength: isMobileRef.current ? 8 : 12,
    spawnRate: isMobileRef.current ? 0.02 : 0.03,
    characterChangeRate: 0.1, // How often characters change
  });

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
      isMobileRef.current = window.innerWidth < 768;
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Create a new matrix column
  const createColumn = (x: number, currentTime: number): MatrixColumn => {
    const config = getConfig();
    const length = config.minColumnLength + Math.random() * (config.maxColumnLength - config.minColumnLength);
    const speed = config.minSpeed + Math.random() * (config.maxSpeed - config.minSpeed);
    
    const characters: string[] = [];
    const opacities: number[] = [];
    
    // Generate random characters for the column
    for (let i = 0; i < length; i++) {
      characters.push(CODE_CHARACTERS[Math.floor(Math.random() * CODE_CHARACTERS.length)]);
      // Create fading effect from head to tail
      const fadePosition = i / length;
      opacities.push(config.opacity * (1 - fadePosition));
    }
    
    return {
      id: Math.random(),
      x,
      y: -length * config.fontSize, // Start above the screen
      speed,
      characters,
      opacities,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      fontSize: config.fontSize,
      length,
      lastUpdate: currentTime,
    };
  };

  // Initialize matrix columns
  const initializeColumns = () => {
    const config = getConfig();
    columnsRef.current = [];
    
    const columnWidth = windowSize.width / config.columnCount;
    
    // Create initial columns with staggered starts
    for (let i = 0; i < config.columnCount; i++) {
      const x = i * columnWidth + columnWidth / 2;
      const column = createColumn(x, 0);
      
      // Stagger the initial positions
      column.y = Math.random() * windowSize.height - column.length * config.fontSize;
      
      columnsRef.current.push(column);
    }
  };

  // Update a matrix column
  const updateColumn = (column: MatrixColumn, currentTime: number, deltaTime: number) => {
    const config = getConfig();
    
    // Move column down
    column.y += column.speed * (deltaTime / 16); // Normalize for 60fps
    
    // Change characters occasionally for dynamic effect
    if (currentTime - column.lastUpdate > 100 / column.speed) {
      if (Math.random() < config.characterChangeRate) {
        const changeIndex = Math.floor(Math.random() * column.characters.length);
        column.characters[changeIndex] = CODE_CHARACTERS[Math.floor(Math.random() * CODE_CHARACTERS.length)];
      }
      column.lastUpdate = currentTime;
    }
    
    // Reset column when it's completely off screen
    if (column.y > windowSize.height + column.length * config.fontSize) {
      column.y = -column.length * config.fontSize;
      
      // Randomly change properties for variety
      column.speed = config.minSpeed + Math.random() * (config.maxSpeed - config.minSpeed);
      column.color = COLORS[Math.floor(Math.random() * COLORS.length)];
      
      // Regenerate characters
      for (let i = 0; i < column.characters.length; i++) {
        column.characters[i] = CODE_CHARACTERS[Math.floor(Math.random() * CODE_CHARACTERS.length)];
      }
    }
  };

  // Draw a matrix column
  const drawColumn = (ctx: CanvasRenderingContext2D, column: MatrixColumn) => {
    ctx.font = `${column.fontSize}px 'Courier New', monospace`;
    ctx.textAlign = 'center';
    
    // Draw each character in the column
    for (let i = 0; i < column.characters.length; i++) {
      const charY = column.y + i * column.fontSize;
      
      // Only draw if character is visible on screen
      if (charY > -column.fontSize && charY < windowSize.height + column.fontSize) {
        const opacity = column.opacities[i];
        
        // Add extra brightness to the head of the column
        const isHead = i === 0;
        const headBrightness = isHead ? 0.8 : 0.4;
        
        ctx.save();
        ctx.globalAlpha = opacity;
        
        // Draw character with glow effect
        if (isHead) {
          ctx.shadowBlur = 8;
          ctx.shadowColor = column.color;
          ctx.fillStyle = '#FFFFFF'; // Bright white for head
        } else {
          ctx.shadowBlur = 2;
          ctx.shadowColor = column.color;
          ctx.fillStyle = column.color;
        }
        
        ctx.fillText(column.characters[i], column.x, charY);
        ctx.restore();
      }
    }
  };

  // Main animation setup
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = windowSize.width;
    canvas.height = windowSize.height;

    // Initialize columns
    initializeColumns();

    let lastTime = 0;

    // Animation loop
    const animate = (currentTime: number) => {
      const deltaTime = currentTime - lastTime;
      lastTime = currentTime;
      
      // Clear canvas with very subtle background
      ctx.fillStyle = 'rgba(10, 15, 44, 0.05)'; // Very subtle background clear
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Update and draw all columns
      columnsRef.current.forEach(column => {
        updateColumn(column, currentTime, deltaTime);
        drawColumn(ctx, column);
      });

      // Occasionally spawn new columns for dynamic effect
      const config = getConfig();
      if (Math.random() < config.spawnRate) {
        const randomX = Math.random() * windowSize.width;
        const newColumn = createColumn(randomX, currentTime);
        
        // Replace a random existing column
        const replaceIndex = Math.floor(Math.random() * columnsRef.current.length);
        columnsRef.current[replaceIndex] = newColumn;
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    // Start animation
    animationRef.current = requestAnimationFrame(animate);

    // Cleanup
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [windowSize]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{
        zIndex: 1,
        opacity: 0.6, // Additional opacity control
        mixBlendMode: 'screen'
      }}
    />
  );
};

export default CodeMatrixBackground;