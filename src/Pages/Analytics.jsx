import React, { useEffect, useState } from "react";
import Sidebar from "../component/sidebar";
import { MdAnalytics } from "react-icons/md";
import DatePicker from "react-datepicker";
import { getAnalytics } from "../helper/Urlhelper";
import { format } from "date-fns";
const Analytics = () => {
  const [data, setData] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [loading, setLoading] = useState(false); // ✅ loader state
  const headers = [
    "Scanner ID",
    "Total Scanned Batches",
    "Total Scanned Sheets",
    "Avg Scanned Sheets",
    "Total Scanning Time",
    "Total Logged in Time",
    "Idle Time",
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true); // start loader

        // ✅ Format date using date-fns
        const formattedDate = format(new Date(selectedDate), "yyyy-MM-dd");

        const res = await getAnalytics(formattedDate);

        if (res?.data?.results) {
          setData(res.data.results);
        } else {
          setData([]);
        }
      } catch (error) {
        console.error("Error fetching analytics:", error);
      } finally {
        setLoading(false); // stop loader
      }
    };

    if (selectedDate) {
      fetchData();
    }
  }, [selectedDate]);
  // Skeleton loader rows (optional shimmer effect)
  const SkeletonLoader = () => (
    <tbody>
      {[...Array(6)].map((_, idx) => (
        <tr key={idx}>
          {headers.map((_, i) => (
            <td key={i} className="px-4 py-3 border-b">
              <div className="h-4 bg-gray-200 animate-pulse rounded"></div>
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  );
  const TableData = data.map((item, idx) => (
    <tr key={idx} className="hover:bg-gray-50">
      <td className="px-4 py-2 border-b">{item?.scanner_id}</td>
      <td className="px-4 py-2 border-b text-center">{item?.total_batches}</td>
      <td className="px-4 py-2 border-b text-center">{item?.total_rows}</td>
      <td className="px-4 py-2 border-b text-center">
        {item?.avg_rows_per_batch.toFixed(2)}
      </td>
      <td className="px-4 py-2 border-b text-center">
        {item?.total_batch_time_hh_mm}
      </td>
      <td className="px-4 py-2 border-b text-center">
        {item?.total_operational_window_hh_mm}
      </td>
      <td className="px-4 py-2 border-b text-center">
        {item?.idle_time_hh_mm}
      </td>
    </tr>
  ));
  return (
    <>
      <Sidebar />
      <div className="p-6 sm:ml-64 mt-4">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-4xl font-bold text-gray-800 flex items-center gap-2">
            <MdAnalytics className="text-blue-600" /> Analytics
          </h1>

          <DatePicker
            selected={selectedDate}
            onChange={(date) => {
              setSelectedDate(date);
              document.activeElement.blur(); // ✅ closes the calendar popup
            }}
            isClearable={true}
            dateFormat="dd-MM-yyyy"
            placeholderText="Select date "
            className="border z-999 border-gray-300 px-6 py-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            portalId="root" // ✅ prevents position jump
            popperPlacement="bottom-start" // or "top-start"
          />
        </div>

        <div className="overflow-x-auto overflow-y-auto bg-white shadow-md rounded-lg max-h-[76vh] ">
          <table className="min-w-full table-auto border-collapse">
            <thead className="bg-gray-200 sticky top-0 z-1">
              <tr>
                {headers.map((header, idx) => (
                  <th
                    key={idx}
                    className="px-4 py-2 text-left text-gray-700 font-semibold border-b"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>

            {/* ✅ Conditional rendering */}
            {loading ? (
              <SkeletonLoader />
            ) : data.length === 0 ? (
              <tbody>
                <tr>
                  <td
                    colSpan={headers.length}
                    className="text-center py-6 text-gray-500"
                  >
                    No data available
                  </td>
                </tr>
              </tbody>
            ) : (
              <tbody>{TableData}</tbody>
            )}
          </table>
        </div>
      </div>
    </>
  );
};

export default Analytics;
