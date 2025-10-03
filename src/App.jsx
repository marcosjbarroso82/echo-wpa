import { useState, useRef, useEffect } from 'react'
import { useRegisterSW } from 'virtual:pwa-register/react'
import { useBluetoothHeadphone } from './hooks/useBluetoothHeadphone'
import BluetoothMessage from './components/BluetoothMessage'
import './App.css'

function App() {
  const [isRecording, setIsRecording] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [audioBlob, setAudioBlob] = useState(null)
  const [audioUrl, setAudioUrl] = useState(null)
  const [recordingTime, setRecordingTime] = useState(0)
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [showInstallPrompt, setShowInstallPrompt] = useState(false)
  const [isLoopEnabled, setIsLoopEnabled] = useState(false)
  
  const mediaRecorderRef = useRef(null)
  const audioRef = useRef(null)
  const timerRef = useRef(null)

  // Hook para manejar eventos del auricular Bluetooth
  const { lastEventTime, isSupported, simulateEvent, debugInfo, clearDebugInfo } = useBluetoothHeadphone()

  // PWA Service Worker registration
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r) {
      console.log('SW Registered: ' + r)
    },
    onRegisterError(error) {
      console.log('SW registration error', error)
    },
  })

  // PWA Install prompt
  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setShowInstallPrompt(true)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    }
  }, [])

  // Handle audio ended event for loop control
  useEffect(() => {
    const audio = audioRef.current
    if (audio) {
      const handleEnded = () => {
        if (!isLoopEnabled) {
          setIsPlaying(false)
        }
      }
      
      audio.addEventListener('ended', handleEnded)
      
      return () => {
        audio.removeEventListener('ended', handleEnded)
      }
    }
  }, [isLoopEnabled])

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice
      console.log(`User response to the install prompt: ${outcome}`)
      setDeferredPrompt(null)
      setShowInstallPrompt(false)
    }
  }

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
      audioRef.current.loop = isLoopEnabled
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
      {/* Mensaje del auricular Bluetooth */}
      <BluetoothMessage lastEventTime={lastEventTime} isSupported={isSupported} />
      
      <h1>🎤 Grabador de Audio</h1>
      
      {/* PWA Install Prompt */}
      {showInstallPrompt && (
        <div className="install-prompt">
          <div className="install-content">
            <span>📱 Instala Echo WPA en tu dispositivo</span>
            <div className="install-buttons">
              <button className="install-btn" onClick={handleInstallClick}>
                Instalar
              </button>
              <button 
                className="dismiss-btn" 
                onClick={() => setShowInstallPrompt(false)}
              >
                ✕
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PWA Update Available */}
      {needRefresh && (
        <div className="update-prompt">
          <div className="update-content">
            <span>🔄 Nueva versión disponible</span>
            <button className="update-btn" onClick={() => updateServiceWorker(true)}>
              Actualizar
            </button>
          </div>
        </div>
      )}
      
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

        {/* Botón de prueba para auricular Bluetooth */}
        <div className="bluetooth-test-section">
          <button 
            className="test-btn"
            onClick={simulateEvent}
            title="Simular botón del auricular Bluetooth (para pruebas en navegador)"
          >
            🎧 Probar Botón del Auricular
          </button>
          <div className="test-info">
            <small>
              {isSupported 
                ? "✅ Soporte para auricular Bluetooth activado" 
                : "⚠️ Soporte limitado - usa el botón de prueba"
              }
            </small>
            <div className="debug-info">
              <small>
                💡 Usa el control remoto de media o auriculares Bluetooth para probar
              </small>
            </div>
          </div>
        </div>

        {/* Panel de Debug */}
        <div className="debug-panel">
          <div className="debug-header">
            <h4>🔍 Panel de Debug</h4>
            <button 
              className="clear-debug-btn"
              onClick={clearDebugInfo}
              title="Limpiar log de debug"
            >
              🧹 Limpiar
            </button>
          </div>
          <div className="debug-log">
            {debugInfo.length === 0 ? (
              <small>Esperando eventos multimedia... Usa el control remoto de media o auriculares Bluetooth.</small>
            ) : (
              debugInfo.map((info, index) => (
                <div key={index} className="debug-entry">
                  <small>{info}</small>
                </div>
              ))
            )}
          </div>
        </div>

        {audioUrl && (
          <div className="playback-section">
            <h3>Reproducir Grabación</h3>
            
            {/* Loop Toggle */}
            <div className="loop-control">
              <label className="loop-toggle">
                <input
                  type="checkbox"
                  checked={isLoopEnabled}
                  onChange={(e) => setIsLoopEnabled(e.target.checked)}
                />
                <span className="toggle-slider"></span>
                <span className="toggle-label">
                  🔁 Reproducción en loop
                </span>
              </label>
            </div>
            
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
