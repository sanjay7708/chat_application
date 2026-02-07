import React, { useState } from 'react'
import api from '../api'
import { Link, useNavigate } from 'react-router-dom'

export const SignUp = () => {
    const navigate=useNavigate()
    const [error,setError]=useState("")
    const [newuser,setNewuser]=useState({
        username:'',
        email:'',
        password:'',
        confirm_password:''
    })

    const handleChange=(e)=>{
        const {name,value}=e.target
        setNewuser((prev)=>({
            ...prev,
            [name]:value
        }))
    }

    const handleSubmit=async(e)=>{
        e.preventDefault()
        try{
            const res=await api.post('accounts/signup/',newuser)
            alert(res.data.message)
            navigate('/login')
        }
        catch(err){
            const data=err.response?.data || {}
            if (data.non_field_errors){
                setError(data.non_field_errors[0])
            }
            else{
                setError(Object.values(data)?.[0]?.[0])
            }
        }
    }

  return (<>
    <h1 className='text-center mt-10 text-3xl font-bold text-teal-500'>signup</h1>
    <div className='flex justify-center mt-5'>
        
        <form action="" method='post' onSubmit={handleSubmit} className='w-full max-w-sm space-y-5'>
            {error &&(
                    <p className='text-red-600 text-sm mt-2'>{error}</p>
                )}
            <div className='flex flex-col gap-2'>
                <label className=''>Username:</label>
                <input type="text" className='border rounded px-3 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500' name='username'  value={newuser.username} onChange={handleChange} placeholder='username'/>
            </div>
            <div className='flex flex-col gap-2'>
                <label className=''>Email:</label>
                <input type="email" name='email' className='border rounded focus:ring-2 px-3 py-3 focus:outline-none focus:ring-teal-500' value={newuser.email} onChange={handleChange} placeholder='email'/>
            </div>
            <div className='flex flex-col gap-2'>
                <label className=''>Password:</label>
                <input type="password" className='border rounded px-3 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500' name='password' value={newuser.password} onChange={handleChange} placeholder='password'/>
            </div>
            <div className='flex flex-col gap-2'>
                <label className=''>Confirm Password:</label>
                <input type="password" name='confirm_password' value={newuser.confirm_password} onChange={handleChange} placeholder='confirm_password'
                className='border rounded px-3 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500'
                />
            </div>
            
                <button type='submit' className='w-full bg-teal-600 py-2 rounded hover:bg-teal-700 hover:cursor-pointer transition'>Signup</button>
                <Link to={'/login'} className='text-blue-400 text-lg font-bold cursor-default'>alreayd have an account <span className='text-blue-400 hover:text-blue-900 cursor-pointer'>Login</span></Link>
        </form>
        
    </div>
    </>
  )
}
