'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/useAuthStore'

export default function Home() {
  const router = useRouter()
  const checkAuth = useAuthStore(state => state.checkAuth)
  const token = useAuthStore(state => state.token)

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  useEffect(() => {
    if (token === null) return 
    if (token) {
      router.push('/products')
    } else {
      router.push('/login')
    }
  }, [router, token])

  return null
}
