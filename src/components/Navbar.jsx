import { forwardRef, useEffect, useRef, useState } from 'react'
import { LuChevronDown } from 'react-icons/lu'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import logo from '../assets/logo.svg'
import phFlag from '../assets/flagph.svg'
import MagneticButton from './MagneticButton'

const links = [{ label: 'About Us', href: '#about', id: 'about' }]

const solutions = [
  { label: 'Enov8tiveMD', href: '#solutions' },
  { label: 'Enov8tiveLAB', href: '#solutions' },
  { label: 'PMRF Digital Form', href: '#solutions' },
]

const countries = [
  { code: 'PH', name: 'Philippines', flag: phFlag },
  { code: 'US', name: 'United States', flag: '🇺🇸' },
  { code: 'SG', name: 'Singapore', flag: '🇸🇬' },
]

function Dropdown({ trigger, children, align = 'left' }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const close = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    const esc = (e) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('pointerdown', close)
    document.addEventListener('keydown', esc)
    return () => {
      document.removeEventListener('pointerdown', close)
      document.removeEventListener('keydown', esc)
    }
  }, [])

  return (
    <div
      className={`dd ${open ? 'is-open' : ''}`}
      ref={ref}
      onMouseEnter={() => window.matchMedia('(hover: hover)').matches && setOpen(true)}
      onMouseLeave={() => window.matchMedia('(hover: hover)').matches && setOpen(false)}
    >
      <button
        type="button"
        className="dd__trigger"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
      >
        {trigger}
        <LuChevronDown className="dd__chev" size={18} strokeWidth={2.5} />
      </button>
      <div className={`dd__menu dd__menu--${align}`} role="menu" onClick={() => setOpen(false)}>
        {children}
      </div>
    </div>
  )
}

const Navbar = forwardRef(function Navbar(_, ref) {
  const [country, setCountry] = useState(countries[0])
  const [current, setCurrent] = useState('home')

  // scrollspy: highlight the section currently in view
  useEffect(() => {
    const sections = [
      { id: 'home', start: 'top 50%' },
      { id: 'about', start: 'top 50%' },
      { id: 'solutions', start: 'top 50%' },
    ]
    const triggers = sections
      .filter((s) => document.getElementById(s.id))
      .map((s) =>
        ScrollTrigger.create({
          trigger: `#${s.id}`,
          start: s.start,
          end: 'bottom 50%',
          onToggle: (self) => self.isActive && setCurrent(s.id),
        })
      )
    return () => triggers.forEach((t) => t.kill())
  }, [])

  return (
    <header className="nav" ref={ref}>
      <div className="nav__inner">
        <a href="#home" className="nav__logo" aria-label="Enov8tive home">
          <img src={logo} alt="Enov8tive" />
        </a>

        <nav className="nav__links" aria-label="Primary">
          {links.map((l) => (
            <a
              key={l.label}
              href={l.href}
              className={`nav__link ${current === l.id ? 'is-active' : ''}`}
            >
              {l.label}
            </a>
          ))}

          <Dropdown
            trigger={
              <span className={`nav__link nav__link--dd ${current === 'solutions' ? 'is-active' : ''}`}>
                Solutions
              </span>
            }
          >
            {solutions.map((s) => (
              <a key={s.label} href={s.href} className="dd__item" role="menuitem">
                {s.label}
              </a>
            ))}
          </Dropdown>
        </nav>

        <div className="nav__right">
          <Dropdown
            align="right"
            trigger={
              <span className="nav__country">
                <img className="nav__flag" src={country.flag} alt="" aria-hidden="true" />
                <span>{country.code}</span>
              </span>
            }
          >
            {countries.map((c) => (
              <button
                type="button"
                key={c.code}
                className={`dd__item ${c.code === country.code ? 'is-current' : ''}`}
                role="menuitem"
                onClick={() => setCountry(c)}
              >
                {c.flag.startsWith('/') || c.flag.includes('.svg') ? (
                  <img className="nav__flag nav__flag--sm" src={c.flag} alt="" aria-hidden="true" />
                ) : (
                  <span aria-hidden="true">{c.flag}</span>
                )}{' '}
                {c.name}
              </button>
            ))}
          </Dropdown>

          <a href="#login" className="nav__login">
            Login
          </a>

          <MagneticButton href="#contact" className="nav__cta" strength={0.1}>
            Inquire Now
          </MagneticButton>
        </div>
      </div>
    </header>
  )
})

export default Navbar