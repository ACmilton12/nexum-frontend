import React from 'react'
import Modal from './Modal'
import { AlertTriangle } from 'lucide-react'

interface ConfirmDeleteModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title?: string
  projectName?: string
  loading?: boolean
}

const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Eliminar proyecto',
  projectName,
  loading = false
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="max-w-[450px]">
      <div className="flex flex-col items-center text-center mx-auto">
        {/* Icon with light red background */}
        <div className="w-16 h-16 bg-red-50 dark:bg-red-900/10 rounded-full flex items-center justify-center mb-6">
          <div className="w-12 h-12 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
            <AlertTriangle className="text-[#c8102e]" size={24} />
          </div>
        </div>

        {/* Title */}
        <h2 className="text-[20px] font-bold text-[#1a1a2e] dark:text-white mb-3">
          {title}
        </h2>

        {/* Description */}
        <p className="text-[14px] text-[#5b6472] dark:text-gray-400 leading-relaxed mb-8">
          ¿Estás seguro de que deseas eliminar el proyecto <span className="font-bold text-[#1a1a2e] dark:text-white">"{projectName}"</span>?
          Esta acción no se puede deshacer y eliminará permanentemente todos los datos asociados al mismo.
        </p>

        {/* Buttons */}
        <div className="flex flex-col-reverse sm:flex-row gap-3 w-full">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-2.5 text-[14px] font-bold text-[#1a1a2e] dark:text-gray-200 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className={`flex-1 px-6 py-2.5 text-[14px] font-bold text-white bg-[#c8102e] rounded-xl hover:brightness-110 transition-all shadow-sm ${loading ? 'opacity-70 cursor-not-allowed' : ''
              }`}
          >
            {loading ? 'Eliminando...' : 'Sí, eliminar proyecto'}
          </button>
        </div>
      </div>
    </Modal >
  )
}

export default ConfirmDeleteModal
