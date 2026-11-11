import { forwardRef } from 'react'
import logo from '../assets/logo1.svg'
import MagneticButton from './MagneticButton'

const links = [
  { label: 'Home', href: '#home', active: true },
  { label: 'About Us', href: '#about' },
  { label: 'Solutions', href: '#solutions' },
]

const Navbar = forwardRef(function Navbar(_, ref) {
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
              className={`nav__link ${l.active ? 'is-active' : ''}`}
            >
              {l.label}
            </a>
          ))}
        </nav>

        <MagneticButton href="#contact" className="nav__cta" strength={0.1}>
          Contact Us
        </MagneticButton>
      </div>
    </header>
  )
})

export default Navbar