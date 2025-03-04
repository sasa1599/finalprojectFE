import React from 'react'
import { ToastContainer } from 'react-toastify'

const ToastContainerElement = () => {
  return (
    <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
    />
  )
}

export default ToastContainerElement