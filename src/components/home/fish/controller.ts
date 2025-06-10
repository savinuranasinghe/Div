// src/components/home/fish/controller.ts
// Logic for fish behavior and movement
import { Fish, CursorState, TailSegment, Particle, ParticleType } from './types';
import { DivFish } from '../divfish/types';

// 🔧 CHANGE THESE VALUES TO ADJUST FISH SIZES:
const FISH_SIZE_DESKTOP = 15; // Normal fish size on desktop
const FISH_SIZE_MOBILE = 15;  // Normal fish size on mobile

// 🔧 CHANGE THESE VALUES TO ADJUST NORMAL FISH SPEEDS:
// Normal swimming speed
const FISH_NORMAL_SPEED_DESKTOP = 0.5; // Base normal speed on desktop
const FISH_NORMAL_SPEED_MOBILE = 0.4;  // Base normal speed on mobile (slower)
const FISH_SPEED_VARIATION = 0.4;      // Random speed variation added to base

// Maximum chase speed  
const FISH_MAX_SPEED_DESKTOP = 1.5;    // Max speed when chasing on desktop
const FISH_MAX_SPEED_MOBILE = 1.2;     // Max speed when chasing on mobile (slower)
const FISH_MAX_SPEED_VARIATION = 0.3;  // Random max speed variation

// Edge boundary buffer to prevent sticking
const EDGE_BUFFER = 5;
// More tail segments for greater fluidity
const TAIL_SEGMENT_COUNT = 10;
// Influence distance for divfish effect
const DIVFISH_INFLUENCE_DISTANCE = 150;

/**
 * Creates a new fish object with size based on device type
 */
export function createFish(id: number, tankWidth: number, tankHeight: number, isMobile: boolean = false): Fish {
  const fishSize = isMobile ? FISH_SIZE_MOBILE : FISH_SIZE_DESKTOP;
  const normalSpeedBase = isMobile ? FISH_NORMAL_SPEED_MOBILE : FISH_NORMAL_SPEED_DESKTOP;
  const maxSpeedBase = isMobile ? FISH_MAX_SPEED_MOBILE : FISH_MAX_SPEED_DESKTOP;
  
  return {
    id,
    x: Math.random() * (tankWidth - 2 * EDGE_BUFFER) + EDGE_BUFFER,
    y: Math.random() * (tankHeight - 2 * EDGE_BUFFER) + EDGE_BUFFER,
    size: fishSize,
    speed: normalSpeedBase + Math.random() * FISH_SPEED_VARIATION,
    maxSpeed: maxSpeedBase + Math.random() * FISH_MAX_SPEED_VARIATION,
    normalSpeed: normalSpeedBase + Math.random() * FISH_SPEED_VARIATION,
    angle: Math.random() * Math.PI * 2,
    targetAngle: Math.random() * Math.PI * 2,
    turnSpeed: 0.03 + Math.random() * 0.02,
    tailSegments: Array.from({ length: TAIL_SEGMENT_COUNT }, (_, i) => ({ 
      x: 0, y: 0, angle: 0,
      // Add flexibility values for more dynamic tail movement
      // More flexibility toward the end of the tail
      flexibility: 0.5 + (i / TAIL_SEGMENT_COUNT) * 0.5
    } as TailSegment)),
    wobbleOffset: Math.random() * Math.PI * 2,
    wobbleSpeed: 0.05 + Math.random() * 0.03, // Speed of tail wobble
    wobbleIntensity: 0.8 + Math.random() * 0.4, // Intensity of tail movement
    state: 'swimming',
    stateTime: 0,
    inspectDuration: 1000 + Math.random() * 2000,
    // Adjusted for 4 fish - more evenly spaced orbit radii
    inspectRadius: 20 + id * 15,
    // Adjusted for 4 fish - more evenly spaced orbit positions
    orbitOffset: id * (Math.PI * 2 / 4),
    acceleration: 0.05,
    // Add divfish influence properties
    divfishBoost: 1.0, // Multiplier for speed and glow when near divfish
    divfishBoostDecay: 0.02, // How fast the boost fades
  };
}

/**
 * Creates a new particle with device-specific size and cyan color
 */
