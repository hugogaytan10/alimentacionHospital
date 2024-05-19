import React from 'react'
import { NavLink } from 'react-router-dom'

export const NotFound = () => {
  return (
    <div className='flex flex-wrap justify-center items-center h-screen'>
        <h1 className='block w-full text-center text-8xl'>404</h1>
        <h2 className='block w-full text-center text-2xl'>Page not found</h2>
        <NavLink to="/" className='w-1/4 text-center btn flex mt-20 text-gray-200'>Regresar al inicio</NavLink>
    </div>
  )
}
