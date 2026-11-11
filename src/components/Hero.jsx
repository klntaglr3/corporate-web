import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import Navbar from './Navbar'
import useHideOnScroll from '../hooks/useHideOnScroll'
import MagneticButton from './MagneticButton'
import heroBg from '../assets/herobg1.svg'
import './hero.css'
import { AltArrowRightIcon } from '@solar-icons/react/linear/alt-arrow-right'
gsap.registerPlugin(useGSAP)

const headlineLines = ['Empowering the', 'Healthcare Sector', 'in the Philippines']

function ChevronRight() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M9 5l7 7-7 7"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default function Hero() {
  const root = useRef(null)
  const navRef = useRef(null)
  useHideOnScroll(navRef)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const tl = gsap.timeline({ defaults: { ease: 'power4.out' } })

        // background: slow cinematic settle
        tl.fromTo(
          '.hero__bg img',
          { scale: 1.12 },
          { scale: 1, duration: 2.4, ease: 'power2.out' },
          0
        )

        tl.fromTo(
          '.hero__overlay',
          { opacity: 0 },
          { opacity: 1, duration: 1.2, ease: 'power1.out' },
          0
        )

        // navbar drops in
        tl.fromTo(
          navRef.current,
          { yPercent: -100, opacity: 0 },
          { yPercent: 0, opacity: 1, duration: 0.9 },
          0.2
        )

        // headline: masked line reveal
        tl.fromTo(
          '.hero__line-inner',
          { yPercent: 150, rotate: 2 },
          { yPercent: 0, rotate: 0, duration: 1.1, stagger: 0.12 },
          0.45
        )

        tl.fromTo(
          '.hero__desc',
          { y: 28, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.9 },
          1.0
        )

        tl.fromTo(
          '.hero__divider',
          { scaleX: 0 },
          { scaleX: 1, duration: 1.2, ease: 'power3.inOut' },
          1.1
        )

        tl.fromTo(
          '.hero__btn',
          { y: 24, opacity: 0, scale: 0.94 },
          { y: 0, opacity: 1, scale: 1, duration: 0.8, stagger: 0.1, ease: 'back.out(1.6)' },
          1.3
        )

      })

      // hero zooms out, blurs and dims while About slides over it
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const about = document.querySelector('#about')
        if (!about) return

        const tl = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: {
            trigger: about,
            start: 'top bottom',
            end: 'top top',
            scrub: true,
            invalidateOnRefresh: true,
          },
        })

        tl.fromTo('.hero__bg', { scale: 1.1 }, { scale: 1, force3D: true }, 0) // image zoom out
          .fromTo('.hero__shade', { opacity: 0 }, { opacity: 0.45 }, 0)         // cheap dimming
          .fromTo('.hero__content', { y: 0, opacity: 1 }, { y: -70, opacity: 0.2 }, 0)
      })

      // no-motion fallback: everything visible, nothing animated
      mm.add('(prefers-reduced-motion: reduce)', () => {
        gsap.set(
          ['.hero__line-inner', '.hero__desc', '.hero__btn', '.hero__divider'],
          { clearProps: 'all' }
        )
      })

      return () => mm.revert()
    },
    { scope: root }
  )

  return (
    <>
      <Navbar ref={navRef} />

      <div className="hero" id="home" ref={root}>
        <div className="hero__inner">
          <div className="hero__bg" aria-hidden="true">
            <img className="hero__bg-main" src={heroBg} alt="" />
          </div>
          <div className="hero__overlay" aria-hidden="true" />
          <div className="hero__shade" aria-hidden="true" />

          <div className="hero__content">
            <h1 className="hero__title">
              {headlineLines.map((line) => (
                <span className="hero__line" key={line}>
                  <span className="hero__line-inner">{line}</span>
                </span>
              ))}
            </h1>

            <p className="hero__desc">
              Enov8tive empowers healthcare providers across the Philippines with
              innovative medical software built to make every practice smarter,
              faster, and better.
            </p>

            <div className="hero__divider" />

            <div className="hero__actions">
              <MagneticButton href="#contact" className="hero__btn hero__btn--primary">
                Inquire Now
                <AltArrowRightIcon size={22} aria-hidden="true" />
              </MagneticButton>
              <MagneticButton href="#about" className="hero__btn hero__btn--glass">
                About Us
              </MagneticButton>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}