import React from 'react'
import { Link } from 'react-router-dom'
import { useContext } from 'react'
import { AdminContext } from '../context/AdminContext'
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx'


const StudentTable = () => {

    const  {student} = useContext(AdminContext)
    const [filteredDevices, setFilteredDevices] = useState([])   
    
    


   


    // npm install jspdf jspdf-autotable
    const exportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(12);
    doc.text("Student List", 14, 15);

    const tableColumn = [
      "ID", 
      "Full Name", 
      "Department", 
      "Device Id", 
      "Email", 
      "Phone", 
      "Created At", 
      "Created At"];
    const tableRows = [];

    student.forEach((stu) => {
      const rowData = [
        stu.studentId,
        stu.fullName,
        stu.department,
        stu.deviceId,
        stu.email,
        stu.phone,
        stu.createdAt ? new Date(stu.createdAt).toLocaleString() : '',
        stu.updatedAt ? new Date(stu.updatedAt).toLocaleString() : '',
      ];
      tableRows.push(rowData);
    });

    dautoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 20,
      theme: "grid",
      styles: { fontSize: 8 }
    });
    doc.save("student_list.pdf");
  };


  const exportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(
      student.map((stu) => ({
        ID: stu.studentId,
        "Full Name": stu.fullName,
        Department: stu.department,
        "Device Id": stu.deviceId,
        Email: stu.email,
        Phone: stu.phone,
        "Created At": stu.createdAt ? new Date(stu.createdAt).toLocaleString()
          : '',
        "Updated At": stu.updatedAt ? new Date(stu.updatedAt).toLocaleString() : ''
      }))
    );
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Students");
    XLSX.writeFile(wb, "student_list.xlsx");
  };


  return (
    
  )
}

export default StudentTable
