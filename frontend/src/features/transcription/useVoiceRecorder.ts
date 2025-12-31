import { useState, useCallback, useRef } from 'react'

/**
 * Return type for the useVoiceRecorder hook
 */
export interface UseVoiceRecorderReturn {
  /** Whether recording is in progress */
  isRecording: boolean
  /** Recording duration in seconds */
  duration: number
  /** Recorded audio as a Blob */
  audioBlob: Blob | null
  /** Error message if recording failed */
  error: string | null
  /** Start recording audio from microphone */
  startRecording: () => Promise<void>
  /** Stop recording and create audio blob */
  stopRecording: () => void
  /** Reset all recording state */
  resetRecording: () => void
}

/**
 * Get supported MIME type for audio recording
 * Tries webm first, then falls back to mp4 for Safari
 */
function getSupportedMimeType(): string {
  const types = ['audio/webm', 'audio/webm;codecs=opus', 'audio/mp4', 'audio/ogg']
  for (const type of types) {
    if (MediaRecorder.isTypeSupported(type)) {
      return type
    }
  }
  return 'audio/webm' // Default fallback
}

/**
 * Hook for recording audio using the MediaRecorder API
 *
 * @example
 * ```tsx
 * const {
 *   isRecording,
 *   duration,
 *   audioBlob,
 *   error,
 *   startRecording,
 *   stopRecording,
 *   resetRecording,
 * } = useVoiceRecorder()
 *
 * return (
 *   <div>
 *     {isRecording ? (
 *       <button onClick={stopRecording}>Stop ({duration}s)</button>
 *     ) : (
 *       <button onClick={startRecording}>Record</button>
 *     )}
 *     {error && <p>{error}</p>}
 *     {audioBlob && <audio src={URL.createObjectURL(audioBlob)} controls />}
 *   </div>
 * )
 * ```
 */
export function useVoiceRecorder(): UseVoiceRecorderReturn {
  // State
  const [isRecording, setIsRecording] = useState(false)
  const [duration, setDuration] = useState(0)
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Refs for MediaRecorder and timer
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const timerRef = useRef<number | null>(null)
  const streamRef = useRef<MediaStream | null>(null)

  const startRecording = useCallback(async () => {
    // Check browser support
    if (!navigator.mediaDevices?.getUserMedia) {
      setError('Audio recording is not supported in this browser')
      return
    }

    // Reset previous state
    setError(null)
    setAudioBlob(null)
    setDuration(0)
    audioChunksRef.current = []

    try {
      // Request microphone permission
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      streamRef.current = stream

      // Get supported MIME type
      const mimeType = getSupportedMimeType()

      // Create MediaRecorder
      const mediaRecorder = new MediaRecorder(stream, { mimeType })
      mediaRecorderRef.current = mediaRecorder

      // Collect audio data
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data)
        }
      }

      // Create blob when recording stops
      mediaRecorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: mimeType })
        setAudioBlob(blob)
        setIsRecording(false)

        // Stop timer
        if (timerRef.current !== null) {
          clearInterval(timerRef.current)
          timerRef.current = null
        }

        // Release microphone
        if (streamRef.current) {
          streamRef.current.getTracks().forEach((track) => track.stop())
          streamRef.current = null
        }
      }

      // Handle errors during recording
      mediaRecorder.onerror = () => {
        setError('Recording failed')
        setIsRecording(false)
        if (timerRef.current !== null) {
          clearInterval(timerRef.current)
          timerRef.current = null
        }
      }

      // Start recording
      mediaRecorder.start()
      setIsRecording(true)

      // Start duration timer
      timerRef.current = window.setInterval(() => {
        setDuration((d) => d + 1)
      }, 1000)
    } catch (err) {
      // Handle specific error types
      if (err instanceof Error) {
        if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
          setError('Microphone permission denied')
        } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
          setError('No microphone found')
        } else if (err.name === 'NotSupportedError') {
          setError('Audio recording is not supported')
        } else if (err.name === 'NotReadableError') {
          setError('Microphone is already in use')
        } else {
          setError('Failed to start recording')
        }
      } else {
        setError('Failed to start recording')
      }
    }
  }, [])

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop()
    }
  }, [])

  const resetRecording = useCallback(() => {
    // Stop any ongoing recording
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop()
    }

    // Clear timer
    if (timerRef.current !== null) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }

    // Release microphone
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
      streamRef.current = null
    }

    // Reset state
    setIsRecording(false)
    setDuration(0)
    setAudioBlob(null)
    setError(null)
    audioChunksRef.current = []
    mediaRecorderRef.current = null
  }, [])

  return {
    isRecording,
    duration,
    audioBlob,
    error,
    startRecording,
    stopRecording,
    resetRecording,
  }
}
