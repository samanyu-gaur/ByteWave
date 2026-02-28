import React, { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import TopicAnimation from './TopicAnimation'

const PERSPECTIVE = 800
const TILT_MAX    = 12

const styles = {
  section: {
    padding: '48px 24px',
    maxWidth: 1000,
    margin: '0 auto',
  },
  title: {
    fontFamily: 'var(--font-display)',
    fontSize: 28,
    fontWeight: 700,
    textAlign: 'center',
    margin: '0 0 12px',
    color: 'var(--primary-text)',
  },
  subtitle: {
    textAlign: 'center',
    margin: '0 auto 32px',
    color: 'var(--primary-text-muted)',
    fontSize: 15,
    maxWidth: 480,
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
    gap: 16,
  },
  tileOuter: {
    perspective: PERSPECTIVE,
    transformStyle: 'preserve-3d',
  },
  tile: {
    padding: '18px 16px',
    borderRadius: 20,
    background: 'var(--bg-card)',
    backdropFilter: 'blur(12px)',
    border: '2px solid var(--border-light)',
    cursor: 'grab',
    textAlign: 'center',
    transition: 'transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.35s ease, border-color 0.2s ease',
    boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
    position: 'relative',
    overflow: 'hidden',
    transformStyle: 'preserve-3d',
  },
  tileDragging: {
    cursor: 'grabbing',
    boxShadow: '0 16px 40px rgba(99, 102, 241, 0.25)',
    borderColor: 'rgba(99, 102, 241, 0.5)',
    zIndex: 10,
  },
  orbitRing: {
    position: 'absolute',
    inset: -3,
    borderRadius: 24,
    border: '1px solid transparent',
    pointerEvents: 'none',
    opacity: 0,
    transition: 'opacity 0.3s ease',
  },
  tileIcon: {
    fontSize: 28,
    marginBottom: 8,
    lineHeight: 1,
    transition: 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
  },
  tileName: {
    fontFamily: 'var(--font-display)',
    fontSize: 15,
    fontWeight: 600,
    color: 'var(--primary-text)',
    margin: 0,
  },
  tileDesc: {
    fontSize: 11,
    color: 'var(--primary-text-muted)',
    margin: '4px 0 0',
    lineHeight: 1.3,
  },
}

function PhysicsTile({ item, originalIndex, isDragging, isOver, dragHandlers, className }) {
  const ref = useRef(null)
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  const [hover, setHover] = useState(false)
  const navigate = useNavigate()
  const dragMoved = useRef(false)

  const handleMouseMove = (e) => {
    if (!ref.current || isDragging) return
    const rect = ref.current.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    const x = (e.clientX - cx) / (rect.width / 2)
    const y = (e.clientY - cy) / (rect.height / 2)
    setTilt({
      y: Math.max(-TILT_MAX, Math.min(TILT_MAX, x * TILT_MAX)),
      x: Math.max(-TILT_MAX, Math.min(TILT_MAX, -y * TILT_MAX)),
    })
  }

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 })
    setHover(false)
    if (dragHandlers.onDragLeave) dragHandlers.onDragLeave()
  }

  const handleMouseEnter = () => setHover(true)

  const tiltStyle = !isDragging && (tilt.x !== 0 || tilt.y !== 0)
    ? {
        transform: `perspective(${PERSPECTIVE}px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale3d(1.02, 1.02, 1.02)`,
        boxShadow: hover
          ? '0 20px 40px rgba(0,0,0,0.2), 0 0 0 1px rgba(99, 102, 241, 0.2), 0 0 30px rgba(99, 102, 241, 0.15)'
          : undefined,
      }
    : {}

  const isHoverActive = hover && !isDragging

  return (
    <div style={styles.tileOuter} className={className}>
      <div
        ref={ref}
        draggable
        onDragStart={(e) => { dragMoved.current = true; dragHandlers.onDragStart(e, originalIndex) }}
        onDragEnd={(e) => { dragHandlers.onDragEnd(e); setTimeout(() => { dragMoved.current = false }, 0) }}
        onDragOver={(e) => dragHandlers.onDragOver(e, originalIndex)}
        onClick={() => { if (!dragMoved.current) navigate(`/chat?topic=${item.id}&name=${encodeURIComponent(item.name)}`) }}
        onDragLeave={handleMouseLeave}
        onDrop={(e) => dragHandlers.onDrop(e, originalIndex)}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onMouseEnter={handleMouseEnter}
        style={{
          ...styles.tile,
          ...(isDragging ? { ...styles.tileDragging, transform: 'perspective(600px) scale(1.05) rotate(2deg)' } : {}),
          ...(isOver && !isDragging ? { transform: 'scale(1.03)', borderColor: 'rgba(99, 102, 241, 0.4)' } : {}),
          opacity: isDragging ? 0.9 : 1,
          ...tiltStyle,
        }}
        className="physics-tile"
      >
        <div
          className="tile-orbit-ring"
          style={{
            ...styles.orbitRing,
            opacity: isHoverActive ? 1 : 0,
            borderColor: isHoverActive ? 'rgba(99, 102, 241, 0.5)' : 'transparent',
          }}
          aria-hidden
        />
        <div
          style={{
            ...styles.tileIcon,
            transform: isHoverActive ? 'scale(1.15) rotate(12deg)' : 'scale(1) rotate(0deg)',
          }}
        >
          <TopicAnimation topicId={item.id} size={48} />
        </div>
        <p style={styles.tileName}>{item.name}</p>
        {item.description && <p style={styles.tileDesc}>{item.description}</p>}
      </div>
    </div>
  )
}

