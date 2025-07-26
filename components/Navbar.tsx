"use client"
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/useAuthStore'
import Link from 'next/link'
import { useEffect } from 'react'

const Navbar = () => {
  const router = useRouter()
  const token = useAuthStore((state) => state.token)
  const setToken = useAuthStore((state) => state.setToken)
  const logout = useAuthStore((state) => state.logout)

  // Carga el token de localStorage al montar el componente (cliente)
  useEffect(() => {
    const storedToken = localStorage.getItem('token')
    if (storedToken) {
      setToken(storedToken)
    }
  }, [setToken])

  const authenticated = !!token

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  return (
    <nav className='bg-blue-600 p-4 text-white flex justify-between items-center'>
      <div className='text-lg font-bold cursor-pointer' onClick={() => router.push('/')}>
        MyApp
      </div>
      <ul className='flex space-x-4'>
        {!authenticated ? (
          <>
            <Link href='/login' className='hover:underline cursor-pointer'>
              Login
            </Link>
            <Link href='/register' className='hover:underline cursor-pointer'>
              Register
            </Link>
          </>
        ) : (
          <>
            <Link href='/products' className='hover:underline cursor-pointer'>
              Products
            </Link>
            <Link href='/profile' className='hover:underline cursor-pointer'>
              Profile
            </Link>
            <button onClick={handleLogout} className='hover:underline cursor-pointer'>
              Logout
            </button>
          </>
        )}
      </ul>
    </nav>
  )
}

export default Navbar
