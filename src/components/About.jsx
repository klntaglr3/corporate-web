import { useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import './about.css'

gsap.registerPlugin(useGSAP, ScrollTrigger)

const statement =
  'We build the software ecosystem that helps every clinic, hospital and HMO deliver better, more connected patient care.'

const levels = ['Primary', 'Secondary', 'Tertiary']

// Put these images in /public/about/
const tabs = [
  {
    id: 'why-we-do',
    label: 'Why We Do',
    type: 'rows',
    items: [
      {
        title: 'Integrated Software for Medical Professionals',
        body: 'Enov8tive is a software ecosystem engineered for the healthcare industry—empowering medical professionals with specialized tools that help deliver better and more efficient patient care.',
        img: '/about/integrated.jpg',
      },
      {
        title: 'Technology Designed for Every Level of Care',
        body: 'Our platform connects the entire Clinical Workflow—from primary consultations to specialized treatments and hospital care. Whether you’re a clinic, diagnostic center, hospital, or HMO, Enov8tive provides integrated digital tools that improve every stage of patient care.',
        img: '/about/levels.jpg',
      },
    ],
  },
  {
    id: 'why-we-do-it',
    label: 'Why We Do It',
    type: 'rows',
    items: [
      {
        title: 'Improving Lives Through Connected Healthcare',
        body: 'People are at the center of our philosophy. Each service is dedicated to unique stakeholders in the healthcare industry. Through our integrated system, every healthcare worker can deliver better care to more patients. Our goal is to create impactful solutions that improve lives.',
        img: '/about/lives.jpg',
      },
      {
        title: 'The Careenovators',
        sub: 'Innovators That Care',
        body: 'Enov8tive is comprised of a diverse, multi-disciplinary group of professionals all dedicated to shaping innovative healthcare solutions with a shared passion for making a positive impact.',
        img: '/about/team.jpg',
      },
    ],
  },
  {
    id: 'how-we-do-it',
    label: 'How We Do It',
    type: 'steps',
    heading: 'The Enov8tive Approach',
    intro: 'We don’t just innovate once—we keep building, evolving, and pushing boundaries.',
    items: [
      {
        title: 'User-Centric Innovation',
        body: 'We build technology that simplifies, enhances, and optimizes workflows based on real-world challenges.',
        img: '/about/icon-user.png',
      },
      {
        title: 'Scalability & Future-Readiness',
        body: 'Designed to adapt and grow with the ever-changing technological landscape.',
        img: '/about/icon-scale.png',
      },
      {
        title: 'Relentless Improvement',
        body: 'We continuously analyze, refine and enhance our systems to provide cutting-edge solutions.',
        img: '/about/icon-improve.png',
      },
      {
        title: 'Seamless Integration',
        body: 'Our solutions work together, ensuring smooth transitions and interoperability across different platforms.',
        img: '/about/icon-integrate.png',
      },
    ],
  },
]

const hideBroken = (e) => {
  e.currentTarget.style.display = 'none'
}

export default function About() {
  const root = useRef(null)
  const content = useRef(null)
  const [active, setActive] = useState(0)
  const tab = tabs[active]

  // intro: statement words light up on scroll
  useGSAP(
    () => {
      gsap.fromTo(
        '.about__word',
        { opacity: 0.14 },
        {
          opacity: 1,
          stagger: 0.1,
          ease: 'none',
          scrollTrigger: {
            trigger: '.about__statement',
            start: 'top 80%',
            end: 'bottom 55%',
            scrub: true,
          },
        }
      )

      gsap.fromTo(
        '.about__marquee-track',
        { xPercent: 0 },
        {
          xPercent: -12,
          ease: 'none',
          scrollTrigger: {
            trigger: '.about__marquee',
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        }
      )
    },
    { scope: root }
  )

  // tab content: reveal on mount and every time the tab changes
  useGSAP(
    () => {
      const el = content.current
      const items = el.querySelectorAll('[data-reveal]')
      const clips = el.querySelectorAll('[data-clip]')
      const imgs = el.querySelectorAll('.about__media-inner')

      const tl = gsap.timeline({
        scrollTrigger: { trigger: el, start: 'top 85%', once: true },
      })

      tl.fromTo(
        items,
        { y: 36, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, stagger: 0.08, ease: 'power3.out' },
        0
      )
        .fromTo(
          clips,
          { clipPath: 'inset(100% 0% 0% 0%)' },
          { clipPath: 'inset(0% 0% 0% 0%)', duration: 1, stagger: 0.12, ease: 'power4.inOut' },
          0.05
        )
        .fromTo(
          imgs,
          { scale: 1.25 },
          { scale: 1, duration: 1.3, stagger: 0.12, ease: 'power3.out' },
          0.05
        )
    },
    { scope: content, dependencies: [active], revertOnUpdate: true }
  )

  return (
    <section className="about" id="about" ref={root}>
      {/* intro */}
      <div className="about__intro">
        <p className="about__statement">
          {statement.split(' ').map((w, i) => (
            <span className="about__word" key={i}>
              {w}{' '}
            </span>
          ))}
        </p>
      </div>

      {/* marquee */}
      <div className="about__marquee" aria-hidden="true">
        <div className="about__marquee-track">
          {[0, 1].map((g) => (
            <div className="about__marquee-group" key={g}>
              {[...levels, ...levels].map((l, i) => (
                <span className="about__marquee-item" key={l + i}>
                  {l}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* tabs */}
      <div className="about__tabs-wrap">
        <div className="about__tabs" role="tablist">
          <span
            className="about__indicator"
            style={{ transform: `translateX(${active * 100}%)` }}
          />
          {tabs.map((t, i) => (
            <button
              type="button"
              role="tab"
              aria-selected={i === active}
              key={t.id}
              className={`about__tab ${i === active ? 'is-active' : ''}`}
              onClick={() => setActive(i)}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="about__content" ref={content} key={tab.id}>
          {tab.type === 'rows' ? (
            tab.items.map((it, i) => (
              <div className={`about__row ${i % 2 ? 'is-reverse' : ''}`} key={it.title}>
                <div className="about__text" data-reveal>
                  <h3>{it.title}</h3>
                  {it.sub && <span className="about__sub">{it.sub}</span>}
                  <p>{it.body}</p>
                </div>
                <figure className="about__media" data-clip>
                  <div className="about__media-inner">
                    <img src={it.img} alt="" onError={hideBroken} />
                  </div>
                </figure>
              </div>
            ))
          ) : (
            <div className="about__approach">
              <div className="about__approach-head" data-reveal>
                <h3>{tab.heading}</h3>
                <p>{tab.intro}</p>
              </div>
              <div className="about__grid">
                {tab.items.map((it) => (
                  <div className="about__feature" data-reveal key={it.title}>
                    <img src={it.img} alt="" onError={hideBroken} />
                    <div>
                      <h4>{it.title}</h4>
                      <p>{it.body}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}