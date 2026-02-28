import React, { useEffect, useState } from 'react'

const LERP_HEAD = 0.18
const LERP_TAIL = 0.06
const TRAIL_DOTS = 4

export default function CustomCursor() {
  const [pos, setPos] = useState({ x: -100, y: -100 })
  const [head, setHead] = useState({ x: -100, y: -100 })
  const [trail, setTrail] = useState(Array(TRAIL_DOTS).fill({ x: -100, y: -100 }))
  const [visible, setVisible] = useState(false)
  const [isPointer, setIsPointer] = useState(false)

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const hasFinePointer = window.matchMedia('(pointer: fine)').matches
    if (!hasFinePointer || prefersReducedMotion) return

    const handleMove = (e) => {
      setPos({ x: e.clientX, y: e.clientY })
      setVisible(true)
    }
    const handleLeave = () => setVisible(false)
    const handleOver = (e) =>
      setIsPointer(
        ['A', 'BUTTON'].includes(e.target?.tagName) || getComputedStyle(e.target).cursor === 'pointer'
      )

    document.body.addEventListener('mousemove', handleMove)
    document.body.addEventListener('mouseleave', handleLeave)
    document.body.addEventListener('mouseover', handleOver, true)
    document.body.classList.add('custom-cursor-active')

    let raf = 0
    const update = () => {
      setHead((h) => {
        const newHead = {
          x: h.x + (pos.x - h.x) * LERP_HEAD,
          y: h.y + (pos.y - h.y) * LERP_HEAD,
        }
        setTrail((prev) => {
          const next = []
          let follow = newHead
          for (let i = 0; i < prev.length; i++) {
            next[i] = {
              x: prev[i].x + (follow.x - prev[i].x) * LERP_TAIL,
              y: prev[i].y + (follow.y - prev[i].y) * LERP_TAIL,
            }
            follow = next[i]
          }
          return next
        })
        return newHead
      })
      raf = requestAnimationFrame(update)
    }
    raf = requestAnimationFrame(update)

    return () => {
      document.body.removeEventListener('mousemove', handleMove)
      document.body.removeEventListener('mouseleave', handleLeave)
      document.body.removeEventListener('mouseover', handleOver, true)
      document.body.classList.remove('custom-cursor-active')
      cancelAnimationFrame(raf)
    }
  }, [pos.x, pos.y])

  useEffect(() => {
    document.body.classList.toggle('custom-cursor-visible', visible)
    if (visible) document.body.style.cursor = 'none'
    else document.body.style.cursor = ''
    return () => {
      document.body.classList.remove('custom-cursor-visible')
      document.body.style.cursor = ''
    }
  }, [visible])

  if (!visible) return null

  return (
    <div
      className="custom-cursor custom-cursor-comet"
      style={{
        position: 'fixed',
        left: 0,
        top: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 99999,
      }}
    >
      {/* Trail dots (comet tail) */}
      {trail.map((t, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: t.x - 4,
            top: t.y - 4,
            width: 8,
            height: 8,
            borderRadius: '50%',
            background: `rgba(99, 102, 241, ${0.35 + (1 - i / TRAIL_DOTS) * 0.45})`,
            transform: `scale(${0.55 + (i / TRAIL_DOTS) * 0.45})`,
            boxShadow: '0 0 8px rgba(99, 102, 241, 0.3)',
          }}
        />
      ))}
      {/* Head (bright dot) */}
      <div
        style={{
          position: 'absolute',
          left: head.x - (isPointer ? 7 : 6),
          top: head.y - (isPointer ? 7 : 6),
          width: isPointer ? 14 : 12,
          height: isPointer ? 14 : 12,
          borderRadius: '50%',
          background: 'var(--gradient-accent)',
          border: '2px solid rgba(255, 255, 255, 0.4)',
          boxShadow: isPointer
            ? '0 0 28px rgba(139, 92, 246, 0.8), 0 0 14px rgba(99, 102, 241, 0.5)'
            : '0 0 22px rgba(99, 102, 241, 0.65), 0 0 10px rgba(99, 102, 241, 0.4)',
          transition: 'width 0.15s ease, height 0.15s ease, box-shadow 0.15s ease, border 0.15s ease',
        }}
      />
    </div>
  )
}
