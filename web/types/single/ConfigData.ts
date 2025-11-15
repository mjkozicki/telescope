interface ConfigData {
  url: string
  date: string
  options: {
    browser: string
    blockDomains: string[]
    block: string[]
    connectionType: boolean | string
    width: string
    height: string
    frameRate: string
    disableJS: boolean
    debug: boolean
    auth: boolean | string
    timeout: string
    repeatRun: boolean
    outputDir: string
    html: boolean
    list: boolean
    testId: string
    fileSuffix: string
  }
  browserConfig: {
    engine: string
    channel: string
    headless: boolean
    flags: boolean
    args: string[]
    viewport: {
      width: number
      height: number
    }
    recordHar?: unknown
    recordVideo?: unknown
    ignoreDefaultArgs: string[]
    logger: unknown
  }
}

export type { ConfigData }