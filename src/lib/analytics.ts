// Analytics is optional: a blocked Google script must never affect the app.
const MEASUREMENT_ID = 'G-0G005EC87S'

type AnalyticsEvent =
  | 'food_picker_open'
  | 'drink_picker_open'
  | 'food_result_confirm'
  | 'drink_result_confirm'
  | 'daily_fortune_open'
  | 'daily_fortune_draw'
  | 'dex_open'

type EventParams = {
  item_type?: 'food' | 'drink'
  item_id?: string
  source?: 'picker' | 'dex' | 'fortune'
}

declare global {
  interface Window {
    dataLayer?: unknown[][]
    gtag?: (...args: unknown[]) => void
  }
}

let initialized = false
let unavailable = false
let lastPagePath = ''
let lastPageLocation = ''
let lastPageTitle = ''

function enabled(): boolean {
  return import.meta.env.PROD && typeof window !== 'undefined' && !unavailable
}

function initialize(): boolean {
  if (!enabled()) return false
  if (initialized) return true
  try {
    window.dataLayer = window.dataLayer || []
    window.gtag = (...args: unknown[]) => { window.dataLayer?.push(args) }
    const script = document.createElement('script')
    script.async = true
    script.src = `https://www.googletagmanager.com/gtag/js?id=${MEASUREMENT_ID}`
    script.onerror = () => { unavailable = true }
    window.gtag('js', new Date())
    // SPA views are sent explicitly when the React screen changes.
    window.gtag('config', MEASUREMENT_ID, { send_page_view: false })
    document.head.appendChild(script)
    initialized = true
    return true
  } catch {
    unavailable = true
    return false
  }
}

function pageLocation(path: string): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '')
  return `${window.location.origin}${base}${path}`
}

export function trackPageView(path: string, title: string): void {
  if (!enabled() || path === lastPagePath || !initialize()) return
  try {
    const location = pageLocation(path)
    const parameters: Record<string, string> = {
      page_title: title,
      page_location: location,
      send_to: MEASUREMENT_ID
    }
    if (lastPageLocation) parameters.page_referrer = lastPageLocation
    window.gtag?.('event', 'page_view', parameters)
    lastPagePath = path
    lastPageLocation = location
    lastPageTitle = title
  } catch {
    // Analytics is best effort; navigation must continue.
  }
}

export function trackEvent(name: AnalyticsEvent, params: EventParams = {}): void {
  if (!enabled() || !initialize()) return
  try {
    window.gtag?.('event', name, {
      ...params,
      page_location: lastPageLocation || pageLocation('/home'),
      page_title: lastPageTitle || document.title,
      send_to: MEASUREMENT_ID
    })
  } catch {
    // Analytics is best effort; user actions must continue.
  }
}
