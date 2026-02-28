import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'

// All motion runs purely through RAF + direct DOM writes.
// Zero React state updates during movement → zero re-renders → no lag.

const TRAIL  = 5     // trail dot count (fewer = less CPU)
const L_HEAD = 0.25  // head lerp factor
const L_TAIL = 0.32  // each dot follows the one ahead at this rate

export default function CustomCursor() {
  const containerRef = useRef(null)
  const headRef      = useRef(null)
  const tailRefs     = useRef([])

  useEffect(() => {
    const hasFine   = window.matchMedia('(pointer: fine)').matches
    const noMotion  = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!hasFine || noMotion) return

    // ── mutable state (never triggers React re-render) ────────────────────
    const mouse  = { x: -400, y: -400 }
    const head   = { x: -400, y: -400 }
    const trail  = Array.from({ length: TRAIL }, () => ({ x: -400, y: -400 }))
    let visible  = false
    let pointer  = false
    let raf      = 0
    let moving   = false   // true only when mouse moved recently
    let idleTimer = 0

    // ── helpers ────────────────────────────────────────────────────────────
    const show = (v) => {
      if (visible === v) return
      visible = v
      if (containerRef.current) containerRef.current.style.opacity = v ? '1' : '0'
      document.body.classList.toggle('custom-cursor-visible', v)
    }

    const setPointer = (p) => {
      if (pointer === p) return
      pointer = p
      // Update head glow directly — no React state
      if (headRef.current) {
        headRef.current.style.boxShadow = p
          ? '0 0 18px rgba(139,92,246,0.95), 0 0 8px rgba(99,102,241,0.65)'
          : '0 0 12px rgba(99,102,241,0.75)'
      }
    }

    // ── listeners ──────────────────────────────────────────────────────────
    const onMove = (e) => {
      mouse.x = e.clientX
      mouse.y = e.clientY
      show(true)
      if (!moving) {
        moving = true
        raf = requestAnimationFrame(tick)   // restart loop if it was paused
      }
      clearTimeout(idleTimer)
      idleTimer = setTimeout(() => { moving = false }, 150)  // pause after 150ms idle
    }
    const onLeave  = () => show(false)
    const onOver   = (e) => {
      const el = e.target
      setPointer(
        ['A', 'BUTTON'].includes(el?.tagName) ||
        getComputedStyle(el).cursor === 'pointer'
      )
    }

    document.addEventListener('mousemove', onMove, { passive: true })
    document.addEventListener('mouseleave', onLeave)
    document.addEventListener('mouseover', onOver, true)
    document.body.classList.add('custom-cursor-active')

    // ── animation loop — self-pauses when mouse is idle ───────────────────
    const tick = () => {
      if (!moving) { raf = 0; return }   // stop loop when idle

      head.x += (mouse.x - head.x) * L_HEAD
      head.y += (mouse.y - head.y) * L_HEAD

      let lx = head.x, ly = head.y
      for (let i = 0; i < TRAIL; i++) {
        trail[i].x += (lx - trail[i].x) * L_TAIL
        trail[i].y += (ly - trail[i].y) * L_TAIL
        lx = trail[i].x
        ly = trail[i].y
      }

      const hn = headRef.current
      if (hn) {
        const s = pointer ? 13 : 9
        hn.style.transform = `translate(${head.x - s * 0.5}px,${head.y - s * 0.5}px)`
        hn.style.width     = s + 'px'
        hn.style.height    = s + 'px'
      }

      const nodes = tailRefs.current
      for (let i = 0; i < TRAIL; i++) {
        const n = nodes[i]
        if (!n) continue
        const frac = 1 - (i + 1) / (TRAIL + 1)
        const s    = Math.max(2, frac * 7 | 0)
        n.style.transform = `translate(${trail[i].x - s * 0.5}px,${trail[i].y - s * 0.5}px)`
        n.style.width     = s + 'px'
        n.style.height    = s + 'px'
        n.style.opacity   = (frac * 0.75 + 0.05).toFixed(2)
      }

      raf = requestAnimationFrame(tick)
    }

    return () => {
      cancelAnimationFrame(raf)
      clearTimeout(idleTimer)
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseleave', onLeave)
      document.removeEventListener('mouseover', onOver, true)
      document.body.classList.remove('custom-cursor-active')
      document.body.classList.remove('custom-cursor-visible')
    }
  }, [])

  // Render once — never re-renders after mount
  return createPortal(
    <div
      ref={containerRef}
      style={{
        position: 'fixed', inset: 0,
        pointerEvents: 'none', zIndex: 99999,
        opacity: 0,   // starts hidden; show() sets it to 1
      }}
    >
      {/* Head */}
      <div
        ref={headRef}
        style={{
          position: 'absolute', top: 0, left: 0,
          width: 9, height: 9,
          borderRadius: '50%',
          background: 'var(--gradient-accent)',
          boxShadow: '0 0 12px rgba(99,102,241,0.75)',
          willChange: 'transform, width, height',
        }}
      />
      {/* Trail */}
      {Array.from({ length: TRAIL }).map((_, i) => (
        <div
          key={i}
          ref={el => { tailRefs.current[i] = el }}
          style={{
            position: 'absolute', top: 0, left: 0,
            width: 6, height: 6,
            borderRadius: '50%',
            background: i < 3 ? '#818cf8' : '#6366f1',
            willChange: 'transform, width, height, opacity',
          }}
        />
      ))}
    </div>,
    document.body
  )
}
