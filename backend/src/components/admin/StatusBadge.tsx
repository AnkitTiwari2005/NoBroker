import { cn } from '@/lib/utils'

export default function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    published: 'bg-green-100 text-green-800',
    pending: 'bg-yellow-100 text-yellow-800',
    featured: 'bg-blue-100 text-blue-800',
    draft: 'bg-slate-100 text-slate-800',
    sold: 'bg-purple-100 text-purple-800',
    rented: 'bg-indigo-100 text-indigo-800',
    rejected: 'bg-red-100 text-red-800',
    archived: 'bg-slate-200 text-slate-600',
    new: 'bg-blue-100 text-blue-800',
    contacted: 'bg-yellow-100 text-yellow-800',
    closed: 'bg-green-100 text-green-800',
  }
  
  const defaultStyle = 'bg-slate-100 text-slate-800'
  const style = styles[status] || defaultStyle
  
  return (
    <span className={cn('px-2.5 py-0.5 rounded-full text-xs font-medium capitalize', style)}>
      {status.replace('_', ' ')}
    </span>
  )
}
