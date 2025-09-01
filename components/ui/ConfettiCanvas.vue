<template>
  <canvas 
    ref="canvasRef"
    class="fixed inset-0 pointer-events-none z-50"
    :style="{ width: '100vw', height: '100vh' }"
  />
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { gsap } from 'gsap'

const canvasRef = ref<HTMLCanvasElement>()
const ctx = ref<CanvasRenderingContext2D>()
const particles = ref<Array<{
  x: number
  y: number
  vx: number
  vy: number
  color: string
  size: number
  life: number
  maxLife: number
}>>([])

const colors = [
  '#4f46e5', // indigo
  '#7c3aed', // purple
  '#10b981', // emerald
  '#f59e0b', // amber
  '#ef4444', // red
  '#06b6d4', // cyan
]

const createParticle = (x: number, y: number) => {
  const angle = Math.random() * Math.PI * 2
  const velocity = 2 + Math.random() * 4
  const size = 2 + Math.random() * 4
  const life = 60 + Math.random() * 60
  
  particles.value.push({
    x,
    y,
    vx: Math.cos(angle) * velocity,
    vy: Math.sin(angle) * velocity - 2,
    color: colors[Math.floor(Math.random() * colors.length)],
    size,
    life,
    maxLife: life
  })
}

const updateParticles = () => {
  if (!ctx.value) return
  
  ctx.value.clearRect(0, 0, canvasRef.value!.width, canvasRef.value!.height)
  
  particles.value = particles.value.filter(particle => {
    particle.x += particle.vx
    particle.y += particle.vy
    particle.vy += 0.1 // gravity
    particle.life--
    
    const alpha = particle.life / particle.maxLife
    ctx.value!.globalAlpha = alpha
    ctx.value!.fillStyle = particle.color
    ctx.value!.beginPath()
    ctx.value!.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
    ctx.value!.fill()
    
    return particle.life > 0
  })
  
  if (particles.value.length > 0) {
    requestAnimationFrame(updateParticles)
  }
}

const burst = (x: number, y: number, count: number = 20) => {
  for (let i = 0; i < count; i++) {
    createParticle(x, y)
  }
  updateParticles()
}

const setupCanvas = () => {
  if (!canvasRef.value) return
  
  const canvas = canvasRef.value
  const rect = canvas.getBoundingClientRect()
  
  canvas.width = rect.width * window.devicePixelRatio
  canvas.height = rect.height * window.devicePixelRatio
  
  ctx.value = canvas.getContext('2d')!
  ctx.value.scale(window.devicePixelRatio, window.devicePixelRatio)
  
  canvas.style.width = rect.width + 'px'
  canvas.style.height = rect.height + 'px'
}

const handleResize = () => {
  setupCanvas()
}

onMounted(() => {
  setupCanvas()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})

defineExpose({
  burst
})
</script>
