// src/components/home/CyberFishTank.tsx
import React, { useEffect, useRef, useState } from 'react';
import { CursorState, Fish, Particle } from './fish/types';
import { drawFish, drawWaterTexture, drawParticles } from './fish/renderer';
import { initFishes, updateFish, createParticle, createBubble } from './fish/controller';
import { DivFish } from './divfish/types';
import { createDivFish, updateDivFish } from './divfish/controller';
import { drawDivFish } from './divfish/renderer';

// Number of normal fish to show in the tank
const FISH_COUNT_MOBILE = 2; // Mobile fish count
const FISH_COUNT_DESKTOP = 8; // Desktop fish count

// 🔧 CHANGE THESE VALUES TO ADJUST PARTICLE COUNTS:
const INITIAL_PARTICLES_DESKTOP = 50;  // Desktop particle count
const INITIAL_PARTICLES_MOBILE = 25;   // Mobile particle count (reduced)

// 🔧 CHANGE THESE VALUES TO ADJUST PARTICLE CREATION FREQUENCY:
const PARTICLE_FREQUENCY_DESKTOP = 0.07;  // Desktop frequency (higher = more particles)
const PARTICLE_FREQUENCY_MOBILE = 0.04;   // Mobile frequency (lower = fewer particles)

// Cyan color for particles
const CYAN_COLOR = '#00FFFF';
// Bubble release interval (8 seconds = 8000ms)
const BUBBLE_RELEASE_INTERVAL = 8000;

const CyberFishTank: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 800,
    height: typeof window !== 'undefined' ? window.innerHeight : 600,
  });
  
  // References to maintain state across renders
  const isMobileRef = useRef(typeof window !== 'undefined' && window.innerWidth < 768);
  const cursorRef = useRef<CursorState>({ 
    x: null, 
    y: null, 
    lastMoved: 0,
    isActive: false
  });
  const fishesRef = useRef<Fish[]>([]);
  const divfishRef = useRef<DivFish | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationRef = useRef<number | null>(null);
  const lastBubbleTimeRef = useRef<number>(0);
  
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
  
  // Main animation setup
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas dimensions
    canvas.width = windowSize.width;
    canvas.height = Math.min(windowSize.height * 0.7, 600);
    
    // Initialize normal fish on first render or when window resizes
    const fishCount = isMobileRef.current ? FISH_COUNT_MOBILE : FISH_COUNT_DESKTOP;
    fishesRef.current = initFishes(fishCount, canvas.width, canvas.height, isMobileRef.current);
    
    // Initialize divfish with mobile/desktop size consideration
    divfishRef.current = createDivFish(canvas.width, canvas.height, isMobileRef.current);
    
    // Initialize particles with device-appropriate counts
    particlesRef.current = [];
    const initialParticleCount = isMobileRef.current ? INITIAL_PARTICLES_MOBILE : INITIAL_PARTICLES_DESKTOP;
    
    for (let i = 0; i < initialParticleCount; i++) {
      // Create initial floating particles
      particlesRef.current.push(createParticle(
        Math.random() * canvas.width,
        Math.random() * canvas.height,
        'floater',
        CYAN_COLOR,
        canvas.width,
        canvas.height,
        isMobileRef.current
      ));
    }
    
    // Reset bubble timer
    lastBubbleTimeRef.current = Date.now();
    
    // Mouse event handlers
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      cursorRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        lastMoved: Date.now(),
        isActive: true
      };
    };
    
    const handleMouseLeave = () => {
      cursorRef.current.isActive = false;
    };
    
    const handleMouseEnter = () => {
      if (cursorRef.current.x !== null) {
        cursorRef.current.isActive = true;
      }
    };
    
    // Add event listeners
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);
    canvas.addEventListener('mouseenter', handleMouseEnter);
    
    // Animation timing
    let lastTime = 0;
    
    // Main animation loop
    const animate = (timestamp: number) => {
      // Calculate delta time for smooth animations at any frame rate
      const deltaTime = lastTime ? timestamp - lastTime : 0;
      lastTime = timestamp;
      
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw tank background
      ctx.fillStyle = '#0A0F2C';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw water texture effects
      drawWaterTexture(ctx, canvas.width, canvas.height);
      
      // Create new floating particles occasionally with device-appropriate frequency
      const particleFrequency = isMobileRef.current ? PARTICLE_FREQUENCY_MOBILE : PARTICLE_FREQUENCY_DESKTOP;
      if (Math.random() < particleFrequency) {
        particlesRef.current.push(createParticle(
          Math.random() * canvas.width,
          canvas.height - 10,
          'floater',
          CYAN_COLOR,
          canvas.width,
          canvas.height,
          isMobileRef.current
        ));
      }
      
      // Divfish bubble release every 8 seconds
      const currentTime = Date.now();
      if (divfishRef.current && currentTime - lastBubbleTimeRef.current > BUBBLE_RELEASE_INTERVAL) {
        // Release 6 bubbles from divfish position
        for (let i = 0; i < 6; i++) {
          particlesRef.current.push(createBubble(
            divfishRef.current.x,
            divfishRef.current.y,
            canvas.width,
            canvas.height
          ));
        }
        lastBubbleTimeRef.current = currentTime;
      }
      
      // Update and filter out dead particles
      particlesRef.current = particlesRef.current
        .filter(particle => {
          // Update particle position based on type
          if (particle.type === 'bubble') {
            // Bubbles float upward
            particle.y -= particle.speed * (deltaTime / 16);
            particle.x += Math.sin(timestamp / 800 + particle.x) * 0.3; // Slight wobble
          } else {
            // Regular floater particles
            particle.y -= particle.speed * (deltaTime / 16);
            particle.x += Math.sin(timestamp / 1000 + particle.x) * 0.2;
          }
          
          particle.lifetime--;
          particle.pulse = (Math.sin(timestamp / 500 * particle.pulseSpeed) + 1) / 2; // For glow pulsing
          
          // Remove particles that are out of bounds or expired
          return (
            particle.y > -10 && 
            particle.y < canvas.height + 10 &&
            particle.x > -10 && 
            particle.x < canvas.width + 10 &&
            particle.lifetime > 0
          );
        });
      
      // Update and draw normal fish (pass divfish for influence calculation)
      fishesRef.current.forEach(fish => {
        updateFish(fish, canvas.width, canvas.height, cursorRef.current, isMobileRef.current, deltaTime, divfishRef.current);
        drawFish(ctx, fish);
      });
      
      // Update and draw divfish
      if (divfishRef.current) {
        updateDivFish(divfishRef.current, canvas.width, canvas.height, deltaTime);
        drawDivFish(ctx, divfishRef.current);
      }
      
      // Draw particles
      drawParticles(ctx, particlesRef.current);
      
      // Continue animation
      animationRef.current = requestAnimationFrame(animate);
    };
    
    // Start animation loop
    animationRef.current = requestAnimationFrame(animate);
    
    // Cleanup on unmount
    return () => {
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
      canvas.removeEventListener('mouseenter', handleMouseEnter);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [windowSize]);
  
  return (
    <div className="absolute inset-0 w-full h-full pointer-events-auto" style={{ zIndex: 5 }}>
      <canvas
        ref={canvasRef}
        className="w-full h-full block"
        style={{
          background: 'transparent'
        }}
      />
    </div>
  );
};

export default CyberFishTank;