export default function DraggableTiles({ items, title = 'Drag to explore', subtitle = 'Rearrange the tiles any way you like.' }) {
  const [order, setOrder] = useState(() => items.map((_, i) => i))
  const [dragging, setDragging] = useState(null)
  const [dragOver, setDragOver] = useState(null)

  const reordered = order.map((i) => items[i])

  const handleDragStart = (e, index) => {
    setDragging(index)
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/plain', index)
    e.dataTransfer.setData('application/json', JSON.stringify({ index }))
    setTimeout(() => e.target.classList.add('tile-dragging'), 0)
  }

  const handleDragEnd = (e) => {
    setDragging(null)
    setDragOver(null)
    e.target.classList.remove('tile-dragging')
  }

  const handleDragOver = (e, index) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    if (dragging === null) return
    setDragOver(index)
  }

  const handleDragLeave = () => setDragOver(null)

  const handleDrop = (e, toIndex) => {
    e.preventDefault()
    setDragOver(null)
    const fromIndex = dragging
    if (fromIndex == null || fromIndex === toIndex) return

    setOrder((prev) => {
      const next = [...prev]
      const fromOrderIndex = next.indexOf(fromIndex)
      let toOrderIndex = next.indexOf(toIndex)
      const [removed] = next.splice(fromOrderIndex, 1)
      if (fromOrderIndex < toOrderIndex) toOrderIndex -= 1
      next.splice(toOrderIndex, 0, removed)
      return next
    })
    setDragging(null)
  }

  return (
    <section style={styles.section}>
      <h2 style={styles.title}>{title}</h2>
      <p style={styles.subtitle}>{subtitle}</p>
      <div style={styles.grid}>
        {reordered.map((item, gridIndex) => {
          const originalIndex = order[gridIndex]
          const isDragging = dragging === originalIndex
          const isOver = dragOver === originalIndex
          return (
            <PhysicsTile
              key={item.id}
              item={item}
              originalIndex={originalIndex}
              isDragging={isDragging}
              isOver={isOver}
              dragHandlers={{
                onDragStart: handleDragStart,
                onDragEnd: handleDragEnd,
                onDragOver: handleDragOver,
                onDragLeave: handleDragLeave,
                onDrop: handleDrop,
              }}
              className="anim-bounce-in"
            />
          )
        })}
      </div>
    </section>
  )
}
