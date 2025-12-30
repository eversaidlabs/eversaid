export interface SpellcheckError {
  word: string
  start: number
  end: number
  suggestions: string[]
}

export interface Segment {
  id: string
  speaker: number
  time: string
  rawText: string
  cleanedText: string
}

export interface HistoryEntry {
  id: string
  filename: string
  duration: string
  status: "complete" | "processing" | "error"
  timestamp: string // Added timestamp field for history entries
}

export interface SegmentEditState {
  isEditing: boolean
  hasUnsavedEdits: boolean
}
