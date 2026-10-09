import React, { useEffect } from 'react'
import ReactDOM from 'react-dom'
import { X } from 'lucide-react'

interface ModalSheetProps {
  children: React.ReactNode
  onClose: () => void
  /** height of sheet — default 'auto', can be '70vh', '90vh', etc. */
  height?: string
  title?: string
  /** Show a close (X) button in the top-right corner */
  showClose?: boolean
}

/**
 * Portal-based bottom sheet that renders directly into #modal-root,
 * completely outside any scroll containers or stacking contexts.
 * This is the only reliable way to ensure sheets appear above the TabBar
 * in a Capacitor / Android WebView environment.
 */
export default function ModalSheet({
  children,
  onClose,
  height = 'auto',
  title,
  showClose = false,
}: ModalSheetProps) {
  const root = document.getElementById('modal-root')
  if (!root) return null

  return ReactDOM.createPortal(
    <div
      className="fixed inset-0 flex flex-col justify-end"
      style={{ pointerEvents: 'auto' }}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Sheet panel */}
      <div
        className="relative bg-white rounded-t-3xl sheet-enter overflow-hidden flex flex-col"
        style={{ maxHeight: height === 'auto' ? '90vh' : height }}
      >
        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-1 shrink-0">
          <div className="w-10 h-1 bg-slate-200 rounded-full" />
        </div>

        {/* Optional header */}
        {(title || showClose) && (
          <div className="flex items-center justify-between px-5 py-3 shrink-0">
            {title && <h3 className="text-lg font-bold text-slate-800">{title}</h3>}
            {showClose && (
              <button
                onClick={onClose}
                className="p-2 -mr-2 bg-slate-100 rounded-full text-slate-500 btn-press"
              >
                <X size={18} />
              </button>
            )}
          </div>
        )}

        {/* Scrollable content */}
        <div className="overflow-y-auto" style={{ WebkitOverflowScrolling: 'touch' }}>
          {children}
        </div>

        {/* Safe area bottom spacer */}
        <div style={{ paddingBottom: 'env(safe-area-inset-bottom, 16px)' }} />
      </div>
    </div>,
    root
  )
}
