import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react'
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react'

// ─── Toast System ─────────────────────────────────────────────────────────────
interface Toast {
  id: string
  message: string
  type: 'success' | 'error' | 'info'
}

interface ToastContextType {
  showToast: (message: string, type?: Toast['type']) => void
}

const ToastContext = createContext<ToastContextType | null>(null)

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const showToast = useCallback((message: string, type: Toast['type'] = 'success') => {
    const id = Date.now().toString()
    setToasts(prev => [...prev, { id, message, type }])
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000)
  }, [])

  const removeToast = (id: string) => setToasts(prev => prev.filter(t => t.id !== id))

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {/* Toast Container */}
      <div className="fixed top-0 left-0 right-0 z-[9999] flex flex-col items-center gap-2 pointer-events-none"
        style={{ paddingTop: 'calc(env(safe-area-inset-top, 0px) + 12px)', paddingLeft: 16, paddingRight: 16 }}>
        {toasts.map(toast => (
          <div
            key={toast.id}
            className={`toast-in flex items-center gap-3 px-4 py-3 rounded-2xl shadow-xl max-w-sm w-full pointer-events-auto ${
              toast.type === 'success' ? 'bg-slate-900 text-white' :
              toast.type === 'error'   ? 'bg-red-600 text-white' :
                                         'bg-primary text-white'
            }`}
          >
            {toast.type === 'success' && <CheckCircle size={18} className="flex-shrink-0 text-emerald-400" />}
            {toast.type === 'error'   && <AlertCircle size={18} className="flex-shrink-0 text-red-200" />}
            {toast.type === 'info'    && <Info         size={18} className="flex-shrink-0 text-blue-200" />}
            <span className="text-sm font-medium flex-1">{toast.message}</span>
            <button onClick={() => removeToast(toast.id)} className="p-0.5 opacity-70 active:opacity-100">
              <X size={16} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}