export function createParticle(
  x: number, 
  y: number, 
  type: ParticleType,
  color: string,
  canvasWidth: number,
  canvasHeight: number,
  isMobile: boolean = false
): Particle {
  // Different particle sizes for mobile vs desktop
  const baseSize = isMobile ? 1.0 : 1.8;        // Smaller base size on mobile
  const sizeVariation = isMobile ? 1.2 : 2.2;   // Less size variation on mobile
  
  const size = baseSize + Math.random() * sizeVariation;
  const speed = 0.3 + Math.random() * 0.5;
  const alpha = 0.5 + Math.random() * 0.5; // Increased opacity
  const lifetime = 300 + Math.random() * 500;
  const pulse = Math.random(); // Random starting pulse phase
  const pulseSpeed = 0.5 + Math.random() * 1; // Control pulse speed
  
  return {
    x,
    y,
    size,
    speed,
    alpha,
    color: '#00FFFF', // Cyan color instead of using passed color
    type: 'floater',
    lifetime,
    maxLifetime: lifetime,
    pulse,
    pulseSpeed
  };
}

/**
 * Creates a bubble particle from divfish
 */
export function createBubble(
  x: number, 
  y: number, 
  canvasWidth: number,
  canvasHeight: number
): Particle {
  const size = 1.5 + Math.random() * 2; // Smaller bubbles
  const speed = 1 + Math.random() * 1.5; // Faster upward movement
  const alpha = 0.8 + Math.random() * 0.2; // Higher initial alpha for better visibility
  const lifetime = 600 + Math.random() * 400; // Longer lifetime for fade effect
  const pulse = Math.random();
  const pulseSpeed = 0.3 + Math.random() * 0.7;
  
  return {
    x: x + (Math.random() - 0.5) * 20, // Slight random offset
    y,
    size,
    speed,
    alpha,
    color: '#87CEEB', // Light blue bubble color
    type: 'bubble',
    lifetime,
    maxLifetime: lifetime,
    pulse,
    pulseSpeed
  };
}

/**
 * Initialize multiple fish with device-appropriate sizes
 */
export function initFishes(count: number, tankWidth: number, tankHeight: number, isMobile: boolean = false): Fish[] {
  return Array.from({ length: count }, (_, i) => createFish(i, tankWidth, tankHeight, isMobile));
}

/**
 * Calculate distance between two points
 */
export function getDistance(x1: number, y1: number, x2: number, y2: number): number {
  return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
}

/**
 * Updates the fish tail segments for fluid motion
 * Now adapted for the top-down flattened fish design
 */
export function updateFishTail(fish: Fish): void {
  // Update wobble effect for the tail
  fish.wobbleOffset += fish.wobbleSpeed;
  
  // Calculate speed factor - faster fish have more tail movement
  const speedFactor = fish.speed / fish.normalSpeed;
  
  // Different wobble characteristics based on fish state
  const stateWobbleMultiplier = fish.state === 'chasing' ? 1.2 : 
                              fish.state === 'inspecting' ? 0.7 : 1.0;
  
  // Calculate lag factor - how much each segment lags behind the previous one
  const lagFactor = 0.2;
  
  // Head position
  const headX = fish.x;
  const headY = fish.y;
  
  // Previous position tracking
  let prevX = headX;
  let prevY = headY;
  let prevAngle = fish.angle;
  
  // Update each tail segment
  fish.tailSegments.forEach((segment, i) => {
    // Calculate segment position based on fish motion
    const segmentIndex = i + 1;
    const totalSegments = fish.tailSegments.length;
    
    // Calculate lag - increases toward the end of the tail
    const lagAmount = lagFactor * (segmentIndex / totalSegments) * speedFactor;
    
    // Dynamic distance based on speed and segment position
    const segmentDistance = fish.size * 0.1 * (1 + lagAmount);
    
    // Wobble increases toward tail end
    const wobbleAmplitude = fish.wobbleIntensity * (segmentIndex / totalSegments) * stateWobbleMultiplier;
    const wobbleFrequency = 1 + segmentIndex * 0.2; // Higher frequency for tail end
    
    // Calculate wobble amount with sine wave
    const wobblePhase = fish.wobbleOffset * wobbleFrequency + segmentIndex * 0.5;
    const wobbleAmount = wobbleAmplitude * Math.sin(wobblePhase);
    
    // Apply perpendicular wobble to create fluid motion
    const wobbleX = Math.sin(prevAngle) * wobbleAmount;
    const wobbleY = -Math.cos(prevAngle) * wobbleAmount;
    
    // Position behind previous point with lag effect
    segment.x = prevX - Math.cos(prevAngle) * segmentDistance + wobbleX;
    segment.y = prevY - Math.sin(prevAngle) * segmentDistance + wobbleY;
    
    // Calculate angle with smooth transition
    const angleToHead = Math.atan2(headY - segment.y, headX - segment.x);
    const segmentFraction = segmentIndex / totalSegments;
    
    // Blend between direct angle to head and previous segment angle for smoother curve
    const blendFactor = Math.min(1, segmentFraction * 2);
    segment.angle = angleToHead * (1 - blendFactor) + prevAngle * blendFactor;
    
    // Update previous positions for next segment
    prevX = segment.x;
    prevY = segment.y;
    prevAngle = segment.angle;
  });
}

