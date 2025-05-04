'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { User } from '@supabase/supabase-js'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import * as Icons from 'lucide-react'
import {
  List as ListIcon,
  Share2,
  Trash2,
  PlusCircle,
  Edit2,
} from 'lucide-react'
import ConfirmModal from './ConfirmModal'
import ManageMembersModal from './ManageMembersModal'
import ManageListModal from './ManageListModal'

// List type
export type List = {
    id: string
    name: string
    owner_id: string
    icon: string
    icon_color: string
  }
  
export default function ListsManager({
  user,
  onSelect,
  refreshFlag,
}: {
  user: User
  onSelect: (l: List) => void
  refreshFlag: number
}) {
  const [lists, setLists] = useState<List[]>([])
  const [newName, setNewName] = useState('')
  const [deleteListId, setDeleteListId] = useState<string | null>(null)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [manageListId, setManageListId] = useState<string | null>(null)
  const [editingList, setEditingList] = useState<List | null>(null)

  // load lists w/ icon
  useEffect(() => {
    supabase
      .from('lists')
      .select('id,name,owner_id,icon,icon_color')
      .order('created_at', { ascending: true })
      .then(({ data, error }) => {
        if (error) toast.error(error.message, { icon: '❌' })
        else setLists(data as List[])
      })
  }, [refreshFlag])

  // create list
  const createList = async () => {
    const name = newName.trim()
    if (!name) {
      toast('Please enter a list name', { icon: '⚠️' })
      return
    }
    setNewName('')
    const { data, error } = await supabase
      .from('lists')
      .insert({ name, owner_id: user.id })
      .select('id,name,owner_id,icon')
      .single()

    if (error) {
      toast.error(error.message, { icon: '❌' })
    } else {
      setLists((prev) => [...prev, data as List])
      toast.success('List created!', { icon: '🆕' })
    }
  }

  // request delete
  const requestDeleteList = (id: string) => {
    setDeleteListId(id)
    setConfirmOpen(true)
  }
  const confirmDeleteList = async () => {
    if (!deleteListId) return
    const { error } = await supabase.from('lists').delete().eq('id', deleteListId)
    if (error) toast.error(error.message, { icon: '❌' })
    else {
      setLists((prev) => prev.filter((l) => l.id !== deleteListId))
      toast('List deleted', { icon: '🗑️' })
    }
    setConfirmOpen(false)
    setDeleteListId(null)
  }

  // handle edit save
  const handleSave = (updated: Pick<List, 'id' | 'name' | 'icon'>) => {
    setLists((prev) =>
      prev.map((l) =>
        l.id === updated.id
          ? { ...l, name: updated.name, icon: updated.icon }
          : l
      )
    )
    setEditingList(null)
  }

  return (
    <div className="px-4 sm:px-0">
      <motion.h2
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-3xl sm:text-4xl font-bold mb-4 text-secondary select-none cursor-default text-center sm:text-left"
      >
        Your Lists
      </motion.h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-6">
        {lists.map((l) => {
          const IconComp = (Icons as any)[l.icon] || ListIcon
          return (
            <motion.div
              key={l.id}
              whileHover={{ scale: 1.03 }}
              className="flex items-center bg-white p-4 rounded-lg shadow-lg hover:shadow-xl transition-transform"
            >
              <IconComp size={24} className="text-primary mr-3" />
              <div className="flex-1">
                <button
                  onClick={() => onSelect(l)}
                  className="text-lg font-semibold text-secondary text-left w-full"
                >
                  {l.name}
                </button>
              </div>
              {l.owner_id === user.id && (
                <div className="flex gap-3">
                  <button
                    onClick={() => setEditingList(l)}
                    className="text-secondary hover:text-accent transition"
                  >
                    <Edit2 size={20} />
                  </button>
                  <button
                    onClick={() => setManageListId(l.id)}
                    className="text-secondary hover:text-accent transition"
                  >
                    <Share2 size={20} />
                  </button>
                  <button
                    onClick={() => requestDeleteList(l.id)}
                    className="text-secondary hover:text-red-500 transition"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              )}
            </motion.div>
          )
        })}
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <input
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="New list name"
          className="flex-grow px-4 py-3 border border-secondary/30 rounded-lg text-lg focus:ring-2 focus:ring-primary"
        />
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={createList}
          className="flex items-center justify-center gap-2 px-5 py-3 bg-green-600 text-white rounded-lg text-lg hover:bg-green-700 transition"
        >
          <PlusCircle size={22} /> Create
        </motion.button>
      </div>

      <ConfirmModal
        isOpen={confirmOpen}
        message="Delete this list and all its items?"
        onConfirm={confirmDeleteList}
        onCancel={() => setConfirmOpen(false)}
      />

<ManageMembersModal
        listId={manageListId!}
        isOpen={Boolean(manageListId)}
        onClose={() => setManageListId(null)}
      />

      {editingList && (
        <ManageListModal
          list={editingList}
          isOpen={true}
          onClose={() => setEditingList(null)}
          onSave={handleSave}
        />
      )}</div>
  )
}
