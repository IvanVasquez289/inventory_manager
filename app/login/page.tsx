import Link from 'next/link'
import React from 'react'

const LoginPage = () => {
  return (
    <div className='h-screen flex justify-center items-center text-black'>
      <div className='bg-gray-100 p-8 rounded shadow-md w-96'>
        <form>
          <h2 className='text-2xl font-bold mb-6 text-center'>Login</h2>
          <div className='mb-4'>
            <label className='block text-sm font-medium mb-2' htmlFor='email'>Email</label>
            <input
              type='email'
              id='email'
              className='w-full p-2 border border-gray-300 rounded'
              placeholder='Enter your email'
              required
            />
          </div>
          <div className='mb-6'>
            <label className='block text-sm font-medium mb-2' htmlFor='password'>Password</label>
            <input
              type='password'
              id='password'
              className='w-full p-2 border border-gray-300 rounded'
              placeholder='Enter your password'
              required
            />
          </div>
          <button
            type='submit'
            className='w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition duration-200'
          >
            Login
          </button>
        </form>
        <div className='mt-4 text-center'>
          No account? {' '}
          <Link href='/register' className='text-blue-600 hover:underline'>
            Register here
          </Link>
        </div>
      </div>
      
    </div>
  )
}

export default LoginPage