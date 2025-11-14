import React, { useEffect, useState } from "react";
import Sidebar from "../component/sidebar";
import { FaSearch } from "react-icons/fa";
import { IoArrowBack } from "react-icons/io5";
import {
  fetchTables,
  getImage,
  searchStudentRecord,
} from "../helper/Urlhelper";
import { toast, ToastContainer } from "react-toastify";
import { set } from "date-fns";
import { FullScreenViewer } from "react-iv-viewer";

const subjectCodeMappedWithQuestion = {
  601: 30,
  602: 30,
  603: 30,
  604: 50,
  605: 50,
  606: 30,
  "901/1": 50,
  "902/1": 50,
  903: 20,
  "904/1": 60,
  "905/1": 30,
  "906/1": 30,
  907: 20,
  908: 20,
  909: 20,
  910: 20,
  "911/2": 40,
  "912/1": 30,
};

const StudentSearch = () => {
  // ✅ Define all form states
  const [formData, setFormData] = useState({
    Subject_Code: "",
    Questions: "",
    LearningArea: "",
    OMR_SHEET_NUMBER: "",
    AssessmentNumber: "",
    CentreCode: "",
    CentreName: "",
    SClass: "",
    ABSENT: "",
    ScannerID: "",
    CreatedAt: "",
    CsvPath: "",
    BoxNumber: "",
  });
  const [selectedTable, setSelectedTable] = useState(null);
  const [tableOptions, setTableOptions] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [base64String, setBase64String] = useState(null);
  const fetchUsers = async () => {
    try {
      const res = await fetchTables();
      if (Array.isArray(res.data.tables)) {
        setTableOptions(res.data.tables);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchUsers();
  }, []);
  // ✅ Handle input change
  const handleChange = (e) => {
    const { id, value } = e.target;

    setFormData((prev) => {
      const updated = { ...prev, [id]: value };

      // If Subject_Code changes, update Questions too
      if (id === "Subject_Code") {
        updated.Questions = subjectCodeMappedWithQuestion[value] || "";
      }

      return updated;
    });
  };

  // ✅ Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData);
    const { Subject_Code } = formData;
    // return;
    if (!Subject_Code) {
      toast.warn("Please select a Subject Code");
      return;
    }
    setIsLoading(true);

    setHasSearched(true);
    // ✅ Filter out empty column values
    const filteredColumns = Object.fromEntries(
      Object.entries(formData).filter(([_, v]) => v !== "")
    );

    const obj = {
      columns: filteredColumns,
      table: selectedTable,
    };

    let loadingToast;

    try {
      // ✅ Show loading toast
      loadingToast = toast.loading("Searching records...");

      // ✅ Call the API
      const response = await searchStudentRecord(obj);
      const results = response?.results || [];

      // ✅ Handle "no records found"
      if (results.length === 0) {
        toast.update(loadingToast, {
          render: "No records found.",
          type: "info",
          isLoading: false,
          autoClose: 3000,
        });
        setSearchResults([]);
        setHeaders([]);
        return;
      }

      // ✅ Success case
      toast.update(loadingToast, {
        render: `Found ${results.length} matching record(s)`,
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });

      setHeaders(Object.keys(results[0]));
      setSearchResults(results);
    } catch (error) {
      console.error("❌ API Error:", error.response?.data || error.message);

      // ✅ Update the *same* loading toast to show the error
      if (loadingToast) {
        toast.update(loadingToast, {
          render:
            error.response?.data?.detail ||
            "Something went wrong while searching.",
          type: "error",
          isLoading: false,
          autoClose: 4000,
        });
      } else {
        // Fallback — in case loading toast didn't exist for some reason
        toast.error(
          error.response?.data?.detail ||
            "Something went wrong while searching."
        );
      }
      setSearchResults([]);
      setHeaders([]);
    } finally {
      // ✅ Always re-enable the button
      setIsLoading(false);
    }
  };

  const alltableOptions = tableOptions.map((item, index) => {
    return (
      <option key={index} value={item}>
        {item}
      </option>
    );
  });
  const handleRowClick = async (item) => {
    setBase64String(null);
    const csvPath = item?.CsvPath;
    const frontSideImg = item?.Front_Side_Image;
    if (!csvPath || !frontSideImg) {
      toast.error("CSV Path or Front Side Image data is missing.");
      return;
    }

    const res = await getImage(csvPath, frontSideImg);
    if (res?.data?.success) {
      setBase64String(res.data.image_base64);
      // console.log(res.data.image_base64);
    }
  };
  const TableData = searchResults.map((item, rowIndex) => (
    <tr
      key={rowIndex}
      className="border-b hover:bg-gray-100 cursor-pointer"
      onClick={() => handleRowClick(item)}
    >
      {Object.values(item).map((value, colIndex) => (
        <td key={colIndex} className="px-4 py-2 text-sm text-gray-700">
          {value !== null && value !== undefined ? value.toString() : ""}
        </td>
      ))}
    </tr>
  ));
  return (
    <>
      <Sidebar />
      <div className="p-4 sm:ml-64 mt-2 flex flex-col">
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <form
            className="grid grid-cols-2 md:grid-cols-6 gap-4"
            onSubmit={handleSubmit}
          >
            {/* Subject Code */}
            <div className="flex flex-col">
              <label
                htmlFor="Subject_Code"
                className="text-gray-700 mb-1 text-sm"
              >
                Subject Code
              </label>

              <select
                id="Subject_Code"
                value={formData.Subject_Code}
                onChange={handleChange}
                className="border p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="" disabled>
                  Select Subject Code
                </option>

                <option value="901/1">901/1</option>
                <option value="902/1">902/1</option>
                <option value="903">903</option>
                <option value="904/1">904/1</option>
                <option value="905/1">905/1</option>
                <option value="906/1">906/1</option>
                <option value="907">907</option>
                <option value="908">908</option>
                <option value="909">909</option>
                <option value="910">910</option>
                <option value="911/2">911/2</option>
                <option value="912/1">912/1</option>

                <option value="601">601</option>
                <option value="602">602</option>
                <option value="603">603</option>
                <option value="604">604</option>
                <option value="605">605</option>
                <option value="606">606</option>
              </select>
            </div>

            {/* Learning Area */}
            <div className="flex flex-col">
              <label
                htmlFor="LearningArea"
                className="text-gray-700 mb-1 text-sm"
              >
                Learning Area
              </label>
              <input
                type="text"
                id="LearningArea"
                value={formData.LearningArea}
                onChange={handleChange}
                className="border p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* OMR Sheet Number */}
            <div className="flex flex-col">
              <label
                htmlFor="OMR_SHEET_NUMBER"
                className="text-gray-700 mb-1 text-sm"
              >
                OMR Sheet Number
              </label>
              <input
                type="text"
                id="OMR_SHEET_NUMBER"
                value={formData.OMR_SHEET_NUMBER}
                onChange={handleChange}
                className="border p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Assessment Number */}
            <div className="flex flex-col">
              <label
                htmlFor="AssessmentNumber"
                className="text-gray-700 mb-1 text-sm"
              >
                Assessment Number
              </label>
              <input
                type="text"
                id="AssessmentNumber"
                value={formData.AssessmentNumber}
                onChange={handleChange}
                className="border p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Centre Code */}
            <div className="flex flex-col">
              <label
                htmlFor="CentreCode"
                className="text-gray-700 mb-1 text-sm"
              >
                Centre Code
              </label>
              <input
                type="text"
                id="CentreCode"
                value={formData.CentreCode}
                onChange={handleChange}
                className="border p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Centre Name */}
            <div className="flex flex-col">
              <label
                htmlFor="CentreName"
                className="text-gray-700 mb-1 text-sm"
              >
                Centre Name
              </label>
              <input
                type="text"
                id="CentreName"
                value={formData.CentreName}
                onChange={handleChange}
                className="border p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* SClass */}
            <div className="flex flex-col">
              <label htmlFor="SClass" className="text-gray-700 mb-1 text-sm">
                SClass
              </label>
              <input
                type="text"
                id="SClass"
                value={formData.SClass}
                onChange={handleChange}
                className="border p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Absent */}
            <div className="flex flex-col">
              <label htmlFor="ABSENT" className="text-gray-700 mb-1 text-sm">
                Absent
              </label>
              <input
                type="text"
                id="ABSENT"
                value={formData.ABSENT}
                onChange={handleChange}
                placeholder="A or Empty"
                className="border p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Scanner ID */}
            <div className="flex flex-col">
              <label htmlFor="ScannerID" className="text-gray-700 mb-1 text-sm">
                Scanner ID
              </label>
              <input
                type="text"
                id="ScannerID"
                value={formData.ScannerID}
                onChange={handleChange}
                className="border p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Full Name */}
            <div className="flex flex-col">
              <label htmlFor="FullName" className="text-gray-700 mb-1 text-sm">
                Full Name
              </label>
              <input
                type="text"
                id="FullName"
                value={formData.FullName}
                onChange={handleChange}
                className="border p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* CSV Path */}
            <div className="flex flex-col">
              <label htmlFor="CsvPath" className="text-gray-700 mb-1 text-sm">
                CSV Path
              </label>
              <input
                type="text"
                id="CsvPath"
                value={formData.CsvPath}
                onChange={handleChange}
                className="border p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Box Number */}
            <div className="flex flex-col">
              <label htmlFor="BoxNumber" className="text-gray-700 mb-1 text-sm">
                Box Number
              </label>
              <input
                type="text"
                id="BoxNumber"
                value={formData.BoxNumber}
                onChange={handleChange}
                className="border p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Buttons */}
            <div className="col-span-2 md:col-span-6 flex flex-row items-center justify-between mt-4">
              {/* ✅ Center text (only visible after search) */}
              <div className="flex-1 flex justify-center ml-20">
                {hasSearched && (
                  <div className="text-gray-700 text-sm font-medium">
                    Found {searchResults.length} matching record
                    {searchResults.length !== 1 ? "s" : ""}.
                  </div>
                )}
              </div>

              {/* ✅ Action row (right-aligned) */}
              <div className="flex items-center justify-end gap-3">
                {/* <select
                  value={selectedTable}
                  defaultValue=""
                  onChange={(e) => setSelectedTable(e.target.value)}
                  className="border border-gray-300 px-4 py-2 focus:outline-none focus:ring focus:ring-blue-300 rounded-md"
                  disabled={isLoading}
                >
                  <option value="" disabled>
                    Select Table
                  </option>
                  {alltableOptions}
                </select> */}

                <button
                  type="submit"
                  disabled={isLoading}
                  className={`flex items-center gap-2 px-5 py-2 rounded-lg shadow transition text-white ${
                    isLoading
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-blue-500 hover:bg-blue-600"
                  }`}
                >
                  {isLoading ? (
                    <>
                      <svg
                        className="animate-spin h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v8z"
                        ></path>
                      </svg>
                      Searching...
                    </>
                  ) : (
                    <>
                      <FaSearch className="text-white text-lg" />
                      Search
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>

          {/* Table */}
          {/* <div className="overflow-x-auto overflow-y-auto bg-white shadow-md rounded-lg max-h-[50vh] mt-2">
            <table className="min-w-full table-auto border-collapse">
              <thead className="bg-gray-200 sticky top-0 z-10">
                <tr>
                  {headers.map((item, idx) => (
                    <th
                      className="px-4 py-2 text-left text-gray-700 font-semibold border-b"
                      key={idx}
                    >
                      {item}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>{TableData}</tbody>
            </table>
          </div> */}
          <div className="flex gap-4 mt-4">
            {/* LEFT SIDE — Table */}
            <div
              className={`overflow-x-auto overflow-y-auto bg-white shadow-md rounded-lg max-h-[50vh] transition-all duration-300
    ${base64String ? "flex-1" : "w-full"}`}
            >
              <table className="min-w-full table-auto border-collapse">
                <thead className="bg-gray-200 sticky top-0 z-10">
                  <tr>
                    {headers.map((item, idx) => (
                      <th
                        className="px-4 py-2 text-left text-gray-700 font-semibold border-b"
                        key={idx}
                      >
                        {item}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>{TableData}</tbody>
              </table>
            </div>

            {/* RIGHT SIDE — Image Viewer (hide container when closed) */}
            {base64String && (
              <div className="flex justify-end relative w-[650px]">
                <div className="relative">
                  {/* Close button */}
                  <button
                    onClick={() => setBase64String(null)}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center shadow-md hover:bg-red-600 z-20"
                  >
                    ✕
                  </button>

                  <FullScreenViewer
                    img={`data:image/png;base64,${base64String}`}
                    width="640px"
                    snapView={true}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* {base64String && (
        <div className="relative flex justify-end">
       
          <button
            onClick={() => setBase64String(null)}
            className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center shadow-md hover:bg-red-600"
          >
            ✕
          </button>

          <FullScreenViewer
            img={`data:image/png;base64,${base64String}`}
            width="640px"
            snapView={true}
          />
        </div>
      )} */}

      <ToastContainer />
    </>
  );
};

export default StudentSearch;
