import React, { useEffect } from 'react'
import { createPortal } from 'react-dom'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
  title?: string
  positioning?: 'center' | 'top-right' | 'right'
  maxWidth?: string
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  children,
  title,
  positioning = 'center',
  maxWidth = 'max-w-[550px]'
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  if (!isOpen) return null

  let overlayClasses =
    'fixed inset-0 bg-[#001a5e8c] backdrop-blur-sm z-[1000] flex transition-opacity duration-300 '
  let containerClasses =
    'bg-white dark:bg-slate-900 relative text-left shadow-[0_16px_40px_rgba(0,26,94,0.18)] dark:shadow-none dark:border dark:border-slate-800 transition-colors duration-300 '

  if (positioning === 'top-right') {
    overlayClasses += 'justify-end items-start'
    containerClasses += 'mt-[60px] mr-5 p-5 rounded-xl w-[250px]'
  } else if (positioning === 'right') {
    overlayClasses += 'justify-end items-stretch'
    containerClasses += 'rounded-l-2xl p-6 sm:p-10 w-full max-w-[520px] h-full overflow-y-auto'
  } else {
    overlayClasses += 'justify-center items-center p-4 sm:p-6'
    containerClasses += `rounded-2xl p-5 sm:p-8 w-full ${maxWidth} max-h-[90vh] overflow-y-auto`
  }

  const modalContent = (
    <div className={overlayClasses} onClick={onClose}>
      <div className={containerClasses} onClick={(e) => e.stopPropagation()}>
        <button
          onClick={onClose}
          className={`absolute ${positioning === 'right' ? 'top-6 right-6' : 'top-4 right-5'} text-gray-400 hover:text-[#C8102E] hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg w-8 h-8 flex items-center justify-center transition-all text-2xl leading-none`}
        >
          &times;
        </button>
        {title && (
          <h2 className="mb-2 text-[18px] sm:text-[20px] font-bold text-[#1a1a2e] dark:text-white leading-snug pr-8">
            {title}
          </h2>
        )}
        {children}
      </div>
    </div>
  )

  return typeof document !== 'undefined' ? createPortal(modalContent, document.body) : modalContent
}

export default Modal
