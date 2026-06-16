import { useState, useEffect, useRef, useCallback } from 'react'
import {
  Search,
  Calendar as CalendarIcon,
  Download,
  ShieldCheck,
  Eye,
  X,
  ArrowRight
} from 'lucide-react'
import Sidebar from './components/Sidebar'
import Calendar from '../../components/ui/Calendar'
import { getActivityLogs } from '../../services/admin.service'
import { useTranslation } from 'react-i18next'

interface AuditLog {
  id: number
  user_name: string
  affected_user?: string | null
  event: string
  timestamp: string
  detail: string
  raw_date: string
  log_name?: string
  properties?: {
    attributes?: Record<string, unknown>
    old?: Record<string, unknown>
  }
}

const AuditPage = () => {
  const { t, i18n } = useTranslation()
  const [logs, setLogs] = useState<AuditLog[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null)

  // Referencias para disparar los inputs de fecha ocultos
  const dateFromRef = useRef<HTMLInputElement>(null)
  const dateToRef = useRef<HTMLInputElement>(null)

  const fetchLogs = useCallback(async () => {
    try {
      setLoading(true)
      const result = await getActivityLogs({ per_page: 100 })
      setLogs(result.data)
    } catch (err: unknown) {
      setError((err as Error).message || t('admin.audit.table.error'))
    } finally {
      setLoading(false)
    }
  }, [t])

  useEffect(() => {
    fetchLogs()
  }, [fetchLogs])

  // Función para abrir el calendario nativo al hacer clic en el diseño personalizado
  const handleOpenCalendar = (ref: React.RefObject<HTMLInputElement | null>) => {
    if (ref.current) {
      if ('showPicker' in HTMLInputElement.prototype) {
        try {
          ref.current.showPicker()
        } catch {
          ref.current.focus()
        }
      } else {
        ref.current.focus()
      }
    }
  }

  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      log.user_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.id.toString().includes(searchTerm)

    let matchesDate = true
    if (dateFrom || dateTo) {
      const logDate = new Date(log.raw_date)
      if (dateFrom) {
        const [y, m, d] = dateFrom.split('-').map(Number)
        const from = new Date(y, m - 1, d, 0, 0, 0, 0)
        if (logDate < from) matchesDate = false
      }
      if (dateTo) {
        const [y, m, d] = dateTo.split('-').map(Number)
        const to = new Date(y, m - 1, d, 23, 59, 59, 999)
        if (logDate > to) matchesDate = false
      }
    }
    return matchesSearch && matchesDate
  })

  const getEventBadgeClass = (event: string) => {
    switch (event.toLowerCase()) {
      case 'update_role':
      case 'updated':
        return 'bg-blue-100 text-blue-700'
      case 'login_failed':
        return 'bg-red-100 text-red-700'
      case 'profile_updated':
        return 'bg-green-100 text-green-700'
      case 'portfolio_edit':
        return 'bg-indigo-100 text-indigo-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  const translateEventName = (event: string) => {
    const key = event.toLowerCase()
    const translated = t(`admin.audit.events.${key}`)
    if (translated && !translated.startsWith('admin.audit.events.')) {
      return translated
    }
    return event.replace(/_/g, ' ')
  }

  const formatDateDisplay = (dateStr: string) => {
    if (!dateStr) return 'DD/MM/AA'
    const [y, m, d] = dateStr.split('-')
    return `${d}/${m}/${y.slice(-2)}`
  }

  type AuditEntityType =
    | 'user'
    | 'work_experience'
    | 'certification'
    | 'project'
    | 'skill'
    | 'portfolio'
    | 'unknown'

  const getAuditAttributes = (log: AuditLog) => ({
    ...(log.properties?.old || {}),
    ...(log.properties?.attributes || {})
  })

  const detectAuditEntityType = (log: AuditLog): AuditEntityType => {
    const logName = (log.log_name || '').toLowerCase()
    const attrs = getAuditAttributes(log)
    const keys = Object.keys(attrs)

    if (logName.includes('certification') || logName.includes('certific')) return 'certification'
    if (
      logName.includes('work_experience') ||
      logName.includes('work-experience') ||
      logName.includes('experience')
    ) {
      return 'work_experience'
    }
    if (logName.includes('project')) return 'project'
    if (logName.includes('skill') || logName.includes('habilidad')) return 'skill'

    if (keys.includes('issuing_entity') || keys.includes('expiration_date')) return 'certification'
    if (keys.includes('position') || keys.includes('company') || keys.includes('employment_type')) {
      return 'work_experience'
    }
    if (keys.includes('project_url') || (keys.includes('title') && keys.includes('category_id'))) {
      return 'project'
    }
    if (
      keys.includes('show_experience') ||
      keys.includes('show_certifications') ||
      keys.includes('global_privacy')
    ) {
      return 'portfolio'
    }
    if (
      keys.includes('first_name') ||
      keys.includes('last_name') ||
      keys.includes('role') ||
      keys.includes('deactivated_by_admin') ||
      keys.includes('email')
    ) {
      return 'user'
    }

    return 'unknown'
  }

  const isPortfolioVisibilityEntity = (entity: AuditEntityType) =>
    entity === 'work_experience' ||
    entity === 'certification' ||
    entity === 'project' ||
    entity === 'skill'

  const getAuditEntitySummary = (log: AuditLog): string | null => {
    const attrs = getAuditAttributes(log)
    const entity = detectAuditEntityType(log)

    switch (entity) {
      case 'work_experience': {
        const position = attrs.position ? String(attrs.position) : ''
        const company = attrs.company ? String(attrs.company) : ''
        if (position && company) {
          return t('admin.audit.entity.experience_item', { position, company })
        }
        if (position) return t('admin.audit.entity.experience_position', { position })
        return t('admin.audit.entity.experience_section')
      }
      case 'certification': {
        const name = attrs.name ? String(attrs.name) : ''
        if (name) return t('admin.audit.entity.certification_item', { name })
        return t('admin.audit.entity.certification_section')
      }
      case 'project': {
        const title = attrs.title || attrs.name
        if (title) return t('admin.audit.entity.project_item', { title: String(title) })
        return t('admin.audit.entity.project_section')
      }
      case 'portfolio':
        return t('admin.audit.entity.portfolio_section')
      default:
        return null
    }
  }

  const getChangedAuditKeys = (log: AuditLog) => {
    const attributes = log.properties?.attributes || {}
    const old = log.properties?.old || {}

    return Array.from(new Set([...Object.keys(attributes), ...Object.keys(old)])).filter((key) => {
      if (key === 'updated_at' || key === 'created_at' || key === 'id') return false
      if (
        key === 'deactivated_by_admin' &&
        (attributes.is_active !== undefined || old.is_active !== undefined)
      ) {
        return false
      }

      const oldVal =
        old[key] !== undefined && old[key] !== null ? String(old[key]) : null
      const newVal =
        attributes[key] !== undefined && attributes[key] !== null
          ? String(attributes[key])
          : null

      return oldVal !== newVal
    })
  }

  const translateKey = (key: string, log?: AuditLog) => {
    if (log && key === 'is_active') {
      const entity = detectAuditEntityType(log)
      if (entity === 'work_experience') return t('admin.audit.fields.experience_visibility')
      if (entity === 'certification') return t('admin.audit.fields.certification_visibility')
      if (entity === 'project') return t('admin.audit.fields.project_visibility')
      if (entity === 'skill') return t('admin.audit.fields.skill_visibility')
    }

    const translated = t(`admin.audit.fields.${key}`)
    if (translated && !translated.startsWith('admin.audit.fields.')) {
      return translated
    }
    return key
  }

  const formatValue = (key: string, value: unknown, log?: AuditLog) => {
    if (value === undefined || value === null || value === 'null') return t('admin.audit.values.unspecified')

    // Si el valor es booleano o string 'true'/'false'
    if (
      typeof value === 'boolean' ||
      value === 'true' ||
      value === 'false' ||
      value === 1 ||
      value === 0 ||
      value === '1' ||
      value === '0'
    ) {
      const isTrue = value === true || value === 'true' || value === 1 || value === '1'
      const entity = log ? detectAuditEntityType(log) : 'user'

      if (key === 'is_active') {
        if (isPortfolioVisibilityEntity(entity)) {
          return isTrue ? t('admin.audit.values.visible') : t('admin.audit.values.hidden')
        }
        return isTrue ? t('admin.audit.values.active') : t('admin.audit.values.suspended')
      }
      if (key === 'deactivated_by_admin') return isTrue ? t('admin.audit.values.suspended') : t('admin.audit.values.active')
      if (key === 'global_privacy') return isTrue ? t('admin.audit.values.private') : t('admin.audit.values.public')
      if (key === 'is_current') return isTrue ? t('admin.audit.values.yes') : t('admin.audit.values.no')

      return isTrue ? t('admin.audit.values.yes') : t('admin.audit.values.no')
    }

    // Detectar y formatear fechas ISO (ej. 2026-02-01T00:00:00.000000Z)
    if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T/.test(value)) {
      try {
        const date = new Date(value)
        return date.toLocaleDateString(i18n.language, {
          day: '2-digit',
          month: 'short',
          year: 'numeric'
        })
      } catch {
        // Si falla, retornamos el string original
      }
    }

    return String(value)
  }

  const formatAffectedUserDisplay = (log: AuditLog): string | null => {
    const entity = detectAuditEntityType(log)

    if (isPortfolioVisibilityEntity(entity) || entity === 'portfolio') {
      return t('admin.audit.values.professional', 'Profesional')
    }

    if (!log.affected_user) return null

    if (log.affected_user === 'Usuario') {
      return t('admin.audit.values.professional', 'Profesional')
    }

    return log.affected_user
  }

  const shouldShowAffectedUser = (log: AuditLog) => {
    const display = formatAffectedUserDisplay(log)
    return Boolean(display && display !== log.user_name)
  }

  const buildPdfDetailSummary = (log: AuditLog): string => {
    const props = log.properties
    if (!props?.attributes && !props?.old) {
      const fallback = log.detail || t('admin.audit.detail_modal.no_structured_details')
      return `• ${fallback}`
    }

    const attributes = props.attributes || {}
    const old = props.old || {}
    const keys = getChangedAuditKeys(log)

    if (keys.length === 0) {
      const fallback = log.detail || t('admin.audit.detail_modal.no_changes')
      const entitySummary = getAuditEntitySummary(log)
      return entitySummary ? `• ${entitySummary}\n• ${fallback}` : `• ${fallback}`
    }

    const bullets: string[] = []
    const entitySummary = getAuditEntitySummary(log)
    if (entitySummary) bullets.push(`• ${entitySummary}`)

    keys.forEach((key) => {
        const oldVal =
          old[key] !== undefined && old[key] !== null ? formatValue(key, old[key], log) : null
        const newVal =
          attributes[key] !== undefined && attributes[key] !== null
            ? formatValue(key, attributes[key], log)
            : null
        const label = translateKey(key, log)

        if (oldVal && newVal && oldVal !== newVal) {
          bullets.push(`• ${label}: ${oldVal} -> ${newVal}`)
          return
        }
        if (newVal) bullets.push(`• ${label}: ${newVal}`)
        else if (oldVal) bullets.push(`• ${label}: ${oldVal}`)
        else bullets.push(`• ${label}`)
      })

    return bullets.join('\n')
  }

  const handleExportPDF = async () => {
    if (filteredLogs.length === 0) return

    const [{ default: jsPDF }, { default: autoTable }] = await Promise.all([
      import('jspdf'),
      import('jspdf-autotable')
    ])

    const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' })
    const pageWidth = doc.internal.pageSize.getWidth()
    const marginX = 14
    const generatedAt = new Date().toLocaleString(i18n.language)

    doc.setFillColor(0, 48, 135)
    doc.rect(0, 0, pageWidth, 24, 'F')
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(15)
    doc.text(t('admin.audit.pdf.title'), marginX, 11)
    doc.setFontSize(9)
    doc.text(t('admin.audit.pdf.subtitle'), marginX, 18)

    doc.setTextColor(90, 90, 90)
    doc.setFontSize(8)
    doc.text(t('admin.audit.pdf.generated_at', { date: generatedAt }), pageWidth - marginX, 11, {
      align: 'right'
    })

    let summaryY = 32
    doc.setTextColor(30, 30, 30)
    doc.setFontSize(11)
    doc.text(t('admin.audit.pdf.summary_title'), marginX, summaryY)
    summaryY += 6

    doc.setFontSize(9)
    doc.setTextColor(70, 70, 70)
    doc.text(t('admin.audit.pdf.records_count', { count: filteredLogs.length }), marginX, summaryY)
    summaryY += 5

    if (dateFrom || dateTo) {
      doc.text(
        t('admin.audit.pdf.period', {
          from: dateFrom ? formatDateDisplay(dateFrom) : '...',
          to: dateTo ? formatDateDisplay(dateTo) : '...'
        }),
        marginX,
        summaryY
      )
    } else {
      doc.text(t('admin.audit.pdf.period_all'), marginX, summaryY)
    }
    summaryY += 5

    doc.text(
      searchTerm.trim()
        ? t('admin.audit.pdf.search_filter', { term: searchTerm.trim() })
        : t('admin.audit.pdf.no_search_filter'),
      marginX,
      summaryY
    )

    const tableColumn = [
      'ID',
      t('admin.audit.table.user'),
      t('admin.audit.pdf.affected_user'),
      t('admin.audit.table.event'),
      t('admin.audit.table.date'),
      t('admin.audit.pdf.summary')
    ]

    const tableRows = filteredLogs.map((log) => [
      String(log.id),
      log.user_name,
      (() => {
        const affected = formatAffectedUserDisplay(log)
        return affected && affected !== log.user_name
          ? affected
          : t('admin.audit.pdf.not_applicable')
      })(),
      translateEventName(log.event),
      log.timestamp,
      buildPdfDetailSummary(log)
    ])

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: summaryY + 6,
      theme: 'striped',
      headStyles: {
        fillColor: [0, 48, 135],
        textColor: 255,
        fontSize: 8,
        fontStyle: 'bold'
      },
      styles: {
        fontSize: 7.5,
        cellPadding: 2.5,
        overflow: 'linebreak',
        valign: 'top',
        lineColor: [220, 220, 220]
      },
      columnStyles: {
        0: { cellWidth: 12 },
        1: { cellWidth: 30 },
        2: { cellWidth: 30 },
        3: { cellWidth: 26 },
        4: { cellWidth: 28 },
        5: { cellWidth: 'auto', cellPadding: { top: 3, right: 2.5, bottom: 3, left: 2.5 } }
      },
      alternateRowStyles: { fillColor: [248, 250, 252] },
      margin: { left: marginX, right: marginX },
      didDrawPage: (data) => {
        const pageCount = doc.getNumberOfPages()
        const currentPage = data.pageNumber
        doc.setFontSize(8)
        doc.setTextColor(120, 120, 120)
        doc.text(
          t('admin.audit.pdf.page', { current: currentPage, total: pageCount }),
          pageWidth / 2,
          doc.internal.pageSize.getHeight() - 8,
          { align: 'center' }
        )
      }
    })

    const dateStr = new Date().toISOString().split('T')[0]
    doc.save(t('admin.audit.pdf.filename', { date: dateStr }))
  }

  const renderChangesTable = (log: AuditLog) => {
    const props = log.properties
    if (!props || (!props.attributes && !props.old)) {
      return (
        <div className="p-8 text-center text-gray-500 dark:text-gray-400 bg-gray-50/50 dark:bg-slate-800/50 rounded-2xl border border-dashed border-gray-200 dark:border-gray-700">
          {t('admin.audit.detail_modal.no_structured_details')}
        </div>
      )
    }

    const attributes = props.attributes || {}
    const old = props.old || {}

    const isUpdate =
      log.event === 'updated' ||
      log.event === 'profile_updated' ||
      log.event === 'portfolio_edit' ||
      Object.keys(old).length > 0

    if (isUpdate) {
      const keys = getChangedAuditKeys(log)

      if (keys.length === 0)
        return (
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4 bg-gray-50 dark:bg-slate-800 rounded-xl">
            {t('admin.audit.detail_modal.no_changes')}
          </p>
        )

      const entitySummary = getAuditEntitySummary(log)

      return (
        <div className="space-y-3">
          {entitySummary && (
            <div className="px-4 py-3 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-900/40">
              <p className="text-[11px] uppercase tracking-wider text-indigo-500 dark:text-indigo-300 font-bold mb-1">
                {t('admin.audit.detail_modal.affected_section')}
              </p>
              <p className="text-sm font-semibold text-indigo-900 dark:text-indigo-100">
                {entitySummary}
              </p>
            </div>
          )}
          <div className="rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm bg-white dark:bg-slate-900">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50/80 dark:bg-slate-800 border-b border-gray-200 dark:border-gray-700 text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400">
              <tr>
                <th className="px-5 py-4 font-bold w-1/3">{t('admin.audit.detail_modal.field')}</th>
                <th className="px-5 py-4 font-bold text-red-600 dark:text-red-400 bg-red-50/50 dark:bg-red-900/20 w-1/3">
                  {t('admin.audit.detail_modal.old_value')}
                </th>
                <th className="px-5 py-4 font-bold text-green-600 dark:text-green-400 bg-green-50/50 dark:bg-green-900/20 w-1/3">
                  {t('admin.audit.detail_modal.new_value')}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {keys.map((key) => {
                const oldVal =
                  old[key] !== undefined && old[key] !== null
                    ? formatValue(key, old[key], log)
                    : 'Ø'
                const newVal =
                  attributes[key] !== undefined && attributes[key] !== null
                    ? formatValue(key, attributes[key], log)
                    : 'Ø'
                return (
                  <tr
                    key={key}
                    className="transition-colors hover:bg-gray-50 dark:hover:bg-slate-800 bg-white dark:bg-slate-900"
                  >
                    <td className="px-5 py-4 font-medium text-gray-900 dark:text-white border-r border-gray-100/50 dark:border-gray-800">
                      {translateKey(key, log)}
                    </td>
                    <td
                      className="px-5 py-4 text-red-900 dark:text-red-300 bg-red-50/20 dark:bg-red-900/10 font-mono text-xs break-all 
                                   line-through decoration-red-300/80 opacity-80"
                    >
                      {oldVal}
                    </td>
                    <td className="px-5 py-4 text-green-900 dark:text-green-300 bg-green-50/20 dark:bg-green-900/10 font-mono text-xs break-all font-medium flex items-center gap-2">
                      <span className="text-green-500 dark:text-green-400">
                        <ArrowRight size={14} />
                      </span>
                      {newVal}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        </div>
      )
    }

    const keys = Object.keys(attributes).filter(
      (k) => k !== 'created_at' && k !== 'updated_at' && k !== 'id'
    )
    if (keys.length === 0) return null

    return (
      <div className="rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm bg-white dark:bg-slate-900">
        <table className="w-full text-sm text-left">
          <thead className="bg-blue-50/50 dark:bg-blue-900/20 border-b border-blue-100 dark:border-blue-800 text-xs uppercase tracking-wider text-blue-700 dark:text-blue-300">
            <tr>
              <th className="px-5 py-4 font-bold w-1/3">{t('admin.audit.detail_modal.registered_data')}</th>
              <th className="px-5 py-4 font-bold">{t('admin.audit.detail_modal.value')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {keys.map((key) => (
              <tr
                key={key}
                className="bg-white dark:bg-slate-900 hover:bg-blue-50/30 dark:hover:bg-blue-900/10 transition-colors"
              >
                <td className="px-5 py-4 font-medium text-gray-900 dark:text-white border-r border-gray-50 dark:border-gray-800 bg-gray-50/10 dark:bg-slate-800/20">
                  {translateKey(key, log)}
                </td>
                <td className="px-5 py-4 text-blue-900 dark:text-blue-300 font-mono text-xs break-all bg-blue-50/10 dark:bg-blue-900/10">
                  {formatValue(key, attributes[key], log)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }

  const RightPanelContent = () => (
    <div className="sticky top-6 space-y-8">
      <div>
        <Calendar />
      </div>

      <div>
        <h3 className="font-bold text-textMain dark:text-white mb-4 flex items-center gap-2 uppercase tracking-wider text-xs">
          <ShieldCheck size={16} className="text-primary" />
          {t('admin.audit.security.title')}
        </h3>
        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800 shadow-sm">
          <p className="text-[11px] text-blue-700 dark:text-blue-300 leading-relaxed">
            {t('admin.audit.security.desc')}
          </p>
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-800 shadow-sm overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700 bg-gray-50/80 dark:bg-slate-900/50">
          <h3 className="font-bold text-textMain dark:text-white text-xs uppercase tracking-wider">
            {t('admin.audit.reports.title')}
          </h3>
          <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-relaxed mt-1.5">
            {t('admin.audit.reports.desc')}
          </p>
        </div>

        <div className="p-4 space-y-3">
          <div className="rounded-lg bg-blue-50/60 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900/40 p-3 space-y-2.5">
            <div className="flex items-center justify-between gap-3 text-[11px]">
              <span className="text-gray-500 dark:text-gray-400">{t('admin.audit.reports.records_label')}</span>
              <span className="font-bold text-[#003087] dark:text-cyan-400 text-sm">{filteredLogs.length}</span>
            </div>
            <div className="flex items-start justify-between gap-3 text-[11px]">
              <span className="text-gray-500 dark:text-gray-400 shrink-0">{t('admin.audit.reports.period_label')}</span>
              <span className="font-medium text-gray-700 dark:text-gray-200 text-right">
                {dateFrom || dateTo
                  ? `${dateFrom ? formatDateDisplay(dateFrom) : '...'} — ${dateTo ? formatDateDisplay(dateTo) : '...'}`
                  : t('admin.audit.reports.all_dates')}
              </span>
            </div>
            <div className="flex items-start justify-between gap-3 text-[11px]">
              <span className="text-gray-500 dark:text-gray-400 shrink-0">{t('admin.audit.reports.search_label')}</span>
              <span className="font-medium text-gray-700 dark:text-gray-200 text-right break-all">
                {searchTerm.trim() ? `"${searchTerm.trim()}"` : t('admin.audit.reports.no_search')}
              </span>
            </div>
          </div>

          <button
            onClick={handleExportPDF}
            disabled={loading || filteredLogs.length === 0}
            className="w-full flex items-center gap-3 p-3.5 bg-[#003087] dark:bg-blue-600 text-white hover:brightness-110 disabled:bg-gray-200 disabled:text-gray-400 disabled:dark:bg-slate-700 disabled:dark:text-gray-500 disabled:cursor-not-allowed rounded-xl transition-all group shadow-sm"
          >
            <div className="w-9 h-9 rounded-lg bg-white/15 flex items-center justify-center shrink-0">
              <Download size={18} />
            </div>
            <div className="text-left min-w-0">
              <span className="block text-sm font-bold">{t('admin.audit.export_pdf')}</span>
              <span className="block text-[10px] text-white/80 font-medium">
                {filteredLogs.length === 0
                  ? t('admin.audit.reports.export_empty')
                  : t('admin.audit.reports.export_desc')}
              </span>
            </div>
          </button>
        </div>
      </div>
    </div>
  )

  return (
    <div className="flex flex-1 overflow-hidden transition-colors duration-300">
      <Sidebar activeItem="Auditoría" />

      <main className="flex-1 flex flex-col lg:flex-row overflow-hidden bg-background dark:bg-slate-900">
        <div className="flex-1 p-4 sm:p-6 md:p-6 overflow-y-auto">
          <h1 className="text-xl sm:text-2xl font-bold text-textMain dark:text-white mb-6">
            {t('admin.audit.title')}
          </h1>

          {/* FILTROS RESPONSIVOS */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4 mb-8">
            {/* Buscador */}
            <div className="relative flex-1">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
                type="text"
                placeholder={t('admin.audit.search_placeholder')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700 dark:text-white rounded-xl shadow-sm focus:ring-2 focus:ring-primary/10 outline-none transition-all"
              />
            </div>

            {/* Selector de Fechas (Solución Definitiva con showPicker) */}
            <div className="flex items-center gap-2 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 px-4 py-2 flex-1 md:flex-none justify-between">
              <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-tighter w-full">
                {/* Botón Desde */}
                <div
                  className="relative flex-1 cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-700 p-1 rounded-md transition-colors"
                  onClick={() => handleOpenCalendar(dateFromRef)}
                >
                  <span className="text-gray-400 dark:text-gray-500 block mb-0.5">{t('admin.audit.date_from')}</span>
                  <span className="text-textMain dark:text-gray-200 block text-[13px] font-medium">
                    {formatDateDisplay(dateFrom)}
                  </span>
                  <input
                    ref={dateFromRef}
                    type="date"
                    value={dateFrom}
                    onChange={(e) => setDateFrom(e.target.value)}
                    className="absolute inset-0 opacity-0 pointer-events-none"
                  />
                </div>

                <div className="h-8 w-px bg-gray-100 dark:bg-gray-700 shrink-0"></div>

                {/* Botón Hasta */}
                <div
                  className="relative flex-1 cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-700 p-1 rounded-md transition-colors"
                  onClick={() => handleOpenCalendar(dateToRef)}
                >
                  <span className="text-gray-400 dark:text-gray-500 block mb-0.5">{t('admin.audit.date_to')}</span>
                  <span className="text-textMain dark:text-gray-200 block text-[13px] font-medium">
                    {formatDateDisplay(dateTo)}
                  </span>
                  <input
                    ref={dateToRef}
                    type="date"
                    value={dateTo}
                    onChange={(e) => setDateTo(e.target.value)}
                    className="absolute inset-0 opacity-0 pointer-events-none"
                  />
                </div>

                <CalendarIcon
                  size={18}
                  className="text-gray-300 dark:text-gray-600 shrink-0 ml-1"
                />
              </div>
            </div>
          </div>

          {/* TABLA DE AUDITORÍA */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden transition-colors duration-300">
            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[850px]">
                <thead>
                  <tr className="bg-gray-50/50 dark:bg-slate-900 border-b border-gray-100 dark:border-gray-700 text-gray-500 dark:text-gray-400 uppercase text-[11px] tracking-wider">
                    <th className="text-left px-6 py-4 font-bold">{t('admin.audit.table.user')}</th>
                    <th className="text-center px-6 py-4 font-bold">{t('admin.audit.table.event')}</th>
                    <th className="text-left px-6 py-4 font-bold">{t('admin.audit.table.date')}</th>
                    <th className="text-left px-6 py-4 font-bold text-center">{t('admin.audit.table.details')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                  {loading ? (
                    <tr>
                      <td colSpan={4} className="p-16 text-center text-gray-400 animate-pulse">
                        {t('admin.audit.table.loading')}
                      </td>
                    </tr>
                  ) : error ? (
                    <tr>
                      <td colSpan={4} className="p-16 text-center text-action font-medium">
                        {error}
                      </td>
                    </tr>
                  ) : filteredLogs.length > 0 ? (
                    filteredLogs.map((log) => (
                      <tr
                        key={log.id}
                        className="hover:bg-blue-50/20 dark:hover:bg-blue-900/10 transition-colors"
                      >
                        <td className="px-6 py-4 text-textMain dark:text-gray-300 font-normal">
                          {log.user_name}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span
                            className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${getEventBadgeClass(log.event)}`}
                          >
                            {translateEventName(log.event)}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-500 dark:text-gray-400 font-mono text-xs">
                          {log.timestamp}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-center">
                            <button
                              onClick={() => setSelectedLog(log)}
                              className="p-1.5 bg-blue-50 dark:bg-slate-800 text-blue-600 dark:text-blue-400 hover:bg-blue-600 hover:text-white rounded-lg transition-all shadow-sm flex shrink-0 items-center justify-center border border-blue-100 dark:border-gray-700 hover:border-blue-600 group tooltip-trigger relative"
                              title={t('admin.audit.table.details')}
                            >
                              <Eye
                                size={18}
                                className="group-hover:scale-110 transition-transform"
                              />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="p-16 text-center text-gray-400 italic">
                        {t('admin.audit.table.no_results')}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* ASIDE DERECHO */}
        <aside className="hidden lg:block w-72 p-6 bg-white dark:bg-slate-900 lg:border-l border-gray-200 dark:border-gray-800 shrink-0 overflow-y-auto">
          <RightPanelContent />
        </aside>
      </main>

      {/* MODAL DETALLES DE ACTIVIDAD */}
      {selectedLog && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-gray-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-[2rem] shadow-2xl w-full max-w-4xl overflow-hidden border border-gray-100 dark:border-gray-800 flex flex-col max-h-[90vh] sm:max-h-[85vh] animate-in zoom-in-95 duration-200">
            <div className="px-6 py-5 sm:px-8 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-white dark:bg-slate-900">
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">
                  {t('admin.audit.detail_modal.title')}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-gray-500 dark:text-gray-400 font-mono bg-gray-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
                    ID: {selectedLog.id}
                  </span>
                  <span className="text-xs text-gray-400">•</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                    <CalendarIcon size={12} />
                    {selectedLog.timestamp}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedLog(null)}
                className="p-2.5 text-gray-400 bg-gray-50 dark:bg-slate-800 hover:bg-red-50 dark:hover:bg-red-900/30 hover:text-red-500 rounded-full transition-all"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 sm:p-8 overflow-y-auto flex-1 bg-gray-50/30 dark:bg-slate-800/20">
              <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-center gap-4 p-5 bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
                <div
                  className={`p-4 rounded-xl shrink-0 shadow-inner ${getEventBadgeClass(selectedLog.event)}`}
                >
                  <ShieldCheck size={28} />
                </div>
                <div className="flex-1 flex flex-col sm:flex-row gap-6">
                  <div>
                    <p className="text-xs text-gray-400 dark:text-gray-500 font-medium uppercase tracking-wider mb-1">
                      {t('admin.audit.detail_modal.responsible')}
                    </p>
                    <p className="font-bold text-gray-900 dark:text-white text-lg">
                      {selectedLog.user_name}
                    </p>
                  </div>
                  {shouldShowAffectedUser(selectedLog) && (
                    <div className="border-l-0 sm:border-l border-gray-200 dark:border-gray-700 pl-0 sm:pl-6">
                      <p className="text-xs text-blue-500 dark:text-blue-400 font-medium uppercase tracking-wider mb-1">
                        {t('admin.audit.detail_modal.affected')}
                      </p>
                      <p className="font-bold text-blue-700 dark:text-blue-300 text-lg">
                        {formatAffectedUserDisplay(selectedLog)}
                      </p>
                    </div>
                  )}
                </div>
                <div className="mt-4 sm:mt-0 sm:ml-auto sm:text-right shrink-0">
                  <span
                    className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest border ${getEventBadgeClass(selectedLog.event)} border-current/20`}
                  >
                    {translateEventName(selectedLog.event)}
                  </span>
                </div>
              </div>

              <div className="mb-4">
                <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2 uppercase tracking-wide">
                  {t('admin.audit.detail_modal.data_state')}
                </h4>
                {renderChangesTable(selectedLog)}
              </div>
            </div>

            <div className="px-6 py-5 sm:px-8 border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-slate-900 flex justify-end">
              <button
                onClick={() => setSelectedLog(null)}
                className="px-8 py-2.5 bg-gray-900 dark:bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-gray-800 dark:hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg focus:ring-4 focus:ring-gray-200 dark:focus:ring-blue-900"
              >
                {t('admin.audit.detail_modal.close')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AuditPage
