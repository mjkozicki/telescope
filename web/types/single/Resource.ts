export interface Resource {
  name: string
  entryType: string
  startTime: number
  duration: number
  initiatorType: string
  deliveryType: string
  nextHopProtocol: string
  renderBlockingStatus: 'blocking' | 'non-blocking'
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
  serverTiming: Array<{
    name: string
    duration: number
    description: string
  }>
}