/**
 * Update fish position and behavior based on state
 */
export function updateFish(
  fish: Fish, 
  tankWidth: number, 
  tankHeight: number, 
  cursor: CursorState, 
  isMobile: boolean, 
  deltaTime: number,
  divfish?: DivFish | null
): void {
  const now = Date.now();
  const timeSinceCursorMoved = now - cursor.lastMoved;
  
  // Update state time
  fish.stateTime += deltaTime;
  
  // Check divfish influence
  let nearDivfish = false;
  if (divfish) {
    const distanceToDivfish = getDistance(fish.x, fish.y, divfish.x, divfish.y);
    if (distanceToDivfish < DIVFISH_INFLUENCE_DISTANCE) {
      // Apply divfish boost
      fish.divfishBoost = Math.min(3.0, fish.divfishBoost + 0.05); // Boost up to 3x
      nearDivfish = true;
      
      // Make normal fish turn away from divfish when they get close
      const dx = fish.x - divfish.x;
      const dy = fish.y - divfish.y;
      const angleAwayFromDivfish = Math.atan2(dy, dx);
      
      // Gradually turn away from divfish
      fish.targetAngle = angleAwayFromDivfish;
    }
  }
  
  // Decay divfish boost when not near
  if (!nearDivfish) {
    fish.divfishBoost = Math.max(1.0, fish.divfishBoost - fish.divfishBoostDecay);
  }
  
  // Handle different states
  if (isMobile) {
    // On mobile, always free swim
    fish.state = 'swimming';
  } else if (cursor.x === null || !cursor.isActive) {
    // No cursor or cursor not in canvas, free swim
    fish.state = 'swimming';
  } else if (fish.state === 'swimming') {
    // If cursor is active and we're swimming, start chasing
    if (cursor.isActive && timeSinceCursorMoved < 100) {
      fish.state = 'chasing';
      fish.stateTime = 0;
    }
  } else if (fish.state === 'chasing') {
    // If cursor hasn't moved for a while, start inspecting
    if (timeSinceCursorMoved > 1000) {
      fish.state = 'inspecting';
      fish.stateTime = 0;
    }
  } else if (fish.state === 'inspecting') {
    // After inspection period, go back to swimming
    if (fish.stateTime > fish.inspectDuration) {
      fish.state = 'swimming';
      fish.stateTime = 0;
    }
    
    // If cursor moves significantly while inspecting, go back to chasing
    if (timeSinceCursorMoved < 100) {
      fish.state = 'chasing';
      fish.stateTime = 0;
    }
  }
  
  // Handle behavior based on state
  if (fish.state === 'swimming') {
    // Free swimming behavior
    // Occasionally change direction
    if (Math.random() < 0.005) {
      fish.targetAngle = Math.random() * Math.PI * 2;
    }
    
    // Gradually return to normal speed (affected by divfish boost)
    const targetSpeed = fish.normalSpeed * fish.divfishBoost;
    fish.speed = fish.speed + (targetSpeed - fish.speed) * fish.acceleration;
    
    // Add some natural wobble to the swimming motion
    if (Math.random() < 0.02) {
      // Small random direction adjustments
      fish.targetAngle += (Math.random() - 0.5) * 0.2;
    }
  } else if (fish.state === 'chasing' && cursor.x !== null && cursor.y !== null) {
    // Chase cursor behavior
    const dx = cursor.x - fish.x;
    const dy = cursor.y - fish.y;
    fish.targetAngle = Math.atan2(dy, dx);
    
    // Gradually increase to max speed (affected by divfish boost)
    const targetSpeed = fish.maxSpeed * fish.divfishBoost;
    fish.speed = fish.speed + (targetSpeed - fish.speed) * fish.acceleration;
  } else if (fish.state === 'inspecting' && cursor.x !== null && cursor.y !== null) {
    // Circle around cursor behavior
    const inspectTime = fish.stateTime / 1000; // convert to seconds
    const angle = inspectTime * 2 + fish.orbitOffset;
    
    // Calculate position in orbit around cursor
    const targetX = cursor.x + Math.cos(angle) * fish.inspectRadius;
    const targetY = cursor.y + Math.sin(angle) * fish.inspectRadius;
    
    // Get angle to orbit position
    const dx = targetX - fish.x;
    const dy = targetY - fish.y;
    fish.targetAngle = Math.atan2(dy, dx);
    
    // Adjust speed based on distance to target orbit position (affected by divfish boost)
    const distToOrbitPos = getDistance(fish.x, fish.y, targetX, targetY);
    const orbitSpeed = (0.5 + (distToOrbitPos / 50)) * fish.divfishBoost;
    fish.speed = fish.speed + (orbitSpeed - fish.speed) * fish.acceleration * 2;
  }
  
  // Smooth turning toward target angle
  const angleDiff = ((fish.targetAngle - fish.angle + Math.PI * 3) % (Math.PI * 2)) - Math.PI;
  fish.angle += Math.sign(angleDiff) * Math.min(Math.abs(angleDiff), fish.turnSpeed);
  
  // Update position based on angle and speed
  const nextX = fish.x + Math.cos(fish.angle) * fish.speed;
  const nextY = fish.y + Math.sin(fish.angle) * fish.speed;
  
  // Improved edge detection with anticipation to prevent sticking
  // Check if the next position would be too close to or beyond the edge
  const edgeMargin = EDGE_BUFFER + fish.speed * 3; // Increased margin to prevent corner sticking
  
  // Handle horizontal boundaries with improved anticipation
  if (nextX < edgeMargin) {
    // Approaching left edge - turn right with random angle variation
    fish.targetAngle = (Math.random() * Math.PI / 2) - (Math.PI / 4); // Random angle between -45° to 45° (generally rightward)
    fish.x = Math.max(edgeMargin, fish.x); // Ensure fish doesn't go past margin
  } else if (nextX > tankWidth - edgeMargin) {
    // Approaching right edge - turn left with random angle variation
    fish.targetAngle = Math.PI + (Math.random() * Math.PI / 2) - (Math.PI / 4); // Random angle between 135° to 225° (generally leftward)
    fish.x = Math.min(tankWidth - edgeMargin, fish.x); // Ensure fish doesn't go past margin
  } else {
    // Regular movement
    fish.x = nextX;
  }
  
  // Handle vertical boundaries with improved anticipation
  if (nextY < edgeMargin) {
    // Approaching top edge - turn down with random angle variation
    fish.targetAngle = (Math.PI / 2) + (Math.random() * Math.PI / 2) - (Math.PI / 4); // Random angle between 45° to 135° (generally downward)
    fish.y = Math.max(edgeMargin, fish.y); // Ensure fish doesn't go past margin
  } else if (nextY > tankHeight - edgeMargin) {
    // Approaching bottom edge - turn up with random angle variation
    fish.targetAngle = (-Math.PI / 2) + (Math.random() * Math.PI / 2) - (Math.PI / 4); // Random angle between -135° to -45° (generally upward)
    fish.y = Math.min(tankHeight - edgeMargin, fish.y); // Ensure fish doesn't go past margin
  } else {
    // Regular movement
    fish.y = nextY;
  }
  
  // Update tail segments
  updateFishTail(fish);
}