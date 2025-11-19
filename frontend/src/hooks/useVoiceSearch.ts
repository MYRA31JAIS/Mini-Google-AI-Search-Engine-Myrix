import { useState, useCallback } from 'react'

export function useVoiceSearch() {
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState('')

  const startListening = useCallback((onResult: (text: string) => void) => {
    if (!('webkitSpeechRecognition' in window)) {
      alert('Voice search not supported in this browser')
      return
    }

    const recognition = new (window as any).webkitSpeechRecognition()
    recognition.continuous = false
    recognition.interimResults = true

    recognition.onstart = () => setIsListening(true)
    recognition.onend = () => setIsListening(false)

    recognition.onresult = (event: any) => {
      const text = event.results[0][0].transcript
      setTranscript(text)
      if (event.results[0].isFinal) {
        onResult(text)
      }
    }

    recognition.start()
  }, [])

  return { isListening, startListening, transcript }
}
