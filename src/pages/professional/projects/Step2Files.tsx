import { useState, useRef, useCallback, useEffect } from 'react'
import {
  Upload,
  FileImage,
  FileText,
  Trash2,
  AlertCircle,
  CheckCircle,
  Loader2,
  HardDrive,
  ChevronLeft,
  Check,
  Eye,
  X
} from 'lucide-react'
import { uploadProjectFiles, deleteProjectFile } from '../../../services/File.service'

// ─── Constants ────────────────────────────────────────────────────────────────

const MAX_STORAGE_MB = 700
const MAX_FILES = 10
const MAX_IMAGE_MB = 2
const MAX_PDF_MB = 16

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf']
const ALLOWED_LABEL = 'JPG, PNG, WEBP, PDF'

function toMB(bytes: number) {
  return bytes / (1024 * 1024)
}
function formatMB(bytes: number) {
  return toMB(bytes).toFixed(1)
}

function getFileIcon(mimeType: string) {
  if (mimeType === 'application/pdf') return <FileText size={18} className="text-[#C8102E]" />
  return <FileImage size={18} className="text-[#003087]" />
}

// ─── Types ────────────────────────────────────────────────────────────────────

type FileStatus = 'uploading' | 'success' | 'error'

export interface UploadedFile {
  id: string
  backendId?: number
  file?: File
  name: string
  size: number
  mimeType: string
  status: FileStatus
  progress: number
  errorMessage?: string
  url?: string
}

interface Step2FilesProps {
  projectId: number
  uploadedFiles: UploadedFile[]
  onFilesChange: (files: UploadedFile[]) => void
  onBack: () => void
  onSave: () => void
  showFormatError: boolean
  onShowFormatError: () => void
  onFormatErrorClose: () => void
  showConfirmNoFiles: boolean
  onConfirmNoFilesConfirm: () => void
  onConfirmNoFilesCancel: () => void
  onToast: (msg: string, type: 'success' | 'error' | 'info') => void
}

// ─── Sub-components ───────────────────────────────────────────────────────────

