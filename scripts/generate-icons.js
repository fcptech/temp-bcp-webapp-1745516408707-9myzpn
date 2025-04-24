import { createCanvas } from 'canvas';
import fs from 'fs';
import path from 'path';

// Icon configurations
const icons = [
  { name: 'icon-192.png', size: 192, maskable: false },
  { name: 'icon-512.png', size: 512, maskable: false },
  { name: 'icon-maskable.png', size: 512, maskable: true }
];

function drawIcon(size, maskable = false) {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');
  const padding = maskable ? size * 0.2 : size * 0.15;
  const iconSize = size - (padding * 2);

  // Background
  ctx.fillStyle = '#002060';
  ctx.fillRect(0, 0, size, size);

  // Chart icon
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = size * 0.04;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  // Draw bars
  const barWidth = iconSize * 0.2;
  const barSpacing = iconSize * 0.1;
  const startX = padding + (iconSize - ((barWidth * 3) + (barSpacing * 2))) / 2;
  const baseY = padding + iconSize;

  // Bar heights (percentage of icon size)
  const heights = [0.4, 0.7, 0.5];

  heights.forEach((height, i) => {
    const x = startX + (i * (barWidth + barSpacing));
    const barHeight = iconSize * height;
    ctx.beginPath();
    ctx.moveTo(x, baseY);
    ctx.lineTo(x, baseY - barHeight);
    ctx.lineTo(x + barWidth, baseY - barHeight);
    ctx.lineTo(x + barWidth, baseY);
    ctx.stroke();
  });

  return canvas;
}

// Ensure public directory exists
const publicDir = path.join(process.cwd(), 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir);
}

// Generate icons
icons.forEach(({ name, size, maskable }) => {
  const canvas = drawIcon(size, maskable);
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(path.join(publicDir, name), buffer);
  console.log(`Generated ${name}`);
});

// Generate apple-touch-icon.png (special size with padding)
const appleIconSize = 180;
const canvas = createCanvas(appleIconSize, appleIconSize);
const ctx = canvas.getContext('2d');

// White background
ctx.fillStyle = '#ffffff';
ctx.fillRect(0, 0, appleIconSize, appleIconSize);

// Draw the icon slightly smaller
const innerCanvas = drawIcon(appleIconSize * 0.9, false);
ctx.drawImage(
  innerCanvas, 
  appleIconSize * 0.05, 
  appleIconSize * 0.05, 
  appleIconSize * 0.9, 
  appleIconSize * 0.9
);

fs.writeFileSync(
  path.join(publicDir, 'apple-touch-icon.png'),
  canvas.toBuffer('image/png')
);
console.log('Generated apple-touch-icon.png');