import React from 'react'

const RegisterStudent = () => {
  return (
    <div className=' flex flex-col justify-center items-center'>
      <h1 className='text-center text-3xl bg-blue-500 my-5 py-3 px-6 text-gray-200 rounded'>Add Student</h1>

      <form className="grid grid-cols-1 gap-4 w-96">
        
           <input
            type="text"
            name="studentName"
            placeholder="Student Name"
            // value={formData.deviceId}
            // onChange={handleChange}
            className="border p-2 rounded"
          />
          <input
            type="text"
            name="department"
            placeholder="Department"
            // value={formData.macAddress}
            // onChange={handleChange}
            className="border p-2 rounded"
          />
          <input
            type="text"
            name="serialNumber"
            placeholder="Serial Number"
            // value={formData.serialNumber}
            // onChange={handleChange}
            className="border p-2 rounded"
          />
          <input
            type="text"
            name="fullName"
            placeholder="Student Full Name"
            // value={formData.serialNumber}
            // onChange={handleChange}
            className="border p-2 rounded"
          />
          <select
            name="os"
            // value={formData.os}
            // onChange={handleChange}
            className="border p-2 rounded"
          >
            <option>Windows</option>
            <option>Linux</option>
            <option>macOS</option>
          </select>
          <input
            type="text"
            name="ownerId"
            placeholder="Owner Student ID"
            // value={formData.ownerId}
            // onChange={handleChange}
            className="border p-2 rounded"
          />
        </form>
    </div>
  )
}

export default RegisterStudent
