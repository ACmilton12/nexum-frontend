import React, { useState, useCallback } from 'react'
import Cropper, { type Area, type Point } from 'react-easy-crop'
import Modal from './Modal'
import { Loader2 } from 'lucide-react'

// Helper para extraer la parte recortada de la imagen original usando Canvas
// Se quita el export para que Fast Refresh funcione correctamente en este archivo
const getCroppedImg = async (imageSrc: string, pixelCrop: Area): Promise<Blob> => {
  const image = await new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image()
    img.addEventListener('load', () => resolve(img))
    img.addEventListener('error', (err) => reject(err))
    img.src = imageSrc
  })

  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')

  if (!ctx) {
    throw new Error('No 2d context')
  }

  canvas.width = pixelCrop.width
  canvas.height = pixelCrop.height

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  )

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error('Canvas is empty'))
        return
      }
      resolve(blob)
    }, 'image/jpeg') // Formato temporal, luego se comprime a WebP en PersonalData
  })
}

interface ImageCropperModalProps {
  isOpen: boolean
  onClose: () => void
  imageSrc: string
  onCropComplete: (croppedBlob: Blob) => void
}

const ImageCropperModal: React.FC<ImageCropperModalProps> = ({
  isOpen,
  onClose,
  imageSrc,
  onCropComplete
}) => {
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  const onCropChange = (crop: Point) => setCrop(crop)
  const onZoomChange = (zoom: number) => setZoom(zoom)
  const onCropCompleteHandler = useCallback((_croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels)
  }, [])

  const handleSave = async () => {
    if (!croppedAreaPixels) return
    try {
      setIsProcessing(true)
      const croppedBlob = await getCroppedImg(imageSrc, croppedAreaPixels)
      onCropComplete(croppedBlob)
    } catch (e) {
      console.error(e)
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Recortar foto de perfil">
      <div className="relative w-full h-[300px] sm:h-[400px] bg-gray-900 rounded-lg overflow-hidden mt-4">
        <Cropper
          image={imageSrc}
          crop={crop}
          zoom={zoom}
          aspect={1}
          cropShape="round"
          showGrid={false}
          onCropChange={onCropChange}
          onCropComplete={onCropCompleteHandler}
          onZoomChange={onZoomChange}
        />
      </div>

      <div className="mt-6 flex flex-col gap-2">
        <label className="text-sm font-medium text-gray-700">Ajustar Zoom</label>
        <input
          type="range"
          value={zoom}
          min={1}
          max={3}
          step={0.1}
          aria-labelledby="Zoom"
          onChange={(e) => setZoom(Number(e.target.value))}
          className="w-full accent-[#003087]"
        />
      </div>

      <div className="mt-6 flex justify-end gap-3">
        <button
          onClick={onClose}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          disabled={isProcessing}
        >
          Cancelar
        </button>
        <button
          onClick={handleSave}
          disabled={isProcessing}
          className="flex items-center gap-2 px-6 py-2 text-sm font-bold text-white bg-[#003087] rounded-lg hover:brightness-110 transition-colors shadow-sm disabled:opacity-70"
        >
          {isProcessing && <Loader2 size={16} className="animate-spin" />}
          Aplicar recorte
        </button>
      </div>
    </Modal>
  )
}

export default ImageCropperModal
