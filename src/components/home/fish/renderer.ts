// src/components/home/fish/renderer.ts
// Functions for rendering fish and water effects
import { Fish, Particle } from './types';

/**
 * Draws the water texture/background
 */
export function drawWaterTexture(ctx: CanvasRenderingContext2D, width: number, height: number): void {
  // Main water gradient
  const gradient = ctx.createRadialGradient(
    width / 2, height / 2, 0,
    width / 2, height / 2, Math.max(width, height) / 1.5
  );
  
  gradient.addColorStop(0, 'rgba(16, 24, 56, 0.6)');
  gradient.addColorStop(1, 'rgba(10, 15, 44, 0.8)');
  
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
  
  // Vignette effect around edges
  const vignetteGradient = ctx.createRadialGradient(
    width / 2, height / 2, Math.min(width, height) * 0.3,
    width / 2, height / 2, Math.max(width, height) / 1.8
  );
  
  vignetteGradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
  vignetteGradient.addColorStop(1, 'rgba(0, 0, 0, 0.4)');
  
  ctx.fillStyle = vignetteGradient;
  ctx.fillRect(0, 0, width, height);
}

/**
 * Draws a fish with the new shape: elliptical body with triangular front and tail pointing same direction
 */
export function drawFish(ctx: CanvasRenderingContext2D, fish: Fish): void {
  ctx.save();
  
  // Calculate body dimensions based on fish size
  // Adjusted to match CSS proportions
  const bodyWidth = fish.size * 0.70; // Increased for larger body (200px in CSS)
  const bodyHeight = fish.size * 0.35; // Proportional to width (80px in CSS)
  
  // Position for drawing
  const centerX = fish.x;
  const centerY = fish.y;
  
  // Rotation based on fish angle
  ctx.translate(centerX, centerY);
  ctx.rotate(fish.angle);
  
  // Normal fish uses cyan/pink colors with divfish boost glow
  const bodyColor = '#00FFFF';
  const frontColor = 'rgba(0, 255, 255, 0.7)';
  const tailColor = 'rgba(255, 46, 245, 0.7)';
  const wingColor = 'rgba(0, 255, 255, 0.7)';
  
  // Draw triangular tail first (behind body) - points right according to CSS
  drawFishTail(ctx, fish, bodyWidth, bodyHeight, tailColor);
  
  // Draw triangular front (also points right according to CSS)
  drawFishFront(ctx, fish, bodyWidth, bodyHeight, frontColor);
  
  // Draw side fins (wings)
  drawFishWings(ctx, fish, bodyWidth, bodyHeight, wingColor);
  
  // Draw main body (colored elliptical shape)
  ctx.beginPath();
  ctx.ellipse(0, 0, bodyWidth, bodyHeight, 0, 0, Math.PI * 2);
  
  // Add glow effect based on state and divfish boost
  const baseGlowIntensity = fish.state === 'chasing' ? 20 : 
                           fish.state === 'inspecting' ? 15 : 10;
  const glowIntensity = baseGlowIntensity * fish.divfishBoost; // Enhanced by divfish boost
  ctx.shadowBlur = glowIntensity;
  ctx.shadowColor = bodyColor;
  
  // Solid body color with brightness boost
  const brightnessBoost = Math.min(1.5, fish.divfishBoost);
  ctx.fillStyle = brightnessBoost > 1.2 ? '#40FFFF' : bodyColor; // Brighter cyan when boosted
  ctx.fill();
  
  // Add subtle highlight for depth
  ctx.beginPath();
  ctx.ellipse(-bodyWidth * 0.2, -bodyHeight * 0.2, bodyWidth * 0.4, bodyHeight * 0.3, 0, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
  ctx.fill();
  
  // Add cybernetic detail based on state
  if (fish.state === 'chasing' || fish.state === 'inspecting') {
    // Inner tech circle
    ctx.beginPath();
    ctx.arc(0, 0, bodyWidth * 0.4, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(0, 255, 255, ${0.6 * fish.divfishBoost})`;
    ctx.lineWidth = 1;
    ctx.stroke();
    
    // Pulsing effect based on state time
    if (fish.state === 'inspecting') {
      const pulseSize = 0.3 + 0.1 * Math.sin(fish.stateTime / 200);
      ctx.beginPath();
      ctx.arc(0, 0, bodyWidth * pulseSize, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(0, 255, 255, ${0.8 * fish.divfishBoost})`;
      ctx.stroke();
    }
  }
  
  ctx.restore();
}

/**
 * Draws a triangular front pointing right like in CSS
 */
function drawFishFront(
  ctx: CanvasRenderingContext2D, 
  fish: Fish, 
  bodyWidth: number, 
  bodyHeight: number,
  color: string
): void {
  // Dimensions for front triangle based on CSS proportions (100px width, 160px total height)
  const frontLength = bodyWidth * 1; // Length of the triangle (100px in CSS)
  const frontHeight = bodyHeight * 2; // Height (top to bottom) (160px in CSS)
  
  // Get wobble amount for animation
  const wobbleTime = fish.wobbleOffset;
  const wobbleSpeed = fish.state === 'chasing' ? 1.5 : 1.0;
  
  // Create a slight wobble effect for the front
  const wobbleAmount = Math.sin(wobbleTime * wobbleSpeed) * (fish.wobbleIntensity * 2);
  
  // Draw the front triangle - pointing right just like the CSS
  ctx.beginPath();
  
  // Position at the front of body based on CSS (left: 30px vs body at 100px)
  const frontStartX = -bodyWidth * 0.7; // Left side of body - front triangle starts before body
  
  // Draw the triangle with animation (pointing right with border-left in CSS)
  ctx.moveTo(frontStartX, 0); // Base center point 
  ctx.lineTo(frontStartX - frontLength, frontHeight/2 + wobbleAmount); // Top point
  ctx.lineTo(frontStartX - frontLength, -frontHeight/2 + wobbleAmount); // Bottom point
  ctx.closePath();
  
  // Create a gradient for the front
  const frontGradient = ctx.createLinearGradient(frontStartX, 0, frontStartX - frontLength, 0);
  frontGradient.addColorStop(0, color);
  frontGradient.addColorStop(0.7, color.replace('0.7', '0.3'));
  frontGradient.addColorStop(1, color.replace('0.7', '0.1'));
  
  ctx.fillStyle = frontGradient;
  ctx.shadowBlur = 10 * fish.divfishBoost;
  ctx.shadowColor = color;
  
  // Fill the front with semi-transparent color
  ctx.fill();
  
  // Add subtle outer glow
  ctx.beginPath();
  ctx.moveTo(frontStartX, 0);
  ctx.lineTo(frontStartX - frontLength * 1.05, frontHeight/2 * 1.1 + wobbleAmount);
  ctx.lineTo(frontStartX - frontLength * 1.05, -frontHeight/2 * 1.1 + wobbleAmount);
  ctx.closePath();
  
  ctx.shadowBlur = 15 * fish.divfishBoost;
  ctx.shadowColor = '#00FFFF';
  ctx.strokeStyle = color.replace('0.7', '0.1');
  ctx.lineWidth = 1;
  ctx.stroke();
}

/**
 * Draws a triangular tail pointing right like in CSS - now with cyber pink color
 */
function drawFishTail(
  ctx: CanvasRenderingContext2D, 
  fish: Fish, 
  bodyWidth: number, 
  bodyHeight: number,
  color: string
): void {
  // Dimensions for tail triangle based on CSS proportions (150px border-left, 160px height)
  const tailLength = bodyWidth * 2.5; // Length of the triangular tail (150px in CSS)
  const tailHeight = bodyHeight * 5; // Height (top to bottom) (160px in CSS) - updated to 5x
  
  // Enhanced physics-based wobble simulation
  const wobbleTime = fish.wobbleOffset;
  const wobbleSpeed = fish.state === 'chasing' ? 1.8 : 
                     fish.state === 'inspecting' ? 1.3 : 1.0;
  
  // Calculate primary wobble motion
  const primaryWobble = Math.sin(wobbleTime * wobbleSpeed) * (fish.wobbleIntensity * 6);
  
  // Add secondary wobble for more complex motion
  const secondaryWobble = Math.sin(wobbleTime * wobbleSpeed * 1.7 + 0.4) * (fish.wobbleIntensity * 2);
  
  // Combine wobbles for natural motion
  const tailWobble = primaryWobble + secondaryWobble;
  
  // Position for tail based on CSS (left: 150px vs body at 100px)
  const tailStartX = bodyWidth * 0.25; // Right side of body where tail overlaps (about 50px after body start)
  
  // Create a path for the tail with enhanced physics - pointing right like CSS
  ctx.beginPath();
  
  // Draw the triangle with animation (pointing right with border-left)
  ctx.moveTo(tailStartX, 0); // Base center point
  ctx.lineTo(tailStartX - tailLength, tailHeight/2 + tailWobble); // Top point
  ctx.lineTo(tailStartX - tailLength, -tailHeight/2 + tailWobble); // Bottom point
  ctx.closePath();
  
  // Create a gradient for the tail to give it a cyber pink semi-transparent effect
  const tailGradient = ctx.createLinearGradient(tailStartX, 0, tailStartX - tailLength, 0);
  tailGradient.addColorStop(0, color);
  tailGradient.addColorStop(0.7, color.replace('0.7', '0.3'));
  tailGradient.addColorStop(1, color.replace('0.7', '0.1'));
  
  ctx.fillStyle = tailGradient;
  ctx.shadowBlur = 10 * fish.divfishBoost;
  ctx.shadowColor = color;
  
  // Fill the tail with semi-transparent color
  ctx.fill();
  
  // Add subtle outer glow
  ctx.beginPath();
  ctx.moveTo(tailStartX, 0);
  ctx.lineTo(tailStartX - tailLength * 1.05, tailHeight/2 * 1.1 + tailWobble);
  ctx.lineTo(tailStartX - tailLength * 1.05, -tailHeight/2 * 1.1 + tailWobble);
  ctx.closePath();
  
  ctx.shadowBlur = 15 * fish.divfishBoost;
  ctx.shadowColor = '#FF2EF5'; // Cyber pink glow
  ctx.strokeStyle = color.replace('0.7', '0.1');
  ctx.lineWidth = 1;
  ctx.stroke();
}

/**
 * Draws the side fins (wings) with fluid motion
 */
function drawFishWings(
  ctx: CanvasRenderingContext2D,
  fish: Fish,
  bodyWidth: number,
  bodyHeight: number,
  color: string
): void {
  // Wing dimensions - smaller than tail
  const wingLength = bodyWidth * 2;
  const wingBaseWidth = bodyHeight * 4;
  
  // Wing physics properties - slightly different frequencies than the tail
  // for more interesting motion and asymmetry
  const wobbleTime = fish.wobbleOffset;
  const leftWingPhase = wobbleTime * 1.2; // Slightly faster than tail
  const rightWingPhase = wobbleTime * 1.2 + Math.PI; // Opposite phase
  
  // Wing amplitude increases with fish speed
  const wingAmplitude = fish.wobbleIntensity * 8 * (fish.speed / fish.normalSpeed);
  
  // Increase flutter when chasing or inspecting
  const flutterIntensity = fish.state === 'chasing' ? 1.5 : 
                          fish.state === 'inspecting' ? 1.2 : 1.0;
  
  // Left wing (extends from left side of body)
  drawWing(
    ctx,
    0, // At center of body
    -bodyHeight * 0.8, // Offset to left side
    wingLength,
    wingBaseWidth,
    leftWingPhase,
    wingAmplitude * flutterIntensity,
    Math.PI / 2, // 90 degrees (pointing left)
    color,
    fish.divfishBoost
  );
  
  // Right wing (extends from right side of body)
  drawWing(
    ctx,
    0, // At center of body
    bodyHeight * 0.8, // Offset to right side
    wingLength,
    wingBaseWidth,
    rightWingPhase,
    wingAmplitude * flutterIntensity,
    -Math.PI / 2, // -90 degrees (pointing right)
    color,
    fish.divfishBoost
  );
}

/**
 * Helper function to draw a single wing with physics
 */
function drawWing(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  length: number,
  baseWidth: number,
  phase: number,
  amplitude: number,
  angle: number,
  color: string,
  divfishBoost: number
): void {
  // Save context to isolate transformations
  ctx.save();
  
  // Move to wing base position and rotate
  ctx.translate(x, y);
  ctx.rotate(angle);
  
  // Calculate wing curve based on physics
  // Use primary and secondary sine waves for more complex motion
  const primaryWobble = Math.sin(phase) * amplitude;
  const secondaryWobble = Math.sin(phase * 1.5 + 0.4) * (amplitude * 0.3);
  const curveAmount = primaryWobble + secondaryWobble;
  
  // Draw wing path
  ctx.beginPath();
  
  // Wing base
  ctx.moveTo(0, -baseWidth/3);
  
  // Create a curved wing shape with physics-based movement
  // Top edge with curve
  ctx.quadraticCurveTo(
    length * 0.5, -baseWidth/2 + curveAmount * 0.7, // Control point with physics
    length, 0 // End point (tip of wing)
  );
  
  // Bottom edge with curve (opposite phase)
  ctx.quadraticCurveTo(
    length * 0.5, baseWidth/2 + curveAmount * 0.5, // Control point with physics
    0, baseWidth/3 // Back to base (bottom)
  );
  
  // Close the path
  ctx.closePath();
  
  // Create a gradient similar to the tail
  const wingGradient = ctx.createLinearGradient(0, 0, length, 0);
  wingGradient.addColorStop(0, color);
  wingGradient.addColorStop(0.5, color.replace('0.7', '0.4'));
  wingGradient.addColorStop(1, color.replace('0.7', '0.1'));
  
  // Apply gradient and glow effects
  ctx.fillStyle = wingGradient;
  ctx.shadowBlur = 10 * divfishBoost;
  ctx.shadowColor = color;
  ctx.fill();
  
  // Add subtle glow outline
  ctx.strokeStyle = color.replace('0.7', '0.2');
  ctx.lineWidth = 0.5;
  ctx.stroke();
  
  // Restore context
  ctx.restore();
}

/**
 * Draws particles on the canvas - NOW WITH ROUND CYAN PARTICLES
 */
export function drawParticles(ctx: CanvasRenderingContext2D, particles: Particle[]): void {
  particles.forEach(particle => {
    ctx.save();
    
    if (particle.type === 'bubble') {
      // Draw bubble particles with glow and fade effect
      const pulseIntensity = 0.8 + (particle.pulse * 0.2);
      const glowSize = 4 + (particle.pulse * 2); // Smaller glow for smaller bubbles
      
      // Calculate fade based on lifetime - fade more as bubble rises
      const fadeMultiplier = particle.lifetime / particle.maxLifetime;
      ctx.globalAlpha = particle.alpha * fadeMultiplier;
      
      // Bubble glow effect
      ctx.shadowBlur = glowSize;
      ctx.shadowColor = particle.color;
      
      // Draw bubble as circle
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      ctx.fillStyle = particle.color;
      ctx.fill();
      
      // Add bubble highlight with fade
      ctx.globalAlpha = (particle.alpha * fadeMultiplier) * 0.8;
      ctx.beginPath();
      ctx.arc(particle.x - particle.size * 0.3, particle.y - particle.size * 0.3, particle.size * 0.4, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.fill();
      
      // Add outer glow ring
      ctx.globalAlpha = (particle.alpha * fadeMultiplier) * 0.3;
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size * 1.5, 0, Math.PI * 2);
      ctx.strokeStyle = particle.color;
      ctx.lineWidth = 1;
      ctx.stroke();
      
    } else {
      // Enhanced floating ROUND CYAN particles with stronger glow
      // Calculate pulse effect for glow intensity
      const pulseIntensity = 0.7 + (particle.pulse * 0.3);
      const glowSize = 8 + (particle.pulse * 5);
      
      // Set opacity based on lifetime
      ctx.globalAlpha = particle.alpha * (particle.lifetime / particle.maxLifetime);
      
      // Enhanced glow effect
      ctx.shadowBlur = glowSize;
      ctx.shadowColor = particle.color; // Now cyan (#00FFFF)
      
      // Draw as ROUND circle instead of rectangle
      ctx.fillStyle = particle.color;
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      ctx.fill();
      
      // Add a second layer for stronger glow at center
      ctx.globalAlpha = pulseIntensity * 0.7 * (particle.lifetime / particle.maxLifetime);
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size * 0.6, 0, Math.PI * 2);
      ctx.fill();
      
      // Add bright center dot for extra sparkle
      ctx.globalAlpha = pulseIntensity * 0.9 * (particle.lifetime / particle.maxLifetime);
      ctx.fillStyle = '#FFFFFF'; // White center
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size * 0.3, 0, Math.PI * 2);
      ctx.fill();
    }
    
    ctx.restore();
  });
}