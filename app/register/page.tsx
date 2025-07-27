"use client"
import { axiosInstance } from '@/lib/axios'
import { useAuthStore } from '@/store/useAuthStore'
import { FormRegister } from '@/types'
import Link from 'next/link'
import {  useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'

const RegisterPage = () => {
  const router = useRouter()
  const token = useAuthStore((state) => state.token)
  const setToken = useAuthStore((state) => state.setToken)
  const [formData, setFormData] = useState<FormRegister>({
    name: '',
    email: '',
    password: ''
  })

  useEffect(() => {
    if (token) {
      router.push('/products');
    }
  })
  const isValid = () => {
    return formData.name !== '' && formData.email !== '' && formData.password !== '';
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid()) {
      alert('Please fill in all fields');
      return;
    }

    try {
      const response = await axiosInstance.post('/auth/register', formData);
      if(response.status === 201) {
        setToken(response.data.token);
        router.push('/products')
      }
      
    } catch (error) {
      if( error instanceof Error) {
        console.log(`Error: ${error.message}`);
      }
    }
  }

  return (
    <div className='h-screen flex justify-center items-center text-black'>
      <div className='bg-gray-100 p-8 rounded shadow-md w-96'>
        <form onSubmit={handleSubmit}>
          <h2 className='text-2xl font-bold mb-6 text-center'>Register</h2>
          <div className='mb-4'>
            <label className='block text-sm font-medium mb-2' htmlFor='username'>Username</label>
            <input
              type='text'
              id='name'
              className='w-full p-2 border border-gray-300 rounded'
              placeholder='Enter your name'
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>
          <div className='mb-4'>
            <label className='block text-sm font-medium mb-2' htmlFor='email'>Email</label>
            <input
              type='email'
              id='email'
              className='w-full p-2 border border-gray-300 rounded'
              placeholder='Enter your email'
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </div>
          <button
            type='submit'
            className='w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition duration-200 cursor-pointer'
          >
            Register
          </button>
        </form>
        <div className='mt-4 text-center'>
          Already have an account?{' '}
          <Link href='/login' className='text-blue-600 hover:underline'>
            Login here
          </Link>
        </div>
      </div>
      
    </div>
  )
}

export default RegisterPage