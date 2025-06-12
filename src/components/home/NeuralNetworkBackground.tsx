import React, { useEffect, useRef, useState } from 'react';

interface Node {
  id: number;
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  size: number;
  opacity: number;
  targetOpacity: number;
  color: string;
  colorIndex: number;
  isVisible: boolean;
  spawnTime: number;
  pulsePhase: number;
  connections: number[];
}

interface Connection {
  from: number;
  to: number;
  strength: number;
  opacity: number;
  particles: DataParticle[];
}

interface DataParticle {
  id: number;
  progress: number;
  speed: number;
  size: number;
  opacity: number;
  color: string;
  fromNode: number;
  toNode: number;
}

const NeuralNetworkBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationRef = useRef<number | null>(null);
  const nodesRef = useRef<Node[]>([]);
  const connectionsRef = useRef<Connection[]>([]);
  const nextNodeIdRef = useRef(0);
  const nextParticleIdRef = useRef(0);
  const isMobileRef = useRef(typeof window !== 'undefined' && window.innerWidth < 768);
  
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1920,
    height: typeof window !== 'undefined' ? window.innerHeight : 1080,
  });

  // Only cyan color as requested
  const COLORS = ['#00FFFF']; // Only Cyan
  
  // Enhanced configuration for more nodes everywhere
  const getConfig = () => ({
    maxNodes: isMobileRef.current ? 35 : 60, // Much more nodes
    maxConnections: isMobileRef.current ? 30 : 50, // Moderate connections
    connectionDistance: isMobileRef.current ? 180 : 220, // Moderate connection range
    nodeSpawnRate: isMobileRef.current ? 0.06 : 0.1, // Faster spawning
    nodeLifetime: isMobileRef.current ? 12000 : 18000, // Longer lifetime
    particleSpawnRate: 0, // NO PARTICLES as requested
    maxParticlesPerConnection: 0, // NO PARTICLES
    nodeSpeed: 0.5,
    particleSpeed: 0.02,
    edgeBuffer: 30, // Small buffer to use more screen space
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

  // Create a new node with edge-prioritized distribution
  const createNode = (width: number, height: number, currentTime: number): Node => {
    const config = getConfig();
    const padding = config.edgeBuffer;
    
    // Edge zones with higher probability
    const edgeZones = [
      // Top edge strip
      { x: padding, y: padding, w: width - 2 * padding, h: 80, weight: 3 },
      // Bottom edge strip
      { x: padding, y: height - 80 - padding, w: width - 2 * padding, h: 80, weight: 3 },
      // Left edge strip
      { x: padding, y: padding + 80, w: 80, h: height - 160 - 2 * padding, weight: 3 },
      // Right edge strip
      { x: width - 80 - padding, y: padding + 80, w: 80, h: height - 160 - 2 * padding, weight: 3 },
      
      // Corner zones (extra priority)
      { x: padding, y: padding, w: 120, h: 120, weight: 4 },
      { x: width - 120 - padding, y: padding, w: 120, h: 120, weight: 4 },
      { x: padding, y: height - 120 - padding, w: 120, h: 120, weight: 4 },
      { x: width - 120 - padding, y: height - 120 - padding, w: 120, h: 120, weight: 4 },
      
      // Mid-edge zones
      { x: width * 0.3, y: padding, w: width * 0.4, h: 60, weight: 2 },
      { x: width * 0.3, y: height - 60 - padding, w: width * 0.4, h: 60, weight: 2 },
      { x: padding, y: height * 0.3, w: 60, h: height * 0.4, weight: 2 },
      { x: width - 60 - padding, y: height * 0.3, w: 60, h: height * 0.4, weight: 2 },
    ];
    
    // Center zones with lower probability
    const centerZones = [
      { x: width * 0.2, y: height * 0.2, w: width * 0.6, h: height * 0.6, weight: 1 },
      { x: width * 0.25, y: height * 0.25, w: width * 0.5, h: height * 0.5, weight: 0.5 },
    ];
    
    // Combine all zones
    const allZones = [...edgeZones, ...centerZones];
    
    // Create weighted selection array
    const weightedZones = [];
    allZones.forEach(zone => {
      for (let i = 0; i < zone.weight * 10; i++) {
        weightedZones.push(zone);
      }
    });
    
    // Select a zone based on weight
    const selectedZone = weightedZones[Math.floor(Math.random() * weightedZones.length)];
    const x = selectedZone.x + Math.random() * selectedZone.w;
    const y = selectedZone.y + Math.random() * selectedZone.h;
    
    return {
      id: nextNodeIdRef.current++,
      x,
      y,
      targetX: x,
      targetY: y,
      size: 3 + Math.random() * 4, // Keep original sizes
      opacity: 0,
      targetOpacity: 0.6 + Math.random() * 0.4,
      color: COLORS[0], // Always cyan
      colorIndex: 0,
      isVisible: true,
      spawnTime: currentTime,
      pulsePhase: Math.random() * Math.PI * 2,
      connections: [],
    };
  };

  // Create a data particle (unused but keeping for compatibility)
  const createDataParticle = (fromNode: Node, toNode: Node): DataParticle => {
    return {
      id: nextParticleIdRef.current++,
      progress: 0,
      speed: 0.01 + Math.random() * 0.02,
      size: 1 + Math.random() * 2,
      opacity: 0.7 + Math.random() * 0.3,
      color: COLORS[0], // Always cyan
      fromNode: fromNode.id,
      toNode: toNode.id,
    };
  };

  // Calculate distance between two points
  const getDistance = (x1: number, y1: number, x2: number, y2: number): number => {
    return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
  };

  // Update node connections
  const updateConnections = () => {
    const config = getConfig();
    connectionsRef.current = [];
    
    for (let i = 0; i < nodesRef.current.length; i++) {
      const nodeA = nodesRef.current[i];
      if (!nodeA.isVisible) continue;
      
      for (let j = i + 1; j < nodesRef.current.length; j++) {
        const nodeB = nodesRef.current[j];
        if (!nodeB.isVisible) continue;
        
        const distance = getDistance(nodeA.x, nodeA.y, nodeB.x, nodeB.y);
        
        if (distance < config.connectionDistance) {
          const strength = 1 - (distance / config.connectionDistance);
          const existingConnection = connectionsRef.current.find(
            conn => (conn.from === nodeA.id && conn.to === nodeB.id) ||
                   (conn.from === nodeB.id && conn.to === nodeA.id)
          );
          
          if (!existingConnection) {
            connectionsRef.current.push({
              from: nodeA.id,
              to: nodeB.id,
              strength,
              opacity: strength * 0.35, // Slightly higher opacity for better visibility
              particles: [], // No particles
            });
          }
        }
      }
    }
    
    // Limit total connections
    if (connectionsRef.current.length > config.maxConnections) {
      connectionsRef.current = connectionsRef.current
        .sort((a, b) => b.strength - a.strength)
        .slice(0, config.maxConnections);
    }
  };

  // Draw a node with cyan glow effect
  const drawNode = (ctx: CanvasRenderingContext2D, node: Node, currentTime: number) => {
    if (!node.isVisible || node.opacity <= 0) return;

    // Pulsing effect
    const pulseValue = Math.sin(currentTime * 0.002 + node.pulsePhase) * 0.3 + 0.7;
    const finalSize = node.size * pulseValue;

    ctx.save();
    ctx.globalAlpha = node.opacity;
    
    // Enhanced cyan glow effect
    ctx.shadowBlur = 25;
    ctx.shadowColor = COLORS[0];
    ctx.fillStyle = COLORS[0];
    
    // Draw node
    ctx.beginPath();
    ctx.arc(node.x, node.y, finalSize, 0, Math.PI * 2);
    ctx.fill();
    
    // Inner bright core
    ctx.shadowBlur = 0;
    ctx.globalAlpha = node.opacity * 0.8;
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(node.x, node.y, finalSize * 0.4, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.restore();
  };

  // Draw connection line with cyan color
  const drawConnection = (ctx: CanvasRenderingContext2D, connection: Connection) => {
    const fromNode = nodesRef.current.find(n => n.id === connection.from);
    const toNode = nodesRef.current.find(n => n.id === connection.to);
    
    if (!fromNode || !toNode || !fromNode.isVisible || !toNode.isVisible) return;

    ctx.save();
    ctx.globalAlpha = connection.opacity;
    
    // Simple cyan line (no gradient since all nodes are cyan)
    ctx.strokeStyle = COLORS[0];
    ctx.lineWidth = 1.2;
    ctx.shadowBlur = 6;
    ctx.shadowColor = COLORS[0];
    
    ctx.beginPath();
    ctx.moveTo(fromNode.x, fromNode.y);
    ctx.lineTo(toNode.x, toNode.y);
    ctx.stroke();
    
    ctx.restore();
  };

  // Draw data particle (unused but keeping for compatibility)
  const drawDataParticle = (ctx: CanvasRenderingContext2D, particle: DataParticle) => {
    // Not used since particles are disabled
  };

  // Utility function to convert hex to RGB (keeping for compatibility)
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 0, g: 0, b: 0 };
  };

  // Update node properties with better movement distribution
  const updateNode = (node: Node, currentTime: number, config: any) => {
    // Smooth movement towards target
    node.x += (node.targetX - node.x) * config.nodeSpeed * 0.02;
    node.y += (node.targetY - node.y) * config.nodeSpeed * 0.02;
    
    // Smooth opacity transitions
    node.opacity += (node.targetOpacity - node.opacity) * 0.02;
    
    // Age-based behavior
    const age = currentTime - node.spawnTime;
    
    if (age > config.nodeLifetime * 0.8) {
      // Start fading out
      node.targetOpacity = 0;
      if (node.opacity < 0.01) {
        node.isVisible = false;
      }
    }
    
    // Enhanced random movement with edge preference
    if (Math.random() < 0.008) { // Slightly more frequent movement
      const padding = config.edgeBuffer;
      
      // 70% chance to move to edge areas, 30% to center
      if (Math.random() < 0.7) {
        // Move to edge areas
        const edgeChoice = Math.floor(Math.random() * 4);
        switch (edgeChoice) {
          case 0: // Top edge
            node.targetX = padding + Math.random() * (window.innerWidth - 2 * padding);
            node.targetY = padding + Math.random() * 100;
            break;
          case 1: // Bottom edge
            node.targetX = padding + Math.random() * (window.innerWidth - 2 * padding);
            node.targetY = window.innerHeight - 100 - padding + Math.random() * 100;
            break;
          case 2: // Left edge
            node.targetX = padding + Math.random() * 100;
            node.targetY = padding + Math.random() * (window.innerHeight - 2 * padding);
            break;
          case 3: // Right edge
            node.targetX = window.innerWidth - 100 - padding + Math.random() * 100;
            node.targetY = padding + Math.random() * (window.innerHeight - 2 * padding);
            break;
        }
      } else {
        // Move to center areas (less frequently)
        node.targetX = window.innerWidth * 0.3 + Math.random() * (window.innerWidth * 0.4);
        node.targetY = window.innerHeight * 0.3 + Math.random() * (window.innerHeight * 0.4);
      }
    }
  };

  // Update data particles (unused but keeping for compatibility)
  const updateDataParticles = (connection: Connection, config: any) => {
    // Particles are disabled, so this does nothing
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

    // Animation loop
    const animate = (currentTime: number) => {
      const config = getConfig();
      
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Spawn new nodes more frequently
      const visibleNodes = nodesRef.current.filter(n => n.isVisible).length;
      if (Math.random() < config.nodeSpawnRate && visibleNodes < config.maxNodes) {
        nodesRef.current.push(createNode(canvas.width, canvas.height, currentTime));
      }

      // Update nodes
      nodesRef.current.forEach(node => {
        if (node.isVisible) {
          updateNode(node, currentTime, config);
        }
      });

      // Remove dead nodes
      nodesRef.current = nodesRef.current.filter(node => 
        node.isVisible || node.opacity > 0.01
      );

      // Update connections
      updateConnections();

      // Draw connections (no particles)
      connectionsRef.current.forEach(connection => {
        drawConnection(ctx, connection);
      });

      // Draw nodes
      nodesRef.current.forEach(node => {
        drawNode(ctx, node, currentTime);
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
        opacity: 0.7,
        mixBlendMode: 'screen'
      }}
    />
  );
};

export default NeuralNetworkBackground;