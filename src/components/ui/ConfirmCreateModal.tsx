import React from 'react';
import Modal from './Modal';
import { PlusCircle } from 'lucide-react';

interface ConfirmCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
}

const ConfirmCreateModal: React.FC<ConfirmCreateModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Nuevo proyecto",
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="max-w-[450px]">
      <div className="flex flex-col items-center text-center mx-auto">
        {/* Icon with light red background */}
        <div className="w-16 h-16 bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-6">
          <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
            <PlusCircle className="text-[#c8102e]" size={24} />
          </div>
        </div>

        {/* Title */}
        <h2 className="text-[20px] font-bold text-[#1a1a2e] dark:text-white mb-3">
          {title}
        </h2>

        {/* Description */}
        <p className="text-[14px] text-[#5b6472] dark:text-gray-400 leading-relaxed mb-8">
          ¿Deseas registrar un nuevo proyecto en tu portafolio? 
          Esto abrirá el formulario para que puedas completar los detalles técnicos y subir evidencias.
        </p>

        {/* Buttons */}
        <div className="flex gap-3 w-full">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-2.5 text-[14px] font-bold text-[#1a1a2e] dark:text-gray-300 bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-6 py-2.5 text-[14px] font-bold text-white bg-[#c8102e] rounded-xl hover:brightness-110 transition-all shadow-sm"
          >
            Sí, crear proyecto
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmCreateModal;
