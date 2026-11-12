import { useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import circle1 from '../assets/circle.svg'
import circle2 from '../assets/circle2.svg'
import './about.css'

gsap.registerPlugin(useGSAP, ScrollTrigger)

const segments = [
  'Enov8tive empowers healthcare',
  { pill: circle1 },
  'providers across the Philippines with',
  { pill: circle2 },
  'innovative medical software built to make every practice smarter, faster, and better.',
]

const stats = [
  {
    value: 10,
    suffix: '+',
    title: 'Years of research',
    body: 'Built on validated psychological frameworks and continuous machine-learning improvement.',
  },
  {
    value: 1200,
    suffix: '+',
    title: 'Clinical Data Points',
    body: 'Our models are informed by diverse emotional patterns collected from real-world mental health observations.',
  },
  {
    value: 50,
    suffix: 'M+',
    title: 'AI-Generated Insights',
    body: 'Advanced emotional analysis logs that help refine accuracy, personalization and product.',
  },
]

export default function About() {
  const root = useRef(null)
  const [active, setActive] = useState(0)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        // statement: text fills in as you scroll, pills pop in on the way
        const items = gsap.utils.toArray('.about__tok, .about__pill')
        const tl = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: {
            trigger: '.about__statement',
            start: 'top 78%',
            end: 'bottom 45%',
            scrub: true,
          },
        })
        items.forEach((el, i) => {
          const isPill = el.classList.contains('about__pill')
          tl.fromTo(
            el,
            isPill ? { opacity: 0.15, scale: 0.8 } : { color: '#a4acba' },
            isPill ? { opacity: 1, scale: 1, duration: 1.2 } : { color: '#0b1220', duration: 1 },
            i * 0.45
          )
        })

        // cards rise in
        gsap.fromTo(
          '.about__card',
          { y: 60, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            stagger: 0.12,
            ease: 'power3.out',
            scrollTrigger: { trigger: '.about__cards', start: 'top 85%', once: true },
          }
        )

        // counters
        gsap.utils.toArray('.about__count').forEach((el) => {
          const end = Number(el.dataset.count)
          const o = { v: 0 }
          gsap.to(o, {
            v: end,
            duration: 2,
            ease: 'power3.out',
            scrollTrigger: { trigger: el, start: 'top 90%', once: true },
            onUpdate: () => {
              el.textContent = Math.round(o.v).toLocaleString('en-US')
            },
          })
        })
      })

      mm.add('(prefers-reduced-motion: reduce)', () => {
        gsap.set('.about__tok', { color: '#0b1220' })
        gsap.utils.toArray('.about__count').forEach((el) => {
          el.textContent = Number(el.dataset.count).toLocaleString('en-US')
        })
      })

      return () => mm.revert()
    },
    { scope: root }
  )

  // cursor spotlight on each card
  // cursor position -> angle + proximity to the card edge
  const onMove = (e) => {
    const el = e.currentTarget
    const r = el.getBoundingClientRect()
    const cx = r.left + r.width / 2
    const cy = r.top + r.height / 2
    const dx = e.clientX - cx
    const dy = e.clientY - cy
    const angle = (Math.atan2(dy, dx) * 180) / Math.PI + 90
    // 0 at center, 1 at the edge
    const k = Math.max(Math.abs(dx) / (r.width / 2), Math.abs(dy) / (r.height / 2))
    const near = Math.min(1, Math.max(0, (k - 0.35) / 0.65))
    el.style.setProperty('--edge-angle', `${angle}deg`)
    el.style.setProperty('--near', near.toFixed(3))
  }

  const onLeaveCard = (e) => {
    e.currentTarget.style.setProperty('--near', '0')
  }

  return (
    <section className="about" id="about" ref={root}>
      <p className="about__statement">
        {segments.map((seg, i) =>
          typeof seg === 'string' ? (
            seg.split(' ').map((w, j) => (
              <span className="about__tok" key={`${i}-${j}`}>
                {w}{' '}
              </span>
            ))
          ) : (
            <span className="about__pill" key={i}>
              <img src={seg.pill} alt="" loading="lazy" decoding="async" />
            </span>
          )
        )}
      </p>

      <div className="about__cards" onMouseLeave={() => setActive(0)}>
        {stats.map((s, i) => (
          <article
            key={s.title}
            className={`about__card ${i === active ? 'is-active' : ''}`}
            onMouseEnter={() => setActive(i)}
          >
            <span className="about__edge" aria-hidden="true" />
            <span className="about__glow" aria-hidden="true" />

            <div className="about__card-inner">
              <div className="about__big">
                <span className="about__count" data-count={s.value}>
                  0
                </span>
                <span>{s.suffix}</span>
              </div>
              <hr />
              <h3>{s.title}</h3>
              <p>{s.body}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}