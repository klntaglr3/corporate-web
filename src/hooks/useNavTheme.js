import { useEffect } from 'react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// .is-hero while the hero is on screen; everywhere else the navbar keeps its stroke
export default function useNavTheme(ref) {
  useEffect(() => {
    const el = ref.current
    if (!el) return
    el.classList.add('is-hero')
    const st = ScrollTrigger.create({
      trigger: '#about',
      start: 'top top+=80',
      end: 'max',
      onToggle: (self) => el.classList.toggle('is-hero', !self.isActive),
    })
    return () => st.kill()
  }, [ref])
}