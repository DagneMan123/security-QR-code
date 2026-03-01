import React, { useContext, useState, useEffect } from 'react'
import { SecurityContext } from '../context/SecurityContext'
import { Link } from 'react-router-dom'

const SecurityAllStudents = () => {
  const { student } = useContext(SecurityContext)
  const [filteredStudents, setFilteredStudents] = useState([])
  const [search, setSearch] = useState("")
  const [department, setDepartment] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const studentsPerPage = 10

  useEffect(() => {
    setFilteredStudents(student)
  }, [student])

  useEffect(() => {
    applyFilter()
    setCurrentPage(1)
  }, [search, department])

  const applyFilter = () => {
    let studentCopy = student.slice()
    
    if (search) {
      studentCopy = studentCopy.filter(d =>
        d.studentId.toLowerCase().includes(search.toLowerCase()) ||
        d.fullName.toLowerCase().includes(search.toLowerCase()) ||
        d.deviceId?.toLowerCase().includes(search.toLowerCase())
      )
    }
    
    if (department) {
      studentCopy = studentCopy.filter(s => s.department?.toLowerCase() === department.toLowerCase())
    }
    
    setFilteredStudents(studentCopy)
  }

  const indexOfLastDevice = currentPage * studentsPerPage
  const indexOfFirstDevice = indexOfLastDevice - studentsPerPage
  const paginatedDevices = filteredStudents.slice(indexOfFirstDevice, indexOfLastDevice)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">All Students</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">View all registered students</p>
        </div>
        <div className="relative">
          <input
            type="text"
            placeholder="Search students..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 pr-4 py-2.5 w-full sm:w-64 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm"
          />
          <svg className="w-5 h-5 absolute left-3 top-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow border border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Department</label>
            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="w-full px-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Departments</option>
              <option value="Software">Software</option>
              <option value="Computer">Computer Science</option>
              <option value="Mechanical">Mechanical</option>
              <option value="Electrical">Electrical</option>
              <option value="Mechatronics">Mechatronics</option>
              <option value="Civil">Civil</option>
              <option value="Textile">Textile</option>
              <option value="Water">Water</option>
              <option value="Garment">Garment</option>
              <option value="Hydrolics">Hydrolics</option>
              <option value="Cotem">Cotem</option>
              <option value="Chemical">Chemical</option>
              <option value="Industrial">Industrial</option>
              <option value="Leather">Leather</option>
              <option value="Fashion">Fashion</option>
              <option value="Architecture">Architecture</option>
              <option value="Biomedical">Biomedical</option>
              <option value="IS">IS</option>
              <option value="IT">IT</option>
              <option value="Food">Food</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Results</label>
            <div className="px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl">
              <span className="text-gray-700 dark:text-gray-300 font-medium">{filteredStudents.length} students</span>
            </div>
          </div>
        </div>
      </div>

      {/* Students Table */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-linear-to-r from-gray-800 to-gray-900 dark:from-gray-900 dark:to-gray-950">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-200 uppercase tracking-wider">Photo</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-200 uppercase tracking-wider">ID</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-200 uppercase tracking-wider">Full Name</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-200 uppercase tracking-wider">Department</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-200 uppercase tracking-wider">Device ID</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-200 uppercase tracking-wider">Contact</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {paginatedDevices.map((student) => (
                <tr key={student.studentId} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="relative group">
                      <img
                        className="w-12 h-12 rounded-xl object-cover border-2 border-gray-200 dark:border-gray-700 group-hover:border-blue-500 transition-colors"
                        src={student.imageUrl || "https://via.placeholder.com/48/1e293b/94a3b8?text=U"}
                        alt={student.fullName}
                      />
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-gray-900 dark:text-white font-medium">{student.studentId}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-gray-900 dark:text-white font-medium">{student.fullName}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                      {student.department}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Link
                      to={`/security/device/${student.deviceId}`}
                      className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium group inline-flex items-center"
                    >
                      {student.deviceId}
                      <svg className="w-4 h-4 ml-2 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </Link>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-700 dark:text-gray-300">{student.email}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">{student.phone}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {filteredStudents.length === 0 && (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700 mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">No students found</h3>
            <p className="mt-2 text-gray-500 dark:text-gray-400">Try adjusting your search or filters</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {filteredStudents.length > 0 && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-white dark:bg-gray-800 rounded-2xl p-4 shadow border border-gray-200 dark:border-gray-700">
          <div className="text-sm text-gray-700 dark:text-gray-400 mb-4 sm:mb-0">
            Showing <span className="font-semibold text-gray-900 dark:text-white">{indexOfFirstDevice + 1}</span> to{" "}
            <span className="font-semibold text-gray-900 dark:text-white">
              {Math.min(indexOfLastDevice, filteredStudents.length)}
            </span>{" "}
            of <span className="font-semibold text-gray-900 dark:text-white">{filteredStudents.length}</span> students
          </div>
          <div className="flex items-center space-x-2">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(p => p - 1)}
              className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
              Previous
            </button>
            <div className="flex items-center space-x-1">
              {Array.from({ length: Math.ceil(filteredStudents.length / studentsPerPage) }, (_, i) => (
                <button
                  key={i + 1}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors min-w-10 ${
                    currentPage === i + 1
                      ? "bg-linear-to-r from-blue-500 to-indigo-600 text-white shadow-lg"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            <button
              disabled={currentPage === Math.ceil(filteredStudents.length / studentsPerPage)}
              onClick={() => setCurrentPage(p => p + 1)}
              className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next
              <svg className="w-5 h-5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SecurityAllStudents;