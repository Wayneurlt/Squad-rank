import { gsap } from 'gsap'

export const useAnimations = () => {
  const initAOS = () => {
    if (process.client) {
      import('aos').then((AOS) => {
        AOS.default.init({
          duration: 800,
          easing: 'ease-out-cubic',
          once: true,
          offset: 100
        })
      })
    }
  }

  const animateCounter = (element: HTMLElement, from: number, to: number, duration: number = 1.5) => {
    gsap.fromTo(element, 
      { textContent: from },
      {
        textContent: to,
        duration,
        ease: "power2.out",
        snap: { textContent: 0.01 },
        onUpdate: function() {
          element.textContent = Math.round(this.targets()[0].textContent * 100) / 100
        }
      }
    )
  }

  const staggerIn = (elements: HTMLElement[], delay: number = 0.1) => {
    gsap.fromTo(elements, 
      { 
        opacity: 0, 
        y: 50,
        scale: 0.9
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.6,
        ease: "back.out(1.7)",
        stagger: delay
      }
    )
  }

  const fadeInUp = (element: HTMLElement, delay: number = 0) => {
    gsap.fromTo(element,
      { 
        opacity: 0, 
        y: 30 
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power2.out",
        delay
      }
    )
  }

  const scaleIn = (element: HTMLElement, delay: number = 0) => {
    gsap.fromTo(element,
      { 
        opacity: 0, 
        scale: 0.8 
      },
      {
        opacity: 1,
        scale: 1,
        duration: 0.6,
        ease: "back.out(1.7)",
        delay
      }
    )
  }

  const createConfetti = (x: number, y: number, count: number = 50) => {
    if (!process.client) return

    const colors = ['#4f46e5', '#7c3aed', '#10b981', '#f59e0b', '#ef4444', '#06b6d4']
    const particles: Array<{
      x: number
      y: number
      vx: number
      vy: number
      color: string
      size: number
      life: number
      maxLife: number
    }> = []

    // Create particles
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2
      const velocity = 2 + Math.random() * 6
      const size = 2 + Math.random() * 4
      const life = 60 + Math.random() * 60

      particles.push({
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

    // Animate particles
    const animate = () => {
      particles.forEach(particle => {
        particle.x += particle.vx
        particle.y += particle.vy
        particle.vy += 0.1 // gravity
        particle.life--
      })

      // Remove dead particles
      const alive = particles.filter(p => p.life > 0)
      if (alive.length === 0) return

      // Continue animation
      requestAnimationFrame(animate)
    }

    animate()
  }

  const createFloatingAnimation = (element: HTMLElement) => {
    gsap.to(element, {
      y: -10,
      duration: 2,
      ease: "power2.inOut",
      yoyo: true,
      repeat: -1
    })
  }

  const createPulseGlow = (element: HTMLElement) => {
    gsap.to(element, {
      boxShadow: "0 0 30px rgba(79, 70, 229, 0.6)",
      duration: 2,
      ease: "power2.inOut",
      yoyo: true,
      repeat: -1
    })
  }

  return {
    initAOS,
    animateCounter,
    staggerIn,
    fadeInUp,
    scaleIn,
    createConfetti,
    createFloatingAnimation,
    createPulseGlow
  }
}
