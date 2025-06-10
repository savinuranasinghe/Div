// src/components/home/DNAStreamsBackground.tsx
import React, { useEffect, useRef, useState } from 'react';

interface Particle {
  x: number;
  y: number;
  size: number;
  opacity: number;
  life: number;
  maxLife: number;
  streamId: number;
}

interface DataStream {
  id: number;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  progress: number;
  speed: number;
  colorPhase: number;
  isHelix: boolean;
  helixProgress: number;
  helixDuration: number;
  particles: Particle[];
}

interface DNAPoint {
  x: number;
  y: number;
  offset: number;
}

const DNAStreamsBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationRef = useRef<number | null>(null);
  const streamsRef = useRef<DataStream[]>([]);
  const lastHelixTimeRef = useRef<number>(0);
  const isMobileRef = useRef(typeof window !== 'undefined' && window.innerWidth < 768);
  
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1920,
    height: typeof window !== 'undefined' ? window.innerHeight : 1080,
  });

  // Brand colors
  const COLORS = {
    CYAN: '#00FFFF',
    VIOLET: '#8A2BE2', 
    PINK: '#FF2EF5'
  };

  // Animation constants
  const STREAM_COUNT = isMobileRef.current ? 3 : 5;
  const PARTICLES_PER_STREAM = isMobileRef.current ? 8 : 15;
  const HELIX_INTERVAL = 12000; // 12 seconds between helix formations
  const HELIX_DURATION = 6000; // 6 seconds for helix lifecycle

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

  // Initialize data streams
  const initializeStreams = (canvas: HTMLCanvasElement): DataStream[] => {
    const streams: DataStream[] = [];
    
    for (let i = 0; i < STREAM_COUNT; i++) {
      const isReverse = i % 2 === 0;
      const stream: DataStream = {
        id: i,
        startX: isReverse ? -100 : canvas.width + 100,
        startY: isReverse ? -100 : canvas.height * (0.2 + (i * 0.15)),
        endX: isReverse ? canvas.width + 100 : -100,
        endY: isReverse ? canvas.height * (0.3 + (i * 0.15)) : canvas.height + 100,
        progress: Math.random(),
        speed: 0.0008 + Math.random() * 0.0005, // Slower, more meditative
        colorPhase: (i / STREAM_COUNT) * Math.PI * 2,
        isHelix: false,
        helixProgress: 0,
        helixDuration: HELIX_DURATION,
        particles: []
      };
      
      // Initialize particles for this stream
      for (let j = 0; j < PARTICLES_PER_STREAM; j++) {
        stream.particles.push(createParticle(stream, j));
      }
      
      streams.push(stream);
    }
    
    return streams;
  };

  // Create a particle
  const createParticle = (stream: DataStream, index: number): Particle => {
    const spacing = 1 / PARTICLES_PER_STREAM;
    const position = (stream.progress + (index * spacing)) % 1;
    const x = stream.startX + (stream.endX - stream.startX) * position;
    const y = stream.startY + (stream.endY - stream.startY) * position;

    return {
      x,
      y,
      size: 1 + Math.random() * 2,
      opacity: 0.3 + Math.random() * 0.4,
      life: Math.random() * 100,
      maxLife: 100,
      streamId: stream.id
    };
  };

  // Get color for current phase
  const getColorFromPhase = (phase: number, alpha: number = 1): string => {
    const normalizedPhase = ((phase % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
    const segment = normalizedPhase / (Math.PI * 2 / 3);
    
    let r, g, b;
    
    if (segment < 1) {
      // Cyan to Violet
      const t = segment;
      r = Math.floor(0 * (1 - t) + 138 * t);
      g = Math.floor(255 * (1 - t) + 43 * t);
      b = Math.floor(255 * (1 - t) + 226 * t);
    } else if (segment < 2) {
      // Violet to Pink
      const t = segment - 1;
      r = Math.floor(138 * (1 - t) + 255 * t);
      g = Math.floor(43 * (1 - t) + 46 * t);
      b = Math.floor(226 * (1 - t) + 245 * t);
    } else {
      // Pink to Cyan
      const t = segment - 2;
      r = Math.floor(255 * (1 - t) + 0 * t);
      g = Math.floor(46 * (1 - t) + 255 * t);
      b = Math.floor(245 * (1 - t) + 255 * t);
    }
    
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  // Draw DNA helix
  const drawDNAHelix = (
    ctx: CanvasRenderingContext2D, 
    stream: DataStream, 
    centerX: number, 
    centerY: number,
    length: number
  ) => {
    const helixRadius = 20 + Math.sin(stream.helixProgress * 0.01) * 5;
    const frequency = 0.05;
    const points1: DNAPoint[] = [];
    const points2: DNAPoint[] = [];
    
    // Generate helix points
    for (let i = 0; i <= length; i += 2) {
      const angle1 = i * frequency;
      const angle2 = angle1 + Math.PI;
      const yPos = centerY - length/2 + i;
      
      points1.push({
        x: centerX + Math.cos(angle1) * helixRadius,
        y: yPos,
        offset: i
      });
      
      points2.push({
        x: centerX + Math.cos(angle2) * helixRadius,
        y: yPos,
        offset: i
      });
    }

    // Draw helix strands
    ctx.strokeStyle = getColorFromPhase(stream.colorPhase, 0.6);
    ctx.lineWidth = 2;
    
    // First strand
    ctx.beginPath();
    points1.forEach((point, index) => {
      if (index === 0) ctx.moveTo(point.x, point.y);
      else ctx.lineTo(point.x, point.y);
    });
    ctx.stroke();
    
    // Second strand
    ctx.beginPath();
    points2.forEach((point, index) => {
      if (index === 0) ctx.moveTo(point.x, point.y);
      else ctx.lineTo(point.x, point.y);
    });
    ctx.stroke();
    
    // Draw connecting bridges
    ctx.strokeStyle = getColorFromPhase(stream.colorPhase + Math.PI/3, 0.4);
    ctx.lineWidth = 1;
    
    for (let i = 0; i < Math.min(points1.length, points2.length); i += 4) {
      ctx.beginPath();
      ctx.moveTo(points1[i].x, points1[i].y);
      ctx.lineTo(points2[i].x, points2[i].y);
      ctx.stroke();
    }
  };

  // Draw data stream
  const drawDataStream = (ctx: CanvasRenderingContext2D, stream: DataStream) => {
    const currentX = stream.startX + (stream.endX - stream.startX) * stream.progress;
    const currentY = stream.startY + (stream.endY - stream.startY) * stream.progress;
    
    if (stream.isHelix && stream.helixProgress > 0.2) {
      // Draw DNA helix
      const helixLength = 150;
      drawDNAHelix(ctx, stream, currentX, currentY, helixLength);
    } else {
      // Draw regular data stream
      const gradient = ctx.createLinearGradient(
        stream.startX, stream.startY,
        stream.endX, stream.endY
      );
      
      const headColor = getColorFromPhase(stream.colorPhase, 0.8);
      const tailColor = getColorFromPhase(stream.colorPhase, 0.1);
      
      gradient.addColorStop(0, tailColor);
      gradient.addColorStop(0.7, tailColor);
      gradient.addColorStop(1, headColor);
      
      ctx.strokeStyle = gradient;
      ctx.lineWidth = 2;
      ctx.shadowBlur = 8;
      ctx.shadowColor = getColorFromPhase(stream.colorPhase, 0.6);
      
      // Draw the stream line
      const startDrawX = stream.startX + (stream.endX - stream.startX) * Math.max(0, stream.progress - 0.3);
      const startDrawY = stream.startY + (stream.endY - stream.startY) * Math.max(0, stream.progress - 0.3);
      
      ctx.beginPath();
      ctx.moveTo(startDrawX, startDrawY);
      ctx.lineTo(currentX, currentY);
      ctx.stroke();
      
      ctx.shadowBlur = 0;
    }
  };

  // Draw particles
  const drawParticles = (ctx: CanvasRenderingContext2D, stream: DataStream) => {
    stream.particles.forEach(particle => {
      if (particle.life > 0) {
        const alpha = (particle.life / particle.maxLife) * particle.opacity;
        ctx.fillStyle = getColorFromPhase(stream.colorPhase, alpha);
        ctx.shadowBlur = 4;
        ctx.shadowColor = getColorFromPhase(stream.colorPhase, alpha * 0.8);
        
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.shadowBlur = 0;
      }
    });
  };

  // Update stream
  const updateStream = (stream: DataStream, deltaTime: number, currentTime: number) => {
    // Update progress
    stream.progress += stream.speed * deltaTime;
    if (stream.progress > 1.3) {
      stream.progress = -0.3;
    }
    
    // Update color phase
    stream.colorPhase += 0.001 * deltaTime;
    
    // Handle helix transformation
    if (!stream.isHelix && currentTime - lastHelixTimeRef.current > HELIX_INTERVAL) {
      if (Math.random() < 0.3) { // 30% chance for any stream to become helix
        stream.isHelix = true;
        stream.helixProgress = 0;
        lastHelixTimeRef.current = currentTime;
      }
    }
    
    if (stream.isHelix) {
      stream.helixProgress += deltaTime;
      if (stream.helixProgress > stream.helixDuration) {
        stream.isHelix = false;
        stream.helixProgress = 0;
      }
    }
    
    // Update particles
    stream.particles.forEach((particle, index) => {
      particle.life -= deltaTime * 0.05;
      
      if (particle.life <= 0) {
        // Respawn particle
        const newParticle = createParticle(stream, index);
        stream.particles[index] = newParticle;
      } else {
        // Update position based on stream
        const spacing = 1 / PARTICLES_PER_STREAM;
        const position = (stream.progress + (index * spacing)) % 1;
        particle.x = stream.startX + (stream.endX - stream.startX) * position;
        particle.y = stream.startY + (stream.endY - stream.startY) * position;
      }
    });
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = windowSize.width;
    canvas.height = windowSize.height;

    // Initialize streams
    streamsRef.current = initializeStreams(canvas);
    lastHelixTimeRef.current = Date.now();

    let lastTime = 0;

    const animate = (currentTime: number) => {
      const deltaTime = lastTime ? currentTime - lastTime : 0;
      lastTime = currentTime;

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update and draw streams
      streamsRef.current.forEach(stream => {
        updateStream(stream, deltaTime, currentTime);
        drawDataStream(ctx, stream);
        drawParticles(ctx, stream);
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

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
        opacity: 0.6,
        mixBlendMode: 'screen'
      }}
    />
  );
};

export default DNAStreamsBackground;