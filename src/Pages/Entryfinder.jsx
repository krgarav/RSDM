import React, { useState } from "react";
import Sidebar from "../component/sidebar";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import { getEntryBySearch } from "../helper/Urlhelper"; // <-- API for search

const Entryfinder = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    // if (!searchTerm.trim()) {
    //   toast.warn("Please enter a search term");
    //   return;
    // }

    // setLoading(true);
    // try {
    //   const res = await getEntryBySearch(searchTerm); // API call
    //   if (Array.isArray(res) && res.length > 0) {
    //     setSearchResults(res);
    //   } else {
    //     setSearchResults([]);
    //     toast.info("No results found");
    //   }
    // } catch (error) {
    //   console.error(error);
    //   toast.error("Error fetching search results");
    // } finally {
    //   setLoading(false);
    // }
  };

  return (
    <>
      <Sidebar />
      <div className="p-4 sm:ml-64 mt-10 flex flex-col">
        <h1 className="text-3xl font-semibold mb-6">Search Entries</h1>

        {/* Search Bar */}
        <div className="flex mb-6">
          <input
            type="text"
            placeholder="Enter keyword to search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full border border-gray-300 rounded-l px-4 py-2 focus:outline-none focus:ring focus:ring-blue-300"
          />
          <button
            onClick={handleSearch}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold px-6 rounded-r"
          >
            {loading ? "Searching..." : "Search"}
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto bg-white shadow-md rounded-lg max-h-[50vh]">
          <table className="min-w-full table-auto">
            <thead className="bg-gray-200">
              <tr>
                <th className="px-4 py-2 text-left">#</th>
                <th className="px-4 py-2 text-left">Name</th>
                <th className="px-4 py-2 text-left">Email</th>
                <th className="px-4 py-2 text-left">Role</th>
                <th className="px-4 py-2 text-left">Status</th>
                <th className="px-4 py-2 text-left">Created At</th>
              </tr>
            </thead>
            <tbody>
              {searchResults.length > 0 ? (
                searchResults.map((item, index) => (
                  <tr
                    key={index}
                    className="border-b hover:bg-gray-100 cursor-pointer"
                  >
                    <td className="px-4 py-2">{index + 1}</td>
                    <td className="px-4 py-2">{item.username}</td>
                    <td className="px-4 py-2">{item.email}</td>
                    <td className="px-4 py-2">{item.role}</td>
                    <td className="px-4 py-2">
                      {item.isRestricted ? "Inactive" : "Active"}
                    </td>
                    <td className="px-4 py-2">
                      {new Date(item.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="6"
                    className="text-center text-gray-500 py-4 italic"
                  >
                    {loading ? "Searching..." : "No data to display"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <ToastContainer />
      </div>
    </>
  );
};

export default Entryfinder;
