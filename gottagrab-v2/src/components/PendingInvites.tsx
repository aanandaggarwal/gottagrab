'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { ListChecks, UserPlus2, UserMinus2 } from 'lucide-react'
import toast from 'react-hot-toast'
import * as Icons from 'lucide-react'
import { List as DefaultIcon } from 'lucide-react'

type Invite = {
  id:               string
  list_id:          string
  invitee_email:    string
  invited_by:       string
  invited_by_email: string
  list_name:        string
  list_icon:        string
  list_color:       string
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
      <ul className="space-y-4">
        <AnimatePresence>
          {invites.map((inv) => {
            // Dynamically look up the icon component
            const IconComp = (Icons as any)[inv.list_icon] || DefaultIcon

            return (
              <motion.li
                key={inv.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="flex justify-between items-center bg-white p-4 rounded-lg shadow"
              >
                <div className="flex items-center gap-3">
                  <IconComp
                    size={28}
                    className="flex-shrink-0"
                    style={{ color: inv.list_color }}
                  />
                  <div>
                    <p className="font-semibold">{inv.list_name}</p>
                    <p className="text-sm text-secondary">
                      Invited by {inv.invited_by_email}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={async () => {
                      await onAccept(inv.id)
                      toast.success('Invite accepted!', { icon: '✅' })
                    }}
                    className="flex items-center gap-1 px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition"
                  >
                    <UserPlus2 size={16} /> Accept
                  </button>
                  <button
                    onClick={async () => {
                      await onDecline(inv.id)
                      toast.error('Invite declined', { icon: '❌' })
                    }}
                    className="flex items-center gap-1 px-3 py-1 bg-gray-800 text-white rounded hover:bg-gray-700 transition"
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
