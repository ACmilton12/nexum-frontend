import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'

interface BreadcrumbStep {
  label: string
  path?: string
}

interface BreadcrumbProps {
  steps: BreadcrumbStep[]
}

const Breadcrumb = ({ steps }: BreadcrumbProps) => {
  return (
    <nav className="flex items-center gap-2 px-6 py-2 text-sm text-gray-500 bg-[#eef3f8] border-b border-gray-200">
      {steps.map((step, index) => (
        <div key={index} className="flex items-center gap-2">
          {step.path ? (
            <Link to={step.path} className="hover:text-primary transition-colors">
              {step.label}
            </Link>
          ) : (
            <span className="font-semibold text-textMain">{step.label}</span>
          )}
          {index < steps.length - 1 && <ChevronRight size={14} className="text-gray-400" />}
        </div>
      ))}
    </nav>
  )
}

export default Breadcrumb
