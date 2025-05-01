import { ReactNode, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { FiAlertTriangle } from 'react-icons/fi'

interface ConfirmProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  type?: 'danger' | 'warning' | 'info'
}

export default function Confirm({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'danger'
}: ConfirmProps) {
  // Close modal on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }
    
    document.addEventListener('keydown', handleEscape)
    
    // Prevent body scroll when modal is open
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = ''
    }
  }, [isOpen, onClose])
  
  const getTypeStyles = () => {
    switch (type) {
      case 'danger':
        return {
          icon: <FiAlertTriangle className="h-6 w-6 text-error-500" />,
          confirmButton: 'bg-error-500 text-white hover:bg-error-600 focus:ring-error-500'
        }
      case 'warning':
        return {
          icon: <FiAlertTriangle className="h-6 w-6 text-warning-500" />,
          confirmButton: 'bg-warning-500 text-white hover:bg-warning-600 focus:ring-warning-500'
        }
      case 'info':
        return {
          icon: <FiAlertTriangle className="h-6 w-6 text-primary-500" />,
          confirmButton: 'bg-primary-500 text-white hover:bg-primary-600 focus:ring-primary-500'
        }
    }
  }
  
  const { icon, confirmButton } = getTypeStyles()
  
  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-neutral-900 bg-opacity-50 backdrop-blur-sm transition-opacity"
              onClick={onClose}
            />
            
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: 'spring', damping: 20, stiffness: 300 }}
              className="relative z-10 w-full max-w-md transform rounded-lg bg-white dark:bg-neutral-800 p-6 shadow-apple text-left"
            >
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-0.5">
                  {icon}
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-neutral-900 dark:text-white">{title}</h3>
                  <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-300">{message}</p>
                </div>
              </div>
              
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="btn btn-outline"
                >
                  {cancelText}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onConfirm()
                    onClose()
                  }}
                  className={`btn ${confirmButton}`}
                >
                  {confirmText}
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  )
}