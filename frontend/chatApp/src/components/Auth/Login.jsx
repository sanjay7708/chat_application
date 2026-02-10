import React, { useContext, useState } from 'react'
import api from '../api'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../../App'

export const Login = () => {
  const {username,setUsername,isLoggedin,setIsLoggedin}=useContext(AuthContext)
  const navigate=useNavigate()
  const [user,setUser]=useState({
    username:'',
    password:''
  })


  const handleChange=(e)=>{
      const{name,value}=e.target
      setUser((prev)=>({
        ...prev,
        [name]:value
      }))
  }

  const handleSubmit=async(e)=>{
    e.preventDefault()
    try{
      const res=await api.post('http://127.0.0.1:8000/accounts/login/',user);
      localStorage.setItem("access",res.data.access)
      localStorage.setItem("refresh",res.data.refresh)
      localStorage.setItem("username",res.data.username)

      // fetch username
      const who=await api.get('accounts/whoami/')
      
      setUsername(who.data.username);
      
      setIsLoggedin(true)
        
      alert('loggin success')
      navigate('/')
    }
    catch(error){
      alert(error.response.data.message)
    }
  }
  return (
    <>
      <h1 className='text-center mx-auto mt-10 text-3xl text-teal-500 font-bold'>Login</h1>
      <div className='flex justify-center mt-5'>
        <form action="" method='post' onSubmit={handleSubmit} className='w-full max-w-sm space-y-5'>
          <div className='flex flex-col gap-2'>
            <label className=''>Username:</label>
            <input type="text"  className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500" value={user.username} name='username' placeholder='enterusername' onChange={handleChange}/>
          </div>
          <div className='flex flex-col gap-2'>
            <label className=''>Password</label>
            <input type="password" className='border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500' value={user.password} name='password' placeholder='password'onChange={handleChange}/>
          </div>
          
            <button type='submit' className='w-full bg-teal-600 py-2 rounded hover:bg-teal-700 hover:cursor-pointer transition'>Login</button>
          
        </form>
      </div>
    </>
  )
}
