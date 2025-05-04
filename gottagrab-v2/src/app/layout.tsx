import './globals.css'
import { ReactNode } from 'react'
import { Toaster } from 'react-hot-toast'

export const metadata = {
  title: 'GottaGrab',
  description: 'Shared shopping lists',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="font-sans antialiased min-h-screen">
        {children}
        <Toaster position="top-right" />
      </body>
    </html>
  )
}
