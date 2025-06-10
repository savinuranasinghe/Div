// src/components/home/DivfishOnly.tsx
import React, { useEffect, useRef, useState } from 'react';
import { Particle } from './fish/types';
import { DivFish } from './divfish/types';
import { updateDivFish } from './divfish/controller';
import { drawDivFish } from './divfish/renderer';
import { drawWaterTexture, drawParticles } from './fish/renderer';
import { createBubble, createParticle } from './fish/controller';

// Bubble release interval (8 seconds = 8000ms)
const BUBBLE_RELEASE_INTERVAL = 8000;

// 🔧 CHANGE THESE VALUES TO ADJUST PARTICLE COUNTS FOR WHY CHOOSE DIVGAZE SECTION:
const INITIAL_PARTICLES_DESKTOP = 10;  // Desktop particle count
const INITIAL_PARTICLES_MOBILE = 15;   // Mobile particle count (reduced)

// 🔧 CHANGE THESE VALUES TO ADJUST PARTICLE CREATION FREQUENCY:
const PARTICLE_FREQUENCY_DESKTOP = 0.01;  // Desktop frequency
const PARTICLE_FREQUENCY_MOBILE = 0.02;   // Mobile frequency (much lower)

// Cyan color for particles
const CYAN_COLOR = '#00FFFF';

// 🔧 CHANGE THESE VALUES TO ADJUST DIVFISH SIZES FOR WHY CHOOSE DIVGAZE SECTION:
const LARGE_DIVFISH_SIZE_DESKTOP = 25; // Large divfish size for desktop
const LARGE_DIVFISH_SIZE_MOBILE = 25;  // Normal divfish size for mobile

// 🔧 CHANGE THESE VALUES TO ADJUST DIVFISH SPEEDS FOR WHY CHOOSE DIVGAZE SECTION:
const LARGE_DIVFISH_SPEED_DESKTOP = 0.4;   // Base divfish speed on desktop
const LARGE_DIVFISH_SPEED_MOBILE = 0.3;    // Base divfish speed on mobile (slower)
const LARGE_DIVFISH_SPEED_VARIATION = 0.2; // Random speed variation

/**
 * Creates a divfish for Why Choose Divgaze section with size based on device type
 */
function createLargeDivFish(tankWidth: number, tankHeight: number, isMobile: boolean): DivFish {
  const EDGE_BUFFER = 100; // Increased buffer to keep fish away from navbar area
  const fishSize = isMobile ? LARGE_DIVFISH_SIZE_MOBILE : LARGE_DIVFISH_SIZE_DESKTOP;
  const speedBase = isMobile ? LARGE_DIVFISH_SPEED_MOBILE : LARGE_DIVFISH_SPEED_DESKTOP;
  
  return {
    id: 999,
    x: Math.random() * (tankWidth - 2 * EDGE_BUFFER) + EDGE_BUFFER,
    y: Math.random() * (tankHeight - 2 * EDGE_BUFFER) + EDGE_BUFFER + 100, // Start below navbar
    size: fishSize,
    speed: speedBase + Math.random() * LARGE_DIVFISH_SPEED_VARIATION,
    normalSpeed: speedBase + Math.random() * LARGE_DIVFISH_SPEED_VARIATION,
    angle: Math.random() * Math.PI * 2,
    targetAngle: Math.random() * Math.PI * 2,
    turnSpeed: 0.03 + Math.random() * 0.02,
    tailSegments: Array.from({ length: 10 }, (_, i) => ({ 
      x: 0, y: 0, angle: 0,
      flexibility: 0.5 + (i / 10) * 0.5
    })),
    wobbleOffset: Math.random() * Math.PI * 2,
    wobbleSpeed: 0.05 + Math.random() * 0.03,
    wobbleIntensity: 0.8 + Math.random() * 0.4,
    acceleration: 0.05,
  };
}

/**
 * Update large divfish with navbar avoidance
 */
