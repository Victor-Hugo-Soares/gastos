// Run: node scripts/generate-icons.mjs
// Generates placeholder SVG icons for PWA
import { writeFileSync, mkdirSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const iconsDir = join(__dirname, '..', 'public', 'icons')

mkdirSync(iconsDir, { recursive: true })

function makeSVG(size) {
  const radius = size * 0.2
  const fontSize = size * 0.45
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <rect width="${size}" height="${size}" rx="${radius}" fill="#2563eb"/>
  <text x="50%" y="54%" font-family="Arial, sans-serif" font-size="${fontSize}" font-weight="900" fill="white" text-anchor="middle" dominant-baseline="middle">G</text>
</svg>`
}

writeFileSync(join(iconsDir, 'icon-192.svg'), makeSVG(192))
writeFileSync(join(iconsDir, 'icon-512.svg'), makeSVG(512))
writeFileSync(join(iconsDir, 'apple-touch-icon.svg'), makeSVG(180))

// Also write PNG-named files as SVG (browsers accept SVG for PWA icons)
writeFileSync(join(iconsDir, 'icon-192.png'), makeSVG(192))
writeFileSync(join(iconsDir, 'icon-512.png'), makeSVG(512))
writeFileSync(join(iconsDir, 'apple-touch-icon.png'), makeSVG(180))

console.log('Icons generated in public/icons/')
