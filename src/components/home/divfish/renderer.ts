// src/components/home/divfish/renderer.ts

import { DivFish } from './types';

/**
 * Draws the divfish with orange color #FF5F1F
 */
export function drawDivFish(ctx: CanvasRenderingContext2D, divfish: DivFish): void {
  ctx.save();
  
  const bodyWidth = divfish.size * 0.70;
  const bodyHeight = divfish.size * 0.35;
  
  const centerX = divfish.x;
  const centerY = divfish.y;
  
  ctx.translate(centerX, centerY);
  ctx.rotate(divfish.angle);
  
  // Divfish colors - all orange #FF5F1F
  const bodyColor = '#FF5F1F';
  const frontColor = 'rgba(255, 95, 31, 0.7)';
  const tailColor = 'rgba(255, 95, 31, 0.7)';
  const wingColor = 'rgba(255, 95, 31, 0.7)';
  
  // Draw tail first
  drawDivFishTail(ctx, divfish, bodyWidth, bodyHeight, tailColor);
  
  // Draw front
  drawDivFishFront(ctx, divfish, bodyWidth, bodyHeight, frontColor);
  
  // Draw wings
  drawDivFishWings(ctx, divfish, bodyWidth, bodyHeight, wingColor);
  
  // Draw main body with enhanced details
  ctx.beginPath();
  ctx.ellipse(0, 0, bodyWidth, bodyHeight, 0, 0, Math.PI * 2);
  
  ctx.shadowBlur = 10;
  ctx.shadowColor = bodyColor;
  
  // Enhanced gradient body coloring - darker orange at edges, brighter at center
  const bodyGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, bodyWidth);
  bodyGradient.addColorStop(0, '#FF8F5F'); // Brighter orange at center
  bodyGradient.addColorStop(0.6, '#FF5F1F'); // Original orange
  bodyGradient.addColorStop(1, '#CC4F0F'); // Darker orange at edges
  
  ctx.fillStyle = bodyGradient;
  ctx.fill();
  
  // Metallic sheen - occasional bright highlight sweep
  const time = Date.now() / 2000; // Slow sweep
  const sheenPosition = (Math.sin(time) + 1) / 2; // 0 to 1
  const sheenX = -bodyWidth + (sheenPosition * bodyWidth * 2);
  
  const sheenGradient = ctx.createLinearGradient(sheenX - 10, 0, sheenX + 10, 0);
  sheenGradient.addColorStop(0, 'rgba(255, 255, 255, 0)');
  sheenGradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.4)');
  sheenGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
  
  ctx.save();
  ctx.beginPath();
  ctx.ellipse(0, 0, bodyWidth, bodyHeight, 0, 0, Math.PI * 2);
  ctx.clip();
  
  ctx.fillStyle = sheenGradient;
  ctx.fillRect(sheenX - 15, -bodyHeight, 30, bodyHeight * 2);
  ctx.restore();
  
  // Add highlight (existing)
  ctx.beginPath();
  ctx.ellipse(-bodyWidth * 0.2, -bodyHeight * 0.2, bodyWidth * 0.4, bodyHeight * 0.3, 0, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
  ctx.fill();
  
  ctx.restore();
}

function drawDivFishFront(
  ctx: CanvasRenderingContext2D, 
  divfish: DivFish, 
  bodyWidth: number, 
  bodyHeight: number,
  color: string
): void {
  const frontLength = bodyWidth * 1;
  const frontHeight = bodyHeight * 2;
  
  const wobbleTime = divfish.wobbleOffset;
  const wobbleAmount = Math.sin(wobbleTime) * (divfish.wobbleIntensity * 2);
  
  ctx.beginPath();
  
  const frontStartX = -bodyWidth * 0.7;
  
  ctx.moveTo(frontStartX, 0);
  ctx.lineTo(frontStartX - frontLength, frontHeight/2 + wobbleAmount);
  ctx.lineTo(frontStartX - frontLength, -frontHeight/2 + wobbleAmount);
  ctx.closePath();
  
  const frontGradient = ctx.createLinearGradient(frontStartX, 0, frontStartX - frontLength, 0);
  frontGradient.addColorStop(0, color);
  frontGradient.addColorStop(0.7, color.replace('0.7', '0.3'));
  frontGradient.addColorStop(1, color.replace('0.7', '0.1'));
  
  ctx.fillStyle = frontGradient;
  ctx.shadowBlur = 10;
  ctx.shadowColor = color;
  
  ctx.fill();
}

