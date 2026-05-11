import React from 'react'
import Modal from './Modal'
import { Edit3 } from 'lucide-react'

interface ConfirmEditModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title?: string
  projectName?: string
}

const ConfirmEditModal: React.FC<ConfirmEditModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Editar proyecto',
  projectName
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="max-w-[450px]">
      <div className="flex flex-col items-center text-center mx-auto">
        {/* Icon with light red background */}
        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-6">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
            <Edit3 className="text-[#c8102e]" size={24} />
          </div>
        </div>

        {/* Title */}
        <h2 className="text-[20px] font-bold text-[#1a1a2e] mb-3">{title}</h2>

        {/* Description */}
        <p className="text-[14px] text-[#5b6472] leading-relaxed mb-8">
          ¿Estás seguro de que deseas editar el proyecto{' '}
          <span className="font-bold text-[#1a1a2e]">"{projectName}"</span>? Esto abrirá el
          formulario de edición para que puedas modificar sus detalles.
        </p>

        {/* Buttons */}
        <div className="flex gap-3 w-full">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-2.5 text-[14px] font-bold text-[#1a1a2e] bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-6 py-2.5 text-[14px] font-bold text-white bg-[#c8102e] rounded-xl hover:brightness-110 transition-all shadow-sm"
          >
            Sí, editar proyecto
          </button>
        </div>
      </div>
    </Modal>
  )
}

export default ConfirmEditModal
