import React, { useEffect, useState } from "react";
import Sidebar from "../component/sidebar";
import DatePicker from "react-datepicker";
import { format, set } from "date-fns";
import { use } from "react";
import { getUserLogsInfo } from "../helper/Urlhelper";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { LocalizationProvider } from "@mui/x-date-pickers-pro/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers-pro/AdapterDayjs";
import { DateTimeRangePicker } from "@mui/x-date-pickers-pro/DateTimeRangePicker";

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
  // const [startDate, endDate] = dateRange;
  const [loading, setLoading] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const skeletonRows = Array.from({ length: 5 });
  // useEffect(() => {
  //   const { today, oneMonthBefore } = getTodayAndOneMonthBefore();
  //   setStartDate(oneMonthBefore); // start = 1 month before today
  //   setEndDate(today); // end = today
  // }, []);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);

        if (startDate && endDate) {
          const formattedStartDate = format(startDate, "yyyy-MM-dd HH:mm");
          const formattedEndDate = format(endDate, "yyyy-MM-dd HH:mm");

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
  }, [startDate, endDate]);
  const UserLogDetails = userLog.map((item, index) => {
    // console.log(item.Scanner);
    const {
      Scanner,
      UserName,
      IP,
      TotalTimeMinutes,
      TotalTimeHours,
      LogoutCount,
      ScanningCount,
    } = item;
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
        <td className="px-4 py-2">{LogoutCount}</td>
        <td className="px-4 py-2">{ScanningCount}</td>
      </tr>
    );
  });
  // const handleDateChange = (update) => {
  //   if (!update || (Array.isArray(update) && !update[0] && !update[1])) {
  //     console.log("Date range cleared!");
  //     // 👉 run your function here
  //     // runOnClear();
  //     setDateRange([null, null]);
  //     return;
  //   }
  //   setDateRange(update);

  //   if (update[0]) {
  //     console.log("Start:", format(update[0], "dd-MM-yyyy"));
  //   }
  //   if (update[1]) {
  //     console.log("End:", format(update[1], "dd-MM-yyyy"));
  //   }
  // };
  // const handleDateChange = (update) => {
  //   // Clear logic
  //   if (!update || (Array.isArray(update) && !update[0] && !update[1])) {
  //     console.log("Date range cleared!");
  //     setDateRange([null, null]);
  //     return;
  //   }

  //   setDateRange(update);

  //   if (update[0]) {
  //     console.log("Start:", format(update[0], "dd-MM-yyyy HH:mm"));
  //   }
  //   if (update[1]) {
  //     console.log("End:", format(update[1], "dd-MM-yyyy HH:mm"));
  //   }
  // };

  const handleStartChange = (date) => {
    setStartDate(date);
    if (date && endDate && date > endDate) setEndDate(null);
  };

  const handleEndChange = (date) => {
    setEndDate(date);
  };

  const handleClear = () => {
    setStartDate(null);
    setEndDate(null);
    console.log("Date range cleared!");
  };

  const handleLog = () => {
    if (startDate) console.log("Start:", format(startDate, "dd-MM-yyyy HH:mm"));
    if (endDate) console.log("End:", format(endDate, "dd-MM-yyyy HH:mm"));
  };

  return (
    <>
      <Sidebar />
      <div className="p-6 sm:ml-64 mt-12">
        <div className="bg-white p-6 rounded-lg shadow-md flex-1">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">User Log Details</h2>
            {/* Date Range Picker */}
            <div className="gap-2 flex">
              <DatePicker
                selected={startDate}
                onChange={handleStartChange}
                selectsStart
                startDate={startDate}
                endDate={endDate}
                showTimeSelect
                timeFormat="HH:mm" // "hh:mm aa" for 12-hour format
                timeIntervals={15}
                dateFormat="dd-MM-yyyy HH:mm"
                placeholderText="Start date & time"
                className="border border-gray-300 px-4 py-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                isClearable
                portalId="root" // ✅ prevents position jump
                popperPlacement="bottom-start" // or "top-start"
              />

              {/* End DateTime Picker */}
              <DatePicker
                selected={endDate}
                onChange={handleEndChange}
                selectsEnd
                startDate={startDate}
                endDate={endDate}
                minDate={startDate}
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={15}
                dateFormat="dd-MM-yyyy HH:mm"
                placeholderText="End date & time"
                className="border border-gray-300 px-4 py-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                isClearable
                portalId="root" // ✅ prevents position jump
                popperPlacement="bottom-start" // or "top-start"
              />
            </div>
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
                  <th className="px-4 py-2 text-left sticky top-0 bg-gray-100">
                    Logout Count
                  </th>
                  <th className="px-4 py-2 text-left sticky top-0 bg-gray-100">
                    Scanning Count
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
                    <td colSpan="8" className="text-center py-4 text-gray-500">
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
