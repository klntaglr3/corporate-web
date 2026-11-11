import { useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function useHideOnScroll(ref, offset = 120) {
  useEffect(() => {
    const el = ref.current
    if (!el) return

    let hidden = false
    const set = (h) => {
      if (h === hidden) return
      hidden = h
      gsap.to(el, {
        yPercent: h ? -100 : 0,
        duration: 0.5,
        ease: 'power3.out',
        overwrite: 'auto',
      })
    }

    const st = ScrollTrigger.create({
      start: 0,
      end: 'max',
      onUpdate: (self) => {
        if (self.scroll() < offset) return set(false) // always visible near the top
        set(self.direction === 1) // 1 = scrolling down -> hide, -1 = up -> show
      },
    })

    return () => st.kill()
  }, [ref, offset])
}