function updateLargeDivFish(
  divfish: DivFish, 
  tankWidth: number, 
  tankHeight: number, 
  deltaTime: number
): void {
  const EDGE_BUFFER = 100;
  const NAVBAR_HEIGHT = 120; // Height to avoid navbar area
  
  // Always swimming behavior
  if (Math.random() < 0.001) {
    divfish.targetAngle = Math.random() * Math.PI * 2;
  }
  
  // Gradually return to normal speed
  divfish.speed = divfish.speed + (divfish.normalSpeed - divfish.speed) * divfish.acceleration;
  
  // Add minimal natural wobble
  if (Math.random() < 0.005) {
    divfish.targetAngle += (Math.random() - 0.5) * 0.1;
  }
  
  // Smooth turning toward target angle
  const angleDiff = ((divfish.targetAngle - divfish.angle + Math.PI * 3) % (Math.PI * 2)) - Math.PI;
  divfish.angle += Math.sign(angleDiff) * Math.min(Math.abs(angleDiff), divfish.turnSpeed);
  
  // Update position based on angle and speed
  const nextX = divfish.x + Math.cos(divfish.angle) * divfish.speed;
  const nextY = divfish.y + Math.sin(divfish.angle) * divfish.speed;
  
  // Handle boundaries with navbar avoidance
  const edgeMargin = EDGE_BUFFER + divfish.speed * 3;
  
  if (nextX < edgeMargin) {
    divfish.targetAngle = 0; // Right
    divfish.x += Math.min(edgeMargin - nextX, divfish.speed);
  } else if (nextX > tankWidth - edgeMargin) {
    divfish.targetAngle = Math.PI; // Left
    divfish.x -= Math.min(nextX - (tankWidth - edgeMargin), divfish.speed);
  } else {
    divfish.x = nextX;
  }
  
  // Prevent fish from going into navbar area
  if (nextY < NAVBAR_HEIGHT) {
    divfish.targetAngle = Math.PI / 2; // Force downward
    divfish.y = Math.max(NAVBAR_HEIGHT, divfish.y);
  } else if (nextY > tankHeight - edgeMargin) {
    divfish.targetAngle = -Math.PI / 2; // Up
    divfish.y -= Math.min(nextY - (tankHeight - edgeMargin), divfish.speed);
  } else {
    divfish.y = nextY;
  }
  
  // Update tail segments (same logic as original)
  divfish.wobbleOffset += divfish.wobbleSpeed;
  
  const speedFactor = divfish.speed / divfish.normalSpeed;
  const lagFactor = 0.2;
  
  const headX = divfish.x;
  const headY = divfish.y;
  
  let prevX = headX;
  let prevY = headY;
  let prevAngle = divfish.angle;
  
  divfish.tailSegments.forEach((segment, i) => {
    const segmentIndex = i + 1;
    const totalSegments = divfish.tailSegments.length;
    
    const lagAmount = lagFactor * (segmentIndex / totalSegments) * speedFactor;
    const segmentDistance = divfish.size * 0.1 * (1 + lagAmount);
    
    const wobbleAmplitude = divfish.wobbleIntensity * (segmentIndex / totalSegments);
    const wobbleFrequency = 1 + segmentIndex * 0.2;
    
    const wobblePhase = divfish.wobbleOffset * wobbleFrequency + segmentIndex * 0.5;
    const wobbleAmount = wobbleAmplitude * Math.sin(wobblePhase);
    
    const wobbleX = Math.sin(prevAngle) * wobbleAmount;
    const wobbleY = -Math.cos(prevAngle) * wobbleAmount;
    
    segment.x = prevX - Math.cos(prevAngle) * segmentDistance + wobbleX;
    segment.y = prevY - Math.sin(prevAngle) * segmentDistance + wobbleY;
    
    const angleToHead = Math.atan2(headY - segment.y, headX - segment.x);
    const segmentFraction = segmentIndex / totalSegments;
    
    const blendFactor = Math.min(1, segmentFraction * 2);
    segment.angle = angleToHead * (1 - blendFactor) + prevAngle * blendFactor;
    
    prevX = segment.x;
    prevY = segment.y;
    prevAngle = segment.angle;
  });
}

const DivfishOnly: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 800,
    height: typeof window !== 'undefined' ? window.innerHeight : 600,
  });
  
  // References to maintain state across renders
  const isMobileRef = useRef(typeof window !== 'undefined' && window.innerWidth < 768);
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
    
    // Set canvas dimensions to match hero section proportions
    canvas.width = windowSize.width;
    canvas.height = Math.min(windowSize.height * 0.7, 600);
    
    // Initialize divfish with size based on screen size
    divfishRef.current = createLargeDivFish(canvas.width, canvas.height, isMobileRef.current);
    
    // Initialize cyan floating particles with device-appropriate counts
    particlesRef.current = [];
    const initialParticleCount = isMobileRef.current ? INITIAL_PARTICLES_MOBILE : INITIAL_PARTICLES_DESKTOP;
    
    for (let i = 0; i < initialParticleCount; i++) {
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
      
      // Update and draw divfish
      if (divfishRef.current) {
        updateLargeDivFish(divfishRef.current, canvas.width, canvas.height, deltaTime);
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
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [windowSize]);
  
  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 5 }}>
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

export default DivfishOnly;