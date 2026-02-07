import React, { useEffect, useRef, useState, useContext } from 'react'
import { Link, useParams } from 'react-router-dom'
import { AuthContext } from '../../App'
import api from '../api'

export const RoomChat = () => {
  const { username } = useContext(AuthContext)

  const [message, setMessage] = useState('')
  const [oldmessage, setOldmessage] = useState([])
  const [newMessage, setNewMessage] = useState([])
  
  const socketRef = useRef(null)
  const { roomName } = useParams()

  useEffect(() => {
    const getroom_messages = async () => {
      
      try {
        const res = await api.get(`chat/room_detail/${roomName}/`)
        
        // Normalize old messages
        const normalizedOld = res.data.map(item => ({
          userid: item.userid,
          username: item.username,
          message: item.message
        }))

        setOldmessage(normalizedOld)
      } catch {
        console.log('error')
      }
    }
    getroom_messages()
    const token=localStorage.getItem('access');
      if(!token){
        alert('not connected');
        return
      }

    socketRef.current = new WebSocket(`ws://127.0.0.1:8000/ws/chat/${roomName}/?token=${token}`)

    socketRef.current.onopen = () => {
      console.log('websocket connected')
    }

    socketRef.current.onclose = () => {
      console.log('websocket closed')
    }

    socketRef.current.onmessage = (e) => {
      const data = JSON.parse(e.data)
      if (data.message) {
        setNewMessage(prev => [...prev, {
          userid:data.userid,
          username: data.username,
          message: data.message,
        }])
      }
    }

    return () => {
      socketRef.current.close()
    }

  }, [roomName])

  const handleChange = (e) => {
    setMessage(e.target.value)
  }

  const sendMessage = (e) => {
    e.preventDefault()
    if (!message.trim()) return

    socketRef.current.send(
      JSON.stringify({
        username: username,
        message: message
      })
    )
    setMessage('')
  }

  const allmessage = [...oldmessage, ...newMessage]
  
  return (
    <>
      <div className='p-10 lg:p-20 text-center'>
        <h1 className='text-2xl lg:text-4xl'>{roomName}</h1>
      </div>

      <div className='lg:w-2/4 mx-4 lg:mx-auto bg-white rounded-xl'>
        <div className='space-y-3' id='chat-messages'>
          {allmessage.map((msg, i) => (
            <div key={i} className='p-4 bg-teal-200 rounded-xl'>
              
              <Link to={`/user-profile/${msg.userid}`} className='font-bold'>{msg.username}</Link>
              <p>{msg.message}</p>
            </div>
          ))}
        </div>
      </div>

      <div className='lg:w-2/4 mt-6 mx-4 lg:mx-auto p-4 bg-gray-200 rounded-xl'>
        <form className='flex' onSubmit={sendMessage}>
          <input
            type="text"
            placeholder='enter text'
            value={message}
            className='flex-1 mr-3 rounded focus:outline-none focus:ring-black px-3'
            onChange={handleChange}
          />
          <button className='px-5 py-3 rounded-xl bg-green-300 hover:bg-green-500 transition hover:cursor-pointer'>
            Send
          </button>
        </form>
      </div>
    </>
  )
}
