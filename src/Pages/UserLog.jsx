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
  const [userLog, setUserLog] = useState([
    {
      Scanner: "Admin",
      UserName: "Admin",
      IP: "192.168.0.201",
      TotalTimeMinutes: 0.45,
      TotalTimeHours: 0.01,
    },
    {
      Scanner: "USER-01",
      UserName: "USER-01",
      IP: "192.168.0.101",
      TotalTimeMinutes: 0,
      TotalTimeHours: 0.0,
    },
    {
      Scanner: "USER-01",
      UserName: "USER-01",
      IP: "192.168.0.102",
      TotalTimeMinutes: 0,
      TotalTimeHours: 0.0,
    },
    {
      Scanner: "USER-03",
      UserName: "USER-03",
      IP: "192.168.0.103",
      TotalTimeMinutes: 0,
      TotalTimeHours: 0.0,
    },
    {
      Scanner: "USER-04",
      UserName: "USER-04",
      IP: "192.168.0.104",
      TotalTimeMinutes: 0,
      TotalTimeHours: 0.0,
    },
    {
      Scanner: "USER-05",
      UserName: "USER-05",
      IP: "192.168.0.105",
      TotalTimeMinutes: 0,
      TotalTimeHours: 0.0,
    },
    {
      Scanner: "USER-12",
      UserName: "USER-12",
      IP: "192.168.0.112",
      TotalTimeMinutes: 0,
      TotalTimeHours: 0.0,
    },
    {
      Scanner: "USER-13",
      UserName: "USER-13",
      IP: "192.168.0.113",
      TotalTimeMinutes: 0,
      TotalTimeHours: 0.0,
    },
    {
      Scanner: "USER-14",
      UserName: "USER-14",
      IP: "192.168.0.114",
      TotalTimeMinutes: 0,
      TotalTimeHours: 0.0,
    },
  ]);

  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;

  useEffect(() => {
    const { today, oneMonthBefore } = getTodayAndOneMonthBefore();
    setDateRange([oneMonthBefore, today]);
  }, []);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
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
                {UserLogDetails.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-4 text-gray-500">
                      No data present
                    </td>
                  </tr>
                ) : (
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
