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

  // Brand colors with smooth transitions
  const COLORS = ['#00FFFF', '#8A2BE2', '#FF2EF5']; // Cyan, Purple, Pink
  
  // Configuration based on device
  const getConfig = () => ({
    maxNodes: isMobileRef.current ? 15 : 25,
    maxConnections: isMobileRef.current ? 20 : 40,
    connectionDistance: isMobileRef.current ? 150 : 200,
    nodeSpawnRate: isMobileRef.current ? 0.02 : 0.03,
    nodeLifetime: isMobileRef.current ? 8000 : 12000,
    particleSpawnRate: 0.1,
    maxParticlesPerConnection: isMobileRef.current ? 2 : 4,
    nodeSpeed: 0.5,
    particleSpeed: 0.02,
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

  // Create a new node
  const createNode = (width: number, height: number, currentTime: number): Node => {
    const padding = 100;
    const x = padding + Math.random() * (width - 2 * padding);
    const y = padding + Math.random() * (height - 2 * padding);
    
    return {
      id: nextNodeIdRef.current++,
      x,
      y,
      targetX: x,
      targetY: y,
      size: 3 + Math.random() * 4,
      opacity: 0,
      targetOpacity: 0.6 + Math.random() * 0.4,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      colorIndex: Math.floor(Math.random() * COLORS.length),
      isVisible: true,
      spawnTime: currentTime,
      pulsePhase: Math.random() * Math.PI * 2,
      connections: [],
    };
  };

  // Create a data particle
  const createDataParticle = (fromNode: Node, toNode: Node): DataParticle => {
    return {
      id: nextParticleIdRef.current++,
      progress: 0,
      speed: 0.01 + Math.random() * 0.02,
      size: 1 + Math.random() * 2,
      opacity: 0.7 + Math.random() * 0.3,
      color: fromNode.color,
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
              opacity: strength * 0.3,
              particles: [],
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

  // Draw a node with glow effect
  const drawNode = (ctx: CanvasRenderingContext2D, node: Node, currentTime: number) => {
    if (!node.isVisible || node.opacity <= 0) return;

    // Pulsing effect
    const pulseValue = Math.sin(currentTime * 0.002 + node.pulsePhase) * 0.3 + 0.7;
    const finalSize = node.size * pulseValue;
    
    // Color transition over time
    const colorTransition = (currentTime - node.spawnTime) * 0.0005;
    const colorIndex = (node.colorIndex + colorTransition) % COLORS.length;
    const currentColorIndex = Math.floor(colorIndex) % COLORS.length;
    const nextColorIndex = (currentColorIndex + 1) % COLORS.length;
    const blend = colorIndex - Math.floor(colorIndex);
    
    // Interpolate between colors
    const currentColor = hexToRgb(COLORS[currentColorIndex]);
    const nextColor = hexToRgb(COLORS[nextColorIndex]);
    const r = Math.round(currentColor.r * (1 - blend) + nextColor.r * blend);
    const g = Math.round(currentColor.g * (1 - blend) + nextColor.g * blend);
    const b = Math.round(currentColor.b * (1 - blend) + nextColor.b * blend);
    const interpolatedColor = `rgb(${r}, ${g}, ${b})`;

    ctx.save();
    ctx.globalAlpha = node.opacity;
    
    // Outer glow
    ctx.shadowBlur = 20;
    ctx.shadowColor = interpolatedColor;
    ctx.fillStyle = interpolatedColor;
    
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

  // Draw connection line with gradient
  const drawConnection = (ctx: CanvasRenderingContext2D, connection: Connection) => {
    const fromNode = nodesRef.current.find(n => n.id === connection.from);
    const toNode = nodesRef.current.find(n => n.id === connection.to);
    
    if (!fromNode || !toNode || !fromNode.isVisible || !toNode.isVisible) return;

    ctx.save();
    ctx.globalAlpha = connection.opacity;
    
    // Create gradient line
    const gradient = ctx.createLinearGradient(fromNode.x, fromNode.y, toNode.x, toNode.y);
    gradient.addColorStop(0, fromNode.color);
    gradient.addColorStop(1, toNode.color);
    
    ctx.strokeStyle = gradient;
    ctx.lineWidth = 1;
    ctx.shadowBlur = 5;
    ctx.shadowColor = fromNode.color;
    
    ctx.beginPath();
    ctx.moveTo(fromNode.x, fromNode.y);
    ctx.lineTo(toNode.x, toNode.y);
    ctx.stroke();
    
    ctx.restore();
  };

  // Draw data particle
  const drawDataParticle = (ctx: CanvasRenderingContext2D, particle: DataParticle) => {
    const fromNode = nodesRef.current.find(n => n.id === particle.fromNode);
    const toNode = nodesRef.current.find(n => n.id === particle.toNode);
    
    if (!fromNode || !toNode) return;

    const x = fromNode.x + (toNode.x - fromNode.x) * particle.progress;
    const y = fromNode.y + (toNode.y - fromNode.y) * particle.progress;

    ctx.save();
    ctx.globalAlpha = particle.opacity;
    ctx.fillStyle = particle.color;
    ctx.shadowBlur = 8;
    ctx.shadowColor = particle.color;
    
    ctx.beginPath();
    ctx.arc(x, y, particle.size, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.restore();
  };

  // Utility function to convert hex to RGB
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 0, g: 0, b: 0 };
  };

  // Update node properties
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
    
    // Gentle random movement
    if (Math.random() < 0.005) {
      const padding = 100;
      node.targetX = padding + Math.random() * (window.innerWidth - 2 * padding);
      node.targetY = padding + Math.random() * (window.innerHeight - 2 * padding);
    }
  };

  // Update data particles
  const updateDataParticles = (connection: Connection, config: any) => {
    // Update existing particles
    connection.particles = connection.particles.filter(particle => {
      particle.progress += particle.speed;
      return particle.progress <= 1;
    });
    
    // Spawn new particles
    if (Math.random() < config.particleSpawnRate && 
        connection.particles.length < config.maxParticlesPerConnection) {
      const fromNode = nodesRef.current.find(n => n.id === connection.from);
      const toNode = nodesRef.current.find(n => n.id === connection.to);
      
      if (fromNode && toNode && fromNode.isVisible && toNode.isVisible) {
        connection.particles.push(createDataParticle(fromNode, toNode));
      }
    }
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

      // Spawn new nodes
      if (Math.random() < config.nodeSpawnRate && 
          nodesRef.current.filter(n => n.isVisible).length < config.maxNodes) {
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

      // Update and draw connections with particles
      connectionsRef.current.forEach(connection => {
        updateDataParticles(connection, config);
        drawConnection(ctx, connection);
        
        // Draw particles on this connection
        connection.particles.forEach(particle => {
          drawDataParticle(ctx, particle);
        });
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