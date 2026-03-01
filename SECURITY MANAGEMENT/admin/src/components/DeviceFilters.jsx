import React from 'react'
import { useContext } from 'react'
import { AdminContext } from '../context/AdminContext'

const DeviceFilters = () => {

    const{toogleBlock} = useContext(AdminContext)

  return (
    <div>
      <div className=" flex justify-between mb-0 gap-2"> 
      <div className={`border border-gray-300 pl-5 p-3 my-5 sm:block` }>
          <p className='feya'>Blocked/Unblocked:</p>
          <div className='flex  gap-2 text-sm font-light text-gray-700'>
            <p className='flex gap-2'>
              <input  className='w-3' type="checkbox" value={'Block'} 
              onChange={toogleBlock}
               />
               Blocked
            </p>
            <p className='flex gap-2'>
              <input className='w-3' type="checkbox" value={'UnBlock'}
              //  onChange={toogleCategory}
               /> Unlocked
            </p>
          </div>
        </div>
        <div className={`border border-gray-300 pl-5 p-3 my-5 sm:block` }>
          <p className='feya'>Login/Logout:</p>
          <div className='flex  gap-2 text-sm font-light text-gray-700'>
            <p className='flex gap-2'>
              <input  className='w-3' type="checkbox" value={'Block'} 
              onChange={toogleBlock}
               />
               Blocked
            </p>
            <p className='flex gap-2'>
              <input className='w-3' type="checkbox" value={'UnBlock'}
              //  onChange={toogleCategory}
               /> Unlocked
            </p>
          </div>
        </div>
         <div className={`border border-gray-300 pl-5 py-3 my-5 sm:block ` }>
          <p className='feya'>Status:</p>
          <div className='flex  gap-2 text-sm font-light text-gray-700 '>
            <p className='flex gap-2'>
              <input className='w-3' type="checkbox" value={'Men'} 
              // onChange={toogleCategory}
               />
               Succes
            </p>
            <p className='flex gap-2'>
              <input className='w-3' type="checkbox" value={'Women'}
              //  onChange={toogleCategory}
               /> Failed
            </p>
          </div>
        </div></div>
    </div>
  )
}

export default DeviceFilters
