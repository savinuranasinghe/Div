import React, { useEffect, useRef, useState } from 'react';

interface WaveLayer {
  id: number;
  amplitude: number;
  frequency: number;
  speed: number;
  offset: number;
  opacity: number;
  baseOpacity: number;
  breathingPhase: number;
  breathingSpeed: number;
  gradientColors: string[];
  yPosition: number;
}

const GradientWaveBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationRef = useRef<number | null>(null);
  const wavesRef = useRef<WaveLayer[]>([]);
  const isMobileRef = useRef(typeof window !== 'undefined' && window.innerWidth < 768);
  
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1920,
    height: typeof window !== 'undefined' ? window.innerHeight : 1080,
  });

  // Brand color gradients - Cyan to Purple to Pink
  const GRADIENT_SETS = [
    ['#00FFFF', '#8A2BE2'], // Cyan to Purple
    ['#8A2BE2', '#FF2EF5'], // Purple to Pink
    ['#00FFFF', '#FF2EF5'], // Cyan to Pink
    ['#00FFFF', '#8A2BE2', '#FF2EF5'], // All three colors
    ['#FF2EF5', '#8A2BE2'], // Pink to Purple
    ['#8A2BE2', '#00FFFF'], // Purple to Cyan
  ];

  // Configuration based on device
  const getConfig = () => ({
    waveCount: isMobileRef.current ? 4 : 6,
    baseAmplitude: isMobileRef.current ? 30 : 50,
    maxAmplitude: isMobileRef.current ? 80 : 120,
    baseFrequency: 0.003,
    maxFrequency: 0.008,
    baseSpeed: 0.0005,
    maxSpeed: 0.002,
    baseOpacity: isMobileRef.current ? 0.15 : 0.2,
    maxOpacity: isMobileRef.current ? 0.25 : 0.35,
    breathingIntensity: 0.3,
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

  // Create a wave layer
  const createWaveLayer = (index: number, totalWaves: number): WaveLayer => {
    const config = getConfig();
    
    return {
      id: index,
      amplitude: config.baseAmplitude + Math.random() * (config.maxAmplitude - config.baseAmplitude),
      frequency: config.baseFrequency + Math.random() * (config.maxFrequency - config.baseFrequency),
      speed: config.baseSpeed + Math.random() * (config.maxSpeed - config.baseSpeed),
      offset: Math.random() * Math.PI * 2,
      opacity: config.baseOpacity + Math.random() * (config.maxOpacity - config.baseOpacity),
      baseOpacity: config.baseOpacity + Math.random() * (config.maxOpacity - config.baseOpacity),
      breathingPhase: Math.random() * Math.PI * 2,
      breathingSpeed: 0.001 + Math.random() * 0.002,
      gradientColors: GRADIENT_SETS[index % GRADIENT_SETS.length],
      yPosition: (index / totalWaves) * windowSize.height + Math.random() * 200 - 100,
    };
  };

  // Initialize wave layers
  const initializeWaves = () => {
    const config = getConfig();
    wavesRef.current = [];
    
    for (let i = 0; i < config.waveCount; i++) {
      wavesRef.current.push(createWaveLayer(i, config.waveCount));
    }
  };

  // Generate wave path
  const generateWavePath = (
    wave: WaveLayer, 
    width: number, 
    height: number, 
    time: number
  ): Path2D => {
    const path = new Path2D();
    const points = 100; // Number of points to create smooth curve
    const step = width / points;
    
    // Start from bottom left
    path.moveTo(0, height);
    
    // Create wave curve
    for (let i = 0; i <= points; i++) {
      const x = i * step;
      const waveHeight = Math.sin(x * wave.frequency + wave.offset + time * wave.speed) * wave.amplitude;
      const y = wave.yPosition + waveHeight;
      
      if (i === 0) {
        path.lineTo(x, y);
      } else {
        path.lineTo(x, y);
      }
    }
    
    // Close the path to create a filled shape
    path.lineTo(width, height);
    path.lineTo(0, height);
    path.closePath();
    
    return path;
  };

  // Create gradient for wave
  const createWaveGradient = (
    ctx: CanvasRenderingContext2D,
    wave: WaveLayer,
    width: number,
    height: number
  ): CanvasGradient => {
    // Create vertical gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    
    if (wave.gradientColors.length === 2) {
      gradient.addColorStop(0, wave.gradientColors[0]);
      gradient.addColorStop(1, wave.gradientColors[1]);
    } else if (wave.gradientColors.length === 3) {
      gradient.addColorStop(0, wave.gradientColors[0]);
      gradient.addColorStop(0.5, wave.gradientColors[1]);
      gradient.addColorStop(1, wave.gradientColors[2]);
    }
    
    return gradient;
  };

  // Update wave properties
  const updateWave = (wave: WaveLayer, time: number, config: any) => {
    // Update breathing effect
    wave.breathingPhase += wave.breathingSpeed;
    const breathingEffect = Math.sin(wave.breathingPhase) * config.breathingIntensity;
    wave.opacity = wave.baseOpacity + breathingEffect * wave.baseOpacity;
    
    // Ensure opacity stays within bounds
    wave.opacity = Math.max(0.05, Math.min(0.5, wave.opacity));
    
    // Subtle position variation
    wave.yPosition += Math.sin(time * 0.0003 + wave.id) * 0.1;
  };

  // Draw wave layer
  const drawWave = (
    ctx: CanvasRenderingContext2D, 
    wave: WaveLayer, 
    width: number, 
    height: number, 
    time: number
  ) => {
    ctx.save();
    
    // Set opacity
    ctx.globalAlpha = wave.opacity;
    
    // Create and apply gradient
    const gradient = createWaveGradient(ctx, wave, width, height);
    ctx.fillStyle = gradient;
    
    // Generate and draw wave path
    const wavePath = generateWavePath(wave, width, height, time);
    ctx.fill(wavePath);
    
    // Add subtle glow effect
    ctx.globalCompositeOperation = 'soft-light';
    ctx.globalAlpha = wave.opacity * 0.3;
    ctx.fill(wavePath);
    
    ctx.restore();
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

    // Initialize waves
    initializeWaves();

    let startTime = Date.now();

    // Animation loop
    const animate = () => {
      const currentTime = Date.now();
      const elapsed = currentTime - startTime;
      const config = getConfig();
      
      // Clear canvas with very subtle background
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw background gradient
      const backgroundGradient = ctx.createRadialGradient(
        canvas.width / 2, canvas.height / 2, 0,
        canvas.width / 2, canvas.height / 2, Math.max(canvas.width, canvas.height) / 2
      );
      backgroundGradient.addColorStop(0, 'rgba(10, 15, 44, 0.02)');
      backgroundGradient.addColorStop(1, 'rgba(40, 43, 72, 0.05)');
      
      ctx.fillStyle = backgroundGradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Update and draw waves (back to front)
      wavesRef.current.forEach((wave, index) => {
        updateWave(wave, elapsed, config);
        drawWave(ctx, wave, canvas.width, canvas.height, elapsed);
      });

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
        opacity: 0.8,
        mixBlendMode: 'overlay'
      }}
    />
  );
};

export default GradientWaveBackground;