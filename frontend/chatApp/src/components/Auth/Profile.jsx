import React, { useEffect, useState } from 'react'
import api from '../api'

export const Profile = () => {
  const BASE_URL = "http://127.0.0.1:8000";
  const [image, setImage] = useState(null)
  const [userDetails, setUserDetails] = useState({
    username: '',
    email: '',
    profile_image: ''
  })


  useEffect(() => {
    const getUserDetails = async () => {
      try {
        const res = await api.get('accounts/profile/')
        setUserDetails({
          username: res.data.username,
          email: res.data.email,
          profile_image: res.data.profile_image
        })
      }
      catch {
        console.log('error')
      }

    }
    getUserDetails()
  }, [])

  const changeProfile = async (e) => {
    e.preventDefault()
    if (!image) {
      alert('Select an image firs')
    }

    const formData = new FormData()
    formData.append('image', image)
    try {
      const res = await api.patch('accounts/profile/', formData)
      setUserDetails({
        profile_image: res.data.image
      })
      console.log(res)
    }
    catch {
      console.log('error')
    }
  }

  return (
    <>
      <div className="min-h-screen bg-gray-100 flex justify-center items-start pt-10">

        <div className="w-full max-w-md bg-white rounded-2xl shadow-md p-6 text-center">

          {/* Profile Image */}
          <div className="flex justify-center">
            <img
              src={
                userDetails.profile_image
                  ? `${BASE_URL}${userDetails.profile_image}`
                  : "https://ui-avatars.com/api/?name=" + userDetails.username
              }
              alt="profile"
              className="w-28 h-28 rounded-full object-cover border-4 border-teal-300"
            />
          </div>
          <form
            onSubmit={changeProfile}
            className="mt-6 flex flex-col items-center gap-4"
          >
            {/* File input */}
            <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 transition px-4 py-2 rounded-lg border border-gray-300 text-sm font-medium">
              Choose Photo
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImage(e.target.files[0])}
                className="hidden"
              />
            </label>

            {/* Selected file name */}
            {image && (
              <p className="text-xs text-gray-500">
                Selected: {image.name}
              </p>
            )}

            {/* Submit button */}
            <button
              type="submit"
              className="w-full bg-teal-500 hover:bg-teal-600 text-white font-semibold py-2 rounded-lg shadow-md transition active:scale-95"
            >
              Update Profile Photo
            </button>
          </form>

          {/* Username */}
          <h2 className="mt-4 text-2xl font-semibold text-gray-800">
            {userDetails.username}
          </h2>

          {/* Email */}
          <p className="text-gray-500 text-sm">
            {userDetails.email}
          </p>

          {/* Last Seen */}





          {/* Action Button */}


        </div>

      </div>
    </>
  )
}
