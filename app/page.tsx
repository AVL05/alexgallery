'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function RootPage() {
  const router = useRouter()

  useEffect(() => {
    // Basic redirect for static export
    router.replace('/es')
  }, [router])

  return (
    <div style={{ background: '#0a0a0a', height: '100vh', width: '100vw' }} />
  )
}
