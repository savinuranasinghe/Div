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
  
  // Fast, dynamic configuration for quick disappearing lines
  const getConfig = () => ({
    maxNodes: isMobileRef.current ? 80 : 120, // Keep density
    maxConnections: isMobileRef.current ? 200 : 400, // Keep connections
    connectionDistance: isMobileRef.current ? 250 : 350, // Keep range
    nodeSpawnRate: isMobileRef.current ? 0.3 : 0.4, // Much faster spawning
    nodeLifetime: isMobileRef.current ? 2000 : 3000, // Very short lifetime (2-3 seconds)
    nodeSpeed: isMobileRef.current ? 1.5 : 2.0, // Much faster movement
    edgeBuffer: 30, // Keep coverage
    particleSpawnRate: 0, // No particles
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

  // Create invisible node (for connection points only)
  const createNode = (width: number, height: number, currentTime: number): Node => {
    const padding = getConfig().edgeBuffer;
    
    // Distribute nodes more evenly across the entire screen
    const edgeZones = [
      { x: padding, y: padding, w: width - 2 * padding, h: 80, weight: 2 },
      { x: padding, y: height - 80 - padding, w: width - 2 * padding, h: 80, weight: 2 },
      { x: padding, y: height * 0.2, w: 80, h: height * 0.6, weight: 2 },
      { x: width - 80 - padding, y: height * 0.2, w: 80, h: height * 0.6, weight: 2 },
    ];
    
    // More center zones for better coverage
    const centerZones = [
      { x: width * 0.1, y: height * 0.1, w: width * 0.8, h: height * 0.8, weight: 3 },
      { x: width * 0.15, y: height * 0.15, w: width * 0.7, h: height * 0.7, weight: 2 },
      { x: width * 0.2, y: height * 0.2, w: width * 0.6, h: height * 0.6, weight: 2 },
      { x: width * 0.25, y: height * 0.25, w: width * 0.5, h: height * 0.5, weight: 1 },
    ];
    
    // Combine all zones
    const allZones = [...edgeZones, ...centerZones];
    
    // Create weighted selection array
    const weightedZones: any[] = [];
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
      size: 3 + Math.random() * 4, // Keep original sizes (but won't be drawn)
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

  // Update connections between nodes
  const updateConnections = () => {
    const config = getConfig();
    connectionsRef.current = [];
    
    const visibleNodes = nodesRef.current.filter(n => n.isVisible);
    
    for (let i = 0; i < visibleNodes.length; i++) {
      for (let j = i + 1; j < visibleNodes.length; j++) {
        const nodeA = visibleNodes[i];
        const nodeB = visibleNodes[j];
        
        const distance = Math.sqrt(
          Math.pow(nodeA.x - nodeB.x, 2) + Math.pow(nodeA.y - nodeB.y, 2)
        );
        
        if (distance < config.connectionDistance) {
          const strength = 1 - (distance / config.connectionDistance);
          const opacity = Math.min(nodeA.opacity, nodeB.opacity) * strength * 0.6; // Moderate opacity
          
          connectionsRef.current.push({
            from: nodeA.id,
            to: nodeB.id,
            strength,
            opacity: Math.max(opacity, 0.1), // Lower minimum for quicker fade
            particles: [],
          });
        }
      }
    }
    
    // Limit total connections
    if (connectionsRef.current.length > config.maxConnections) {
      connectionsRef.current.sort((a, b) => b.strength - a.strength);
      connectionsRef.current = connectionsRef.current.slice(0, config.maxConnections);
    }
  };

  // Update node properties with better movement distribution
  const updateNode = (node: Node, currentTime: number, config: any) => {
    // Smooth movement towards target (faster)
    node.x += (node.targetX - node.x) * config.nodeSpeed * 0.05; // Faster movement
    node.y += (node.targetY - node.y) * config.nodeSpeed * 0.05;
    
    // Faster opacity transitions
    node.opacity += (node.targetOpacity - node.opacity) * 0.08; // Much faster fade
    
    // Age-based behavior - quick fade out
    const age = currentTime - node.spawnTime;
    
    if (age > config.nodeLifetime * 0.5) { // Start fading much earlier
      // Quick fade out
      node.targetOpacity = 0;
      if (node.opacity < 0.05) { // Higher threshold for quicker removal
        node.isVisible = false;
      }
    }
    
    // Much more frequent movement for dynamic effect
    if (Math.random() < 0.02) { // Much more frequent movement
      const padding = config.edgeBuffer;
      
      // Quick random movement across entire screen
      node.targetX = padding + Math.random() * (window.innerWidth - 2 * padding);
      node.targetY = padding + Math.random() * (window.innerHeight - 2 * padding);
    }
  };

  // Draw connection line with cyan color (NO NODES DRAWN)
  const drawConnection = (ctx: CanvasRenderingContext2D, connection: Connection) => {
    const fromNode = nodesRef.current.find(n => n.id === connection.from);
    const toNode = nodesRef.current.find(n => n.id === connection.to);
    
    if (!fromNode || !toNode || !fromNode.isVisible || !toNode.isVisible) return;

    ctx.save();
    ctx.globalAlpha = connection.opacity;
    
    // Enhanced cyan line with more visible glow
    ctx.strokeStyle = COLORS[0];
    ctx.lineWidth = 1.5; // Slightly thicker lines
    ctx.shadowBlur = 8; // More glow
    ctx.shadowColor = COLORS[0];
    
    ctx.beginPath();
    ctx.moveTo(fromNode.x, fromNode.y);
    ctx.lineTo(toNode.x, toNode.y);
    ctx.stroke();
    
    // Add a second pass for extra glow
    ctx.globalAlpha = connection.opacity * 0.3;
    ctx.shadowBlur = 15;
    ctx.lineWidth = 2;
    ctx.stroke();
    
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

    // Animation loop
    const animate = (currentTime: number) => {
      const config = getConfig();
      
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Spawn new nodes more frequently (invisible connection points)
      const visibleNodes = nodesRef.current.filter(n => n.isVisible).length;
      if (Math.random() < config.nodeSpawnRate && visibleNodes < config.maxNodes) {
        nodesRef.current.push(createNode(canvas.width, canvas.height, currentTime));
      }

      // Update nodes (invisible - just for connection calculations)
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

      // Draw ONLY connections (no nodes)
      connectionsRef.current.forEach(connection => {
        drawConnection(ctx, connection);
      });

      // NOTE: Nodes are NOT drawn anymore - only connections

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