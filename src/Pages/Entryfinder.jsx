import React, { useEffect, useState } from "react";
import Sidebar from "../component/sidebar";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  fetchTables,
  getColumnFromTable,
  getImage,
  searchRecord,
} from "../helper/Urlhelper";
// import { getEntryBySearch } from "../helper/Urlhelper"; // <-- API for search
import { ImageViewer, FullScreenViewer } from "react-iv-viewer";
import "react-iv-viewer/dist/react-iv-viewer.css";
const Entryfinder = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedTable, setSelectedTable] = useState(null);
  const [tableOptions, setTableOptions] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [base64String, setBase64String] = useState(null);
  const [columnOptions, setColumnOptions] = useState([]);
  const [selectedColumn, setSelectedColumn] = useState(null);


  
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

  useEffect(() => {
    const fetchColumns = async (table) => {
      try {
        const col = await getColumnFromTable(table);
        if (col.data.columns) {
          setColumnOptions(col.data.columns);
        }
      } catch (err) {
        console.log(err);
      }
    };
    if (selectedTable) {
      fetchColumns(selectedTable);
    }
  }, [selectedTable]);


  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      toast.warn("Please enter a search term");
      return;
    }
    if (!selectedTable) {
      toast.warn("Please select table ");
      return;
    }
    setLoading(true);
    try {
      const res = await searchRecord(selectedTable, searchTerm, selectedColumn); // API call
      

      if (res?.data?.success) {
        // setSearchResults(Object.values(res?.data?.results[0].record));
        console.log(res?.data?.results);
        setSearchResults(res?.data?.results);
        setHeaders(Object.keys(res?.data?.results[0].record));

        // setBase64String(res?.data?.results[0].image_base64);
      }

      // if (Array.isArray(res) && res.length > 0) {
      //   setSearchResults(res);
      // } else {
      //   setSearchResults([]);
      //   toast.info("No results found");
      // }
    } catch (error) {
      console.error(error?.response?.data);
      toast.error(error?.response?.data?.detail);
    } finally {
      setLoading(false);
    }
  };

  const alltableOptions = tableOptions.map((item, index) => {
    return (
      <option key={index} value={item}>
        {item}
      </option>
    );
  });

  const allColumnTableOptions = columnOptions.map((item, index) => {
    return (
      <option key={index} value={item}>
        {item}
      </option>
    );
  });
  const handleRowClick = async (item) => {
    setBase64String(null);
    const csvPath = item.record["CsvPath"];
    const frontSideImg = item.record["Front-Side-Image"];
    console.log(item.record["Front-Side-Image"]);
    console.log(item.record["CsvPath"]);

    const res = await getImage(csvPath, frontSideImg);
    console.log(res.data.success);
    if (res?.data?.success) {
      setBase64String(res.data.image_base64);
      // console.log(res.data.image_base64);
    }
  };
  const TableData = searchResults.map((item, rowIndex) => {
    return (
      <tr
        onClick={() => handleRowClick(item)}
        className="border-b hover:bg-gray-100 cursor-pointer"
        key={rowIndex}
      >
        {Object.values(item.record).map((value, colIndex) => (
          <td className="px-4 py-2" key={colIndex}>
            {value}
          </td>
        ))}
      </tr>
    );
  });

  // console.log(tableOptions);
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
          <select
            value={selectedTable}
            defaultValue={""}
            onChange={(e) => setSelectedTable(e.target.value)}
            className="border border-gray-300 px-4 py-2 focus:outline-none focus:ring focus:ring-blue-300"
          >
            <option value="" disabled>
              Select Table
            </option>
            {alltableOptions}
          </select>
          <select
            value={selectedColumn}
            defaultValue={""}
            onChange={(e) => setSelectedColumn(e.target.value)}
            className="border border-gray-300 px-4 py-2 focus:outline-none focus:ring focus:ring-blue-300"
          >
            <option value="" disabled>
              Select Column
            </option>
            {allColumnTableOptions}
          </select>
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
                {headers.map((item, idx) => {
                  return (
                    <th className="px-4 py-2 text-left" key={idx}>
                      {item}
                    </th>
                  );
                })}
                {/* <th className="px-4 py-2 text-left">Action</th> */}
              </tr>
            </thead>
            <tbody>
              {/* <tr className="border-b hover:bg-gray-100 cursor-pointer">
                {searchResults.map((item, index) => (
                  <td className="px-4 py-2" key={index}>
                    {item}
                  </td>
                ))}
              </tr> */}
              {TableData}
            </tbody>
          </table>
        </div>

        {/* Image Viewer */}
        {/* {base64String && (
          <img
            src={`data:image/png;base64,${base64String}`}
            alt="Base64 Image"
            className="w-400 h-800 object-cover rounded"
          />
        )} */}
        {base64String && (
          <FullScreenViewer
            img={`data:image/png;base64,${base64String}`}
            width="640px"
            snapView={true}
          />
        )}
        <ToastContainer />
      </div>
    </>
  );
};

export default Entryfinder;
