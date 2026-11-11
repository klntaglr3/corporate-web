import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'

export default function MagneticButton({ href, className = '', strength = 0.3, children }) {
  const btn = useRef(null)
  const fill = useRef(null)
  const label = useRef(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()

      // desktop with a real pointer only, and respect reduced motion
      mm.add('(hover: hover) and (prefers-reduced-motion: no-preference)', () => {
        const el = btn.current
        const STRENGTH = strength
        const LABEL_STRENGTH = strength / 2

        gsap.set(fill.current, { scale: 0, xPercent: -50, yPercent: -50 })

        const opts = { duration: 0.6, ease: 'power3.out' }
        const xTo = gsap.quickTo(el, 'x', opts)
        const yTo = gsap.quickTo(el, 'y', opts)
        const lxTo = gsap.quickTo(label.current, 'x', opts)
        const lyTo = gsap.quickTo(label.current, 'y', opts)

        const placeFill = (e) => {
          const r = el.getBoundingClientRect()
          const size = Math.hypot(r.width, r.height) * 2 // always covers the button
          gsap.set(fill.current, {
            left: e.clientX - r.left,
            top: e.clientY - r.top,
            width: size,
            height: size,
          })
        }

        const onEnter = (e) => {
          placeFill(e)
          gsap.to(fill.current, { scale: 1, duration: 0.6, ease: 'power3.out', overwrite: true })
        }

        const onMove = (e) => {
          const r = el.getBoundingClientRect()
          const dx = e.clientX - (r.left + r.width / 2)
          const dy = e.clientY - (r.top + r.height / 2)
          xTo(dx * STRENGTH)
          yTo(dy * STRENGTH)
          lxTo(dx * LABEL_STRENGTH)
          lyTo(dy * LABEL_STRENGTH)
        }

        const onLeave = (e) => {
          placeFill(e)
          gsap.to(fill.current, { scale: 0, duration: 0.5, ease: 'power3.inOut', overwrite: true })
          xTo(0)
          yTo(0)
          lxTo(0)
          lyTo(0)
        }

        el.addEventListener('mouseenter', onEnter)
        el.addEventListener('mousemove', onMove)
        el.addEventListener('mouseleave', onLeave)

        return () => {
          el.removeEventListener('mouseenter', onEnter)
          el.removeEventListener('mousemove', onMove)
          el.removeEventListener('mouseleave', onLeave)
        }
      })

      return () => mm.revert()
    },
    { scope: btn }
  )

  return (
    <a href={href} ref={btn} className={`btn-magnetic ${className}`}>
      <span className="btn__fill" ref={fill} aria-hidden="true" />
      <span className="btn__label" ref={label}>
        {children}
      </span>
    </a>
  )
}