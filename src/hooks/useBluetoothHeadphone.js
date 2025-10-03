import { useState, useEffect, useCallback } from 'react'

export const useBluetoothHeadphone = () => {
  const [lastEventTime, setLastEventTime] = useState(null)
  const [isSupported, setIsSupported] = useState(false)
  const [debugInfo, setDebugInfo] = useState([])
  const [lastEventTimestamp, setLastEventTimestamp] = useState(0)

  // Función para generar beep grave y largo de 2 segundos
  const playBeep = useCallback(() => {
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)()
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()

      // Configurar oscilador para sonido grave
      oscillator.type = 'sine'
      oscillator.frequency.setValueAtTime(200, audioContext.currentTime) // Frecuencia grave (200Hz)

      // Configurar volumen
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 2)

      // Conectar nodos
      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)

      // Reproducir por 2 segundos
      oscillator.start(audioContext.currentTime)
      oscillator.stop(audioContext.currentTime + 2)

      // Limpiar contexto después de 3 segundos
      setTimeout(() => {
        audioContext.close()
      }, 3000)
    } catch (error) {
      console.error('Error playing beep:', error)
    }
  }, [])

  // Función para obtener timestamp actual
  const getCurrentTimestamp = useCallback(() => {
    const now = new Date()
    const minutes = now.getMinutes().toString().padStart(2, '0')
    const seconds = now.getSeconds().toString().padStart(2, '0')
    return `${minutes}:${seconds}`
  }, [])

  // Función para agregar información de debug
  const addDebugInfo = useCallback((message) => {
    const timestamp = getCurrentTimestamp()
    const debugMessage = `[${timestamp}] ${message}`
    console.log(debugMessage)
    setDebugInfo(prev => [...prev.slice(-9), debugMessage]) // Mantener solo los últimos 10 mensajes
  }, [getCurrentTimestamp])

  // Función para manejar eventos del auricular con debounce
  const handleHeadphoneEvent = useCallback((source = 'unknown') => {
    const now = Date.now()
    
    // Debounce: evitar eventos duplicados en menos de 500ms
    if (now - lastEventTimestamp < 500) {
      addDebugInfo(`⏭️ Evento duplicado ignorado desde: ${source}`)
      return
    }
    
    setLastEventTimestamp(now)
    const timestamp = getCurrentTimestamp()
    setLastEventTime(timestamp)
    playBeep()
    addDebugInfo(`🎧 Botón del auricular detectado desde: ${source}`)
  }, [getCurrentTimestamp, playBeep, addDebugInfo, lastEventTimestamp])

  // Función para simular evento (para botón de prueba)
  const simulateEvent = useCallback(() => {
    handleHeadphoneEvent('botón de prueba')
  }, [handleHeadphoneEvent])

  // Función para limpiar el log de debug
  const clearDebugInfo = useCallback(() => {
    setDebugInfo([])
    addDebugInfo('🧹 Log de debug limpiado')
  }, [addDebugInfo])

  useEffect(() => {
    addDebugInfo('🚀 Iniciando configuración de detección de auricular')
    
    // Registrar service worker personalizado para mejor manejo en segundo plano
    if ('serviceWorker' in navigator) {
      // Usar ruta relativa para GitHub Pages
      const swPath = './sw-custom.js'
      navigator.serviceWorker.register(swPath)
        .then((registration) => {
          addDebugInfo('✅ Service Worker registrado correctamente')
        })
        .catch((error) => {
          addDebugInfo(`❌ Error registrando Service Worker: ${error.message}`)
          // Intentar con la ruta absoluta como fallback
          navigator.serviceWorker.register('/echo-wpa/sw-custom.js')
            .then((registration) => {
              addDebugInfo('✅ Service Worker registrado con ruta absoluta')
            })
            .catch((fallbackError) => {
              addDebugInfo(`❌ Error con ruta absoluta también: ${fallbackError.message}`)
            })
        })
    } else {
      addDebugInfo('⚠️ Service Worker no soportado')
    }

    // Verificar soporte para Media Session API
    if ('mediaSession' in navigator) {
      setIsSupported(true)
      addDebugInfo('✅ Media Session API disponible')

      // Configurar Media Session para capturar eventos de teclas multimedia
      try {
        navigator.mediaSession.setActionHandler('play', () => handleHeadphoneEvent('Media Session - play'))
        navigator.mediaSession.setActionHandler('pause', () => handleHeadphoneEvent('Media Session - pause'))
        navigator.mediaSession.setActionHandler('stop', () => handleHeadphoneEvent('Media Session - stop'))
        navigator.mediaSession.setActionHandler('seekbackward', () => handleHeadphoneEvent('Media Session - seekbackward'))
        navigator.mediaSession.setActionHandler('seekforward', () => handleHeadphoneEvent('Media Session - seekforward'))
        navigator.mediaSession.setActionHandler('previoustrack', () => handleHeadphoneEvent('Media Session - previoustrack'))
        navigator.mediaSession.setActionHandler('nexttrack', () => handleHeadphoneEvent('Media Session - nexttrack'))
        addDebugInfo('✅ Media Session handlers configurados')
      } catch (error) {
        addDebugInfo(`❌ Error configurando Media Session: ${error.message}`)
      }

      // Capturar eventos de teclado optimizado
      const handleKeyDown = (event) => {
        // Solo registrar eventos multimedia relevantes
        const mediaKeys = ['MediaPlayPause', 'MediaPlay', 'MediaPause', 'MediaStop', 'MediaNextTrack', 'MediaPreviousTrack']
        const mediaKeyCodes = [179, 177, 176, 178, 175, 174] // Códigos comunes de teclas multimedia
        
        // Verificar si es un evento multimedia
        if (mediaKeys.includes(event.code) || mediaKeyCodes.includes(event.keyCode)) {
          event.preventDefault()
          addDebugInfo(`🎯 Evento multimedia detectado: ${event.code} (keyCode: ${event.keyCode})`)
          handleHeadphoneEvent(`keydown - ${event.code}`)
        }
      }

      // Escuchar solo eventos de teclado multimedia
      document.addEventListener('keydown', handleKeyDown)
      window.addEventListener('keydown', handleKeyDown)

      // Manejar eventos cuando la app está en segundo plano
      const handleVisibilityChange = () => {
        if (document.hidden) {
          addDebugInfo('📱 App en segundo plano - eventos del auricular siguen activos')
        } else {
          addDebugInfo('📱 App en primer plano')
        }
      }

      document.addEventListener('visibilitychange', handleVisibilityChange)
      addDebugInfo('✅ Event listeners configurados - capturando eventos multimedia')

      // Limpiar listeners
      return () => {
        document.removeEventListener('keydown', handleKeyDown)
        window.removeEventListener('keydown', handleKeyDown)
        document.removeEventListener('visibilitychange', handleVisibilityChange)
        
        // Limpiar Media Session handlers
        try {
          navigator.mediaSession.setActionHandler('play', null)
          navigator.mediaSession.setActionHandler('pause', null)
          navigator.mediaSession.setActionHandler('stop', null)
          navigator.mediaSession.setActionHandler('seekbackward', null)
          navigator.mediaSession.setActionHandler('seekforward', null)
          navigator.mediaSession.setActionHandler('previoustrack', null)
          navigator.mediaSession.setActionHandler('nexttrack', null)
        } catch (error) {
          console.log('Error clearing media session handlers:', error)
        }
      }
    } else {
      setIsSupported(false)
      addDebugInfo('❌ Media Session API no soportada en este navegador')
    }
  }, [handleHeadphoneEvent, addDebugInfo])

  return {
    lastEventTime,
    isSupported,
    simulateEvent,
    debugInfo,
    clearDebugInfo
  }
}
