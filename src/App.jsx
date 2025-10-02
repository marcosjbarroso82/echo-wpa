import { useState, useRef } from 'react'
import './App.css'

function App() {
  const [isRecording, setIsRecording] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [audioBlob, setAudioBlob] = useState(null)
  const [audioUrl, setAudioUrl] = useState(null)
  const [recordingTime, setRecordingTime] = useState(0)
  
  const mediaRecorderRef = useRef(null)
  const audioRef = useRef(null)
  const timerRef = useRef(null)

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      
      const chunks = []
      
      mediaRecorder.ondataavailable = (event) => {
        chunks.push(event.data)
      }
      
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/wav' })
        setAudioBlob(blob)
        const url = URL.createObjectURL(blob)
        setAudioUrl(url)
        stream.getTracks().forEach(track => track.stop())
      }
      
      mediaRecorder.start()
      setIsRecording(true)
      setRecordingTime(0)
      
      // Timer para mostrar duración de grabación
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1)
      }, 1000)
      
    } catch (error) {
      console.error('Error accessing microphone:', error)
      alert('No se pudo acceder al micrófono. Por favor, permite el acceso.')
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
      clearInterval(timerRef.current)
    }
  }

  const playRecording = () => {
    if (audioUrl && audioRef.current) {
      audioRef.current.play()
      setIsPlaying(true)
    }
  }

  const pauseRecording = () => {
    if (audioRef.current) {
      audioRef.current.pause()
      setIsPlaying(false)
    }
  }

  const resetRecording = () => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
    }
    setIsPlaying(false)
    setAudioBlob(null)
    setAudioUrl(null)
    setRecordingTime(0)
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="app">
      <h1>🎤 Grabador de Audio</h1>
      
      <div className="recorder-container">
        <div className="status-section">
          <div className="recording-status">
            {isRecording ? (
              <div className="recording-indicator">
                <div className="pulse"></div>
                <span>Grabando... {formatTime(recordingTime)}</span>
              </div>
            ) : (
              <span>Listo para grabar</span>
            )}
          </div>
        </div>

        <div className="controls-section">
          {!isRecording ? (
            <button 
              className="record-btn"
              onClick={startRecording}
              disabled={isRecording}
            >
              🎤 Iniciar Grabación
            </button>
          ) : (
            <button 
              className="stop-btn"
              onClick={stopRecording}
            >
              ⏹️ Detener Grabación
            </button>
          )}
        </div>

        {audioUrl && (
          <div className="playback-section">
            <h3>Reproducir Grabación</h3>
            <div className="playback-controls">
              {!isPlaying ? (
                <button 
                  className="play-btn"
                  onClick={playRecording}
                >
                  ▶️ Reproducir
                </button>
              ) : (
                <button 
                  className="pause-btn"
                  onClick={pauseRecording}
                >
                  ⏸️ Pausar
                </button>
              )}
              
              <button 
                className="reset-btn"
                onClick={resetRecording}
              >
                🔄 Nueva Grabación
              </button>
            </div>
            
            <audio 
              ref={audioRef}
              src={audioUrl}
              onEnded={() => setIsPlaying(false)}
              controls
              className="audio-player"
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default App
