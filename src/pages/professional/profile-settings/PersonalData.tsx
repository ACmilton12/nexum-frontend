import { useState, useEffect, useRef } from 'react'
import Sidebar from '../../admin/components/Sidebar'
//import RightWidgets from '../../../components/ui/RightWidgets'
import Modal from '../../../components/ui/Modal'
import Toast from '../../../components/ui/Toast'
import Calendar from '../../../components/ui/Calendar'
import ImageCropperModal from '../../../components/ui/ImageCropperModal'
import {
  getPersonalData,
  updatePersonalData,
  uploadAvatar
} from '../../../services/datapersonal.service'
import {
  Camera,
  Save,
  X,
  User,
  Briefcase,
  MapPin,
  Phone,
  Mail,
  ShieldCheck,
  AlertTriangle,
  CheckCircle,
  BookOpen,
  Settings,
  FileText,
  Loader2
} from 'lucide-react'

// Función para comprimir y convertir imagen a WebP
const compressAndConvertToWebP = async (file: File, quality: number = 0.8): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        if (!ctx) {
          reject(new Error('No se pudo obtener el contexto del canvas'))
          return
        }
        canvas.width = img.width
        canvas.height = img.height
        ctx.drawImage(img, 0, 0)
        canvas.toBlob(
          (blob) => {
            if (blob) resolve(blob)
            else reject(new Error('No se pudo convertir a WebP'))
          },
          'image/webp',
          quality
        )
      }
      img.src = e.target?.result as string
    }
    reader.readAsDataURL(file)
  })
}

