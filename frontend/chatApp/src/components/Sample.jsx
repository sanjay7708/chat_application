import React, { useEffect, useState } from 'react'
import api from './api'

export const Sample = () => {
    const [data,setData]=useState([])
    useEffect(()=>{
        const apicall=async()=>{
            try{
                const res=await api.get('chat/userlist/')
                console.log(res.data)
                setData(res.data)
            }
            catch{
                setData('there is unautarized access')
            }
        }
        apicall()
    },[])
  return (
    <>
        {data.length>0?(
            <div className='grid grid-col-1 sm:grid-cols-2 md:grid-col-3 gap-4'>
                {data.map((item)=>(
                    <div key={item.id} className='flex items-center justify-between p-4 border rounded-lg shadow-sm bg-white'>
                        <div className='flex items-center gap-3'>
                            <img src="" alt="sample" className='w-12 h-12 rounded-full object-cover border'/>
                            <p className='font-semibold text-gray-800'>{item.name}</p>
                        </div>
                        <button className='px-4 py-1 text-sm font-medium text-white hover:cursor-pointer border rounded bg-blue-500 hover:bg-blue-600 transition'>Add Frined</button>
                    </div>
                    
                ))}
            </div>
        ):(
            <p>there is no data</p>
        )}
    </>
  )
}
