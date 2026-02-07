import React, { useEffect, useState } from 'react'
import api from '../api'
import { Link } from 'react-router-dom'

export const Rooms = () => {
    const [listRoom,setListRoom]=useState([])
    const [roomType,setRoomType]=useState('')
    useEffect(()=>{
        const listroom=async()=>{
            try{
                const res=await api.get('chat/roomlist/')
                setListRoom(res.data)
            }
            catch{
                console.error('error')
            }
        }
        listroom()

    },[])
  return (
    <>
        <div className='p-10 lg:p-20 text-center '>
            <h1 className='text-2xl lg:text-4xl text-teal-600'>Chats</h1>
        </div>
        {listRoom.length>0?(
            <div className='w-full flex flex-wrap flex-col items-center my-10'>
                {listRoom.map((item)=>(
                <div key={item.id} className='w-full lg:w-6xl px-3 py-3'>
                    <div className='p-4 bg-teal-600 rounded-xl shadow text-center' >
                        <h1 className='mb-5 text-2xl font-semibold'>{item.room_name}</h1>
                        {item.room_type=='private'?(
                            <span className='font-bold text-gray-200'>Private chat</span>
                        ):
                        (
                            <span className='font-bold text-gray-200'>Group Chat</span>
                        )}
                        
                        <Link to={`/room_chat/${item.room_name}`} className='block w-full lg:w-1/3 mx-auto px-5 py-3  rounded-xl text-white bg-green-600 hover:bg-red-700   text-center'>Join</Link>
                    </div>    
                </div>        
                ))}
            </div>    
        ):(
            <p>there is no room</p>
        )}
        
    </>
  )
}