const StorageIndicator = ({ usedBytes }: { usedBytes: number }) => {
  const usedMB = toMB(usedBytes)
  const pct = Math.min((usedMB / MAX_STORAGE_MB) * 100, 100)
  const isWarn = pct >= 80
  const isFull = pct >= 100
  const color = isFull ? 'text-[#C8102E]' : isWarn ? 'text-amber-500' : 'text-[#5b6472]'
  const barColor = isFull ? 'bg-[#C8102E]' : isWarn ? 'bg-amber-500' : 'bg-[#003087]'

  return (
    <div className="flex flex-col gap-1.5 px-3 py-2.5 bg-[#f4f7fb] rounded-lg border border-gray-100">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <HardDrive
            size={13}
            className={isFull ? 'text-[#C8102E]' : isWarn ? 'text-amber-500' : 'text-[#003087]'}
          />
          <span className="text-[12px] font-bold text-[#1a1a2e]">Uso de almacenamiento</span>
        </div>
        <span className={`text-[11px] font-semibold ${color}`}>
          {formatMB(usedBytes)} MB / {MAX_STORAGE_MB} MB
        </span>
      </div>
      <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${barColor}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}

const FileItem = ({
  file,
  onRemove,
  onPreview,
  isRemoving
}: {
  file: UploadedFile
  onRemove: (f: UploadedFile) => void
  onPreview: (f: UploadedFile) => void
  isRemoving: boolean
}) => (
  <div className="flex items-center gap-3 px-3 py-2.5 bg-white border border-gray-100 rounded-lg hover:border-gray-200 transition-all group">
    <div className="flex-shrink-0">{getFileIcon(file.mimeType)}</div>
    <div className="flex-1 min-w-0">
      <div className="flex items-center justify-between gap-2 mb-1">
        <p className="text-[12px] font-semibold text-[#1a1a2e] truncate">{file.name}</p>
        <span className="text-[10px] text-[#5b6472] flex-shrink-0">
          {file.size === 0 ? '? MB' : `${formatMB(file.size)} MB`}
        </span>
      </div>
      {file.status === 'uploading' && (
        <div className="w-full h-1 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-[#003087] rounded-full transition-all duration-300"
            style={{ width: `${file.progress}%` }}
          />
        </div>
      )}
      {file.status === 'success' && (
        <div className="flex items-center gap-1">
          <CheckCircle size={11} className="text-emerald-500" />
          <span className="text-[11px] text-emerald-600 font-medium">Subido correctamente</span>
        </div>
      )}
      {file.status === 'error' && (
        <div className="flex items-center gap-1">
          <AlertCircle size={11} className="text-[#C8102E]" />
          <span className="text-[11px] text-[#C8102E] font-medium">{file.errorMessage}</span>
        </div>
      )}
    </div>
    <div className="flex items-center gap-2 flex-shrink-0">
      {file.status === 'uploading' && (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#eef3f8] text-[#003087] text-[10px] font-bold">
          <Loader2 size={10} className="animate-spin" /> Uploading
        </span>
      )}
      {file.status === 'success' && (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-50 text-emerald-600 text-[10px] font-bold">
          <Check size={10} /> Success
        </span>
      )}
      {file.status === 'error' && (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-red-50 text-[#C8102E] text-[10px] font-bold">
          <AlertCircle size={10} /> Error
        </span>
      )}
      {file.status === 'success' && (
        <button
          type="button"
          onClick={() => onPreview(file)}
          title="Ver archivo"
          className="flex items-center justify-center w-7 h-7 rounded-md bg-[#eef3f8] text-[#003087] hover:bg-[#d8e4f2] transition-all shadow-sm"
        >
          <Eye size={14} />
        </button>
      )}
      {file.status !== 'uploading' && (
        <button
          type="button"
          disabled={isRemoving}
          onClick={() => onRemove(file)}
          title="Eliminar archivo"
          className="flex items-center justify-center w-7 h-7 rounded-md bg-red-50 text-[#C8102E] hover:bg-red-100 transition-all shadow-sm disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isRemoving ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
        </button>
      )}
    </div>
  </div>
)

const FormatErrorModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  if (!isOpen) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-2xl p-6 w-full max-w-[340px] mx-4 flex flex-col items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center">
          <AlertCircle size={24} className="text-[#C8102E]" />
        </div>
        <div className="text-center">
          <h3 className="text-[15px] font-bold text-[#1a1a2e] mb-1">Formato no permitido</h3>
          <p className="text-[13px] text-[#5b6472] leading-relaxed">
            Solo se aceptan archivos{' '}
            <span className="font-semibold text-[#1a1a2e]">{ALLOWED_LABEL}</span>.
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="w-full h-10 bg-[#003087] text-white text-[13px] font-bold rounded-lg hover:brightness-110 transition-all"
        >
          Entendido
        </button>
      </div>
    </div>
  )
}

const ConfirmNoFilesModal = ({
  isOpen,
  onConfirm,
  onCancel
}: {
  isOpen: boolean
  onConfirm: () => void
  onCancel: () => void
}) => {
  if (!isOpen) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative bg-white rounded-xl shadow-2xl p-6 w-full max-w-[360px] mx-4 flex flex-col items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center">
          <AlertCircle size={24} className="text-amber-500" />
        </div>
        <div className="text-center">
          <h3 className="text-[15px] font-bold text-[#1a1a2e] mb-1">¿Guardar sin archivos?</h3>
          <p className="text-[13px] text-[#5b6472] leading-relaxed">
            No has subido ninguna imagen o documento. ¿Estás seguro de que deseas guardar sin
            archivos adjuntos?
          </p>
        </div>
        <div className="flex gap-3 w-full">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 h-10 bg-white border border-gray-200 text-[#1a1a2e] text-[13px] font-bold rounded-lg hover:bg-gray-50 transition-all"
          >
            No, agregar archivos
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="flex-1 h-10 bg-[#003087] text-white text-[13px] font-bold rounded-lg hover:brightness-110 transition-all"
          >
            Sí, guardar
          </button>
        </div>
      </div>
    </div>
  )
}

