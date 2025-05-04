'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { UserPlus2, UserMinus2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { supabase } from '@/lib/supabase'

type Member = { user_id: string; email: string }

interface Props {
  listId: string
  isOpen: boolean
  onClose: () => void
}

export default function ManageMembersModal({
  listId,
  isOpen,
  onClose,
}: Props) {
  const [members, setMembers] = useState<Member[]>([])
  const [email, setEmail] = useState('')

  useEffect(() => {
    if (!isOpen) return
    supabase
      .rpc('get_list_members', { p_list_id: listId })
      .then(({ data, error }) => {
        if (error) toast.error(error.message, { icon: '❌' })
        else setMembers(data as Member[])
      })
  }, [isOpen, listId])

  const emailRegex = /^\S+@\S+\.\S+$/

  const invite = async () => {
    const trimmed = email.trim()
    if (!trimmed) {
      toast('Please enter an email address', { icon: '⚠️' })
      return
    }
    if (!emailRegex.test(trimmed)) {
      toast('Please enter a valid email', { icon: '⚠️' })
      return
    }
    const { error } = await supabase.rpc('invite_user', {
      p_list_id: listId,
      p_email: trimmed,
    })
    if (error) toast.error(error.message, { icon: '❌' })
    else {
      toast.success('Invite sent!', { icon: '📧' })
      setEmail('')
      const { data, error: err2 } = await supabase.rpc('get_list_members', {
        p_list_id: listId,
      })
      if (err2) toast.error(err2.message, { icon: '❌' })
      else setMembers(data as Member[])
    }
  }

  const remove = async (user_id: string) => {
    const { error } = await supabase
      .from('list_members')
      .delete()
      .match({ list_id: listId, user_id })
    if (error) toast.error(error.message, { icon: '❌' })
    else {
      toast('Member removed', { icon: '🗑️' })
      setMembers((m) => m.filter((x) => x.user_id !== user_id))
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
          className="fixed inset-0 bg-overlay flex items-center justify-center z-50"
        >
          <motion.div
            key="modal"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="bg-white p-6 rounded-2xl shadow-lg w-[90vw] max-w-md"
          >
            <h3 className="text-2xl font-semibold mb-4">Manage Members</h3>

            <div className="flex gap-2 mb-2">
              <input
                type="email"
                placeholder="Invite by email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-grow px-3 py-2  border border-secondary/30 rounded-md focus:ring-2 focus:ring-primary"
              />
              <button
                onClick={invite}
                className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition"
              >
                <UserPlus2 />
              </button>
            </div>

            <ul className="space-y-2 max-h-48 overflow-auto mb-4">
              {members.map((m) => (
                <li
                  key={m.user_id}
                  className="flex justify-between items-center bg-bg p-2 rounded-md"
                >
                  <span>{m.email}</span>
                  <button
                    onClick={() => remove(m.user_id)}
                    className="text-secondary hover:text-accent transition"
                  >
                    <UserMinus2 />
                  </button>
                </li>
              ))}
            </ul>

            <button
              onClick={onClose}
              className="mt-0 w-full py-2 bg-secondary text-white rounded-md hover:bg-secondary/80 transition"
            >
              Close
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
