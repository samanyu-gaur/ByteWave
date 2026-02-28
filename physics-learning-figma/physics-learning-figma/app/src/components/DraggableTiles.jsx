import React, { useState, useRef } from 'react'
const TILT_MAX = 8
const PERSPECTIVE = 600

const accent = 'var(--accent-main)'
const muted = 'var(--primary-text-muted)'

/** Simple topic-related animated graphic for landing tiles */
function TopicTileAnimation({ topicId }) {
  const wrapStyle = { width: 48, height: 48, margin: '0 auto 8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }

  switch (topicId) {
    case 'motion':
      return (
        <div className="tile-anim-wrap" style={wrapStyle}>
          <svg viewBox="0 0 32 24" fill="none" style={{ width: 40, height: 30 }}>
            <line x1="4" y1="12" x2="28" y2="12" stroke={muted} strokeWidth="1.5" strokeDasharray="4 2" />
            <g style={{ animation: 'tile-motion-slide 2s ease-in-out infinite' }}>
              <circle cx="16" cy="12" r="4" fill={accent} />
            </g>
          </svg>
        </div>
      )
    case 'forces':
      return (
        <div className="tile-anim-wrap" style={wrapStyle}>
          <svg viewBox="0 0 36 24" fill="none" style={{ width: 44, height: 28 }}>
            <line x1="2" y1="20" x2="34" y2="20" stroke={muted} strokeWidth="1" strokeDasharray="3 2" />
            <path d="M6 14 L6 10 L8 10 L8 14 Z" stroke={accent} strokeWidth="1.5" fill="none" />
            <path d="M8 12 L14 12 M13 10 L14 12 L13 14" stroke={accent} strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
            <g style={{ animation: 'tile-motion-slide 2.2s ease-in-out infinite' }}>
              <rect x="16" y="10" width="8" height="8" rx="1" fill={accent} opacity="0.9" stroke={accent} strokeWidth="1" />
            </g>
          </svg>
        </div>
      )
    case 'energy':
      return (
        <div className="tile-anim-wrap" style={wrapStyle}>
          <svg viewBox="0 0 24 32" fill="none">
            <path d="M12 2 L14 14 L12 16 L10 14 Z M12 16 L12 30" stroke={accent} strokeWidth="2" strokeLinecap="round" style={{ animation: 'tile-energy-pulse 1.2s ease-in-out infinite' }} />
          </svg>
        </div>
      )
    case 'waves':
      return (
        <div className="tile-anim-wrap" style={wrapStyle}>
          <svg viewBox="0 0 40 24" fill="none">
            <path d="M0 12 Q10 4 20 12 T40 12" stroke={accent} strokeWidth="2" fill="none" strokeDasharray="12 12" style={{ animation: 'tile-wave-flow 1.5s linear infinite' }} />
          </svg>
        </div>
      )
    case 'sound':
      return (
        <div className="tile-anim-wrap" style={wrapStyle}>
          <svg viewBox="0 0 32 32" fill="none">
            <circle cx="16" cy="16" r="4" stroke={accent} strokeWidth="2" style={{ animation: 'tile-sound-ripple 1.5s ease-in-out infinite' }} />
            <circle cx="16" cy="16" r="10" stroke={muted} strokeWidth="1" opacity="0.6" style={{ animation: 'tile-sound-ripple 1.5s ease-in-out infinite 0.2s' }} />
            <circle cx="16" cy="16" r="16" stroke={muted} strokeWidth="1" opacity="0.3" style={{ animation: 'tile-sound-ripple 1.5s ease-in-out infinite 0.4s' }} />
          </svg>
        </div>
      )
    case 'light':
      return (
        <div className="tile-anim-wrap" style={wrapStyle}>
          <svg viewBox="0 0 32 32" fill="none">
            <circle cx="16" cy="14" r="6" stroke={accent} strokeWidth="2" fill="none" style={{ animation: 'tile-light-glow 2s ease-in-out infinite' }} />
            <path d="M16 8 L16 4 M16 24 L16 28 M8 14 L4 14 M24 14 L28 14 M10 10 L7 7 M22 10 L25 7 M10 18 L7 21 M22 18 L25 21" stroke={accent} strokeWidth="1" strokeLinecap="round" opacity="0.8" style={{ animation: 'tile-light-glow 2s ease-in-out infinite' }} />
          </svg>
        </div>
      )
    case 'electricity':
      return (
        <div className="tile-anim-wrap" style={wrapStyle}>
          <svg viewBox="0 0 24 32" fill="none">
            <path d="M12 2 L8 14 L12 14 L10 30 L18 14 L14 14 Z" stroke={accent} strokeWidth="2" strokeLinejoin="round" fill="none" strokeDasharray="4 4" style={{ animation: 'tile-electric-dash 1.2s linear infinite' }} />
          </svg>
        </div>
      )
    case 'magnetism':
      return (
        <div className="tile-anim-wrap" style={wrapStyle}>
          <svg viewBox="0 0 32 24" fill="none">
            <rect x="6" y="6" width="8" height="12" rx="2" stroke={accent} strokeWidth="2" style={{ animation: 'tile-magnet-pulse 2s ease-in-out infinite' }} />
            <rect x="18" y="6" width="8" height="12" rx="2" stroke={accent} strokeWidth="2" style={{ animation: 'tile-magnet-pulse 2s ease-in-out infinite 0.5s' }} />
          </svg>
        </div>
      )
    case 'heat':
      return (
        <div className="tile-anim-wrap" style={wrapStyle}>
          <svg viewBox="0 0 32 32" fill="none">
            <path d="M16 28 L16 12 M12 16 L16 12 L20 16 M16 12 L12 8 L16 4 L20 8" stroke={accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ animation: 'tile-heat-rise 2s ease-in-out infinite' }} />
          </svg>
        </div>
      )
    case 'gravity':
      return (
        <div className="tile-anim-wrap" style={wrapStyle}>
          <svg viewBox="0 0 24 32" fill="none">
            <line x1="12" y1="28" x2="12" y2="14" stroke={muted} strokeWidth="1" strokeDasharray="2 2" />
            <g style={{ animation: 'tile-gravity-fall 2s ease-in-out infinite' }}>
              <circle cx="12" cy="8" r="4" fill={accent} />
            </g>
          </svg>
        </div>
      )
    case 'kinematics':
      return (
        <div className="tile-anim-wrap" style={wrapStyle}>
          <svg viewBox="0 0 40 28" fill="none">
            <line x1="4" y1="24" x2="4" y2="4" stroke={muted} strokeWidth="1" />
            <line x1="4" y1="24" x2="36" y2="24" stroke={muted} strokeWidth="1" />
            <path d="M4 20 L36 4" stroke={accent} strokeWidth="2" strokeLinecap="round" strokeDasharray="44" strokeDashoffset="44" style={{ animation: 'tile-slope-draw 2s ease-out infinite' }} />
          </svg>
        </div>
      )
    case 'quantum':
      return (
        <div className="tile-anim-wrap" style={wrapStyle}>
          <svg viewBox="0 0 32 32" fill="none" style={{ overflow: 'visible' }}>
            <circle cx="16" cy="16" r="10" stroke={muted} strokeWidth="1" opacity="0.5" />
            <g className="tile-quantum-orbit" style={{ animation: 'tile-quantum-orbit 4s linear infinite' }}>
              <circle cx="16" cy="6" r="3" fill={accent} />
            </g>
          </svg>
        </div>
      )
    default:
      return <div className="tile-anim-wrap" style={{ ...wrapStyle, fontSize: 28 }}>{'◆'}</div>
  }
}

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
        onDragStart={(e) => dragHandlers.onDragStart(e, originalIndex)}
        onDragEnd={dragHandlers.onDragEnd}
        onDragOver={(e) => dragHandlers.onDragOver(e, originalIndex)}
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
          <TopicTileAnimation topicId={item.id} />
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
              className="phet-bounce-in"
            />
          )
        })}
      </div>
    </section>
  )
}
