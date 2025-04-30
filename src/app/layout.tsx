import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Toaster } from "@/components/ui/toaster"
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'MITRA - Team Management',
  description: 'Manage your team members with ease',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="overflow-x-hidden">
      <body className={`${inter.className} flex flex-col min-h-screen max-h-screen overflow-x-hidden`}>
        <Navbar />
        <main className="flex-grow flex flex-col overflow-y-auto">
          {children}
        </main>
        <Footer />
        <Toaster />
      </body>
    </html>
  )
}
