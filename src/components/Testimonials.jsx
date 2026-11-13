import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { LuChevronLeft, LuChevronRight } from 'react-icons/lu'
import quoteMark from '../assets/quote.svg'
import testi from '../assets/testi.svg'
import './testimonials.css'

gsap.registerPlugin(useGSAP, ScrollTrigger)

const items = [
  {
    quote:
      'I use Enov8tive every day during patient visits, mainly through the mobile app. The MD Notes feature is what I rely on the most.',
    name: 'Cryryl Cells',
    role: 'Provider',
    img: testi,
  },
  {
    quote:
      'Enov8tive’s solutions have revolutionized our operations. The team took the time to understand our needs, and the results have exceeded our expectations.',
    name: 'Dr. Gabriel Halperin',
    role: 'CEO of Calwound Care',
    img: testi,
  },
  {
    quote:
      'I use Enov8tive every day, both on the mobile app and the web browser. What I really appreciate is the flexibility of switching between two depending on what I need to do. Features like MD Notes and especially MD Orders have been the most helpful in my daily workflow.',
    name: 'Carlo Yoshisaki',
    role: 'Provider',
    img: testi,
  },
  {
    quote:
      'Overall, I’ve had a good experience using Enov8tive. I primarily use it during my patient visits and the Quick assessments feature is something I rely on often. The ‘copy from previous’ option is especially helpful and has made my workflow more efficient. Right now, I’m happy with how the system supports my work.',
    name: 'Robin Fordham',
    role: 'Provider',
    img: testi,
  },
]

const AUTO_MS = 6000 // time to fill the active dot
const PAUSE_MS = 8000 // pause after the user navigates
const DRAG_THRESHOLD = 60

export default function Testimonials() {
  const root = useRef(null)
  const fillRef = useRef(null)
  const [index, setIndex] = useState(0)
  const indexRef = useRef(0)
  const busy = useRef(false)
  const hover = useRef(false)
  const pausedUntil = useRef(0)
  const progress = useRef(0) // 0..1 for the active dot
  const visible = useRef(false)
  const item = items[index]

  // entrance: blur-fade when the section scrolls in
  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.fromTo(
          '.testi__fade',
          { y: 16, opacity: 0, filter: 'blur(10px)' },
          {
            y: 0,
            opacity: 1,
            filter: 'blur(0px)',
            duration: 0.9,
            stagger: 0.1,
            ease: 'power3.out',
            clearProps: 'filter,transform',
            scrollTrigger: { trigger: root.current, start: 'top 75%', once: true },
          }
        )
      })
      return () => mm.revert()
    },
    { scope: root }
  )

  // jump to a given index with blur-fade swap
  const goTo = (next, manual = false) => {
    if (busy.current) return
    next = (next + items.length) % items.length
    if (manual) pausedUntil.current = performance.now() + PAUSE_MS
    if (next === indexRef.current) return
    busy.current = true
    progress.current = 0
    if (fillRef.current) fillRef.current.style.setProperty('--p', 0)

    const targets = root.current.querySelectorAll('.testi__swap')
    gsap.to(targets, {
      opacity: 0,
      y: -12,
      filter: 'blur(10px)',
      duration: 0.4,
      ease: 'power2.in',
      onComplete: () => {
        indexRef.current = next
        setIndex(next)
        gsap.fromTo(
          targets,
          { opacity: 0, y: 14, filter: 'blur(10px)' },
          {
            opacity: 1,
            y: 0,
            filter: 'blur(0px)',
            duration: 0.7,
            stagger: 0.08,
            ease: 'power3.out',
            clearProps: 'filter,transform',
            onComplete: () => (busy.current = false),
          }
        )
      },
    })
  }

  const step = (dir) => goTo(indexRef.current + dir, true)

  // progress loop: fills the active dot, then moves on (loops back to the first)
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let raf
    let last = performance.now()
    const tick = (now) => {
      const dt = Math.min(now - last, 100) // avoids a jump after switching tabs
      last = now
      const waiting = now < pausedUntil.current
      if (visible.current && !hover.current && !waiting && !busy.current) {
        progress.current = Math.min(1, progress.current + dt / AUTO_MS)
        fillRef.current?.style.setProperty('--p', progress.current)
        if (progress.current >= 1) goTo(indexRef.current + 1)
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    const st = ScrollTrigger.create({
      trigger: root.current,
      start: 'top bottom',
      end: 'bottom top',
      onToggle: (s) => (visible.current = s.isActive),
    })
    return () => {
      cancelAnimationFrame(raf)
      st.kill()
    }
  }, [])

  // drag / swipe
  const drag = useRef({ down: false, x: 0 })
  const onPointerDown = (e) => {
    if (e.target.closest('button')) return
    drag.current = { down: true, x: e.clientX }
  }
  const onPointerUp = (e) => {
    const d = drag.current
    if (!d.down) return
    d.down = false
    const dx = e.clientX - d.x
    if (dx <= -DRAG_THRESHOLD) step(1)
    else if (dx >= DRAG_THRESHOLD) step(-1)
  }

  return (
    <section
      className="testi"
      ref={root}
      onMouseEnter={() => (hover.current = true)}
      onMouseLeave={() => {
        hover.current = false
        drag.current.down = false
      }}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
    >
      <img className="testi__mark" src={quoteMark} alt="" aria-hidden="true" loading="lazy" decoding="async" />

      <div className="testi__inner">
        <div className="testi__top testi__fade">
          <h2 className="testi__label">Hear From Our Clients</h2>
        </div>

        <blockquote className="testi__quote testi__fade">
          {/* invisible copies reserve the height of the tallest quote */}
          {items.map((it, i) => (
            <span className="testi__ghost" aria-hidden="true" key={i}>
              “{it.quote}”
            </span>
          ))}
          <span className="testi__swap">“{item.quote}”</span>
        </blockquote>

        <div className="testi__bottom testi__fade">
          <div className="testi__person">
            <img className="testi__swap" src={item.img} alt="" draggable="false" />
            <div className="testi__swap">
              <strong>{item.name}</strong>
              <span>{item.role}</span>
            </div>
          </div>

          <div className="testi__nav">
            <div className="testi__dots">
              {items.map((_, i) => (
                <button
                  type="button"
                  aria-label={`Go to testimonial ${i + 1}`}
                  key={i}
                  className={i === index ? 'is-on' : ''}
                  onClick={() => goTo(i, true)}
                >
                  {i === index && <i ref={fillRef} />}
                </button>
              ))}
            </div>
            <button type="button" aria-label="Previous" onClick={() => step(-1)}>
              <LuChevronLeft size={22} strokeWidth={2.75} />
            </button>
            <button type="button" aria-label="Next" onClick={() => step(1)}>
              <LuChevronRight size={22} strokeWidth={2.75} />
            </button>
          </div>
        </div>
      </div>
    
    </section>
  )
}