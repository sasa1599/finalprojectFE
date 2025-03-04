import { OrderItem } from '@/types/orders-types'
import React from 'react'

const CardOrderItems = ({ dataItems }: { dataItems: OrderItem[] }) => {
  return (
    <div className='flex flex-wrap mt-5 gap-3 w-full'>
        {dataItems.map((data, index) => (
            <div key={index} className='box-address bg-gray-700 px-5 rounded-md py-4 w-full'>
                <h1><i className={`bi-phone-fill mr-3`}></i>{data.name} - x{data.quantity}</h1>
                <div className='flex justify-between my-2 items-end'>
                    <div className='w-full flex gap-3 flex-wrap'>
                        <p className='text-white bg-gray-600 w-auto py-1 px-4 text-sm rounded-md'>
                            {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(data.price)}
                        </p>
                        <p className='text-white bg-gray-600 w-auto py-1 px-4 text-sm rounded-md'>{data.total_price}</p>  
                    </div>
                </div>
            </div>
        ))}
    </div>
  )
}

export default CardOrderItems