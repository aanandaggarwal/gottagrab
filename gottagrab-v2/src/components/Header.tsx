'use client'

import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ShoppingCart, Dog, LogOut } from 'lucide-react'

export default function Header() {
  const router = useRouter()
  const signOut = async () => {
    await supabase.auth.signOut()
    router.refresh()
  }
  return (
    <header className="w-full bg-secondary text-white px-4 py-3 shadow bubble flex items-center justify-between">
      <motion.div whileTap={{ scale: 0.9 }} className="flex items-center gap-2">
        <Dog size={24} /> <ShoppingCart size={24} />{' '}
        <span className="text-xl font-bold">GottaGrab</span>
      </motion.div>
      <motion.button
        whileHover={{ scale: 1.1 }}
        onClick={signOut}
        className="flex items-center gap-1 text-sm bg-bg text-secondary px-3 py-1 rounded-md hover:bg-accent hover:text-white transition"
      >
        <LogOut size={16} /> Sign Out
      </motion.button>
    </header>
  )
}
