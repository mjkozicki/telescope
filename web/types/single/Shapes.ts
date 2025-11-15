interface Frame {
    filename: string
    time: number
    path: string
  }
  
  interface Rect {
    x: number
    y: number
    width: number
    height: number
    top: number
    right: number
    bottom: number
    left: number
  }
  export type { Frame, Rect }