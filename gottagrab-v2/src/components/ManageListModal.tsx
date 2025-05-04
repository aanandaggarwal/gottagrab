'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import { supabase } from '@/lib/supabase'
import {
  List as ListIcon,
  ShoppingCart,
  Tag,
  Star,
  Box,
  Heart,
} from 'lucide-react'

export type ListEdit = {
  id: string
  name: string
  icon: string
  icon_color: string
}

interface Props {
  list: ListEdit
  isOpen: boolean
  onClose: () => void
  onSave: (updated: ListEdit) => void
}

const COLOR_OPTIONS = [
  '#EF4444', // red-500
  '#F59E0B', // amber-500
  '#10B981', // emerald-500
  '#3B82F6', // blue-500
  '#6366F1', // indigo-500
  '#8B5CF6', // violet-500
  '#EC4899', // pink-500
  '#14B8A6', // teal-500
]

const ICON_OPTIONS: { id: string; Icon: React.FC<any> }[] = [
  { id: 'ListIcon', Icon: ListIcon },
  { id: 'ShoppingCart', Icon: ShoppingCart },
  { id: 'Tag', Icon: Tag },
  { id: 'Star', Icon: Star },
  { id: 'Box', Icon: Box },
  { id: 'Heart', Icon: Heart },
]

export default function ManageListModal({
  list,
  isOpen,
  onClose,
  onSave,
}: Props) {
  const [name, setName] = useState(list.name)
  const [icon, setIcon] = useState(list.icon)
  const [iconColor, setIconColor] = useState(list.icon_color)

  useEffect(() => {
    if (isOpen) {
      setName(list.name)
      setIcon(list.icon)
      setIconColor(list.icon_color)
    }
  }, [isOpen, list])

  const save = async () => {
    const trimmed = name.trim()
    if (!trimmed) {
      toast('Please enter a list name', { icon: '⚠️' })
      return
    }
    const { error } = await supabase
      .from('lists')
      .update({ name: trimmed, icon, icon_color: iconColor })
      .eq('id', list.id)

    if (error) {
      toast.error(error.message, { icon: '❌' })
    } else {
      toast.success('List updated!', { icon: '✅' })
      onSave({
        id: list.id,
        name: trimmed,
        icon,
        icon_color: iconColor,
      })
      onClose()
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
        >
          <motion.div
            key="modal"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="bg-white p-6 rounded-2xl shadow-lg max-w-md w-full"
          >
            <h3 className="text-2xl font-semibold mb-4">Edit List</h3>

            {/* Name */}
            <label className="block mb-4">
              <span className="text-secondary">Name</span>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-secondary/30 rounded-md focus:ring-2 focus:ring-primary"
              />
            </label>

            {/* Icon Picker */}
            <div className="mb-4">
              <span className="text-secondary block mb-1">Icon</span>
              <div className="flex flex-wrap gap-3">
                {ICON_OPTIONS.map(({ id, Icon }) => (
                  <button
                    key={id}
                    onClick={() => setIcon(id)}
                    className={`p-2 rounded-lg transition ${
                      icon === id
                        ? 'bg-primary text-white'
                        : 'bg-bg text-secondary hover:bg-deco'
                    }`}
                  >
                    <Icon size={24} />
                  </button>
                ))}
              </div>
            </div>

            {/* Color Picker */}
            <div className="mb-6">
              <span className="text-secondary block mb-1">Icon Color</span>
              <div className="grid grid-cols-4 gap-4 justify-center">
                {COLOR_OPTIONS.map((c) => (
                  <button
                    key={c}
                    onClick={() => setIconColor(c)}
                    style={{ backgroundColor: c }}
                    className={`h-10 w-10 rounded-full transform hover:scale-110 transition ${
                      iconColor === c ? 'ring-4 ring-offset-2 ring-primary' : ''
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 bg-secondary text-white rounded-md hover:bg-secondary/80 transition"
              >
                Cancel
              </button>
              <button
                onClick={save}
                className="px-4 py-2 bg-primary text-white rounded-md hover:bg-accent transition"
              >
                Save
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
