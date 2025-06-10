// src/components/home/divfish/types.ts

export interface DivFishTailSegment {
  x: number;
  y: number;
  angle: number;
  flexibility: number;
}

export interface DivFish {
  id: number;
  x: number;
  y: number;
  size: number;
  speed: number;
  normalSpeed: number;
  angle: number;
  targetAngle: number;
  turnSpeed: number;
  tailSegments: DivFishTailSegment[];
  wobbleOffset: number;
  wobbleSpeed: number;
  wobbleIntensity: number;
  acceleration: number;
}