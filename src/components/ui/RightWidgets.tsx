import Calendar from './Calendar'

interface RightWidgetsProps {
  type?: string // Deprecated, kept for backwards compatibility to prevent TS errors
  className?: string
}

const RightWidgets = ({ className = '' }: RightWidgetsProps) => {
  return (
    <aside className={`w-full lg:w-[292px] ${className} bg-white dark:bg-slate-900 p-4 sm:p-6 flex flex-col gap-6 border-t lg:border-t-0 lg:border-l border-gray-200 dark:border-gray-800 overflow-y-auto transition-colors duration-300`}>
      {/* Calendario del Milton*/}
      <div className="flex flex-col gap-3">
        <Calendar />
      </div>

    </aside>
  )
}

export default RightWidgets
