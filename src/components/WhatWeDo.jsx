import { useLayoutEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { LuChevronLeft, LuChevronRight } from 'react-icons/lu'
import img60 from '../assets/image 60.svg'
import img61 from '../assets/image 61.svg'
import img62 from '../assets/image 62.svg'
import img63 from '../assets/image 63.svg'
import img34 from '../assets/image 34.svg'
import img35 from '../assets/image 35.svg'
import img36 from '../assets/image 36.svg'
import img37 from '../assets/image 37.svg'
import frame2611800 from '../assets/Frame 2611800.svg'
import './whatwedo.css'

gsap.registerPlugin(useGSAP, ScrollTrigger)

// img: null = placeholder. Replace with an imported image later.
const tabs = [
  {
    id: 'what',
    label: 'What We Do',
    title: 'What We Do',
    type: 'slider',
    slides: [
      {
        title: 'Integrated Software for Medical Professionals',
        body: 'Enov8tive is a software ecosystem engineered for the healthcare industry—empowering medical professionals with specialized tools that help deliver better and more efficient patient care.',
        img: img62,
      },
      {
        eyebrow: 'Primary · Secondary · Tertiary',
        title: 'Technology Designed for Every Level of Care',
        body: 'Our platform connects the entire Clinical Workflow—from primary consultations to specialized treatments and hospital care. Whether you’re a clinic, diagnostic center, hospital, or HMO, Enov8tive provides integrated digital tools that improve every stage of patient care.',
        img: img63,
      },
    ],
  },
  {
    id: 'why',
    label: 'Why We Do It',
    title: 'Why We Do It',
    type: 'slider',
    slides: [
      {
        title: 'Improving Lives Through Connected Healthcare',
        body: 'People are at the center of our philosophy. Each service is dedicated to unique stakeholders in the healthcare industry. Through our integrated system, every healthcare worker can deliver better care to more patients. Our goal is to create impactful solutions that improve lives.',
        img: img60,
      },
      {
        title: 'The Careenovators',
        sub: 'Innovators That Care',
        body: 'Enov8tive is comprised of a diverse, multi-disciplinary group of professionals all dedicated to shaping innovative healthcare solutions with a shared passion for making a positive impact.',
        img: img61,
      },
    ],
  },
  {
    id: 'how',
    label: 'How We Do It',
    title: 'The Enov8tive Approach',
    type: 'grid',
    footer: 'We don’t just innovate once—we keep building, evolving, and pushing boundaries.',
    items: [
      {
        title: 'User-Centric Innovation',
        body: 'We build technology that simplifies, enhances, and optimizes workflows based on real-world challenges.',
        icon: frame2611800,
      },
      {
        title: 'Scalability & Future-Readiness',
        body: 'Designed to adapt and grow with the ever-changing technological landscape.',
        icon: img34,
      },
      {
        title: 'Seamless Integration',
        body: 'Our solutions integrate seamlessly for smooth workflows across platforms.',
        icon: img36,
      },
      {
        title: 'Security & Compliance',
        body: 'Meeting the highest industry standards to ensure data security, privacy and regulatory compliance.',
        icon: img37,
      },
      {
        title: 'Relentless Improvement',
        body: 'We continuously analyze, refine and enhance our systems to provide cutting-edge solutions.',
        icon: img35,
      },
    ],
  },
]

function Placeholder({ className = '' }) {
  return <div className={`wwd__ph ${className}`} aria-hidden="true" />
}

export default function WhatWeDo() {
  const root = useRef(null)
  const body = useRef(null)
  const track = useRef(null)
  const [active, setActive] = useState(0)
  const [page, setPage] = useState(0)
  const tab = tabs[active]
  const tabRefs = useRef([])
  const [pill, setPill] = useState({ x: 0, w: 0 })

  // measure the active tab so the pill can slide to it
  useLayoutEffect(() => {
    const measure = () => {
      const el = tabRefs.current[active]
      if (el) setPill({ x: el.offsetLeft, w: el.offsetWidth })
    }
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [active])

  // animate content whenever the tab changes
  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.fromTo(
          '.wwd__title',
          { y: 14, opacity: 0, filter: 'blur(10px)' },
          { y: 0, opacity: 1, filter: 'blur(0px)', duration: 0.8, ease: 'power3.out', clearProps: 'filter' }
        )

      })
      return () => mm.revert()
    },
    { scope: root, dependencies: [active], revertOnUpdate: true }
  )



  // scroll parallax: re-runs on tab change because the content is remounted
  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: no-preference) and (min-width: 901px)', () => {
        const scrub = { trigger: root.current, start: 'top bottom', end: 'bottom top', scrub: true }

        // header drifts at different speeds
        gsap.fromTo('.wwd__title', { yPercent: 25 }, { yPercent: -25, ease: 'none', scrollTrigger: scrub })
        gsap.fromTo('.wwd__tabs', { yPercent: 40 }, { yPercent: -40, ease: 'none', scrollTrigger: scrub })

        // images move inside their frames
        gsap.utils.toArray('.wwd__slide-img').forEach((img) => {
          gsap.fromTo(
            img,
            { yPercent: -8, scale: 1.18 },
            {
              yPercent: 8,
              ease: 'none',
              scrollTrigger: {
                trigger: img.closest('.wwd__slide'),
                start: 'top bottom',
                end: 'bottom top',
                scrub: true,
              },
            }
          )
        })

        // slider controls and footer lag slightly behind
        gsap.fromTo(
          '.wwd__controls, .wwd__footer',
          { y: 30 },
          { y: -30, ease: 'none', scrollTrigger: scrub }
        )

        // grid cards: alternate columns move at different speeds
        gsap.utils.toArray('.wwd__feature').forEach((card, i) => {
          gsap.fromTo(
            card,
            { y: i % 2 ? 50 : 20 },
            {
              y: i % 2 ? -50 : -20,
              ease: 'none',
              scrollTrigger: { trigger: card, start: 'top bottom', end: 'bottom top', scrub: true },
            }
          )
        })
      })
      return () => mm.revert()
    },
    { scope: root, dependencies: [active], revertOnUpdate: true }
  )

  // small rounded card -> full width as the section scrolls into view
  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.fromTo(
          '.wwd__panel',
          { scale: 0.92 },
          {
            scale: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: root.current,
              start: 'top 95%',
              end: 'top 20%',
              scrub: true,
            },
          }
        )
      })
      return () => mm.revert()
    },
    { scope: root }
  )

  const switchTab = (i) => {
    if (i === active) return
    setPage(0)
    setActive(i)
  }

  const slideBy = (dir) => {
    const el = track.current
    if (!el) return
    const card = el.querySelector('.wwd__slide')
    const step = card ? card.offsetWidth + 32 : el.clientWidth
    el.scrollBy({ left: dir * step, behavior: 'smooth' })
  }

  // drag to scroll (mouse). Touch already scrolls natively.
  const drag = useRef({ down: false, startX: 0, startLeft: 0, moved: false })

  const onPointerDown = (e) => {
    if (e.pointerType !== 'mouse') return
    const el = track.current
    drag.current = { down: true, startX: e.clientX, startLeft: el.scrollLeft, moved: false }
    el.classList.add('is-dragging')
  }

  const onPointerMove = (e) => {
    const d = drag.current
    if (!d.down) return
    const dx = e.clientX - d.startX
    if (Math.abs(dx) > 4) d.moved = true
    track.current.scrollLeft = d.startLeft - dx
  }

  const DRAG_THRESHOLD = 60 // px: a drag longer than this goes to the next/prev card

  const endDrag = (e) => {
    const d = drag.current
    if (!d.down) return
    d.down = false
    const el = track.current
    el.classList.remove('is-dragging')

    const card = el.querySelector('.wwd__slide')
    if (!card) return
    const step = card.offsetWidth + 32
    const start = Math.round(d.startLeft / step)
    const dx = (e?.clientX ?? d.startX) - d.startX

    let target = start
    if (dx <= -DRAG_THRESHOLD) target = start + 1 // dragged left -> next
    else if (dx >= DRAG_THRESHOLD) target = start - 1 // dragged right -> prev

    const max = Math.round((el.scrollWidth - el.clientWidth) / step)
    target = Math.max(0, Math.min(target, max))
    el.scrollTo({ left: target * step, behavior: 'smooth' })
  }

  const onScroll = () => {
    const el = track.current
    const card = el.querySelector('.wwd__slide')
    if (!card) return
    setPage(Math.round(el.scrollLeft / (card.offsetWidth + 32)))
  }

  return (
    <section className="wwd" id="solutions" ref={root}>
      <div className="wwd__panel" aria-hidden="true" />
      <div className="wwd__inner">
        <header className="wwd__head">
          <h2 className="wwd__title">{tab.title}</h2>

          <div className="wwd__tabs" role="tablist">
            <span
              className="wwd__pill"
              style={{
                width: pill.w,
                transform: `translateX(${pill.x}px)`,
              }}
            />
            {tabs.map((t, i) => (
              <button
                type="button"
                role="tab"
                key={t.id}
                ref={(el) => (tabRefs.current[i] = el)}
                aria-selected={i === active}
                className={`wwd__tab ${i === active ? 'is-active' : ''}`}
                onClick={() => switchTab(i)}
              >
                {t.label}
              </button>
            ))}
          </div>
        </header>

        <div className="wwd__body" ref={body} key={tab.id}>
          {tab.type === 'slider' ? (
            <>
              <div
                className="wwd__track"
                ref={track}
                onScroll={onScroll}
                onPointerDown={onPointerDown}
                onPointerMove={onPointerMove}
                onPointerUp={endDrag}
                onPointerLeave={endDrag}
                onDragStart={(e) => e.preventDefault()}
              >
                {tab.slides.map((s) => (
                  <article className="wwd__slide wwd__anim" key={s.title}>
                    {s.img ? (
                      <img className="wwd__slide-img" src={s.img} alt="" loading="lazy" decoding="async" />
                    ) : (
                      <Placeholder className="wwd__slide-img" />
                    )}
                    <div className="wwd__shade" />
                    <div className="wwd__slide-text">
                      {s.eyebrow && <span className="wwd__eyebrow">{s.eyebrow}</span>}
                      <h3>{s.title}</h3>
                      {s.sub && <span className="wwd__sub">{s.sub}</span>}
                      <p>{s.body}</p>
                    </div>
                  </article>
                ))}
              </div>

              <div className="wwd__controls wwd__anim">
                <div className="wwd__arrows">
                  <button type="button" aria-label="Previous" onClick={() => slideBy(-1)}>
                    <LuChevronLeft size={24} strokeWidth={2} />
                  </button>
                  <button type="button" aria-label="Next" onClick={() => slideBy(1)}>
                    <LuChevronRight size={24} strokeWidth={2} />
                  </button>
                </div>
                <div className="wwd__dots">
                  {tab.slides.map((s, i) => (
                    <span key={s.title} className={i === page ? 'is-on' : ''} />
                  ))}
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="wwd__grid">
                {tab.items.map((it) => (
                  <article className="wwd__feature wwd__anim" key={it.title}>
                    {it.icon ? (
                      <img className="wwd__icon" src={it.icon} alt="" loading="lazy" decoding="async" />
                    ) : (
                      <Placeholder className="wwd__icon" />
                    )}
                    <h3>{it.title}</h3>
                    <p>{it.body}</p>
                  </article>
                ))}
              </div>
              <p className="wwd__footer wwd__anim">{tab.footer}</p>
            </>
          )}
        </div>
      </div>
    </section>
  )
}