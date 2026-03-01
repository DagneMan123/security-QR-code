// src/components/RecentActivity.jsx
import React from "react";

/**
 * recent: [{ time, action, user, status }]
 */
export default function RecentActivity({ recent = [] }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded shadow p-4 mt-6">
      <h3 className="font-semibold mb-3">Recent Activity</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full text-left">
          <thead>
            <tr className="text-xs text-gray-500 uppercase">
              <th className="py-2 px-3">Time</th>
              <th className="py-2 px-3">Action</th>
              <th className="py-2 px-3">User / PC</th>
              <th className="py-2 px-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {recent.map((r, i) => (
              <tr key={i} className="border-t border-gray-100 dark:border-gray-700">
                <td className="py-2 px-3 text-sm">{r.time}</td>
                <td className="py-2 px-3 text-sm">{r.action}</td>
                <td className="py-2 px-3 text-sm">{r.user}</td>
                <td className="py-2 px-3 text-sm">
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      r.status === "Success"
                        ? "bg-green-100 text-green-800"
                        : r.status === "Failed"
                        ? "bg-red-100 text-red-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {r.status}
                  </span>
                </td>
              </tr>
            ))}
            {recent.length === 0 && (
              <tr>
                <td className="py-4 px-3 text-sm text-gray-500" colSpan={4}>
                  No recent activity
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}



// import React from "react";
// import { Device } from "../assets/assets";

// const recentLogs = [
//   { time: "10:32 AM", action: `${Device.status}`, user: "PC-001 (MAC..)", status: `${Device.status}` },
//   { time: "10:12 AM", action: "Logout Atempt", user: "Pending", status: "Failed" },
//   { time: "09:50 AM", action: "Login Attempt", user: "Blocked PC", status: "Failed" },
//   { time: "09:00 AM", action: "Logout", user: "PC-020", status: "Success" },
// ];

// // console.log(Device);


// export default function RecentActivity() {
//   return (
//     <div className="bg-white p-4 rounded shadow">
//       <h3 className="font-bold mb-2">Recent Activity</h3>
//       <div className="overflow-x-auto">
//         <table className="w-full text-left table-auto">
//           <thead>
//             <tr className="bg-gray-200">
//               <th className="px-4 py-2">Time</th>
//               <th className="px-4 py-2">Action</th>
//               <th className="px-4 py-2">User Id</th>
//               <th className="px-4 py-2">Status</th>
//             </tr>
//           </thead>
//           <tbody>
//             {Device.map((log, idx) => (
//               <tr key={idx} className="border-b">
//                 <td className="px-4 py-2">{log.resecentTime}</td>
//                 <td className="px-4 py-2">{log.action}</td>
//                 <td className="px-4 py-2">{log.ownerId}</td>
//                 <td className={`px-4 py-2 font-bold ${log.status === "Failed" ? "text-red-600" :  "text-green-600" }`}>
//                   {log.status}
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }
