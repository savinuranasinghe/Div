// src/components/home/divfish/controller.ts

import { DivFish, DivFishTailSegment } from './types';

// 🔧 CHANGE THESE VALUES TO ADJUST DIVFISH SIZES:
const DIVFISH_SIZE_DESKTOP = 25; // Divfish size on desktop
const DIVFISH_SIZE_MOBILE = 20;  // Divfish size on mobile

// 🔧 CHANGE THESE VALUES TO ADJUST DIVFISH SPEEDS:
const DIVFISH_SPEED_DESKTOP = 0.3;     // Base divfish speed on desktop
const DIVFISH_SPEED_MOBILE = 0.2;      // Base divfish speed on mobile (slower)
const DIVFISH_SPEED_VARIATION = 0.2;   // Random speed variation added to base

const EDGE_BUFFER = 5;
const TAIL_SEGMENT_COUNT = 10;

/**
 * Creates the divfish with size based on device type
 */
export function createDivFish(tankWidth: number, tankHeight: number, isMobile: boolean = false): DivFish {
  const size = isMobile ? DIVFISH_SIZE_MOBILE : DIVFISH_SIZE_DESKTOP;
  const speedBase = isMobile ? DIVFISH_SPEED_MOBILE : DIVFISH_SPEED_DESKTOP;
  
  return {
    id: 999, // Unique ID for divfish
    x: Math.random() * (tankWidth - 2 * EDGE_BUFFER) + EDGE_BUFFER,
    y: Math.random() * (tankHeight - 2 * EDGE_BUFFER) + EDGE_BUFFER,
    size: size,
    speed: speedBase + Math.random() * DIVFISH_SPEED_VARIATION,
    normalSpeed: speedBase + Math.random() * DIVFISH_SPEED_VARIATION,
    angle: Math.random() * Math.PI * 2,
    targetAngle: Math.random() * Math.PI * 2,
    turnSpeed: 0.03 + Math.random() * 0.02,
    tailSegments: Array.from({ length: TAIL_SEGMENT_COUNT }, (_, i) => ({ 
      x: 0, y: 0, angle: 0,
      flexibility: 0.5 + (i / TAIL_SEGMENT_COUNT) * 0.5
    } as DivFishTailSegment)),
    wobbleOffset: Math.random() * Math.PI * 2,
    wobbleSpeed: 0.05 + Math.random() * 0.03,
    wobbleIntensity: 0.8 + Math.random() * 0.4,
    acceleration: 0.05,
  };
}

/**
 * Updates the divfish tail segments for fluid motion
 */
export function updateDivFishTail(divfish: DivFish): void {
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

/**
 * Update divfish position and behavior - always swimming, no cursor interaction
 */
export function updateDivFish(
  divfish: DivFish, 
  tankWidth: number, 
  tankHeight: number, 
  deltaTime: number
): void {
  // Always swimming behavior - change direction much less frequently for leadership aura
  if (Math.random() < 0.001) { // Reduced from 0.005 to 0.001 for more steady movement
    divfish.targetAngle = Math.random() * Math.PI * 2;
  }
  
  // Gradually return to normal speed
  divfish.speed = divfish.speed + (divfish.normalSpeed - divfish.speed) * divfish.acceleration;
  
  // Add minimal natural wobble - much less than normal fish for confident movement
  if (Math.random() < 0.005) { // Reduced from 0.02 to 0.005
    divfish.targetAngle += (Math.random() - 0.5) * 0.1; // Reduced from 0.2 to 0.1
  }
  
  // Smooth turning toward target angle
  const angleDiff = ((divfish.targetAngle - divfish.angle + Math.PI * 3) % (Math.PI * 2)) - Math.PI;
  divfish.angle += Math.sign(angleDiff) * Math.min(Math.abs(angleDiff), divfish.turnSpeed);
  
  // Update position based on angle and speed
  const nextX = divfish.x + Math.cos(divfish.angle) * divfish.speed;
  const nextY = divfish.y + Math.sin(divfish.angle) * divfish.speed;
  
  // Handle boundaries - smoother turning for leadership presence
  const edgeMargin = EDGE_BUFFER + divfish.speed * 3; // Increased margin for smoother turns
  
  if (nextX < edgeMargin) {
    divfish.targetAngle = 0; // Right
    divfish.x += Math.min(edgeMargin - nextX, divfish.speed);
  } else if (nextX > tankWidth - edgeMargin) {
    divfish.targetAngle = Math.PI; // Left
    divfish.x -= Math.min(nextX - (tankWidth - edgeMargin), divfish.speed);
  } else {
    divfish.x = nextX;
  }
  
  if (nextY < edgeMargin) {
    divfish.targetAngle = Math.PI / 2; // Down
    divfish.y += Math.min(edgeMargin - nextY, divfish.speed);
  } else if (nextY > tankHeight - edgeMargin) {
    divfish.targetAngle = -Math.PI / 2; // Up
    divfish.y -= Math.min(nextY - (tankHeight - edgeMargin), divfish.speed);
  } else {
    divfish.y = nextY;
  }
  
  // Update tail segments
  updateDivFishTail(divfish);
}