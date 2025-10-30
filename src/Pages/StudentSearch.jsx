import React, { useState } from "react";
import Sidebar from "../component/sidebar";
import { FaSearch } from "react-icons/fa";
import { IoArrowBack } from "react-icons/io5";
const StudentSearch = () => {
  // ✅ Define all form states
  const [formData, setFormData] = useState({
    Subject_Code: "",
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

  // ✅ Handle input change
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  // ✅ Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("Submitting form data:", formData);
    // alert(formData)

    // try {
    //   // Example API call (adjust URL and method as needed)
    //   const response = await fetch("https://your-api-endpoint.com/search", {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify(formData),
    //   });

    //   const result = await response.json();
    //   console.log("API Response:", result);

    //   // TODO: Handle success (show data, update UI, etc.)
    // } catch (error) {
    //   console.error("API Error:", error);
    //   // TODO: Handle error feedback to user
    // }
  };

  return (
    <>
      <Sidebar />
      <div className="p-4 sm:ml-64 mt-10 flex flex-col">
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h1 className="text-center text-2xl font-bold text-blue-700 mb-6">
            STUDENTS PLATFORM -{" "}
            <span className="text-orange-500">Search OMR Students Results</span>
          </h1>

          <form
            className="grid grid-cols-2 md:grid-cols-4 gap-4"
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
              <input
                type="text"
                id="Subject_Code"
                value={formData.Subject_Code}
                onChange={handleChange}
                className="border p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
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
              <select
                id="ABSENT"
                value={formData.ABSENT}
                onChange={handleChange}
                className="border p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
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

            {/* Created At */}
            <div className="flex flex-col">
              <label htmlFor="CreatedAt" className="text-gray-700 mb-1 text-sm">
                Created At
              </label>
              <input
                type="datetime-local"
                id="CreatedAt"
                value={formData.CreatedAt}
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
            <div className="col-span-2 md:col-span-4 flex justify-end gap-3 mt-2">
              <button
                type="submit"
                className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-lg shadow transition"
              >
                <FaSearch className="text-white text-lg" />
                Search
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default StudentSearch;
