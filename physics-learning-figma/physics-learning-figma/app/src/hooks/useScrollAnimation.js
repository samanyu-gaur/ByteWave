import { useEffect, useRef, useState } from 'react'

const defaultOptions = { rootMargin: '0px 0px -80px 0px', threshold: 0.1 }

/**
 * When the element enters the viewport, set 'visible' to true so you can add a class for scroll-in animation.
 */
export function useScrollAnimation(options = {}) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)
  const opts = { ...defaultOptions, ...options }

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true)
      },
      opts
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [opts.rootMargin, opts.threshold])

  return [ref, visible]
}
