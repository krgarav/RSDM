import React, { useEffect, useState } from "react";
import Sidebar from "../component/sidebar";
import {
  downloadDataById,
  getActiveUsers,
  getAllData,
  getTodayFileScanned,
  getTodaysScannerWise,
  getTotalFileScanned,
  getTotalScannerWise,
  getTotalUsers,
  getUserAnalytics,
} from "../helper/Urlhelper";
import {
  FaFileCsv,
  FaFilePdf,
  FaUsers,
  FaUserCheck,
  FaFileAlt,
} from "react-icons/fa";
import { MdAnalytics } from "react-icons/md";

const getTodayAndYesterday = () => {
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  const formatDate = (date) => date.toISOString().split("T")[0];

  return {
    today: formatDate(today),
    yesterday: formatDate(yesterday),
  };
};
function formatDate(dateString) {
  const date = new Date(dateString);

  // Define the options for formatting the date
  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: true,
  };

  // Format the date into a human-readable string
  return date.toLocaleString("en-US", options);
}
const Dashboard = () => {
  const [allData, setAllData] = useState([]);
  const [analyticDetails, setAnalyticDetails] = useState({
    activeUsers: 0,
    totalUsers: 0,
    totalFilesScanned: 0,
    todayFilesScanned: 0,
  });

  // useEffect(() => {
  // const { today, yesterday } = getTodayAndYesterday();
  //   console.log("Today:", today); // e.g., "2025-09-09"
  //   console.log("Yesterday:", yesterday); // e.g., "2025-09-08"
  // }, []);
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const { today, yesterday } = getTodayAndYesterday();
        // console.log(today, yesterday);
        const res = await getTodaysScannerWise();
        const res2 = await getTotalScannerWise(yesterday, today);
        console.log(res2);
        // if (Array.isArray(res)) {
        //   setAllData(res);
        // }
      } catch (error) {
        console.log(error);
      }
    };
    fetchAllData();
  }, []);

  useEffect(() => {
    const fetchUserAnalytics = async () => {
      try {
        const [resActive, resTotal, resScanned, resToday] = await Promise.all([
          getActiveUsers(),
          getTotalUsers(),
          getTotalFileScanned(),
          getTodayFileScanned(),
        ]);

        // Update state if each response is successful
        setAnalyticDetails((item) => ({
          ...item,
          activeUsers: resActive?.data?.active_users || 0,
          totalUsers: resTotal?.data?.total_users || 0,
          totalFilesScanned: resScanned?.data?.total_data_rows || 0,
          todayFilesScanned: resToday?.data?.todays_data_rows || 0,
        }));

        // console.log("Active Users:", resActive?.data?.active_users);
        // console.log("Total Users:", resTotal?.data?.total_users);
        // console.log("Total Files Scanned:", resScanned?.data?.total_data_rows);
        // console.log("Today Files Scanned:", resToday?.data?.todays_data_rows);
      } catch (error) {
        console.error("Error fetching analytics:", error);
      }
    };

    fetchUserAnalytics();
  }, []);
  console.log(analyticDetails);
  const handledTextDownload = async (rowDetail) => {
    const date = rowDetail.createdAt;

    try {
      // console.log(rowDetail.id);

      const res = await downloadDataById(rowDetail.id, "pdf");

      // Extract file name from the "Content-Disposition" header
      const contentDisposition = res.headers["content-disposition"];
      let fileName = "output.pdf"; // Default file name

      if (contentDisposition && contentDisposition.includes("attachment")) {
        const matches = /filename="(.+)"/.exec(contentDisposition);
        if (matches && matches[1]) {
          fileName = matches[1];
        }
      }
      const parts = fileName.split("-");
      const newFileName = `${parts[0]}-${parts[1]}.pdf`;
      // Extract the created date from the "Date" header
      const createdAt = date;
      let formattedDate = new Date(createdAt); // Convert the date to a Date object

      // Optionally format the date (e.g., 'YYYY-MM-DD')
      const formattedDateString = formattedDate.toISOString().split("T")[0];

      // You can now use the `formattedDateString` for any further use
      console.log("File Name:", fileName);
      console.log("Created At:", formattedDateString);

      // Convert response data to Blob
      const blob = new Blob([res.data], { type: "text/plain" });

      // Create a URL for the Blob
      const url = window.URL.createObjectURL(blob);

      // Create a temporary <a> element to trigger the download
      const a = document.createElement("a");
      a.href = url;
      a.download = newFileName; // Use the extracted file name
      document.body.appendChild(a); // Append to DOM
      a.click(); // Trigger download
      a.remove(); // Remove element from DOM

      // Release the URL object
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.log(error);
    }
  };
  const handleCsvDownload = async (rowDetail) => {
    const date = rowDetail.createdAt;
    try {
      // console.log(rowDetail.id);

      const res = await downloadDataById(rowDetail.id, "csv");

      // Extract file name from the "Content-Disposition" header
      const contentDisposition = res.headers["content-disposition"];
      let fileName = "output.csv"; // Default file name
      if (contentDisposition && contentDisposition.includes("attachment")) {
        const matches = /filename="(.+)"/.exec(contentDisposition);
        if (matches && matches[1]) {
          fileName = matches[1];
        }
      }
      const parts = fileName.split("-");
      const newFileName = `${parts[0]}-${parts[1]}.csv`;
      // Extract the created date from the "Date" header
      const createdAt = date;
      let formattedDate = new Date(createdAt); // Convert the date to a Date object

      // Optionally format the date (e.g., 'YYYY-MM-DD')
      const formattedDateString = formattedDate.toISOString().split("T")[0];

      // You can now use the `formattedDateString` for any further use
      console.log("File Name:", fileName);
      console.log("Created At:", formattedDateString);

      // Convert response data to Blob
      const blob = new Blob([res.data], { type: "text/plain" });

      // Create a URL for the Blob
      const url = window.URL.createObjectURL(blob);

      // Create a temporary <a> element to trigger the download
      const a = document.createElement("a");
      a.href = url;
      a.download = newFileName; // Use the extracted file name
      document.body.appendChild(a); // Append to DOM
      a.click(); // Trigger download
      a.remove(); // Remove element from DOM

      // Release the URL object
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.log(error);
    }
  };
  const AllUploadedData = allData.map((user, index) => (
    <tr
      key={index}
      className="border-b hover:bg-gray-100 cursor-pointer"
      onClick={() => {
        // handleUserModal(user);
      }}
    >
      <td className="px-4 py-2">{index + 1}</td>
      <td className="px-4 py-2">{user.User.email}</td>
      <td className="px-4 py-2">{formatDate(user.createdAt)}</td>
      <td className="px-4 py-2">
        <button
          onClick={() => {
            handleCsvDownload(user);
          }}
          className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white font-medium rounded-md shadow hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M3 3a2 2 0 012-2h6a2 2 0 012 2v1h1a2 2 0 012 2v8a2 2 0 01-2 2h-1v1a2 2 0 01-2 2H5a2 2 0 01-2-2V3zm9 0H5v12h6v-2h1V5h-1V3zM5 5h4v2H5V5zm0 4h4v2H5V9z" />
          </svg>
          <span>CSV</span>
        </button>
      </td>
      <td className="px-4 py-2">
        <button
          onClick={() => handledTextDownload(user)}
          className="flex items-center space-x-2 px-4 py-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-lg shadow-lg hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 transition duration-300"
        >
          <div className="flex items-center justify-center w-8 h-8 bg-red-500 rounded-full shadow-md">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-white"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M6 2C4.895 2 4 2.895 4 4v16c0 1.105.895 2 2 2h12c1.105 0 2-.895 2-2V8.414c0-.53-.21-1.04-.586-1.414l-5-5C14.04 2.21 13.53 2 13 2H6z" />

              <path
                d="M14 3.414L18.586 8H14V3.414z"
                className="text-gray-300"
              />

              <text
                x="50%"
                y="65%"
                textAnchor="middle"
                fontSize="9"
                fontWeight="bold"
                fill="white"
                className="pointer-events-none"
              >
                PDF
              </text>
            </svg>
          </div>
          <span className="text-sm font-medium"> PDF</span>
        </button>
      </td>
    </tr>
  ));

  return (
    <>
      <Sidebar />

      <div className="p-6 sm:ml-64 mt-12">
        <h1 className="text-4xl font-bold mb-6 text-gray-800 flex items-center gap-2">
          <MdAnalytics className="text-blue-600" /> Dashboard
        </h1>

        {/* Stats */}
        {/* Analytics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 my-8">
          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition">
            <h2 className="text-lg font-semibold text-gray-600 flex items-center gap-2">
              <FaFileAlt className="text-blue-500" /> Today's Total Scanned
            </h2>
            <p className="text-3xl font-bold text-blue-600 mt-2">
              {analyticDetails.todayFilesScanned}
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition">
            <h2 className="text-lg font-semibold text-gray-600 flex items-center gap-2">
              <FaFileAlt className="text-indigo-500" /> Total File Scanned
            </h2>
            <p className="text-3xl font-bold text-indigo-600 mt-2">
              {analyticDetails.totalFilesScanned}
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition">
            <h2 className="text-lg font-semibold text-gray-600 flex items-center gap-2">
              <FaUsers className="text-green-500" /> All Users
            </h2>
            <p className="text-3xl font-bold text-green-600 mt-2">
              {analyticDetails.totalUsers}
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition">
            <h2 className="text-lg font-semibold text-gray-600 flex items-center gap-2">
              <FaUserCheck className="text-purple-500" /> Active Users
            </h2>
            <p className="text-3xl font-bold text-purple-600 mt-2">
              {analyticDetails.activeUsers}
            </p>
          </div>
        </div>
        {/* Recent Activity */}
        {/* Table for displaying users */}

        <div className="flex flex-col md:flex-row gap-4 w-full">
          <div className="bg-white p-6 rounded-lg shadow-md flex-1">
            <h2 className="text-xl font-semibold">Today's Total Scanned</h2>
            <div className="overflow-auto bg-white shadow-md rounded-lg max-h-[60vh] my-4">
              <table className="min-w-full table-auto w-full">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="px-4 py-2 text-left sticky top-0 bg-gray-100">
                      Sr No.
                    </th>
                    <th className="px-4 py-2 text-left sticky top-0 bg-gray-100">
                      Scanner Id
                    </th>
                    <th className="px-4 py-2 text-left sticky top-0 bg-gray-100">
                      Sheets Scanned
                    </th>
                    <th className="px-4 py-2 text-left sticky top-0 bg-gray-100">
                      Created At
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {AllUploadedData.length === 0 ? (
                    <tr>
                      <td
                        colSpan="4"
                        className="text-center py-4 text-gray-500"
                      >
                        No data present
                      </td>
                    </tr>
                  ) : (
                    AllUploadedData
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md flex-1">
            <h2 className="text-xl font-semibold">Total File Scanned</h2>
            <div className="overflow-auto bg-white shadow-md rounded-lg max-h-[60vh] my-4">
              <table className="min-w-full table-auto w-full">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="px-4 py-2 text-left sticky top-0 bg-gray-100">
                      Sr No.
                    </th>
                    <th className="px-4 py-2 text-left sticky top-0 bg-gray-100">
                      Scanner Id
                    </th>
                    <th className="px-4 py-2 text-left sticky top-0 bg-gray-100">
                      Sheets Scanned
                    </th>
                    <th className="px-4 py-2 text-left sticky top-0 bg-gray-100">
                      Created At
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {AllUploadedData.length === 0 ? (
                    <tr>
                      <td
                        colSpan="4"
                        className="text-center py-4 text-gray-500"
                      >
                        No data present
                      </td>
                    </tr>
                  ) : (
                    AllUploadedData
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <p className="fixed bottom-0 left-0 w-full text-center text-gray-500 text-xs py-2 bg-white shadow-md">
          &copy; IOS. All rights reserved.
        </p>
      </div>
    </>
  );
};

export default Dashboard;
