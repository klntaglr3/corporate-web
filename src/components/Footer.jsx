import { useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { FaGooglePlay, FaApple } from 'react-icons/fa'
import { AltArrowRightIcon } from '@solar-icons/react/linear/alt-arrow-right'
import MagneticButton from './MagneticButton'
import phones from '../assets/phones.svg'
import hand from '../assets/handphone.webp'
import vitaLogo from '../assets/logo.svg'
import './footer.css'

gsap.registerPlugin(useGSAP, ScrollTrigger)

export default function Footer() {
  const root = useRef(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.fromTo(
          '.ft__fade',
          { y: 16, opacity: 0, filter: 'blur(10px)' },
          {
            y: 0,
            opacity: 1,
            filter: 'blur(0px)',
            duration: 0.9,
            stagger: 0.1,
            ease: 'power3.out',
            clearProps: 'filter,transform',
            scrollTrigger: { trigger: root.current, start: 'top 70%', once: true },
          }
        )
        // phones drift in from the sides
        gsap.fromTo('.ft__phones', { x: -60, opacity: 0 }, {
          x: 0, opacity: 1, duration: 1.1, ease: 'power3.out',
          scrollTrigger: { trigger: root.current, start: 'top 70%', once: true },
        })
        gsap.fromTo('.ft__hand', { x: 60, opacity: 0 }, {
          x: 0, opacity: 1, duration: 1.1, ease: 'power3.out',
          scrollTrigger: { trigger: root.current, start: 'top 70%', once: true },
        })
      })
      return () => mm.revert()
    },
    { scope: root }
  )

  return (
    <footer className="ft" id="contact" ref={root}>
      <img className="ft__phones" src={phones} alt="" loading="lazy" decoding="async" />

      <div className="ft__center">
        <div className="ft__brand ft__fade" aria-label="vita8link MD">
          <img className="ft__logo" src={vitaLogo} alt="" />
          <span className="ft__md" aria-hidden="true">MD</span>
        </div>
        <p className="ft__tag ft__fade">Your whole practice, in your pocket.</p>

        <div className="ft__fade ft__btnwrap">
          <MagneticButton href="#" className="hero__btn hero__btn--primary ft__btn">
            Learn More
            <AltArrowRightIcon size={16} aria-hidden="true" />
          </MagneticButton>
        </div>

        <p className="ft__dl ft__fade">Download our App</p>

        <div className="ft__stores ft__fade">
          <a href="#" className="ft__store" aria-label="Get it on Google Play">
            <svg width="26" height="28" viewBox="0 0 26 28" aria-hidden="true">
              <path d="M1 1.2 14 14 1 26.8c-.6-.3-1-1-1-1.8V3c0-.8.4-1.5 1-1.8Z" fill="#00C3FF" />
              <path d="m18 10-4 4L1 1.2C1.5 1 2.2 1 3 1.4L18 10Z" fill="#00E676" />
              <path d="m18 18-15 8.6c-.8.4-1.5.4-2 .2L14 14l4 4Z" fill="#F44336" />
              <path d="m18 10 5.6 3.2c1 .6 1 1.9 0 2.5L18 18l-4-4 4-4Z" fill="#FFC107" />
            </svg>
            <span>
              <small>GET IT ON</small>
              Google Play
            </span>
          </a>
          <a href="#" className="ft__store" aria-label="Download on the App Store">
            <FaApple size={30} />
            <span>
              <small>Download on the</small>
              App Store
            </span>
          </a>
        </div>
      </div>

      <img className="ft__hand" src={hand} alt="" loading="lazy" decoding="async" />
    </footer>
  )
}