import { useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { VerifiedCheckIcon } from '@solar-icons/react/bold/verified-check'
import philhealth from '../assets/philhealth.svg'
import yakap from '../assets/yakap.svg'
import './certified.css'

gsap.registerPlugin(useGSAP, ScrollTrigger)

// enough logos per group to always be wider than the screen
const logos = Array.from({ length: 12 }, (_, i) => (i % 2 ? philhealth : yakap))

export default function Certified() {
  const root = useRef(null)

  useGSAP(
    () => {
      ScrollTrigger.create({
        trigger: root.current,
        start: 'top bottom',
        end: 'bottom top',
        onToggle: (s) => root.current.classList.toggle('is-paused', !s.isActive),
      })

      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        // blur-fade text, same feel as the hero eyebrow
        gsap.fromTo(
          '.cert__fade',
          { y: 16, opacity: 0, filter: 'blur(10px)' },
          {
            y: 0,
            opacity: 1,
            filter: 'blur(0px)',
            duration: 0.9,
            stagger: 0.12,
            ease: 'power3.out',
            clearProps: 'filter,transform',
            scrollTrigger: { trigger: '.cert__title', start: 'top 85%', once: true },
          }
        )
        gsap.fromTo(
          '.cert__marquee',
          { opacity: 0 },
          {
            opacity: 1,
            duration: 1.2,
            ease: 'power2.out',
            scrollTrigger: { trigger: '.cert__marquee', start: 'top 95%', once: true },
          }
        )
      })
      return () => mm.revert()
    },
    { scope: root }
  )

  return (
    <section className="cert" id="certified" ref={root}>
      {/* gradient definition for the icon */}
      <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true">
        <defs>
          <linearGradient id="certGrad" gradientUnits="objectBoundingBox" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#149A46" />
            <stop offset="100%" stopColor="#A8DB00" />
          </linearGradient>
        </defs>
      </svg>

      <div className="cert__inner">
        <h2 className="cert__title cert__fade">Certified Philhealth Service Provider</h2>

        <div className="cert__card cert__fade">
          <span className="cert__ring" aria-hidden="true" />
          <div className="cert__card-head">
            <VerifiedCheckIcon size={48} className="cert__icon" aria-hidden="true" />
            <h3>eClaims 3.0 Integration</h3>
          </div>
          <hr />
          <h4>1st in the Philippines</h4>
          <p>
            We’ve partnered with PhilHealth to make preventive and primary health services
            accessible to more Filipinos.
            <br />
            Our user-friendly platform is designed to streamline insurance claims—reducing
            delays and simplifying the process for both patients and providers.
          </p>
        </div>
      </div>

      <div className="cert__marquee" aria-hidden="true">
        <div className="cert__track">
          {[0, 1].map((g) => (
            <div className="cert__group" key={g}>
              {logos.map((src, i) => (
                <img src={src} alt="" key={i} draggable="false" width="260" height="76" decoding="async" />
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}