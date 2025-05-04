'use client'

import { motion, AnimatePresence } from 'framer-motion'

type ConfirmModalProps = {
  isOpen: boolean
  message?: string
  onConfirm: () => void
  onCancel: () => void
}

export default function ConfirmModal({
  isOpen,
  message = 'Are you sure?',
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-overlay flex items-center justify-center z-50"
        >
          <motion.div
            key="modal-card"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="bg-white p-6 rounded-2xl shadow-bubble w-80 text-center"
          >
            <p className="text-lg mb-6 text-secondary">{message}</p>
            <div className="flex justify-center gap-4">
              <button
                onClick={onCancel}
                className="px-4 py-2 bg-bg text-secondary rounded-md hover:bg-accent transition"
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-700 transition"
              >
                Delete
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