const FilePreviewModal = ({
  file,
  onClose
}: {
  file: UploadedFile | null
  onClose: () => void
}) => {
  const [blobUrl, setBlobUrl] = useState<string>('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!file) return

    if (file.file) {
      // Local file
      setBlobUrl(URL.createObjectURL(file.file))
      setIsLoading(false)
    } else if (file.url) {
      // Backend file: Fetch as blob to strip 'Content-Disposition: attachment' headers
      setIsLoading(true)
      fetch(file.url, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token') || sessionStorage.getItem('token')}`
        }
      })
        .then((res) => res.blob())
        .then((blob) => {
          const realBlob = new Blob([blob], { type: file.mimeType || blob.type })
          setBlobUrl(URL.createObjectURL(realBlob))
        })
        .catch((err) => {
          console.error('Error loading preview', err)
          // Fallback
          setBlobUrl(file.url!)
        })
        .finally(() => {
          setIsLoading(false)
        })
    }

    return () => {
      // Cleanup
      if (blobUrl && blobUrl.startsWith('blob:')) {
        URL.revokeObjectURL(blobUrl)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [file])

  if (!file) return null

  const isPdf = file.mimeType === 'application/pdf'

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-2xl flex flex-col w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
          <h3 className="text-[14px] font-bold text-[#1a1a2e] truncate pr-4">{file.name}</h3>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-[#C8102E] hover:bg-red-50 rounded-lg transition-colors"
          >
            <X size={18} />
          </button>
        </div>
        <div className="flex-1 overflow-auto bg-[#fafbfc] flex items-center justify-center p-4 min-h-[50vh]">
          {isLoading ? (
            <div className="flex flex-col items-center gap-3">
              <Loader2 size={32} className="animate-spin text-[#003087]" />
              <p className="text-[13px] font-bold text-[#5b6472]">Cargando vista previa...</p>
            </div>
          ) : isPdf ? (
            <iframe
              src={blobUrl}
              className="w-full h-[70vh] rounded border border-gray-200"
              title={file.name}
            />
          ) : (
            <img
              src={blobUrl}
              alt={file.name}
              className="max-w-full max-h-[70vh] object-contain rounded border border-gray-200"
            />
          )}
        </div>
      </div>
    </div>
  )
}

