'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { motion } from 'framer-motion'
import { LogIn, Lock, UserPlus2 } from 'lucide-react'

export default function AuthModal() {
  const [email, setEmail] = useState('')
  const [pw, setPw] = useState('')
  const [isLogin, setIsLogin] = useState(true)
  const [err, setErr] = useState<string | null>(null)

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setErr(null)
    const fn = isLogin
      ? supabase.auth.signInWithPassword({ email, password: pw })
      : supabase.auth.signUp({ email, password: pw })
    const { error } = await fn
    if (error) setErr(error.message)
  }
  const handleGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({ provider: 'google' })
    if (error) setErr(error.message)
  }

  return (
    <div className="fixed inset-0 bg-overlay flex items-center justify-center z-50">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-bg p-6 rounded-2xl shadow bubble w-11/12 max-w-sm"
      >
        <h2 className="text-2xl font-bold text-center mb-4">
          {isLogin ? 'Welcome Back' : 'Create Account'}
        </h2>
        <form onSubmit={handleAuth} className="space-y-3">
          <div className="relative">
            <Lock className="absolute top-1/2 left-3 -translate-y-1/2 text-secondary" />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-secondary/30 rounded-md focus:ring-2 focus:ring-primary"
              required
            />
          </div>
          <div className="relative">
            <Lock className="absolute top-1/2 left-3 -translate-y-1/2 text-secondary" />
            <input
              type="password"
              placeholder="Password"
              value={pw}
              onChange={(e) => setPw(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-secondary/30 rounded-md focus:ring-2 focus:ring-primary"
              required
            />
          </div>
          {err && <p className="text-sanguine-brown text-sm">{err}</p>}
          <button
            type="submit"
            className="w-full py-2 bg-primary text-white rounded-md hover:bg-accent transition"
          >
            {isLogin ? 'Sign In' : 'Sign Up'}
          </button>
        </form>
        <div className="my-4 text-center relative">
          <span className="px-2 bg-bg text-secondary">OR</span>
        </div>
        <button
          onClick={handleGoogle}
          className="w-full flex items-center justify-center gap-2 py-2 border border-primary text-white rounded-md bg-red-700 hover:bg-accent hover:text-white transition"
        >
          <LogIn /> Continue with Google
        </button>
        <p className="text-center text-sm mt-4">
          {isLogin ? "Don't have an account?" : 'Already have one?'}{' '}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-accent font-semibold"
          >
            {isLogin ? 'Sign up' : 'Log in'}
          </button>
        </p>
      </motion.div>
    </div>
  )
}
