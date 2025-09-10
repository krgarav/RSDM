import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function FileScannedTable({ AllUploadedData }) {
  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;

  const filteredData = AllUploadedData.filter((item) => {
    const createdAt = new Date(item.createdAt);
    if (startDate && createdAt < startDate) return false;
    if (endDate && createdAt > endDate) return false;
    return true;
  });

  return (
    <div className="bg-white p-6 rounded-lg shadow-md flex-1">
      <h2 className="text-xl font-semibold">Total File Scanned</h2>

      {/* Date Range Picker */}
      <div className="my-4">
        <DatePicker
          selectsRange={true}
          startDate={startDate}
          endDate={endDate}
          onChange={(update) => setDateRange(update)}
          isClearable={true}
          className="border px-6 py-2  rounded-md"
          placeholderText="Select date range"
        />
      </div>

      {/* Table */}
      <div className="overflow-auto bg-white shadow-md rounded-lg max-h-[60vh] my-4">
        <table className="min-w-full table-auto w-full">
          <thead className="bg-gray-200">
            <tr>
              <th className="px-4 py-2 sticky top-0 bg-gray-100 text-left">Sr No.</th>
              <th className="px-4 py-2 sticky top-0 bg-gray-100 text-left">Scanner Id</th>
              <th className="px-4 py-2 sticky top-0 bg-gray-100 text-left">Sheets Scanned</th>
              <th className="px-4 py-2 sticky top-0 bg-gray-100 text-left">Created At</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center py-4 text-gray-500">
                  No data present
                </td>
              </tr>
            ) : (
              filteredData.map((item, index) => (
                <tr key={item._id || index} className="border-b">
                  <td className="px-4 py-2">{index + 1}</td>
                  <td className="px-4 py-2">{item.scannerId}</td>
                  <td className="px-4 py-2">{item.sheetsScanned}</td>
                  <td className="px-4 py-2">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
