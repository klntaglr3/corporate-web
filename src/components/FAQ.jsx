import { useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { AltArrowRightIcon } from '@solar-icons/react/linear/alt-arrow-right'
import { LuPlus, LuMinus } from 'react-icons/lu'
import MagneticButton from './MagneticButton'
import './faq.css'

gsap.registerPlugin(useGSAP, ScrollTrigger)

const faqs = [
  {
    q: 'How can I reach out to your Support Team?',
    a: (
      <>
        For questions or concerns about Enov8tive, contact{' '}
        <strong>support@enov8tive.com</strong> or call <strong>(808) 720 6077</strong>,
        Monday–Friday, 8 AM–5 PM.
      </>
    ),
  },
  {
    q: 'Are PhilHealth claims submitted automatically?',
    a: 'Enov8tive is integrated with PhilHealth eClaims 3.0 to streamline claim submission. Replace this with your final answer.',
  },
  {
    q: 'Do we need to install anything to use your service?',
    a: 'Enov8tive is a cross-platform solution, accessible on desktop via any web browser and on mobile through our dedicated app, designed to fit your role and operational needs within the organization.',
  },
  {
    q: 'Is your solution only accessible in specific areas?',
    a: 'No, access is available as long as you have an internet connection and, for mobile use, have installed the companion mobile app.',
  },
  {
    q: 'Is my data and my patient’s data secure?',
    a: 'Yes, Enov8tive is fully compliant with applicable data privacy mandates and HIPAA standards. We take data protection seriously and ensure that patient information is handled with the utmost care, security, and confidentiality.',
  },
]

export default function FAQ() {
  const root = useRef(null)
  const [open, setOpen] = useState(0)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.fromTo(
          '.faq__fade',
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

  return (
    <section className="faq" id="faq" ref={root}>
      <div className="faq__inner">
        <div className="faq__side">
          <h2 className="faq__title faq__fade">
            Frequently
            <br />
            Asked Questions
          </h2>
          <div className="faq__fade">
            <MagneticButton href="#contact" className="hero__btn hero__btn--primary faq__btn">
              Inquire Now
              <AltArrowRightIcon size={16} aria-hidden="true" />
            </MagneticButton>
          </div>
        </div>

        <div className="faq__list">
          {faqs.map((f, i) => {
            const isOpen = open === i
            return (
              <div className={`faq__item faq__fade ${isOpen ? 'is-open' : ''}`} key={f.q}>
                <button
                  type="button"
                  className="faq__q"
                  aria-expanded={isOpen}
                  onClick={() => setOpen(isOpen ? -1 : i)}
                >
                  <span>{f.q}</span>
                  <span className="faq__icon" aria-hidden="true">
                    {isOpen ? <LuMinus size={18} /> : <LuPlus size={18} />}
                  </span>
                </button>
                <div className="faq__a">
                  <div className="faq__a-inner">
                    <p>{f.a}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}