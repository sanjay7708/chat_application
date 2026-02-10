import React, { useEffect } from 'react'
import api from '../api'
import { useState } from 'react'

export const Requests = () => {
    const [interestRequest,setInterestRequest]=useState([])
    useEffect(()=>{
        const getrequest=async()=>{
            try{
                const res=await api.get('chat/income_request/')
                console.log(res)
                setInterestRequest(res.data)
            }
            catch{
                console.log('error')
            }
        }
        getrequest()
    },[])
    
    const ResponseRequest=async(interestId,status)=>{
        try{
            const res=await api.post('chat/response_request/',{
                interest_id: interestId,
                status: status
            })
        }
        catch{
            console.log('error')
        }
    }

  return (
    <>
    {interestRequest.length>0?(
            <div className='grid grid-col-1 sm:grid-cols-2 md:grid-col-3 gap-4'>
                {interestRequest.map((item)=>(
                    <div key={item.id} className='flex items-center justify-between p-4 border rounded-lg shadow-sm bg-white'>
                        <div className='flex items-center gap-3'>
                            <img src="" alt="sample" className='w-12 h-12 rounded-full object-cover border'/>
                            <p className='font-semibold text-gray-800'>{item.sender_name}</p>
                        </div>
                        <button className='px-4 py-1 text-sm font-medium text-white hover:cursor-pointer border rounded bg-blue-500 hover:bg-blue-600 transition'onClick={()=>ResponseRequest(item.id, 'accepted')}>Accept</button>
                        <button className='px-4 py-1 text-sm font-medium text-white hover:cursor-pointer border rounded bg-blue-500 hover:bg-blue-600 transition'onClick={()=> ResponseRequest(item.id, 'rejected')}>Reject</button>
                    </div>
                    
                ))}
            </div>
        ):(
            <p>there is no data</p>
        )}
    </>
  )
}
