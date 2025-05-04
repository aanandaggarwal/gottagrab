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

interface Props {
  user: User
  onSelect: (l: List) => void
  refreshFlag: number
  setRefreshFlag: React.Dispatch<React.SetStateAction<number>>
}

export default function ListsManager({
  user,
  onSelect,
  refreshFlag,
  setRefreshFlag,
}: Props) {
  const [lists, setLists] = useState<List[]>([])
  const [newName, setNewName] = useState('')
  const [deleteListId, setDeleteListId] = useState<string | null>(null)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [manageListId, setManageListId] = useState<string | null>(null)
  const [editingList, setEditingList] = useState<List | null>(null)

  useEffect(() => {
    supabase
      .from('lists')
      .select('id, name, owner_id, icon, icon_color')
      .order('created_at', { ascending: true })
      .then(({ data, error }) => {
        if (error) toast.error(error.message, { icon: '❌' })
        else setLists(data as List[])
      })
  }, [refreshFlag, user.id])

  const createList = async () => {
    const name = newName.trim()
    if (!name) {
      toast('Please enter a list name', { icon: '⚠️' })
      return
    }
    setNewName('')

    const defaultIcon = 'ListIcon'
    const defaultColor = '#6B7280'

    const { data, error } = await supabase
      .from('lists')
      .insert({
        name,
        owner_id: user.id,
        icon: defaultIcon,
        icon_color: defaultColor,
      })
      .select('id, name, owner_id, icon, icon_color')
      .single()

    if (error) toast.error(error.message, { icon: '❌' })
    else {
      setLists((prev) => [...prev, data])
      toast.success('List created!', { icon: '🆕' })
    }
  }

  const requestDeleteList = (id: string) => {
    setDeleteListId(id)
    setConfirmOpen(true)
  }

  const confirmDeleteList = async () => {
    if (!deleteListId) return

    const { error } = await supabase
      .from('lists')
      .delete()
      .eq('id', deleteListId)

    if (error) toast.error(error.message, { icon: '❌' })
    else {
      setLists((prev) => prev.filter((l) => l.id !== deleteListId))
      toast('List deleted', { icon: '🗑️' })
    }

    setConfirmOpen(false)
    setDeleteListId(null)
  }

  // receives the freshly‐fetched row from ManageListModal
  const handleSave = (updatedList: List) => {
    // 1) overwrite in our local array
    setLists((prev) =>
      prev.map((l) =>
        l.id === updatedList.id ? updatedList : l
      )
    )
    // 2) close modal + open the updated list
    setEditingList(null)
    onSelect(updatedList)
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
              <IconComp
                size={24}
                style={{ color: l.icon_color || '#6B7280' }}
                className="mr-3 flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <button
                  onClick={() => onSelect(l)}
                  className="text-lg font-semibold text-secondary text-left w-full hover:text-primary transition truncate"
                >
                  {l.name}
                </button>
              </div>
              <div className="flex gap-3 ml-2 flex-shrink-0">
                {l.owner_id === user.id && (
                  <>
                    <button
                      title="Edit List"
                      onClick={() => setEditingList(l)}
                      className="text-secondary hover:text-accent transition"
                    >
                      <Edit2 size={20} />
                    </button>
                    <button
                      title="Manage Members"
                      onClick={() => setManageListId(l.id)}
                      className="text-secondary hover:text-primary transition"
                    >
                      <Share2 size={20} />
                    </button>
                    <button
                      title="Delete List"
                      onClick={() => requestDeleteList(l.id)}
                      className="text-secondary hover:text-red-700 transition"
                    >
                      <Trash2 size={20} />
                    </button>
                  </>
                )}
              </div>
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
          onKeyDown={(e) => e.key === 'Enter' && createList()}
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

      {manageListId && (
        <ManageMembersModal
          listId={manageListId}
          isOpen={true}
          onClose={() => setManageListId(null)}
        />
      )}

      {editingList && (
        <ManageListModal
          list={editingList}
          isOpen={true}
          onClose={() => setEditingList(null)}
          onSave={handleSave}
        />
      )}
    </div>
  )
}
