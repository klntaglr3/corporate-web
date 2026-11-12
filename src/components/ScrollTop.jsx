import { useEffect, useState } from 'react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import MagneticButton from './MagneticButton'
import { LuArrowUp } from 'react-icons/lu'
import './scrolltop.css'

export default function ScrollTop() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const st = ScrollTrigger.create({
      trigger: '#certified',
      start: 'top 60%',
      onEnter: () => setShow(true),       // reached YAKAP, scrolling down
      onLeaveBack: () => setShow(false),  // scrolled back above YAKAP
    })
    return () => st.kill()
  }, [])

  const toTop = () => {
    if (window.__lenis) window.__lenis.scrollTo(0, { duration: 1.6 })
    else window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <MagneticButton
      className={`scrolltop ${show ? 'is-visible' : ''}`}
      label="Scroll to top"
      strength={0.35}
      tabIndex={show ? 0 : -1}
      onClick={toTop}
    >
      <LuArrowUp size={22} strokeWidth={2.75} />
    </MagneticButton>
  )
}