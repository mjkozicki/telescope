interface ConsoleMessage {
  type: 'error' | 'warning' | 'info' | 'log' | 'debug'
  text: string
  location: {
    url: string
    lineNumber: number
    columnNumber: number
  }
}

export type { ConsoleMessage }