import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

export interface BreadcrumbItem {
  label: string
  href?: string
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]
}

export const Breadcrumb = ({ items }: BreadcrumbProps) => {
  return (
    <section className="bg-gray-50 py-4">
      <div className="container mx-auto px-4">
        <nav className="flex items-center space-x-2 text-sm" aria-label="Breadcrumb">
          {items.map((item, index) => {
            const isLast = index === items.length - 1
            
            return (
              <div key={index} className="flex items-center">
                {index > 0 && (
                  <ChevronRight className="h-4 w-4 text-gray-300 mx-2" />
                )}
                {item.href && !isLast ? (
                  <Link 
                    href={item.href} 
                    className="text-gray-500 hover:text-[#0a4768] transition-colors"
                  >
                    {item.label}
                  </Link>
                ) : (
                  <span className={isLast ? "text-gray-900 font-medium" : "text-gray-500"}>
                    {item.label}
                  </span>
                )}
              </div>
            )
          })}
        </nav>
      </div>
    </section>
  )
}
