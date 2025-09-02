import React from "react";
import Sidebar from "../component/sidebar";
import { useState } from "react";
import { useEffect } from "react";
import {
  createTable,
  createUser,
  deactivePath,
  deleteTable,
  deleteUserById,
  fetchTables,
  getAllUsers,
  getUserById,
  savedPathFetch,
  updateUserById,
} from "../helper/Urlhelper";
import { useRef } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
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

function convertObjectToAlphabetArray(obj) {
  const result = Object.keys(obj).map((key) => {
    return { [key]: "alphabet" };
  });
  return result;
}
const ManageTable = () => {
  const [users, setUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newUser, setNewUser] = useState({ name: "", email: "", password: "" });
  const [role, setRole] = useState(null);
  const [profileModal, setProfileModal] = useState(false);
  const [currentUserDetail, setCurrentUserDetail] = useState(null);
  const [email, setEmail] = useState(null);
  const [userName, setUserName] = useState(null);
  const [jsonData, setJsonData] = useState([]);
  const [tableName, setTableName] = useState(null);
  const emailRef = useRef();
  const passwordRef = useRef();
  const userNameRef = useRef();
  const fetchUsers = async () => {
    try {
      const res = await fetchTables();
      if (Array.isArray(res.data.tables)) {
        setUsers(res.data.tables);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchUsers();
  }, [isModalOpen, profileModal]);

  useEffect(() => {
    if (currentUserDetail) {
      setProfileModal(true);
      console.log(emailRef);
    }
  }, [currentUserDetail]);
  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSuspendUser = async () => {
    const result = window.confirm(
      "Are you sure you want the user to be suspended?"
    );
    if (!result) {
      return;
    }
    const userId = currentUserDetail.id;
    const obj = { isRestricted: true };
    try {
      const res = await updateUserById(userId, obj);
      setProfileModal(false);
      console.log(res);
    } catch (error) {
      console.log(error);
    }
  };

  const handleUnSuspendUser = async () => {
    const result = window.confirm(
      "Are you sure you want the user to be un-suspended?"
    );
    if (!result) {
      return;
    }
    const userId = currentUserDetail.id;
    const obj = { isRestricted: false };
    try {
      const res = await updateUserById(userId, obj);
      setProfileModal(false);
      console.log(res);
    } catch (error) {
      console.log(error);
    }
  };
  const handleUserModal = async (userDetail) => {
    try {
      const res = await getUserById(userDetail.id);

      setEmail(res.email);
      setUserName(res.username);
      setRole(res.role);
      console.log(res);
      setCurrentUserDetail(res);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteUser = async () => {
    const userId = currentUserDetail.id;
    try {
      const res = await deleteUserById(userId);
      console.log(res);
      setProfileModal(false);
    } catch (error) {
      console.log(error);
    }
  };
  const handleAddUser = async () => {
    try {
      if (!tableName) {
        toast.error("Please enter a table name");
        return;
      }
      if (jsonData.length === 0) {
        toast.error("Please select CSV file");
        return;
      }
      // Prepare object
      const obj = {
        table_name: tableName,
        table_schema: jsonData,
      };

      // Show loading toast (optional)
      const loadingToast = toast.loading("Creating table...");

      // Call API
      const res = await createTable(obj);

      // Check response and show success
      if (res?.data?.success) {
        toast.dismiss(loadingToast);
        toast.success("Table created successfully!");
        setIsModalOpen(false);
        setTableName(null);
        setJsonData([]);
      } else {
        toast.dismiss(loadingToast);
        toast.error(res?.message || "Failed to create table");
      }
    } catch (error) {
      toast.dismiss();
      toast.error("An error occurred while creating the table");
      console.error(error);
    }
  };

  const handleButtonAction = async (user) => {
    try {
      const confirmed = window.confirm(
        "Are you sure you want to delete the table?"
      );
      if (!confirmed) return; // Exit if user cancels

      const res = await deleteTable(user);
      fetchUsers();
      console.log("Table deleted:", user);
    } catch (error) {
      console.error("Error deleting table:", error);
    }
  };

  const AllUsers = users.map((user, index) => (
    <tr
      key={index}
      className="border-b hover:bg-gray-100 cursor-pointer"
      onClick={() => {
        handleUserModal(user);
      }}
    >
      <td className="px-4 py-2">{index + 1}</td>
      <td className="px-4 py-2">{user}</td>

      {/* ✅ Button Column */}
      <td className="px-4 py-2">
        <button
          className={`${
            "bg-red-500 hover:bg-red-600" // For active users → Deactivate button
            // For inactive users → Activate button
          } text-white px-3 py-1 rounded`}
          onClick={(e) => {
            e.stopPropagation(); // ✅ Prevent triggering row click
            handleButtonAction(user);
          }}
        >
          Delete
        </button>
      </td>
    </tr>
  ));

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target.result;
        const jsonData = csvToJson(text);
        console.log(jsonData); // You can store it in state if needed
        setJsonData(convertObjectToAlphabetArray(jsonData[0]));
      };
      reader.readAsText(file);
    }
  };
  const csvToJson = (csv) => {
    const lines = csv
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line);
    const headers = lines[0].split(",");
    return lines.slice(1).map((line) => {
      const values = line.split(",");
      return headers.reduce((obj, header, index) => {
        obj[header.trim()] = values[index]?.trim();
        return obj;
      }, {});
    });
  };
  return (
    <>
      <Sidebar />

      <div className="p-4 sm:ml-64 mt-10  flex flex-col">
        <div className="flex justify-between items-center align-middle">
          <h1 className="text-3xl font-semibold mb-4">Table Manager</h1>
          {/* Create User Button */}
          <button
            onClick={() => setIsModalOpen(true)}
            className=" bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Create Table
          </button>
        </div>

        {/* Table for displaying users */}
        <div className="overflow-x-auto bg-white shadow-md rounded-lg max-h-[50vh]">
          <table className="min-w-full table-auto">
            <thead className="bg-gray-200">
              <tr>
                <th className="px-4 py-2 text-left sticky top-0 bg-gray-100">
                  Sr No.
                </th>

                <th className="px-4 py-2 text-left sticky top-0 bg-gray-100">
                  Table Name
                </th>
                <th className="px-4 py-2 text-left sticky top-0 bg-gray-100">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {AllUsers.length > 0 ? (
                AllUsers
              ) : (
                <tr>
                  <td colSpan="5" className="text-center py-4 text-gray-500">
                    No data present
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Modal for adding a new user */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
              <h2 className="text-xl font-semibold mb-4">Select CSV</h2>
              <div className="mb-4">
                <label className="block text-sm font-bold mb-2" htmlFor="name">
                  Table Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  onChange={(e) => setTableName(e.target.value)}
                  value={tableName}
                  ref={userNameRef}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="Enter Table Name"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-bold mb-2" htmlFor="name">
                  Sample Csv
                </label>
                <input
                  type="file"
                  id="name"
                  name="name"
                  ref={userNameRef}
                  accept=".csv"
                  onChange={handleFileChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="Enter Username"
                />
              </div>

              {/* JSON Data Display */}
              {jsonData && jsonData.length > 0 && (
                <div className="border rounded p-4 bg-gray-100 max-h-60 overflow-y-auto mb-4">
                  {jsonData.map((item, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center mb-2 border-b pb-2"
                    >
                      <div className="bg-gray-200 p-2 rounded w-1/2 text-sm font-medium">
                        {Object.keys(item).map((key) => (
                          <div key={key} className="mb-1">
                            {key}
                          </div>
                        ))}
                      </div>
                      <div className="bg-white p-2 rounded w-1/2 text-sm">
                        {Object.keys(item).map((key) => (
                          <div
                            key={key}
                            className="flex justify-between items-center mb-1"
                          >
                            <select
                              className="border rounded p-1 text-xs"
                              value={item[key]} // bind the value
                              onChange={(e) => {
                                const newValue = e.target.value;
                                setJsonData((prev) => {
                                  const updated = [...prev];
                                  updated[index] = {
                                    ...updated[index],
                                    [key]: newValue,
                                  };
                                  return updated;
                                });
                              }}
                            >
                              <option value="alphabet">Alphabet</option>
                              <option value="integer">Integer</option>
                            </select>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Buttons */}

              <div className="flex justify-between">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  Close
                </button>
                <button
                  onClick={handleAddUser}
                  className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  Create Table
                </button>
              </div>
            </div>
          </div>
        )}

        {profileModal && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
              <h2 className="text-xl font-semibold mb-4">Update User</h2>
              <div className="mb-4">
                <label className="block text-sm font-bold mb-2" htmlFor="name">
                  User Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={userName}
                  onChange={(event) => {
                    setUserName(event.target.value);
                  }}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="Enter Username"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-bold mb-2" htmlFor="email">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={email}
                  onChange={(event) => {
                    setEmail(event.target.value);
                  }}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="Enter email"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-bold mb-2" htmlFor="role">
                  Role
                </label>
                <div className="relative">
                  <select
                    id="role"
                    name="role"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    onChange={(event) => {
                      const selectedRole = event.target.value;

                      setRole(selectedRole);
                    }}
                    value={role}
                    defaultValue={""}
                  >
                    <option value="" disabled>
                      Select Role
                    </option>
                    <option value="operator">Operator</option>
                    <option value="admin">Admin</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg
                      className="w-4 h-4 text-gray-700"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>
              </div>
              <div className="flex justify-between mb-2">
                <button
                  onClick={handleAddUser}
                  className=" w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded focus:outline-none focus:shadow-outline"
                >
                  Update Details
                </button>
              </div>
              <div className="flex justify-between">
                {/* <button
                  onClick={handleDeleteUser}
                  className="bg-orange-400 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  Remove
                </button> */}
                {currentUserDetail.isRestricted ? (
                  <button
                    onClick={handleUnSuspendUser}
                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-6 rounded focus:outline-none focus:shadow-outline"
                  >
                    Un Suspend
                  </button>
                ) : (
                  <button
                    onClick={handleSuspendUser}
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-6 rounded focus:outline-none focus:shadow-outline"
                  >
                    Suspend
                  </button>
                )}

                <button
                  onClick={() => setProfileModal(false)}
                  className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-6 rounded focus:outline-none focus:shadow-outline"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
        <ToastContainer />
        <p className="text-center bottom-2 text-gray-500 text-xs">
          &copy;IOS.All rights reserved.
        </p>
      </div>
    </>
  );
};

export default ManageTable;
