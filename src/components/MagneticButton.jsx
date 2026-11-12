import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'

export default function MagneticButton({
  href,
  onClick,
  className = '',
  strength = 0.3,
  label,
  children,
  ...rest
}) {
  const btn = useRef(null)
  const fill = useRef(null)
  const labelRef = useRef(null)

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
        const lxTo = gsap.quickTo(labelRef.current, 'x', opts)
        const lyTo = gsap.quickTo(labelRef.current, 'y', opts)

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
          r = el.getBoundingClientRect()
          placeFill(e)
          gsap.to(fill.current, { scale: 1, duration: 0.6, ease: 'power3.out', overwrite: true })
        }

        let r = el.getBoundingClientRect()
        const onMove = (e) => {
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

  const Tag = href ? 'a' : 'button'
  const props = href ? { href } : { type: 'button', onClick }

  return (
    <Tag ref={btn} className={`btn-magnetic ${className}`} aria-label={label} {...props} {...rest}>
      <span className="btn__fill" ref={fill} aria-hidden="true" />
      <span className="btn__label" ref={labelRef}>
        {children}
      </span>
    </Tag>
  )
}