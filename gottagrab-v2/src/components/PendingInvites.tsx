'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { ListChecks, UserPlus2, UserMinus2 } from 'lucide-react'
import toast from 'react-hot-toast'

type Invite = {
  id: string
  list_id: string
  invited_by: string
  list: { name: string }[]   // array
}

export default function PendingInvites({
  invites,
  onAccept,
  onDecline,
}: {
  invites: Invite[]
  onAccept: (id: string) => void
  onDecline: (id: string) => void
}) {
  return (
    <div className="mb-6 px-2">
      <h3 className="text-lg font-semibold mb-2 flex items-center gap-2 text-secondary">
        <ListChecks size={20} /> Pending Invites
      </h3>
      <ul className="space-y-2">
        <AnimatePresence>
          {invites.map((inv) => {
            // grab the first list name
            const listName = inv.list[0]?.name ?? 'Unnamed List'
            return (
              <motion.li
                key={inv.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="flex justify-between items-center bg-bg p-4 rounded-lg shadow bubble"
              >
                <span>{listName}</span>
                <div className="flex gap-2">
                  <button
                    onClick={async () => {
                      await onAccept(inv.id)
                      toast.success('Invite accepted!', { icon: '✅' })
                    }}
                    className="flex items-center gap-1 px-3 py-1 bg-primary text-white rounded hover:bg-accent transition"
                  >
                    <UserPlus2 size={16} /> Accept
                  </button>
                  <button
                    onClick={async () => {
                      await onDecline(inv.id)
                      toast.error('Invite declined', { icon: '❌' })
                    }}
                    className="flex items-center gap-1 px-3 py-1 bg-secondary text-white rounded hover:bg-secondary/80 transition"
                  >
                    <UserMinus2 size={16} /> Decline
                  </button>
                </div>
              </motion.li>
            )
          })}
        </AnimatePresence>
      </ul>
    </div>
  )
}
