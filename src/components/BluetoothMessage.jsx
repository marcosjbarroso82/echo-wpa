import './BluetoothMessage.css'

const BluetoothMessage = ({ lastEventTime, isSupported }) => {
  if (!lastEventTime) return null

  return (
    <div className="bluetooth-message">
      <div className="bluetooth-content">
        <span className="bluetooth-icon">🎧</span>
        <span className="bluetooth-text">
          Botón del auricular presionado a las {lastEventTime}
        </span>
      </div>
    </div>
  )
}

export default BluetoothMessage
