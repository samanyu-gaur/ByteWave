/**
 * HoldOverlay
 *
 * Radial SVG progress ring that fills clockwise as the user holds the Spline tile.
 * Positioned absolutely in the centre of the hero — always on top of Spline.
 *
 * Performance notes:
 * - Only strokeDashoffset changes per rAF tick (one inline style write)
 * - opacity/filter use CSS transitions — compositor-thread only
 * - No layout-triggering properties are animated
 */

const RADIUS      = 36
const STROKE_W    = 3
const CIRCUMFERENCE = +(2 * Math.PI * RADIUS).toFixed(2)   // ≈ 226.19

export default function HoldOverlay({ isHolding, activated, progress }) {
  const visible = isHolding || activated

  // strokeDashoffset goes from CIRCUMFERENCE (empty) → 0 (full)
  const dashOffset = CIRCUMFERENCE * (1 - progress)

  // Outer SVG is sized to fit the ring + stroke + glow headroom
  const size = (RADIUS + STROKE_W + 8) * 2   // 94px

  return (
    <div
      aria-hidden="true"
      style={{
        position:        'absolute',
        inset:           0,
        display:         'flex',
        alignItems:      'center',
        justifyContent:  'center',
        pointerEvents:   'none',
        zIndex:          15,
        // Fade the whole overlay in/out with CSS so the GPU handles it
        opacity:         visible ? 1 : 0,
        transition:      'opacity 0.25s ease',
      }}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        style={{
          // Purple glow pulses on activation; CSS transition handles it cleanly
          filter: activated
            ? 'drop-shadow(0 0 14px rgba(129,140,248,0.85)) drop-shadow(0 0 28px rgba(139,92,246,0.45))'
            : 'drop-shadow(0 0 6px rgba(129,140,248,0.4))',
          transition: 'filter 0.5s ease',
          overflow: 'visible',
        }}
      >
        <defs>
          <linearGradient id="hold-ring-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%"   stopColor="#818cf8" />
            <stop offset="100%" stopColor="#a78bfa" />
          </linearGradient>
        </defs>

        {/* Track — dim background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={RADIUS}
          fill="none"
          stroke="rgba(129,140,248,0.15)"
          strokeWidth={STROKE_W}
        />

        {/* Fill ring — rotated so it starts at top (12 o'clock) */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={RADIUS}
          fill="none"
          stroke="url(#hold-ring-grad)"
          strokeWidth={STROKE_W}
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={dashOffset}
          style={{
            transformOrigin: '50% 50%',
            transform:       'rotate(-90deg)',
            // Only animate dashoffset during active hold; snap back instantly on cancel
            transition: isHolding
              ? 'none'                              // driven by rAF — no CSS transition needed
              : activated
                ? 'none'                            // stay full
                : 'stroke-dashoffset 0.2s ease',   // quick snap to 0 on cancel
          }}
        />

        {/* Centre dot — pulses once on activation */}
        {activated && (
          <circle
            cx={size / 2}
            cy={size / 2}
            r={6}
            fill="rgba(129,140,248,0.9)"
            style={{ animation: 'hold-centre-pulse 0.5s ease-out forwards' }}
          />
        )}
      </svg>

      <style>{`
        @keyframes hold-centre-pulse {
          0%   { r: 6;  opacity: 1; }
          60%  { r: 14; opacity: 0.6; }
          100% { r: 20; opacity: 0; }
        }
      `}</style>
    </div>
  )
}
