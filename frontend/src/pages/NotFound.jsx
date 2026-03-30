import React from 'react'

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center bg-slate-50 text-black">
      
      <img
        src="image.png"
        alt="not found"
        className="w-full h-200 object-contain"
      />

      <a
        href="/"
        className="inline-block px-6 py-3 mt-6 font-medium text-white bg-black rounded-2xl hover:bg-gray-800"
      >
        Quay về trang chủ
      </a>

    </div>
  )
}

export default NotFound