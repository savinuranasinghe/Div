import React, { useEffect, useRef, useState } from 'react';

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  baseSize: number;
  opacity: number;
  baseOpacity: number;
  vx: number;
  vy: number;
  color: string;
  pulseSpeed: number;
  pulseOffset: number;
  shape: 'circle' | 'diamond' | 'triangle';
}

interface MouseState {
  x: number | null;
  y: number | null;
  isActive: boolean;
}

const FloatingParticlesBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationRef = useRef<number | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef<MouseState>({ x: null, y: null, isActive: false });
  const isMobileRef = useRef(typeof window !== 'undefined' && window.innerWidth < 768);
  
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1920,
    height: typeof window !== 'undefined' ? window.innerHeight : 1080,
  });

  // Brand colors
  const COLORS = ['#00FFFF', '#8A2BE2', '#FF2EF5']; // Cyan, Purple, Pink
  
  // Configuration based on device
  const getConfig = () => ({
    particleCount: isMobileRef.current ? 25 : 50,
    mouseInfluence: isMobileRef.current ? 0 : 80,
    baseSpeed: isMobileRef.current ? 0.3 : 0.5,
    maxSize: isMobileRef.current ? 3 : 6,
    minSize: isMobileRef.current ? 1 : 2,
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

  // Create a single particle
  const createParticle = (id: number, width: number, height: number): Particle => {
    const config = getConfig();
    const size = config.minSize + Math.random() * (config.maxSize - config.minSize);
    const opacity = 0.3 + Math.random() * 0.4;
    const shapes: Array<'circle' | 'diamond' | 'triangle'> = ['circle', 'diamond', 'triangle'];
    
    return {
      id,
      x: Math.random() * width,
      y: Math.random() * height,
      size,
      baseSize: size,
      opacity,
      baseOpacity: opacity,
      vx: (Math.random() - 0.5) * config.baseSpeed,
      vy: (Math.random() - 0.5) * config.baseSpeed,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      pulseSpeed: 0.5 + Math.random() * 1.5,
      pulseOffset: Math.random() * Math.PI * 2,
      shape: shapes[Math.floor(Math.random() * shapes.length)],
    };
  };

  // Initialize particles
  const initializeParticles = (width: number, height: number) => {
    const config = getConfig();
    particlesRef.current = [];
    
    for (let i = 0; i < config.particleCount; i++) {
      particlesRef.current.push(createParticle(i, width, height));
    }
  };

  // Draw different particle shapes
  const drawParticle = (ctx: CanvasRenderingContext2D, particle: Particle) => {
    ctx.save();
    ctx.globalAlpha = particle.opacity;
    ctx.fillStyle = particle.color;
    ctx.shadowBlur = 15;
    ctx.shadowColor = particle.color;

    const x = particle.x;
    const y = particle.y;
    const size = particle.size;

    switch (particle.shape) {
      case 'circle':
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
        break;

      case 'diamond':
        ctx.beginPath();
        ctx.moveTo(x, y - size);
        ctx.lineTo(x + size, y);
        ctx.lineTo(x, y + size);
        ctx.lineTo(x - size, y);
        ctx.closePath();
        ctx.fill();
        break;

      case 'triangle':
        ctx.beginPath();
        ctx.moveTo(x, y - size);
        ctx.lineTo(x - size * 0.866, y + size * 0.5);
        ctx.lineTo(x + size * 0.866, y + size * 0.5);
        ctx.closePath();
        ctx.fill();
        break;
    }

    ctx.restore();
  };

  // Update particle position and properties
  const updateParticle = (particle: Particle, width: number, height: number, currentTime: number) => {
    const config = getConfig();
    
    // Mouse interaction (desktop only)
    if (!isMobileRef.current && mouseRef.current.x !== null && mouseRef.current.y !== null && mouseRef.current.isActive) {
      const dx = mouseRef.current.x - particle.x;
      const dy = mouseRef.current.y - particle.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance < config.mouseInfluence) {
        const force = (config.mouseInfluence - distance) / config.mouseInfluence;
        particle.vx += (dx / distance) * force * 0.02;
        particle.vy += (dy / distance) * force * 0.02;
        
        // Increase size and opacity when near mouse
        particle.size = particle.baseSize * (1 + force * 0.5);
        particle.opacity = particle.baseOpacity * (1 + force * 0.3);
      } else {
        // Return to normal size and opacity
        particle.size += (particle.baseSize - particle.size) * 0.05;
        particle.opacity += (particle.baseOpacity - particle.opacity) * 0.05;
      }
    } else {
      // Return to normal size and opacity
      particle.size += (particle.baseSize - particle.size) * 0.05;
      particle.opacity += (particle.baseOpacity - particle.opacity) * 0.05;
    }

    // Apply pulsing effect
    const pulsePhase = currentTime * 0.001 * particle.pulseSpeed + particle.pulseOffset;
    const pulseFactor = 1 + Math.sin(pulsePhase) * 0.2;
    particle.size = particle.baseSize * pulseFactor;
    particle.opacity = particle.baseOpacity * (0.8 + Math.sin(pulsePhase) * 0.2);

    // Update position
    particle.x += particle.vx;
    particle.y += particle.vy;

    // Apply gentle friction
    particle.vx *= 0.98;
    particle.vy *= 0.98;

    // Wrap around edges
    if (particle.x < -particle.size) particle.x = width + particle.size;
    if (particle.x > width + particle.size) particle.x = -particle.size;
    if (particle.y < -particle.size) particle.y = height + particle.size;
    if (particle.y > height + particle.size) particle.y = -particle.size;

    // Add slight random movement to prevent particles from becoming static
    particle.vx += (Math.random() - 0.5) * 0.01;
    particle.vy += (Math.random() - 0.5) * 0.01;

    // Limit velocity
    const maxVel = config.baseSpeed * 2;
    const vel = Math.sqrt(particle.vx * particle.vx + particle.vy * particle.vy);
    if (vel > maxVel) {
      particle.vx = (particle.vx / vel) * maxVel;
      particle.vy = (particle.vy / vel) * maxVel;
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

    // Initialize particles
    initializeParticles(canvas.width, canvas.height);

    // Mouse event handlers (desktop only)
    const handleMouseMove = (e: MouseEvent) => {
      if (isMobileRef.current) return;
      
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        isActive: true
      };
    };

    const handleMouseLeave = () => {
      mouseRef.current.isActive = false;
    };

    const handleMouseEnter = () => {
      if (!isMobileRef.current && mouseRef.current.x !== null) {
        mouseRef.current.isActive = true;
      }
    };

    // Add event listeners (desktop only)
    if (!isMobileRef.current) {
      canvas.addEventListener('mousemove', handleMouseMove);
      canvas.addEventListener('mouseleave', handleMouseLeave);
      canvas.addEventListener('mouseenter', handleMouseEnter);
    }

    // Animation loop
    const animate = (currentTime: number) => {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update and draw particles
      particlesRef.current.forEach(particle => {
        updateParticle(particle, canvas.width, canvas.height, currentTime);
        drawParticle(ctx, particle);
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    // Start animation
    animationRef.current = requestAnimationFrame(animate);

    // Cleanup
    return () => {
      if (!isMobileRef.current) {
        canvas.removeEventListener('mousemove', handleMouseMove);
        canvas.removeEventListener('mouseleave', handleMouseLeave);
        canvas.removeEventListener('mouseenter', handleMouseEnter);
      }
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [windowSize]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-auto"
      style={{
        zIndex: 1,
        opacity: 0.8,
        mixBlendMode: 'screen'
      }}
    />
  );
};

export default FloatingParticlesBackground;