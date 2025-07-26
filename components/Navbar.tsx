import React from 'react'

const Navbar = () => {
  return (
    <nav className='bg-blue-600 p-4 text-white flex justify-between items-center'>
        <div className='text-lg font-bold'>MyApp</div>
        <ul className='flex space-x-4'>
            <li><a href='/login' className='hover:underline'>Login</a></li>
            <li><a href='/register' className='hover:underline'>Register</a></li>
        </ul>
    </nav>
  )
}

export default Navbar