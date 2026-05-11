import { useState, useEffect } from 'react'
import Modal from '../../../components/ui/Modal'
import {
  createProject,
  updateProject,
  suggestCategory,
  type Skill,
  type Project
} from '../../../services/project.service'
import { getProjectFiles } from '../../../services/File.service'
import Step1Form from './Step1Form'
import Step2Files, { type UploadedFile } from './Step2Files'
import Toast from '../../../components/ui/Toast'
import ConfirmCreateModal from '../../../components/ui/ConfirmCreateModal'

interface CreateProjectModalProps {
  isOpen: boolean
  onClose: () => void
  projectToEdit?: Project | null
  onDelete?: (id: number) => void
  onSuccess?: (message: string) => void
}

const CreateProjectModal = ({
  isOpen,
  onClose,
  projectToEdit,
  onDelete,
  onSuccess
}: CreateProjectModalProps) => {
  const [currentStep, setCurrentStep] = useState(1)
  const [createdProjectId, setCreatedProjectId] = useState<number | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [createdProject, setCreatedProject] = useState<Project | null>(null)

  // Form data for step 1, temporarily saved for the confirmation modal
  const [pendingStep1Data, setPendingStep1Data] = useState<{
    title: string
    description: string
    projectUrl: string
    categoryId: number | ''
    selectedSkills: Skill[]
  } | null>(null)
  const [showConfirmModal, setShowConfirmModal] = useState(false)

  // File states for step 2
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [showFormatError, setShowFormatError] = useState(false)
  const [showConfirmNoFiles, setShowConfirmNoFiles] = useState(false)

  // Toast state
  const [toast, setToast] = useState<{
    message: string
    type: 'success' | 'error' | 'info'
  } | null>(null)

  const showToast = (message: string, type: 'success' | 'error' | 'info') => {
    setToast({ message, type })
  }

  const [pendingSuggestion, setPendingSuggestion] = useState<{
    name: string
    justification: string
  } | null>(null)

  // ── Init ───────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (isOpen) {
      setCreatedProject(null)
      setCurrentStep(1)
      setCreatedProjectId(null)
      setUploadedFiles([])
      setShowConfirmNoFiles(false)
      setShowFormatError(false)
      setPendingSuggestion(null)

      if (projectToEdit) {
        setCreatedProjectId(projectToEdit.id)

        // Fetch existing files
        getProjectFiles(projectToEdit.id)
          .then((files) => {
            const mapped: UploadedFile[] = files.map((f) => ({
              id: `server-${f.id}`,
              backendId: f.id,
              file: undefined,
              name: f.original_name,
              size: 0,
              mimeType: f.type === 'pdf' ? 'application/pdf' : 'image/jpeg',
              status: 'success' as const,
              progress: 100,
              url: f.url
            }))
            setUploadedFiles(mapped)
          })
          .catch((err) => {
            console.error('Error cargando archivos del proyecto:', err)
            setUploadedFiles([])
          })
      } else {
        setCreatedProjectId(null)
        setUploadedFiles([])
      }
    }
  }, [isOpen, projectToEdit])

  const activeProject = projectToEdit || createdProject

  const handleStep1Submit = async (data: {
    title: string
    description: string
    projectUrl: string
    categoryId: number | ''
    selectedSkills: Skill[]
  }) => {
    if (activeProject) {
      await handleActualSubmit(data)
    } else {
      setPendingStep1Data(data)
      setShowConfirmModal(true)
    }
  }

  const handleActualSubmit = async (dataOverride?: {
    title: string
    description: string
    projectUrl: string
    categoryId: number | ''
    selectedSkills: Skill[]
  }) => {
    const data = dataOverride || pendingStep1Data
    if (!data) return

    setShowConfirmModal(false)
    try {
      setIsSaving(true)
      const payload = {
        title: data.title,
        description: data.description,
        project_url: data.projectUrl,
        category_id: data.categoryId === '' ? null : data.categoryId,
        skill_ids: data.selectedSkills.map((s) => s.id)
      }

      let projectId: number
      if (activeProject) {
        // We are updating an existing project (either from edit, or one we just created but went back to step 1)
        await updateProject(activeProject.id, payload)
        projectId = activeProject.id
        showToast('Proyecto actualizado. Ahora puedes adjuntar archivos.', 'success')
      } else {
        const created = await createProject(payload)
        projectId = created.id
        setCreatedProject(created)
      }

      if (pendingSuggestion) {
        try {
          await suggestCategory(projectId, pendingSuggestion)
          setPendingSuggestion(null) // Clear after success
        } catch (err: unknown) {
          const error = err as { message?: string }
          console.error('Error sending category suggestion:', error)
          alert(
            'El proyecto se guardó, pero la sugerencia de categoría falló: ' +
              (error.message || 'Error desconocido')
          )
        }
      }

      setCreatedProjectId(projectId)
      setCurrentStep(2)
    } catch (err: unknown) {
      const error = err as { message?: string }
      console.error(error)
      showToast(error.message || 'Error al guardar el proyecto.', 'error')
    } finally {
      setIsSaving(false)
      setPendingStep1Data(null)
    }
  }

  const handleStep2Save = () => {
    showToast('¡Proyecto guardado completamente!', 'success')
    if (onSuccess) {
      onSuccess(projectToEdit ? 'Proyecto actualizado con éxito.' : 'Proyecto creado con éxito.')
    }
    // Esperamos un momento para que el usuario lea el mensaje de éxito antes de cerrar
    setTimeout(() => {
      onClose()
    }, 1500)
  }

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title={projectToEdit ? 'Editar proyecto' : 'Nuevo proyecto'}
      >
        <div className="flex flex-col gap-5">
          {currentStep === 1 && (
            <Step1Form
              projectToEdit={projectToEdit}
              onSubmit={handleStep1Submit}
              onCancel={onClose}
              onDelete={onDelete}
              isSaving={isSaving}
              onSuggestCategory={(name, justification) =>
                setPendingSuggestion({ name, justification })
              }
            />
          )}

          {currentStep === 2 && createdProjectId !== null && (
            <Step2Files
              projectId={createdProjectId}
              uploadedFiles={uploadedFiles}
              onFilesChange={setUploadedFiles}
              onBack={() => setCurrentStep(1)}
              onSave={handleStep2Save}
              showFormatError={showFormatError}
              onShowFormatError={() => setShowFormatError(true)}
              onFormatErrorClose={() => setShowFormatError(false)}
              showConfirmNoFiles={showConfirmNoFiles}
              onConfirmNoFilesConfirm={() => {
                setShowConfirmNoFiles(false)
                handleStep2Save()
              }}
              onConfirmNoFilesCancel={() => setShowConfirmNoFiles(false)}
              onToast={showToast}
            />
          )}
        </div>
      </Modal>

      {!activeProject && (
        <ConfirmCreateModal
          isOpen={showConfirmModal}
          onClose={() => setShowConfirmModal(false)}
          onConfirm={() => handleActualSubmit()}
        />
      )}

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </>
  )
}

export default CreateProjectModal
