import { useState, useEffect, useRef } from 'react'
import Sidebar from '../../admin/components/Sidebar'
import RightWidgets from '../../../components/ui/RightWidgets'
import Modal from '../../../components/ui/Modal'
import Toast from '../../../components/ui/Toast' // Importamos el nuevo componente
import { getPersonalData, updatePersonalData, uploadAvatar } from '../../../services/datapersonal.service'

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

        // Establecer dimensiones del canvas
        canvas.width = img.width
        canvas.height = img.height

        // Dibujar imagen en el canvas
        ctx.drawImage(img, 0, 0)

        // Convertir a WebP con compresión
        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob)
            } else {
              reject(new Error('No se pudo convertir la imagen a WebP'))
            }
          },
          'image/webp',
          quality
        )
      }

      img.onerror = () => {
        reject(new Error('No se pudo cargar la imagen'))
      }

      img.src = e.target?.result as string
    }

    reader.onerror = () => {
      reject(new Error('Error al leer el archivo'))
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
  
  // Estado para el Toast gud y Errores
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null)
  const [errors, setErrors] = useState<{ [key: string]: string }>({})

  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await getPersonalData()

        if (data) {
          const loadedValues = {
            nombre: data.user.first_name || '',
            apellido: data.user.last_name || '',
            tituloProfesional: data.profession || '',
            telefono: data.phone || '',
            ubicacion: data.location || '',
            biografia: data.biography || ''
          }

          setNombre(loadedValues.nombre)
          setApellido(loadedValues.apellido)
          setCorreoElectronico(data.user.email || '')
          setTituloProfesional(loadedValues.tituloProfesional)
          setTelefono(loadedValues.telefono)
          setUbicacion(loadedValues.ubicacion)
          setBiografia(loadedValues.biografia)
          setAvatarUrl(data.avatar_url || '') 
          
          // Guardamos la referencia para el bloqueo del botón
          setInitialData(loadedValues)
        } else {
          const storedUser = JSON.parse(
            localStorage.getItem('user') || sessionStorage.getItem('user') || '{}'
          )
          if (storedUser.first_name) {
            setNombre(storedUser.first_name)
            setApellido(storedUser.last_name)
            setCorreoElectronico(storedUser.email)
          }
        }
      } catch (error) {
        console.error('Error cargando datos:', error)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  // Lógica de validación: ¿Hay cambios respecto a los datos iniciales?
  const hasChanges = initialData && (
    nombre !== initialData.nombre ||
    apellido !== initialData.apellido ||
    tituloProfesional !== initialData.tituloProfesional ||
    telefono !== initialData.telefono ||
    ubicacion !== initialData.ubicacion ||
    biografia !== initialData.biografia
  )

  // Esta función ahora valida campos antes de abrir el modal
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    const newErrors: any = {}
    if (!nombre.trim()) newErrors.nombre = 'Campo obligatorio: Nombre.'
    if (!apellido.trim()) newErrors.apellido = 'Campo obligatorio: Apellido.'
    if (!tituloProfesional.trim()) newErrors.tituloProfesional = 'Campo obligatorio: Profesión.'
    setErrors(newErrors)
    if (Object.keys(newErrors).length === 0 && hasChanges) {
      setShowConfirmModal(true)
    }
  }

  // Esta función ejecuta el guardado real tras la confirmación
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
        biografia: biografia
      })

      setInitialData({
        nombre,
        apellido,
        tituloProfesional,
        telefono,
        ubicacion,
        biografia
      })
      
      // Reemplazo del alert por Toast de éxito
      setToast({ message: 'Tus datos personales se actualizaron correctamente.', type: 'success' })
    } catch (error: any) {
      setToast({ message: error.message || 'Ocurrió un error al guardar.', type: 'error' })
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    if (initialData) {
      // Restauramos los valores originales del formulario
      setNombre(initialData.nombre)
      setApellido(initialData.apellido)
      setTituloProfesional(initialData.tituloProfesional)
      setTelefono(initialData.telefono)
      setUbicacion(initialData.ubicacion)
      setBiografia(initialData.biografia)
      setErrors({})
    }
    // Reemplazo del alert por Toast de info y se mantiene en la página
    setToast({ message: 'Se cancelaron los cambios realizados.', type: 'info' })
  }

  const handleAvatarChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      try {
        const compressedBlob = await compressAndConvertToWebP(file, 0.8)
        const webpFile = new File([compressedBlob], `${file.name.split('.')[0]}.webp`, {
          type: 'image/webp'
        })

        const result = await uploadAvatar(webpFile)
        setAvatarUrl(result.data.avatar_url)
        setToast({ message: 'Foto de perfil actualizada con éxito.', type: 'success' })
      } catch (error: any) {
        setToast({ message: error.message || 'Error al subir la imagen.', type: 'error' })
      }
    }
  }

  if (loading) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          backgroundColor: '#e9eef5'
        }}
      >
        Cargando perfil...
      </div>
    )
  }

  return (
    <div
      style={{
        display: 'flex',
        flex: 1,
        minHeight: 'calc(100vh - 120px)',
        backgroundColor: '#e9eef5'
      }}
    >
      <Sidebar activeItem="Datos Personales" />

      <div
        style={{
          flex: 1,
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          overflowY: 'auto'
        }}
      >
        <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#1a1a2e', margin: 0 }}>
          Datos Personales
        </h2>

        <div
          className="personal-data-card"
          style={{
            width: '100%',
            maxWidth: '1000px',
            backgroundColor: '#fff',
            padding: '32px',
            borderRadius: '12px',
            boxShadow: '0 6px 18 rgba(0, 26, 94, 0.06)',
            display: 'flex',
            gap: '32px'
          }}
        >
          <div
            style={{
              width: '144px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '12px'
            }}
          >
            <div
              style={{
                width: '120px',
                height: '120px',
                borderRadius: '999px',
                overflow: 'hidden',
                boxShadow: '0 0 0 4px #fff, 0 0 0 5px #00000014',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#f5f5f5'
              }}
            >
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt="Profile"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : (
                <span style={{ fontSize: '12px', fontWeight: '600', color: '#999' }}>Sin foto</span>
              )}
            </div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleAvatarChange}
              accept="image/*"
              style={{ display: 'none' }}
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              style={{
                minHeight: '36px',
                padding: '0 14px',
                borderRadius: '8px',
                border: '1px solid #00000014',
                background: '#fff',
                fontSize: '14px',
                cursor: 'pointer',
                fontWeight: '600'
              }}
            >
              Cambiar foto
            </button>
          </div>

          <form
            onSubmit={handleSubmit}
            style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '20px' }}
          >
            <div className="personal-data-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '13px', fontWeight: '600' }}>Nombre</label>
                <input
                  type="text" value={nombre}
                  onChange={(e) => {setNombre(e.target.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ ]/g, '')); setErrors({...errors, nombre: ''})}}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', background: '#fff', outline: 'none', border: `1px solid ${errors.nombre ? '#c8102e' : '#00000014'}` }}
                />
                {errors.nombre && <span style={{ color: '#c8102e', fontSize: '11px', fontWeight: '600' }}>{errors.nombre}</span>}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '13px', fontWeight: '600' }}>Apellido</label>
                <input
                  type="text" value={apellido}
                  onChange={(e) => {setApellido(e.target.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ ]/g, '')); setErrors({...errors, apellido: ''})}}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', background: '#fff', outline: 'none', border: `1px solid ${errors.apellido ? '#c8102e' : '#00000014'}` }}
                />
                {errors.apellido && <span style={{ color: '#c8102e', fontSize: '11px', fontWeight: '600' }}>{errors.apellido}</span>}
              </div>
            </div>

            <div className="personal-data-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '13px', fontWeight: '600' }}>Título Profesional</label>
                <input
                  type="text" value={tituloProfesional}
                  onChange={(e) => {setTituloProfesional(e.target.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ ]/g, '')); setErrors({...errors, tituloProfesional: ''})}}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', background: '#fff', outline: 'none', border: `1px solid ${errors.tituloProfesional ? '#c8102e' : '#00000014'}` }}
                />
                {errors.tituloProfesional && <span style={{ color: '#c8102e', fontSize: '11px', fontWeight: '600' }}>{errors.tituloProfesional}</span>}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '13px', fontWeight: '600' }}>Correo</label>
                <input
                  type="email"
                  value={correoElectronico}
                  disabled
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '8px',
                    border: '1px solid #00000014',
                    background: '#f5f5f5',
                    cursor: 'not-allowed'
                  }}
                />
              </div>
            </div>

            <div className="personal-data-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '13px', fontWeight: '600' }}>Teléfono</label>
                <input
                  type="tel"
                  value={telefono}
                  onChange={(e) => setTelefono(e.target.value.replace(/[^0-9]/g, ''))}
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '8px',
                    border: '1px solid #00000014', outline: 'none'
                  }}
                />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '13px', fontWeight: '600' }}>Ubicación</label>
                <input
                  type="text"
                  value={ubicacion}
                  onChange={(e) => setUbicacion(e.target.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ, ]/g, ''))}
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '8px',
                    border: '1px solid #00000014', outline: 'none'
                  }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '13px', fontWeight: '600' }}>Biografía</label>
              <textarea
                value={biografia}
                onChange={(e) => setBiografia(e.target.value)}
                rows={4}
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '8px',
                  border: '1px solid #00000014',
                  resize: 'none', outline: 'none'
                }}
              />
            </div>

            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
                gap: '12px',
                marginTop: '10px',
                paddingTop: '20px',
                borderTop: '1px solid #0000000a'
              }}
            >
              <button
                type="button"
                onClick={handleCancel}
                disabled={isSaving}
                style={{
                  padding: '10px 20px',
                  borderRadius: '8px',
                  border: '1px solid #00000014',
                  background: '#fff',
                  cursor: isSaving ? 'not-allowed' : 'pointer',
                  fontWeight: '600'
                }}
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isSaving || !hasChanges}
                style={{
                  padding: '10px 20px',
                  borderRadius: '8px',
                  border: 'none',
                  background: (isSaving || !hasChanges) ? '#ccc' : '#c8102e',
                  color: '#fff',
                  fontWeight: '600',
                  cursor: (isSaving || !hasChanges) ? 'not-allowed' : 'pointer'
                }}
              >
                {isSaving ? 'Guardando...' : 'Guardar cambios'}
              </button>
            </div>
          </form>
        </div>
      </div>

      <RightWidgets type="profile" />

      {/* Modal de Confirmación */}
      <Modal 
        isOpen={showConfirmModal} 
        onClose={() => setShowConfirmModal(false)}
        title="¿Estás seguro que deseas actualizar tus Datos personales?"
      >
        <div style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '20px', minWidth: '450px' }}>
          <p style={{ fontSize: '14px', color: '#555', lineHeight: '1.5', margin: 0 }}>
            Estás a punto de actualizar todos tus datos, editados y borrados. Estos cambios serán visibles en tu perfil público de inmediato.
          </p>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '10px' }}>
            <button
              onClick={() => setShowConfirmModal(false)}
              style={{
                padding: '10px 18px',
                borderRadius: '8px',
                border: '1px solid #ddd',
                background: '#fff',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              Cancelar
            </button>
            <button
              onClick={handleConfirmSave}
              style={{
                padding: '10px 18px',
                borderRadius: '8px',
                border: 'none',
                background: '#c8102e',
                color: '#fff',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              Si, Actualizar
            </button>
          </div>
        </div>
      </Modal>

      {/* Componente Toast gud renderizado al final */}
      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={() => setToast(null)} 
        />
      )}
    </div>
  )
}

export default PersonalData