function PersonalData() {
  const [nombre, setNombre] = useState('')
  const [apellido, setApellido] = useState('')
  const [tituloProfesional, setTituloProfesional] = useState('')
  const [correoElectronico, setCorreoElectronico] = useState('')
  const [telefono, setTelefono] = useState('')
  const [ubicacion, setUbicacion] = useState('')
  const [biografia, setBiografia] = useState('')
  const [avatarUrl, setAvatarUrl] = useState('')
  const [initialData, setInitialData] = useState<any>(null)

  const [loading, setLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  
  // Estados para el Cropper
  const [isCropperOpen, setIsCropperOpen] = useState(false)
  const [selectedImageSrc, setSelectedImageSrc] = useState<string>('')
  const [selectedFileName, setSelectedFileName] = useState<string>('')

  const [toast, setToast] = useState<{
    message: string
    type: 'success' | 'error' | 'info'
  } | null>(null)


  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await getPersonalData()

        // Recuperar información base del usuario que se guardó en login
        const userStr = localStorage.getItem('user') || sessionStorage.getItem('user')
        const currentUser = userStr ? JSON.parse(userStr) : null

        if (data) {
          const loadedValues = {
            nombre: data.user?.first_name || currentUser?.first_name || '',
            apellido: data.user?.last_name || currentUser?.last_name || '',
            tituloProfesional: data.profession || '',
            telefono: data.phone || '',
            ubicacion: data.location || '',
            biografia: data.biography || ''
          }
          setNombre(loadedValues.nombre)
          setApellido(loadedValues.apellido)
          setCorreoElectronico(data.user?.email || currentUser?.email || '')
          setTituloProfesional(loadedValues.tituloProfesional)
          setTelefono(loadedValues.telefono)
          setUbicacion(loadedValues.ubicacion)
          setBiografia(loadedValues.biografia)
          setAvatarUrl(data.avatar_url || '')
          setInitialData(loadedValues)
        } else if (currentUser) {
          const loadedValues = {
            nombre: currentUser.first_name || '',
            apellido: currentUser.last_name || '',
            tituloProfesional: '',
            telefono: '',
            ubicacion: '',
            biografia: ''
          }
          setNombre(loadedValues.nombre)
          setApellido(loadedValues.apellido)
          setCorreoElectronico(currentUser.email || '')
          setTituloProfesional('')
          setTelefono('')
          setUbicacion('')
          setBiografia('')
          setAvatarUrl('')
          setInitialData(loadedValues)
        }
      } catch (error) {
        console.error('Error cargando datos:', error)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  const hasChanges =
    initialData &&
    (nombre !== initialData.nombre ||
      apellido !== initialData.apellido ||
      tituloProfesional !== initialData.tituloProfesional ||
      telefono !== initialData.telefono ||
      ubicacion !== initialData.ubicacion ||
      biografia !== initialData.biografia)

  const handleConfirmSave = async () => {
    setShowConfirmModal(false)
    setIsSaving(true)
    try {
      await updatePersonalData({
        nombre,
        apellido,
        tituloProfesional,
        telefono,
        ubicacion,
        biografia
      })
      setInitialData({ nombre, apellido, tituloProfesional, telefono, ubicacion, biografia })
      setToast({ message: 'Tus datos se actualizaron correctamente.', type: 'success' })
    } catch (error: any) {
      setToast({ message: error.message || 'Error al guardar cambios.', type: 'error' })
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    if (initialData) {
      setNombre(initialData.nombre)
      setApellido(initialData.apellido)
      setTituloProfesional(initialData.tituloProfesional)
      setTelefono(initialData.telefono)
      setUbicacion(initialData.ubicacion)
      setBiografia(initialData.biografia)
    }
    setToast({ message: 'Se han revertido los cambios.', type: 'info' })
  }

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = () => {
        setSelectedImageSrc(reader.result as string)
        setSelectedFileName(file.name)
        setIsCropperOpen(true)
      }
      reader.readAsDataURL(file)
      // Resetear el input para que detecte si se selecciona el mismo archivo de nuevo
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const handleCropComplete = async (croppedBlob: Blob) => {
    setIsCropperOpen(false)
    try {
      // 1. Convertir el Blob recortado a File para la compresión
      const fileToCompress = new File([croppedBlob], selectedFileName, { type: 'image/jpeg' })
      
      // 2. Comprimir y convertir a WebP
      const compressedBlob = await compressAndConvertToWebP(fileToCompress, 0.8)
      const webpFile = new File([compressedBlob], `${selectedFileName.split('.')[0]}.webp`, {
        type: 'image/webp'
      })
      
      // 3. Subir el WebP
      const result = await uploadAvatar(webpFile)
      setAvatarUrl(result.data.avatar_url)
      setToast({ message: 'Foto de perfil actualizada y comprimida con éxito.', type: 'success' })
    } catch (error: any) {
      setToast({ message: 'Error al procesar o subir la imagen.', type: 'error' })
    }
  }

  // ESTRUCTURA DEL PANEL DERECHO (Basada en tu imagen de Dashboard Admin)
  const RightPanelContent = () => (
    <div className="sticky top-6 space-y-8">
      {/* Calendario */}
      <div>
        <h3 className="font-bold text-textMain text-sm mb-4 uppercase tracking-wider">
          Calendario
        </h3>
        <Calendar />
      </div>

      {/* Notificaciones */}
      <div>
        <h3 className="font-bold text-textMain text-sm mb-4 flex items-center gap-2 uppercase tracking-wider">
          <ShieldCheck size={18} className="text-action" />
          NOTIFICACIONES
        </h3>
        <div className="space-y-3">
          <div className="flex items-start gap-2 text-xs text-gray-600 leading-relaxed">
            <AlertTriangle size={14} className="text-action mt-0.5 shrink-0" />
            <span>Tu perfil fue visitado 3 veces hoy.</span>
          </div>
          <div className="flex items-start gap-2 text-xs text-gray-600 leading-relaxed">
            <CheckCircle size={14} className="text-green-500 mt-0.5 shrink-0" />
            <span>Proyecto 'App Móvil' publicado correctamente.</span>
          </div>
        </div>
      </div>

      {/* Enlaces Rápidos */}
      <div>
        <h3 className="font-normal text-textMain text-sm mb-4 uppercase tracking-wider">
          Enlaces rápidos
        </h3>
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm text-primary cursor-pointer hover:underline transition-all">
            <BookOpen size={16} className="text-orange-400" />
            <span className="font-medium">Guía de Usuario</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-primary cursor-pointer hover:underline transition-all">
            <Settings size={16} className="text-purple-400" />
            <span className="font-medium">Soporte Técnico</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-primary cursor-pointer hover:underline transition-all">
            <FileText size={16} className="text-blue-300" />
            <span className="font-medium">Políticas UMSS</span>
          </div>
        </div>
      </div>
    </div>
  )

  if (loading)
    return (
      <div className="min-h-screen bg-background dark:bg-slate-900 flex flex-col font-sans transition-colors duration-300">
        <div className="flex flex-1 overflow-hidden relative">
          <Sidebar activeItem="Datos Personales" />
          <main className="flex-1 flex flex-col lg:flex-row overflow-hidden bg-background dark:bg-slate-900 transition-colors duration-300">
            <div className="flex-1 p-4 pl-14 sm:pl-6 md:p-8 flex items-center justify-center overflow-y-auto">
              <div className="flex flex-col items-center gap-3 text-gray-400 dark:text-gray-500 font-medium">
                <Loader2 className="animate-spin text-primary" size={32} />
                <span>Cargando perfil...</span>
              </div>
            </div>
            <aside className="w-full lg:w-72 p-6 bg-white dark:bg-slate-900 border-t lg:border-t-0 lg:border-l border-gray-200 dark:border-gray-800 shrink-0 overflow-y-auto transition-colors duration-300">
              <RightPanelContent />
            </aside>
          </main>
        </div>
      </div>
    )

  return (
    <div className="min-h-screen bg-background dark:bg-slate-900 flex flex-col font-sans transition-colors duration-300">
      <div className="flex flex-1 overflow-hidden relative">
        <Sidebar activeItem="Datos Personales" />

        <main className="flex-1 flex flex-col lg:flex-row overflow-hidden bg-background dark:bg-slate-900 transition-colors duration-300">
          {/* SECCIÓN IZQUIERDA: Formulario */}
          <div className="flex-1 p-4 pl-14 sm:pl-6 md:p-8 overflow-y-auto">
            <header className="mb-8">
              <h1 className="text-xl sm:text-2xl font-bold text-textMain dark:text-white mb-1">Datos Personales</h1>
              <p className="text-sm text-gray-400 dark:text-gray-500">
                Gestiona la información pública de tu cuenta profesional.
              </p>
            </header>

            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 md:p-8 max-w-5xl transition-colors duration-300">
              <div className="flex flex-col lg:flex-row gap-10">
                {/* AVATAR */}
                <div className="flex flex-col items-center gap-4 shrink-0">
                  <div className="relative group">
                    <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-white dark:border-slate-800 shadow-xl bg-gray-50 dark:bg-slate-900 flex items-center justify-center transition-colors">
                      {avatarUrl ? (
                        <img src={avatarUrl} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        <User size={60} className="text-gray-200 dark:text-gray-600" />
                      )}
                    </div>
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute bottom-1 right-1 p-2.5 bg-action text-white rounded-full shadow-lg hover:scale-110 transition-all z-10"
                    >
                      <Camera size={20} />
                    </button>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleAvatarChange}
                      accept="image/*"
                      className="hidden"
                    />
                  </div>
                  <p className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest transition-colors">
                    Foto de Perfil
                  </p>
                </div>

                {/* FORM FIELDS */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault()
                    if (hasChanges) setShowConfirmModal(true)
                  }}
                  className="flex-1 space-y-6"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase flex items-center gap-2 italic">
                        <User size={14} /> Nombre
                      </label>
                      <input
                        type="text"
                        value={nombre}
                        onChange={(e) =>
                          setNombre(e.target.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ ]/g, ''))
                        }
                        className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/30 dark:bg-slate-900 dark:text-white outline-none focus:border-primary transition-all text-sm"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase flex items-center gap-2 italic">
                        <User size={14} /> Apellido
                      </label>
                      <input
                        type="text"
                        value={apellido}
                        onChange={(e) =>
                          setApellido(e.target.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ ]/g, ''))
                        }
                        className="w-full p-3 rounded-xl border border-gray-200 bg-gray-50/30 outline-none focus:border-primary transition-all text-sm"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase flex items-center gap-2 italic">
                        <Briefcase size={14} /> Título Profesional
                      </label>
                      <input
                        type="text"
                        value={tituloProfesional}
                        onChange={(e) => setTituloProfesional(e.target.value)}
                        className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/30 dark:bg-slate-900 dark:text-white outline-none focus:border-primary transition-all text-sm"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase flex items-center gap-2 italic">
                        <Mail size={14} /> Correo Institucional
                      </label>
                      <input
                        type="email"
                        value={correoElectronico}
                        disabled
                        className="w-full p-3 rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-100 dark:bg-slate-700 text-gray-400 dark:text-gray-500 cursor-not-allowed italic text-sm transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase flex items-center gap-2 italic">
                        <Phone size={14} /> Teléfono
                      </label>
                      <input
                        type="tel"
                        value={telefono}
                        onChange={(e) => setTelefono(e.target.value.replace(/[^0-9]/g, ''))}
                        className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/30 dark:bg-slate-900 dark:text-white outline-none focus:border-primary transition-all text-sm tabular-nums"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase flex items-center gap-2 italic">
                        <MapPin size={14} /> Ubicación
                      </label>
                      <input
                        type="text"
                        value={ubicacion}
                        onChange={(e) => setUbicacion(e.target.value)}
                        className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/30 dark:bg-slate-900 dark:text-white outline-none focus:border-primary transition-all text-sm"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase">
                      Biografía Profesional
                    </label>
                    <textarea
                      value={biografia}
                      onChange={(e) => setBiografia(e.target.value)}
                      rows={4}
                      className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/30 dark:bg-slate-900 dark:text-white outline-none focus:border-primary transition-all resize-none text-sm leading-relaxed"
                      placeholder="Describe brevemente tu perfil académico y profesional..."
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row justify-end gap-3 pt-6 border-t border-gray-50 dark:border-gray-700 transition-colors">
                    <button
                      type="button"
                      onClick={handleCancel}
                      disabled={isSaving}
                      className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 font-bold text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 transition-all shadow-sm"
                    >
                      <X size={16} /> Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={isSaving || !hasChanges}
                      className={`flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm text-white shadow-lg transition-all ${isSaving || !hasChanges
                        ? 'bg-gray-300 cursor-not-allowed'
                        : 'bg-action hover:brightness-110 shadow-red-100'
                        }`}
                    >
                      <Save size={16} /> {isSaving ? 'Guardando...' : 'Guardar cambios'}
                    </button>
                  </div>
                </form>
              </div>
            </div>

          </div>

          {/* ASIDE DERECHO (ESTILO DASHBOARD ADMIN) */}
          <aside className="w-full lg:w-72 p-6 bg-white dark:bg-slate-900 border-t lg:border-t-0 lg:border-l border-gray-200 dark:border-gray-800 shrink-0 overflow-y-auto transition-colors duration-300">
            <RightPanelContent />
          </aside>
        </main>
      </div>

      {/* MODALES Y TOASTS */}
      <Modal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        title="Confirmar Actualización"
      >
        <div className="space-y-6 max-w-sm text-center p-2">
          <div className="w-16 h-16 bg-red-50 text-action rounded-full flex items-center justify-center mx-auto">
            <Save size={30} />
          </div>
          <p className="text-sm text-gray-500 leading-relaxed font-medium">
            ¿Estás seguro de que deseas guardar los cambios? Se actualizará tu información
            profesional en la plataforma.
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => setShowConfirmModal(false)}
              className="flex-1 py-3 text-sm font-bold border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
            >
              Volver
            </button>
            <button
              onClick={handleConfirmSave}
              className="flex-1 py-3 text-sm font-bold bg-action text-white rounded-xl hover:brightness-110 shadow-lg shadow-red-200 transition-all"
            >
              Guardar
            </button>
          </div>
        </div>
      </Modal>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {isCropperOpen && (
        <ImageCropperModal
          isOpen={isCropperOpen}
          onClose={() => setIsCropperOpen(false)}
          imageSrc={selectedImageSrc}
          onCropComplete={handleCropComplete}
        />
      )}
    </div>
  )
}

export default PersonalData
