'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type {
  User,
  RealtimePostgresChangesPayload,
} from '@supabase/supabase-js'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import {
  PlusCircle,
  Trash2,
  ArrowLeft,
  Share2
} from 'lucide-react'
import ConfirmModal from './ConfirmModal'
import Autocomplete from './Autocomplete'
import ManageMembersModal from './ManageMembersModal'
import { groceryItems } from '@/lib/groceryItems'

// must match ListsManager.List
export type List = {
  id: string
  name: string
  owner_id: string
  icon: string
  icon_color: string
}

type Item = {
  id: number
  name: string
  list_id: string
  created_by: string
  created_at: string
}

export default function ShoppingList({
  user,
  list,
  onBack,
}: {
  user: User
  list: List
  onBack: () => void
}) {
  const [items, setItems] = useState<Item[]>([])
  const [newItem, setNewItem] = useState('')
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [targetDelete, setTargetDelete] = useState<number | null>(null)
  const [membersOpen, setMembersOpen] = useState(false)

  // initial load
  useEffect(() => {
    supabase
      .from('list_items')
      .select('*')
      .eq('list_id', list.id)
      .order('created_at', { ascending: true })
      .then(({ data, error }) => {
        if (error) toast.error(error.message, { icon: '❌' })
        else setItems(data as Item[])
      })
  }, [list.id])

  // realtime
  useEffect(() => {
    const channel = supabase
      .channel(`list_${list.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'list_items',
          filter: `list_id=eq.${list.id}`,
        },
        (p: RealtimePostgresChangesPayload<Item>) => {
          if (p.eventType === 'INSERT') {
            setItems((prev) => [...prev, p.new!])
          }
          if (p.eventType === 'DELETE') {
            setItems((prev) => prev.filter((i) => i.id !== p.old!.id))
          }
        }
      )
      .subscribe()
    return () => void supabase.removeChannel(channel)
  }, [list.id])

  // add
  const addItem = async () => {
    const name = newItem.trim()
    if (!name) {
      toast('Please enter an item to add', { icon: '❗' })
      return
    }
    setNewItem('')

    const { data, error } = await supabase
      .from('list_items')
      .insert({ name, list_id: list.id, created_by: user.id })
      .select()
      .single()

    if (error) {
      toast.error(error.message, { icon: '❌' })
    } else {
      setItems((prev) => [...prev, data as Item])
      toast.success('Item added!', { icon: '✅' })
    }
  }

  // delete
  const requestDelete = (id: number) => {
    setTargetDelete(id)
    setConfirmOpen(true)
  }
  const confirmDelete = async () => {
    if (targetDelete === null) return
    setItems((prev) => prev.filter((i) => i.id !== targetDelete))

    const { error } = await supabase
      .from('list_items')
      .delete()
      .eq('id', targetDelete)

    if (error) {
      toast.error(error.message, { icon: '❌' })
      // reload fallback
      const { data } = await supabase
        .from('list_items')
        .select('*')
        .eq('list_id', list.id)
        .order('created_at', { ascending: true })
      setItems(data as Item[])
    } else {
      toast('Item deleted', { icon: '🗑️' })
    }
    setConfirmOpen(false)
    setTargetDelete(null)
  }

  // pick list icon component
  const Icon = (require('lucide-react')[list.icon] ||
  ArrowLeft) as React.FC<any>

return (
  <div className="mt-6 px-4 sm:px-0">
    <div className="flex items-center justify-between mb-4">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-secondary font-semibold text-lg hover:text-accent transition"
      >
        <ArrowLeft size={24} /> Back
      </button>
      {list.owner_id === user.id && (
        <button
          onClick={() => setMembersOpen(true)}
          className="flex items-center gap-1 text-secondary hover:text-accent transition"
        >
          <Share2 size={24} /> Manage Members
        </button>
      )}
    </div>

    {/* ** Updated header ** */}
    <motion.h2
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="select-none cursor-default flex items-center justify-center gap-2 text-4xl sm:text-6xl font-bold mb-6 text-secondary"
    >
      <Icon size={48} color={list.icon_color} />
      {list.name}
    </motion.h2>

      {/* Add */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="flex-grow">
          <Autocomplete
            suggestions={groceryItems}
            value={newItem}
            onChange={setNewItem}
            placeholder="Add item…"
            className="w-full"
          />
        </div>
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={addItem}
          className="flex items-center gap-2 px-5 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-lg"
        >
          <PlusCircle size={22} /> Add
        </motion.button>
      </div>

      {/* List */}
      <ul className="space-y-4">
        <AnimatePresence>
          {items.map((item) => (
            <motion.li
              key={item.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="flex justify-between items-center bg-white p-4 rounded-lg shadow-lg"
            >
              <span className="text-secondary text-lg truncate">{item.name}</span>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => requestDelete(item.id)}
                className="text-secondary hover:text-accent transition"
              >
                <Trash2 size={20} />
              </motion.button>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>

      <ConfirmModal
        isOpen={confirmOpen}
        message="Delete this item?"
        onConfirm={confirmDelete}
        onCancel={() => setConfirmOpen(false)}
      />

      <ManageMembersModal
        listId={list.id}
        isOpen={membersOpen}
        onClose={() => setMembersOpen(false)}
      />
    </div>
  )
}
