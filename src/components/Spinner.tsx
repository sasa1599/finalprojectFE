"use client"
import React, { useEffect, useState } from 'react'

export default function Spinner() {
    const [isTimeout, setIsTimeout] = useState(false)
    useEffect(() => {
        // hilangkan Spinner loading setelah 1.5s
        setTimeout(() => {
            setIsTimeout(true)
        }, 1500);
    }, [])
  return (
    <div className={`w-full bg-gray-900 ${isTimeout ? "hidden" : "flex"} justify-center items-center h-full fixed start-0 top-0 z-50`}>
        <span className="relative flex size-5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sky-400 opacity-75"></span>
            <span className="relative inline-flex size-5 rounded-full bg-sky-500"></span>
        </span>
    </div>
  )
}