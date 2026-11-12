import { useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { AltArrowRightIcon } from '@solar-icons/react/linear/alt-arrow-right'
import MagneticButton from './MagneticButton'
import ctaBg from '../assets/cta.svg'
import './cta.css'

gsap.registerPlugin(useGSAP, ScrollTrigger)

export default function CTA() {
  const root = useRef(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        // blur-fade text, same feel as the hero eyebrow
        gsap.fromTo(
          '.cta__fade',
          { y: 16, opacity: 0, filter: 'blur(10px)' },
          {
            y: 0,
            opacity: 1,
            filter: 'blur(0px)',
            duration: 0.9,
            stagger: 0.12,
            ease: 'power3.out',
            clearProps: 'filter,transform',
            scrollTrigger: { trigger: root.current, start: 'top 80%', once: true },
          }
        )

        // image drifts inside the banner
        gsap.fromTo(
          '.cta__bg',
          { yPercent: -8, scale: 1.18 },
          {
            yPercent: 8,
            ease: 'none',
            scrollTrigger: {
              trigger: root.current,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
            },
          }
        )
      })
      return () => mm.revert()
    },
    { scope: root }
  )

  return (
    <section className="cta" ref={root}>
      <div className="cta__banner">
        <img className="cta__bg" src={ctaBg} alt="" aria-hidden="true" loading="lazy" decoding="async" />
        <div className="cta__overlay" aria-hidden="true" />

        <div className="cta__content">
          <h2 className="cta__title cta__fade">Ready to Upgrade Your Medical Practice?</h2>
          <div className="cta__actions cta__fade">
            <MagneticButton href="#contact" className="hero__btn hero__btn--primary cta__btn">
              Inquire Now
              <AltArrowRightIcon size={18} aria-hidden="true" />
            </MagneticButton>
            <MagneticButton href="#solutions" className="hero__btn hero__btn--glass cta__btn">
              View Solutions
            </MagneticButton>
          </div>
        </div>
      </div>
    </section>
  )
}