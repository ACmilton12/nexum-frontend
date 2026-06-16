import { Loader2 } from 'lucide-react'

const RouteFallback = () => (
  <div className="flex min-h-[40vh] w-full items-center justify-center bg-background dark:bg-slate-900">
    <Loader2 className="h-8 w-8 animate-spin text-[#003087] dark:text-cyan-400" aria-hidden="true" />
    <span className="sr-only">Cargando...</span>
  </div>
)

export default RouteFallback
