import React, { useEffect, useState } from 'react'
import api from '../api'
import { useParams } from 'react-router-dom'

export const UserProfile = () => {
  const { userid } = useParams()
  const [userDetails, setUserDetails] = useState({
    username: "",
    lastseen: "",
    isActive: false,
  })


  useEffect(() => {
    const getUserProfile = async () => {
      const res = await api.get(`accounts/user_profile/${userid}/`)
      console.log(res.data)
      setUserDetails({
        username: res.data.username,
        isActive: res.data.is_active,
        lastseen: res.data.last_seen,
      })

    }
    getUserProfile()
  }, [])

  console.log(userDetails)
  return (
    <>
      <div className="min-h-screen bg-gray-100 flex justify-center items-start pt-10">

        <div className="w-full max-w-md bg-white rounded-2xl shadow-md p-6 text-center">

          {/* Profile Image */}
          <div className="flex justify-center">
            <img
              src={
                userDetails.profile_image
                  ? userDetails.profile_image
                  : "https://ui-avatars.com/api/?name=" + userDetails.username
              }
              alt="profile"
              className="w-28 h-28 rounded-full object-cover border-4 border-teal-300"
            />
          </div>

          {/* Online Status */}
          <div className="mt-3 flex justify-center items-center gap-2">
            <span
              className={`w-3 h-3 rounded-full ${userDetails.isActive ? "bg-green-500" : "bg-gray-400"
                }`}
            ></span>
            <p className="text-sm text-gray-600">
              {userDetails.isActive ? "Online" : "Offline"}
            </p>
          </div>

          {/* Username */}
          <h2 className="mt-4 text-2xl font-semibold text-gray-800">
            {userDetails.username}
          </h2>

          {/* Email */}
          <p className="text-gray-500 text-sm">
            {userDetails.email}
          </p>

          {/* Last Seen */}
          {!userDetails.isActive && (
      <p className="mt-2 text-xs text-gray-400">
        Last seen: {userDetails.lastseen || "N/A"}
      </p>
    )}
          

          {/* Action Button */}
          

        </div>

      </div>
    </>


  )
}
