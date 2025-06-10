// src/components/home/fish/types.ts

// Defines types and interfaces for the fish tank animation

export type FishState = 'swimming' | 'chasing' | 'inspecting';

export interface TailSegment {
  x: number;
  y: number;
  angle: number;
  flexibility: number; // Added for more dynamic tail movement
}

export interface Fish {
  id: number;
  x: number;
  y: number;
  size: number; // Fixed size as specified in the requirements
  speed: number;
  maxSpeed: number;
  normalSpeed: number;
  angle: number;
  targetAngle: number;
  turnSpeed: number;
  tailSegments: TailSegment[];
  wobbleOffset: number;
  wobbleSpeed: number;
  wobbleIntensity: number; // Controls the amount of tail movement
  state: FishState;
  stateTime: number;
  inspectDuration: number;
  inspectRadius: number;
  orbitOffset: number;
  acceleration: number;
  // Add divfish influence properties
  divfishBoost: number; // Multiplier for speed and glow when near divfish
  divfishBoostDecay: number; // How fast the boost fades
}

export interface CursorState {
  x: number | null;
  y: number | null;
  lastMoved: number;
  isActive: boolean;
}

// Simplified particle type
export type ParticleType = 'floater' | 'bubble';

export interface Particle {
  x: number;
  y: number;
  size: number;
  speed: number;
  alpha: number;
  color: string;
  type: ParticleType;
  lifetime: number;
  maxLifetime: number;
  pulse: number; // For glow pulsing
  pulseSpeed: number;
}