// src/components/Autocomplete.tsx
'use client'

import { useState, useRef, useEffect, type ChangeEvent, type Dispatch, type SetStateAction, type FC } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search } from 'lucide-react'

interface Props {
  suggestions: string[]
  value: string
  onChange: Dispatch<SetStateAction<string>>
  placeholder?: string
  className?: string
}

const Autocomplete: FC<Props> = ({
  suggestions,
  value,
  onChange,
  placeholder = '',
  className = '',
}) => {
  const [filtered, setFiltered] = useState<string[]>([])
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  // Filter suggestions as you type
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value
    onChange(v)
    if (v.trim()) {
      const f = suggestions
        .filter((item) => item.toLowerCase().includes(v.toLowerCase()))
        .slice(0, 5)
      setFiltered(f)
      setOpen(f.length > 0)
    } else {
      setFiltered([])
      setOpen(false)
    }
  }

  // Select a suggestion
  const handleSelect = (item: string) => {
    onChange(item)
    setOpen(false)
  }

  // Close dropdown on outside click
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [])

  return (
    <div ref={ref} className={`relative ${className}`}>
      {/* Input with search icon */}
      <div className="relative">
        <Search className="absolute top-1/2 left-3 -translate-y-1/2 text-secondary" />
        <input
          type="text"
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          className="w-full pl-10 pr-3 py-4 border border-secondary/30 rounded-md focus:ring-2 focus:ring-primary bg-white"
        />
      </div>

      {/* Suggestions dropdown */}
      <AnimatePresence>
        {open && (
          <motion.ul
            key="suggestions"
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.2 }}
            className="absolute z-50 mt-1 w-full bg-white border border-secondary/20 rounded-md shadow-lg overflow-auto max-h-40"
          >
            {filtered.map((item) => (
              <li key={item}>
                <button
                  onClick={() => handleSelect(item)}
                  className="w-full text-left px-3 py-2 hover:bg-secondary/10 transition"
                >
                  {item}
                </button>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  )
}

export default Autocomplete
