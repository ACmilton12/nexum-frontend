import React, { useEffect } from 'react'
import { CheckCircle, AlertCircle, X } from 'lucide-react'

interface ToastProps {
  message: string
  type: 'success' | 'info' | 'error'
  onClose: () => void
  duration?: number
}

const Toast: React.FC<ToastProps> = ({ message, type, onClose, duration = 3000 }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose()
    }, duration)

    return () => clearTimeout(timer)
  }, [onClose, duration])

  const config = {
    success: {
      bgColor: 'bg-[#E6F4EA]',
      textColor: 'text-[#2E7D32]',
      icon: <CheckCircle size={20} className="text-[#2E7D32]" />,
      title: '¡Éxito!'
    },
    info: {
      bgColor: 'bg-primary/5',
      textColor: 'text-primary',
      icon: <AlertCircle size={20} className="text-primary" />,
      title: 'Aviso'
    },
    error: {
      bgColor: 'bg-red-50',
      textColor: 'text-[#c8102e]',
      icon: <AlertCircle size={20} className="text-[#c8102e]" />,
      title: 'Error'
    }
  }

  const { bgColor, textColor, icon, title } = config[type]

  return (
    <div className={`fixed top-4 right-4 left-4 sm:left-auto sm:top-6 sm:right-6 z-[2000] animate-in slide-in-from-right duration-300`}>
      <div
        className={`${bgColor} ${textColor} shadow-lg border-l-4 border-current rounded-lg p-3 sm:p-4 flex items-start gap-3 w-full sm:w-auto sm:min-w-[320px] sm:max-w-[420px]`}
        style={{ boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}
      >
        <div className="mt-0.5">{icon}</div>
        <div className="flex-1">
          <p className="font-bold text-sm leading-none mb-1">{title}</p>
          <p className="text-xs opacity-90">{message}</p>
        </div>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
          <X size={16} />
        </button>
      </div>
    </div>
  )
}

export default Toast
