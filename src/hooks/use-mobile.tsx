// Enhanced src/hooks/use-mobile.tsx
import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    mql.addEventListener("change", onChange)
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    return () => mql.removeEventListener("change", onChange)
  }, [])

  return !!isMobile
}

// Enhanced hook with device capabilities
export function useDeviceCapabilities() {
  const [capabilities, setCapabilities] = React.useState({
    isMobile: false,
    isTablet: false,
    isLowEnd: false,
    supportsTouch: false,
    canUseHighAnimation: true,
    preferesReducedMotion: false
  })

  React.useEffect(() => {
    const isMobile = window.innerWidth < MOBILE_BREAKPOINT
    const isTablet = window.innerWidth >= MOBILE_BREAKPOINT && window.innerWidth < 1024
    const isLowEnd = navigator.hardwareConcurrency <= 4 || 
                     /Android.*Chrome\/[.0-9]*\s/i.test(navigator.userAgent)
    const supportsTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0
    const preferesReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    
    setCapabilities({
      isMobile,
      isTablet,
      isLowEnd,
      supportsTouch,
      canUseHighAnimation: !isMobile && !isLowEnd && !preferesReducedMotion,
      preferesReducedMotion
    })

    // Listen for changes
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const handleMotionChange = (e: MediaQueryListEvent) => {
      setCapabilities(prev => ({ 
        ...prev, 
        preferesReducedMotion: e.matches,
        canUseHighAnimation: !prev.isMobile && !prev.isLowEnd && !e.matches
      }))
    }
    
    motionQuery.addEventListener('change', handleMotionChange)
    return () => motionQuery.removeEventListener('change', handleMotionChange)
  }, [])

  return capabilities
}