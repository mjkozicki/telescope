interface BoundingRect {
  x: number
  y: number
  width: number
  height: number
  top: number
  right: number
  bottom: number
  left: number
}

interface LCPElement {
  nodeName: string
  boundingRect: BoundingRect
  outerHTML?: string
  src?: string
  currentSrc?: string
  content?: string
}

interface LargestContentfulPaint {
  name: string
  entryType: string
  startTime: number
  size: number
  url: string
  id: string
  loadTime: number
  renderTime: number
  element: LCPElement
}

interface LayoutShiftSource {
  previousRect: BoundingRect
  currentRect: BoundingRect
}

interface LayoutShift {
  name: string
  entryType: string
  startTime: number
  value: number
  hadRecentInput: boolean
  lastInputTime: number
  sources: LayoutShiftSource[]
}

interface PaintTiming {
  name: string
  entryType: string
  startTime: number
  duration: number
}

interface UserTiming {
  name: string
  entryType: string
  startTime: number
  duration: number
}

interface ServerTiming {
  name: string
  duration: number
  description: string
}

interface NavigationTiming {
  name: string
  entryType: string
  startTime: number
  duration: number
  initiatorType: string
  deliveryType: string
  nextHopProtocol: string
  renderBlockingStatus: string
  workerStart: number
  workerRouterEvaluationStart: number
  workerCacheLookupStart: number
  workerMatchedSourceType: string
  workerFinalSourceType: string
  redirectStart: number
  redirectEnd: number
  fetchStart: number
  domainLookupStart: number
  domainLookupEnd: number
  connectStart: number
  secureConnectionStart: number
  connectEnd: number
  requestStart: number
  responseStart: number
  firstInterimResponseStart: number
  finalResponseHeadersStart: number
  responseEnd: number
  transferSize: number
  encodedBodySize: number
  decodedBodySize: number
  responseStatus: number
  serverTiming: ServerTiming[]
  unloadEventStart: number
  unloadEventEnd: number
  domInteractive: number
  domContentLoadedEventStart: number
  domContentLoadedEventEnd: number
  domComplete: number
  loadEventStart: number
  loadEventEnd: number
  type: string
  redirectCount: number
  activationStart: number
  criticalCHRestart: number
  notRestoredReasons: unknown | null
}

interface MetricsData {
  navigationTiming: NavigationTiming
  paintTiming: PaintTiming[]
  userTiming: UserTiming[]
  largestContentfulPaint: LargestContentfulPaint[]
  layoutShifts: LayoutShift[]
  totalBlockingTime?: number
}

export type {
  BoundingRect,
  LCPElement,
  LargestContentfulPaint,
  LayoutShiftSource,
  LayoutShift,
  PaintTiming,
  UserTiming,
  ServerTiming,
  NavigationTiming,
  MetricsData
}