import React, { useEffect, useState } from "react";
import Sidebar from "../component/sidebar";
import DatePicker from "react-datepicker";
import { format } from "date-fns";
import { use } from "react";
import { getUserLogsInfo } from "../helper/Urlhelper";
const getTodayAndOneMonthBefore = () => {
  const today = new Date();
  const oneMonthBefore = new Date();
  oneMonthBefore.setMonth(today.getMonth() - 1);

  const formatDate = (date) => date.toISOString();

  return {
    today: formatDate(today),
    oneMonthBefore: formatDate(oneMonthBefore),
  };
};
const UserLog = () => {
  const [userLog, setUserLog] = useState([]);

  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;
  const [loading, setLoading] = useState(false);
  const skeletonRows = Array.from({ length: 5 });
  useEffect(() => {
    const { today, oneMonthBefore } = getTodayAndOneMonthBefore();
    setDateRange([oneMonthBefore, today]);
  }, []);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);
        const [startDate, endDate] = dateRange;

        if (startDate && endDate) {
          const formattedStartDate = format(startDate, "yyyy-MM-dd");
          const formattedEndDate = format(endDate, "yyyy-MM-dd");

          const res2 = await getUserLogsInfo(
            formattedStartDate,
            formattedEndDate
          );
          if (res2?.data?.Data) {
            setUserLog(res2?.data?.Data);
          } else {
            setUserLog([]);
          }
        } else {
          console.log("Date range not selected yet");
          setUserLog([]);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, [dateRange]);
  const UserLogDetails = userLog.map((item, index) => {
    // console.log(item.Scanner);
    const { Scanner, UserName, IP, TotalTimeMinutes, TotalTimeHours } = item;
    return (
      <tr
        key={index}
        className="border-b hover:bg-gray-100 cursor-pointer"
        onClick={() => {
          // handleUserModal(user);
        }}
      >
        <td className="px-4 py-2">{index + 1}</td>
        <td className="px-4 py-2">{Scanner}</td>
        <td className="px-4 py-2">{UserName}</td>
        <td className="px-4 py-2">{IP}</td>
        <td className="px-4 py-2">{TotalTimeMinutes}</td>
        <td className="px-4 py-2">{TotalTimeHours}</td>
      </tr>
    );
  });
  const handleDateChange = (update) => {
    if (!update || (Array.isArray(update) && !update[0] && !update[1])) {
      console.log("Date range cleared!");
      // 👉 run your function here
      // runOnClear();
      setDateRange([null, null]);
      return;
    }
    setDateRange(update);

    if (update[0]) {
      console.log("Start:", format(update[0], "dd-MM-yyyy"));
    }
    if (update[1]) {
      console.log("End:", format(update[1], "dd-MM-yyyy"));
    }
  };
  return (
    <>
      <Sidebar />
      <div className="p-6 sm:ml-64 mt-12">
        <div className="bg-white p-6 rounded-lg shadow-md flex-1">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">User Log Details</h2>
            {/* Date Range Picker */}
            <DatePicker
              selectsRange={true}
              startDate={startDate}
              endDate={endDate}
              onChange={handleDateChange}
              isClearable={true}
              dateFormat="dd-MM-yyyy"
              placeholderText="Select date range"
              className="border border-gray-300 px-6 py-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="overflow-auto bg-white shadow-md rounded-lg max-h-[60vh] my-4">
            <table className="min-w-full table-auto w-full">
              <thead className="bg-gray-200">
                <tr>
                  <th className="px-4 py-2 text-left sticky top-0 bg-gray-100">
                    Sr No.
                  </th>
                  <th className="px-4 py-2 text-left sticky top-0 bg-gray-100">
                    Scanner
                  </th>
                  <th className="px-4 py-2 text-left sticky top-0 bg-gray-100">
                    UserName
                  </th>
                  <th className="px-4 py-2 text-left sticky top-0 bg-gray-100">
                    IP Address
                  </th>
                  <th className="px-4 py-2 text-left sticky top-0 bg-gray-100">
                    Total Time(Minutes)
                  </th>
                  <th className="px-4 py-2 text-left sticky top-0 bg-gray-100">
                    Total Time(Hours)
                  </th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  // Skeleton loading state
                  skeletonRows.map((_, i) => (
                    <tr
                      key={i}
                      className="animate-pulse"
                      style={{ animationDuration: "0.7s" }}
                    >
                      <td className="px-4 py-2">
                        <div className="h-4 bg-gray-300 rounded w-8"></div>
                      </td>
                      <td className="px-4 py-2">
                        <div className="h-4 bg-gray-300 rounded w-24"></div>
                      </td>
                      <td className="px-4 py-2">
                        <div className="h-4 bg-gray-300 rounded w-32"></div>
                      </td>
                      <td className="px-4 py-2">
                        <div className="h-4 bg-gray-300 rounded w-28"></div>
                      </td>
                      <td className="px-4 py-2">
                        <div className="h-4 bg-gray-300 rounded w-16"></div>
                      </td>
                      <td className="px-4 py-2">
                        <div className="h-4 bg-gray-300 rounded w-16"></div>
                      </td>
                    </tr>
                  ))
                ) : UserLogDetails.length === 0 ? (
                  // No data message
                  <tr>
                    <td colSpan="6" className="text-center py-4 text-gray-500">
                      No data found for the selected date range.
                    </td>
                  </tr>
                ) : (
                  // Render data
                  UserLogDetails
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserLog;
