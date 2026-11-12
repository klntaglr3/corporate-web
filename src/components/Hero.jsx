import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Navbar from './Navbar'
import useHideOnScroll from '../hooks/useHideOnScroll'
import useNavTheme from '../hooks/useNavTheme'
import MagneticButton from './MagneticButton'
import heroBg from '../assets/herobg1.svg'
import './hero.css'
import { AltArrowRightIcon } from '@solar-icons/react/linear/alt-arrow-right'
import { StarIcon } from '@solar-icons/react/bold/star'

// every "Ellipse *.svg" in src/assets, first 5 sorted by name
import ell4 from '../assets/Ellipse 4.svg'
import ell5 from '../assets/Ellipse 5.svg'
import ell6 from '../assets/Ellipse 6.svg'
import ell8 from '../assets/Ellipse 8.svg'
import ell9 from '../assets/Ellipse 9.svg'

const avatars = [ell4, ell5, ell6, ell8, ell9]
gsap.registerPlugin(useGSAP, ScrollTrigger)

const headlineLines = ['Empowering the', 'Healthcare Sector', 'in the Philippines']
const eyebrowWords = ['Pushing Boundaries', 'Improving Solutions', 'Evolving Technologies']

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
  useNavTheme(navRef)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()

      mm.add('(prefers-reduced-motion: no-preference)', () => {


        // rotating eyebrow: blur-fade in, hold, blur-fade out, next word
        const words = gsap.utils.toArray('.hero__eyebrow-word')
        gsap.set(words, { opacity: 0, y: 14, filter: 'blur(10px)' })
        const loop = gsap.timeline({ repeat: -1 })
        words.forEach((w) => {
          loop
            .to(w, { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.8, ease: 'power3.out' })
            .to(w, {
              opacity: 0,
              y: -14,
              filter: 'blur(10px)',
              duration: 0.7,
              ease: 'power2.in',
            }, '+=1.8')
        })

        // hero fully covered by About: stop painting and animating it
        ScrollTrigger.create({
          trigger: '#about',
          start: 'top top',
          end: 'max',
          onToggle: (s) => {
            root.current.classList.toggle('is-off', s.isActive)
            if (s.isActive) loop.pause()
            else loop.resume()
          },
        })



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

        tl.fromTo('.hero__bg img', { scale: 1 }, { scale: 1.08, transformOrigin: '50% 0%', force3D: true }, 0) // slow zoom, never exposes a gap
          .fromTo('.hero__shade', { opacity: 0 }, { opacity: 0.45 }, 0)         // cheap dimming
          .fromTo('.hero__content', { y: 0, opacity: 1 }, { y: -70, opacity: 0.2 }, 0)
      })

      // no-motion fallback: everything visible, nothing animated
      mm.add('(prefers-reduced-motion: reduce)', () => {
        gsap.set(
          ['.hero__line-inner', '.hero__eyebrow', '.hero__trust', '.hero__btn'],
          { clearProps: 'all' }
        )
        gsap.set('.hero__eyebrow-word:first-child', { opacity: 1 })
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
            <img className="hero__bg-main" src={heroBg} alt="" fetchPriority="high" decoding="async" />
          </div>
          <div className="hero__overlay" aria-hidden="true" />
          <div className="hero__shade" aria-hidden="true" />

                   <div className="hero__content">
            <p className="hero__eyebrow" aria-label={eyebrowWords.join(', ')}>
              <span className="hero__eyebrow-stage" aria-hidden="true">
                {eyebrowWords.map((w) => (
                  <span className="hero__eyebrow-word" key={w}>
                    {w}
                  </span>
                ))}
              </span>
            </p>

            <h1 className="hero__title">
              {headlineLines.map((line) => (
                <span className="hero__line" key={line}>
                  <span className="hero__line-inner">{line}</span>
                </span>
              ))}
            </h1>

            <div className="hero__trust">
              <div className="hero__avatars">
                {avatars.map((src, i) => (
                  <img src={src} alt="" key={i} />
                ))}
              </div>
              <div>
                <div className="hero__rating-top">
                  <span className="hero__rating-line" />
                  <span className="hero__stars" aria-label="5 out of 5 stars">
                    {[0, 1, 2, 3, 4].map((i) => (
                      <span className="hero__star" key={i}>
                        <StarIcon size={26} color="currentColor" aria-hidden="true" />
                      </span>
                    ))}
                  </span>
                </div>
                <p className="hero__trust-text">Trusted by 10k+ Providers Globally</p>
              </div>
            </div>

            <div className="hero__actions">
              <MagneticButton href="#contact" className="hero__btn hero__btn--primary">
                Inquire Now
                <AltArrowRightIcon size={18} aria-hidden="true" />
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