const ConfirmDeleteFileModal = ({
  file,
  onConfirm,
  onCancel
}: {
  file: UploadedFile | null
  onConfirm: () => void
  onCancel: () => void
}) => {
  if (!file) return null
  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative bg-white rounded-xl shadow-2xl p-6 w-full max-w-[360px] mx-4 flex flex-col items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center">
          <Trash2 size={24} className="text-[#C8102E]" />
        </div>
        <div className="text-center">
          <h3 className="text-[15px] font-bold text-[#1a1a2e] mb-1">¿Eliminar archivo?</h3>
          <p className="text-[13px] text-[#5b6472] leading-relaxed">
            Estás a punto de eliminar{' '}
            <span className="font-semibold text-[#1a1a2e]">{file.name}</span>. Esta acción es
            inmediata y no se puede deshacer.
          </p>
        </div>
        <div className="flex gap-3 w-full">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 h-10 bg-white border border-gray-200 text-[#1a1a2e] text-[13px] font-bold rounded-lg hover:bg-gray-50 transition-all"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="flex-1 h-10 bg-[#C8102E] text-white text-[13px] font-bold rounded-lg hover:brightness-110 transition-all"
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

const Step2Files = ({
  projectId,
  uploadedFiles,
  onFilesChange,
  onBack,
  onSave,
  showFormatError,
  onShowFormatError,
  onFormatErrorClose,
  showConfirmNoFiles,
  onConfirmNoFilesConfirm,
  onConfirmNoFilesCancel,
  onToast
}: Step2FilesProps) => {
  const [isDragOver, setIsDragOver] = useState(false)
  const [removingId, setRemovingId] = useState<string | null>(null)
  const [previewFile, setPreviewFile] = useState<UploadedFile | null>(null)
  const [fileToDelete, setFileToDelete] = useState<UploadedFile | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const filesRef = useRef<UploadedFile[]>(uploadedFiles)

  useEffect(() => {
    filesRef.current = uploadedFiles
  }, [uploadedFiles])

  // ── Derived ────────────────────────────────────────────────────────────────
  const usedBytes = uploadedFiles
    .filter((f) => f.status === 'success' && f.size > 0)
    .reduce((acc, f) => acc + f.size, 0)

  const storageFull = toMB(usedBytes) >= MAX_STORAGE_MB
  const maxFilesReached = uploadedFiles.filter((f) => f.status !== 'error').length >= MAX_FILES
  const hasUploading = uploadedFiles.some((f) => f.status === 'uploading')
  const dropZoneDisabled = storageFull || maxFilesReached
  const successFiles = uploadedFiles.filter((f) => f.status === 'success')

  // ── File handlers ──────────────────────────────────────────────────────────
  const enqueueFile = useCallback(
    (file: File) => {
      if (!ALLOWED_MIME_TYPES.includes(file.type)) {
        onShowFormatError()
        return
      }
      if (storageFull || maxFilesReached) return

      const sizeMB = toMB(file.size)
      let errorMessage: string | undefined

      if (file.type === 'application/pdf' && sizeMB > MAX_PDF_MB) {
        errorMessage = `Excede el límite de ${MAX_PDF_MB} MB para PDF`
      } else if (file.type !== 'application/pdf' && sizeMB > MAX_IMAGE_MB) {
        errorMessage = `Excede el límite de ${MAX_IMAGE_MB} MB para imágenes`
      }

      const localId = `${Date.now()}-${Math.random()}`
      const entry: UploadedFile = {
        id: localId,
        file,
        name: file.name,
        size: file.size,
        mimeType: file.type,
        status: errorMessage ? 'error' : 'uploading',
        progress: 0,
        errorMessage
      }

      onFilesChange([...filesRef.current, entry])

      // Upload immediately
      if (!errorMessage) {
        uploadProjectFiles(projectId, [file], (pct) =>
          onFilesChange(
            filesRef.current.map((f) => (f.id === localId ? { ...f, progress: pct } : f))
          )
        )
          .then((res) => {
            const saved = res.data[0]
            onFilesChange(
              filesRef.current.map((f) =>
                f.id === localId
                  ? { ...f, status: 'success', progress: 100, backendId: saved.id }
                  : f
              )
            )
          })
          .catch((err: Error) => {
            onFilesChange(
              filesRef.current.map((f) =>
                f.id === localId
                  ? {
                      ...f,
                      status: 'error',
                      progress: 0,
                      errorMessage: err.message || 'Error al subir'
                    }
                  : f
              )
            )
          })
      }
    },
    [projectId, onFilesChange, storageFull, maxFilesReached, onShowFormatError]
  )

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragOver(false)
      Array.from(e.dataTransfer.files).forEach(enqueueFile)
    },
    [enqueueFile]
  )

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      Array.from(e.target.files).forEach(enqueueFile)
      e.target.value = ''
    }
  }

  const requestRemoveFile = (file: UploadedFile) => {
    setFileToDelete(file)
  }

  const confirmRemoveFile = async () => {
    if (!fileToDelete) return
    if (fileToDelete.backendId) {
      try {
        setRemovingId(fileToDelete.id)
        await deleteProjectFile(projectId, fileToDelete.backendId)
        onToast('Archivo eliminado exitosamente.', 'success')
      } catch (err: unknown) {
        const error = err as { message?: string }
        onToast(error.message || 'Error al eliminar el archivo.', 'error')
        setRemovingId(null)
        setFileToDelete(null)
        return
      } finally {
        setRemovingId(null)
      }
    }
    onFilesChange(uploadedFiles.filter((f) => f.id !== fileToDelete.id))
    setFileToDelete(null)
  }

  const handleSave = () => {
    if (hasUploading) {
      onToast('Espera a que terminen de subir todos los archivos.', 'error')
      return
    }
    if (successFiles.length === 0) {
      onConfirmNoFilesConfirm()
      return
    }
    onSave()
  }

  return (
    <>
      <div className="flex flex-col gap-4 w-full max-w-[520px] max-h-[75vh] overflow-y-auto pr-1">
        <div className="flex flex-col sm:flex-row justify-between items-start gap-3 sm:gap-4">
          <p className="text-[14px] text-[#5b6472] leading-relaxed">
            Adjunta imágenes o documentos PDF como evidencia digital de tu proyecto.
          </p>
          <span className="bg-[#eef3f8] text-[#003087] px-3 py-1.5 rounded-md text-[13px] font-bold flex-shrink-0 self-start sm:self-auto">
            Archivos
          </span>
        </div>

        <div className="flex justify-end">
          <span
            className={`text-[11px] font-semibold ${maxFilesReached ? 'text-[#C8102E]' : 'text-[#5b6472]'}`}
          >
            {uploadedFiles.filter((f) => f.status !== 'error').length} / {MAX_FILES} archivos
          </span>
        </div>

        <div
          onDragOver={(e) => {
            e.preventDefault()
            if (!dropZoneDisabled) setIsDragOver(true)
          }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={handleDrop}
          onClick={() => !dropZoneDisabled && fileInputRef.current?.click()}
          className={`relative flex flex-col items-center justify-center gap-2 p-6 border-2 border-dashed rounded-xl transition-all
            ${
              dropZoneDisabled
                ? 'border-gray-200 bg-gray-50 cursor-not-allowed opacity-60'
                : isDragOver
                  ? 'border-[#003087] bg-[#eef3f8] cursor-copy'
                  : 'border-gray-200 bg-[#fafbfc] hover:border-[#003087] hover:bg-[#eef3f8] cursor-pointer'
            }`}
        >
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${isDragOver ? 'bg-[#003087]' : 'bg-[#eef3f8]'}`}
          >
            <Upload size={18} className={isDragOver ? 'text-white' : 'text-[#003087]'} />
          </div>
          <div className="text-center">
            <p className="text-[13px] font-semibold text-[#1a1a2e]">
              {storageFull
                ? 'Almacenamiento lleno'
                : maxFilesReached
                  ? `Máximo de ${MAX_FILES} archivos alcanzado`
                  : 'Arrastra archivos o haz clic para seleccionar'}
            </p>
            <p className="text-[11px] text-[#5b6472] mt-0.5">
              Formatos: {ALLOWED_LABEL} · Imágenes ≤ {MAX_IMAGE_MB} MB · PDF ≤ {MAX_PDF_MB} MB
            </p>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept=".jpg,.jpeg,.png,.webp,.pdf"
            className="hidden"
            onChange={handleFileInput}
          />
        </div>

        {storageFull && (
          <div className="flex items-center gap-2 px-3 py-2 bg-red-50 border border-red-100 rounded-lg">
            <AlertCircle size={14} className="text-[#C8102E] flex-shrink-0" />
            <p className="text-[12px] text-[#C8102E] font-medium">
              Has alcanzado el límite de almacenamiento disponible (700 MB).
            </p>
          </div>
        )}

        {uploadedFiles.length > 0 && (
          <div className="flex flex-col gap-2 max-h-[200px] overflow-y-auto pr-0.5">
            {uploadedFiles.map((f) => (
              <FileItem
                key={f.id}
                file={f}
                onRemove={requestRemoveFile}
                onPreview={setPreviewFile}
                isRemoving={removingId === f.id}
              />
            ))}
          </div>
        )}

        {usedBytes > 0 && <StorageIndicator usedBytes={usedBytes} />}

        <div className="flex flex-col-reverse sm:flex-row justify-between sm:items-center gap-3 pt-4 mt-1 border-t border-gray-100">
          <button
            type="button"
            onClick={onBack}
            className="w-full sm:w-auto h-10 px-5 text-[14px] font-bold text-[#1a1a2e] bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
          >
            <ChevronLeft size={14} /> Atrás
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={hasUploading}
            className={`w-full sm:w-auto h-10 px-6 text-[14px] font-bold text-white rounded-lg transition-all flex items-center justify-center gap-2 ${
              hasUploading ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#c8102e] hover:brightness-110'
            }`}
          >
            {hasUploading ? (
              <>
                <Loader2 size={14} className="animate-spin" /> Subiendo...
              </>
            ) : (
              'Guardar Proyecto'
            )}
          </button>
        </div>
      </div>

      <FormatErrorModal isOpen={showFormatError} onClose={onFormatErrorClose} />
      <ConfirmNoFilesModal
        isOpen={showConfirmNoFiles}
        onConfirm={onConfirmNoFilesConfirm}
        onCancel={onConfirmNoFilesCancel}
      />
      <FilePreviewModal file={previewFile} onClose={() => setPreviewFile(null)} />
      <ConfirmDeleteFileModal
        file={fileToDelete}
        onConfirm={confirmRemoveFile}
        onCancel={() => setFileToDelete(null)}
      />
    </>
  )
}

export default Step2Files
