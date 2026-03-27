import React, { useContext } from 'react'
import { replace, useNavigate } from 'react-router-dom'
import api from './api'
import axios from 'axios'
import { AuthContext } from '../App'
import { Link } from 'react-router-dom'
export const Navbar = () => {
  const {username,setUsername,isLoggedin,setIsLoggedin}=useContext(AuthContext)
  const navigate=useNavigate()
  console.log(username)
  const logout=async()=>{
    try{
      const refreshToken=localStorage.getItem('refresh');
    if (refreshToken){
      await axios.post('http://127.0.0.1:8000/accounts/logout/',{
        refresh:refreshToken
      });
    }
    }
    catch{
      alert('there is an error while logout')
    }
    finally{
    localStorage.removeItem("access")
    localStorage.removeItem("refresh")
    localStorage.removeItem("username")
    

      setIsLoggedin(false)
      setUsername(null)
      navigate('/login',{replace:true})
      
    }
    
  }
  return (
    <>
<div className="bg-teal-600">
  <nav className="bg-teal-800 flex flex-col md:flex-row md:items-center md:justify-between px-4 py-4 w-full">
    
    {/* Logo */}
    <div className="flex justify-between items-center w-full md:w-auto">
      <Link to={"/"} className="text-xl text-white hover:text-green-400">Django Chat</Link>
    </div>

    {/* Menu */}
    {isLoggedin ? (
      <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4 mt-3 md:mt-0">
        
        <Link
          to="/profile"
          className="text-white hover:text-green-400"
        >
          {username}
        </Link>

        <Link
          to="/requests"
          className="text-white hover:text-green-400"
        >
          Friend List
        </Link>

        <Link
          to="/requests"
          className="text-white hover:text-green-400"
        >
          Request
        </Link>

        <button
          className="text-white hover:text-green-400 cursor-pointer text-left md:text-center"
          onClick={logout}
        >
          Logout
        </button>

      </div>
    ) : (
      <div className="flex flex-col md:flex-row md:items-center mt-3 md:mt-0">
        <Link
          to="/signup"
          className="text-white hover:text-green-400"
        >
          New User?
        </Link>
      </div>
    )}

  </nav>
</div>

    </>
  )
}