function drawDivFishTail(
  ctx: CanvasRenderingContext2D, 
  divfish: DivFish, 
  bodyWidth: number, 
  bodyHeight: number,
  color: string
): void {
  const tailLength = bodyWidth * 2.5;
  const tailHeight = bodyHeight * 5;
  
  const wobbleTime = divfish.wobbleOffset;
  
  const primaryWobble = Math.sin(wobbleTime) * (divfish.wobbleIntensity * 6);
  const secondaryWobble = Math.sin(wobbleTime * 1.7 + 0.4) * (divfish.wobbleIntensity * 2);
  
  const tailWobble = primaryWobble + secondaryWobble;
  
  const tailStartX = bodyWidth * 0.25;
  
  ctx.beginPath();
  
  ctx.moveTo(tailStartX, 0);
  ctx.lineTo(tailStartX - tailLength, tailHeight/2 + tailWobble);
  ctx.lineTo(tailStartX - tailLength, -tailHeight/2 + tailWobble);
  ctx.closePath();
  
  const tailGradient = ctx.createLinearGradient(tailStartX, 0, tailStartX - tailLength, 0);
  tailGradient.addColorStop(0, color);
  tailGradient.addColorStop(0.7, color.replace('0.7', '0.3'));
  tailGradient.addColorStop(1, color.replace('0.7', '0.1'));
  
  ctx.fillStyle = tailGradient;
  ctx.shadowBlur = 10;
  ctx.shadowColor = color;
  
  ctx.fill();
}

function drawDivFishWings(
  ctx: CanvasRenderingContext2D,
  divfish: DivFish,
  bodyWidth: number,
  bodyHeight: number,
  color: string
): void {
  const wingLength = bodyWidth * 2;
  const wingBaseWidth = bodyHeight * 4;
  
  const wobbleTime = divfish.wobbleOffset;
  const leftWingPhase = wobbleTime * 1.2;
  const rightWingPhase = wobbleTime * 1.2 + Math.PI;
  
  const wingAmplitude = divfish.wobbleIntensity * 8 * (divfish.speed / divfish.normalSpeed);
  
  // Left wing
  drawDivFishWing(
    ctx,
    0,
    -bodyHeight * 0.8,
    wingLength,
    wingBaseWidth,
    leftWingPhase,
    wingAmplitude,
    Math.PI / 2,
    color
  );
  
  // Right wing
  drawDivFishWing(
    ctx,
    0,
    bodyHeight * 0.8,
    wingLength,
    wingBaseWidth,
    rightWingPhase,
    wingAmplitude,
    -Math.PI / 2,
    color
  );
}

function drawDivFishWing(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  length: number,
  baseWidth: number,
  phase: number,
  amplitude: number,
  angle: number,
  color: string
): void {
  ctx.save();
  
  ctx.translate(x, y);
  ctx.rotate(angle);
  
  const primaryWobble = Math.sin(phase) * amplitude;
  const secondaryWobble = Math.sin(phase * 1.5 + 0.4) * (amplitude * 0.3);
  const curveAmount = primaryWobble + secondaryWobble;
  
  ctx.beginPath();
  
  ctx.moveTo(0, -baseWidth/3);
  
  ctx.quadraticCurveTo(
    length * 0.5, -baseWidth/2 + curveAmount * 0.7,
    length, 0
  );
  
  ctx.quadraticCurveTo(
    length * 0.5, baseWidth/2 + curveAmount * 0.5,
    0, baseWidth/3
  );
  
  ctx.closePath();
  
  const wingGradient = ctx.createLinearGradient(0, 0, length, 0);
  wingGradient.addColorStop(0, color);
  wingGradient.addColorStop(0.5, color.replace('0.7', '0.4'));
  wingGradient.addColorStop(1, color.replace('0.7', '0.1'));
  
  ctx.fillStyle = wingGradient;
  ctx.shadowBlur = 10;
  ctx.shadowColor = color;
  ctx.fill();
  
  ctx.strokeStyle = color.replace('0.7', '0.2');
  ctx.lineWidth = 0.5;
  ctx.stroke();
  
  ctx.restore();
}