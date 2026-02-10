import { createContext, useContext, useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import { BrowserRouter,Routes,Route, useNavigate, Navigate } from 'react-router-dom'
import { Login } from './components/Auth/Login'
import { SignUp } from './components/Auth/SignUp'
import { Sample } from './components/Sample'
import { Navbar } from './components/Navbar'
import { Rooms } from './components/Chat/Rooms'
import { RoomChat } from './components/Chat/RoomChat'
import { AddFriends } from './components/Chat/AddFriends'
import { Requests } from './components/Chat/Requests'
import api from './components/api'
import { UserProfile } from './components/Auth/UserProfile'
import { Profile } from './components/Auth/Profile'
export const AuthContext=createContext()
function App() {
  
  
const [username, setUsername] = useState(null)
const [isLoggedin, setIsLoggedin] = useState(false)

const [authLoading, setAuthLoading] = useState(true)
  useEffect(() => {
  const access = localStorage.getItem("access")
  if (!access){
    setAuthLoading(false)
    return
  }
  
  
  api.get("accounts/whoami/")
    .then(res => {
      setUsername(res.data.username)
      setIsLoggedin(true)
    })
    .catch(() => {
      localStorage.clear()
      localStorage.removeItem("username")
      setUsername(null)
      
      setIsLoggedin(false)
    })
    .finally(()=>{
      setAuthLoading(false)
    })
}, [])
if (authLoading) {
  return <div>Checking authentication...</div>
}
  return (
    <>
      <AuthContext.Provider value={{username,setUsername,isLoggedin,setIsLoggedin}}>
        <BrowserRouter>
      <Navbar/>
      <Routes>
        <Route path='/' element={isLoggedin? <Rooms/> : <Navigate to={'/login'}/> }/>
        <Route path="/login" element={<Login />} />
        <Route path='/signup' element={<SignUp/>}/>
        <Route path='/sample' element={<Sample/>}/>
        <Route path='/room_chat/:roomName' element={<RoomChat/>}/>
        <Route path='/add-friends' element={<AddFriends/>}/>
        <Route path='/requests' element={<Requests/>}/>
        <Route path='/user-profile/:userid' element={<UserProfile/>}/>
        <Route path='/profile' element={<Profile/>}/>
      </Routes>
      </BrowserRouter>
      </AuthContext.Provider>
      
    </>
  )
}

export default App
