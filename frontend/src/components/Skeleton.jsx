// Physics-wave shimmer skeleton placeholder.
// The ::after overlay sweeps an indigo sine-shaped gradient across the bar.
export default function Skeleton({ height = 60, borderRadius = 12, delay = 0, style: extra = {} }) {
  return (
    <div
      className="bw-skeleton"
      style={{
        height,
        borderRadius,
        animationDelay: `${delay}s`,
        ...extra,
      }}
    />
  )
}
