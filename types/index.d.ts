
interface TextSvgOptions {
  font?: string
  textAlign?: 'left' | 'center' | 'right' | 'start' | 'end'
  color?: string
  textColor?: string
  backgroundColor?: string
  bgColor?: string
  lineSpacing?: number
  strokeWidth?: number
  strokeColor?: string
  padding?: number
  paddingLeft?: number
  paddingTop?: number
  paddingRight?: number
  paddingBottom?: number
  borderWidth?: number
  borderLeftWidth?: number
  borderTopWidth?: number
  borderRightWidth?: number
  borderBottomWidth?: number
  borderColor?: string
  localFontPath?: string
  localFontName?: string
  maxWidth?: number
  wrap?: boolean
  output?: 'buffer' | 'stream' | 'dataURL' | 'canvas'
  width?: number
  height?: number
}

interface ParsedOptions {
  font: string
  textAlign: 'left' | 'center' | 'right' | 'start' | 'end'
  textColor: string
  backgroundColor: string | null
  lineSpacing: number
  strokeWidth: number
  strokeColor: string
  paddingLeft: number
  paddingTop: number
  paddingRight: number
  paddingBottom: number
  borderLeftWidth: number
  borderTopWidth: number
  borderRightWidth: number
  borderBottomWidth: number
  borderColor: string
  localFontName: string | null
  localFontPath: string | null
  wrap: boolean
  maxWidth: number | undefined
  output: 'buffer' | 'stream' | 'dataURL' | 'canvas'
  width: number | undefined
  height: number | undefined
}

interface LineProperty {
  line: string
  left: number
  right: number
  ascent: number
  descent: number
}

interface MaxMetrics {
  left: number
  right: number
  ascent: number
  descent: number
}

export type { TextSvgOptions, ParsedOptions, LineProperty, MaxMetrics }