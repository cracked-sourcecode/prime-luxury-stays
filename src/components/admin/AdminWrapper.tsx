'use client'

import { ReactNode } from 'react'
import { AdminLocaleProvider } from '@/lib/adminLocale'

export default function AdminWrapper({ children }: { children: ReactNode }) {
  return (
    <AdminLocaleProvider>
      {children}
    </AdminLocaleProvider>
  )
}

