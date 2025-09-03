import React from "react";
import Sidebar from "../component/sidebar";
import { useState } from "react";
import { useEffect } from "react";
import {
  activatePath,
  addNewPath,
  createUser,
  deactivePath,
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
import { createPath } from "react-router-dom";
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
const Pathselector = () => {
  const [users, setUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newUser, setNewUser] = useState({ name: "", email: "", password: "" });
  const [role, setRole] = useState(null);
  const [profileModal, setProfileModal] = useState(false);
  const [currentUserDetail, setCurrentUserDetail] = useState(null);
  const [email, setEmail] = useState(null);
  const [userName, setUserName] = useState(null);
  const [allTableOptions, setAllTableOptions] = useState([]);

  const emailRef = useRef();
  const passwordRef = useRef();
  const userNameRef = useRef();

  const scannerNameRef = useRef();
  const scannerPathRef = useRef();
  const tableNameRef = useRef();

  const fetchallUsers = async () => {
    try {
      const res = await savedPathFetch();
      console.log(res.data);
      if (Array.isArray(res.data)) {
        setUsers(res.data);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchallUsers();
  }, [isModalOpen, profileModal]);

  const fetchAllTables = async () => {
    try {
      const res = await fetchTables();
      if (Array.isArray(res.data.tables)) {
        setAllTableOptions(res.data.tables);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchAllTables();
  }, []);
  useEffect(() => {
    if (currentUserDetail) {
      setProfileModal(true);
      console.log(emailRef);
    }
  }, [currentUserDetail]);

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

  useEffect(() => {}, []);
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
  // Handle adding a new user
  const handleAddUser = async () => {
    const scannerName = scannerNameRef.current.value;
    const scannerPath = scannerPathRef.current.value;
    const tableName = tableNameRef.current.value;

    // Validation
    if (!scannerName.trim()) {
      toast.warn("Scanner Name cannot be empty");
      return;
    }
    if (!scannerPath.trim()) {
      toast.warn("Scanner Path cannot be empty");
      return;
    }
    if (!tableName.trim()) {
      toast.warn("Table Name cannot be empty");
      return;
    }
    if (!scannerPath.includes(":")) {
      toast.warn("Invalid path! Please include ':' in the path.");
      return;
    }
    const obj = {
      path: scannerPath,
      scanner_id: scannerName,
      table_name: tableName,
    };
    console.log(obj);
    // return;
    try {
      const res = await addNewPath(obj);
      console.log(res);

      if (res?.status === 200) {
        toast.success("Path added successfully");
        setIsModalOpen(false);
      } else {
        toast.error(res?.data?.message || "Failed to add path");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to create path");
    }
  };

  const handleButtonAction = async (user) => {
    try {
      let res;
      if (user.active) {
        res = await deactivePath(user.id);
        console.log(res);
        if (res?.status === 200) {
          toast.success("Path deactivated successfully");
        } else {
          toast.error(res?.message || "Failed to deactivate path");
        }
      } else {
        res = await activatePath(user.id);
        if (res?.status === 200) {
          toast.success("Path activated successfully");
        } else {
          toast.error(res?.message || "Failed to activate path");
        }
      }

      // Update UI (either refetch or update state manually)
      await fetchallUsers(); // or update state if you have paths in local state
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while updating the path status");
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
      <td className="px-4 py-2">{user.scanner_id}</td>
      <td className="px-4 py-2">{user.path}</td>
      {/* <td className="px-4 py-2">{user.path}</td> */}
      <td className="px-4 py-2">
        <span
          className={`px-3 py-1 text-sm font-semibold rounded-full ${
            user.active
              ? "bg-green-100 text-green-700"
              : "bg-orange-100 text-orange-700"
          }`}
        >
          {user.active ? "Active" : "Inactive"}
        </span>
      </td>
      <td className="px-4 py-2">{user.table_name}</td>
      {/* ✅ Button Column */}
      <td className="px-4 py-2">
        <button
          className={`${
            user.active
              ? "bg-red-500 hover:bg-red-600" // For active users → Deactivate button
              : "bg-green-500 hover:bg-green-600" // For inactive users → Activate button
          } text-white px-3 py-1 rounded`}
          onClick={(e) => {
            e.stopPropagation(); // ✅ Prevent triggering row click
            handleButtonAction(user);
          }}
        >
          {user.active ? "Finish" : "Activate"}
        </button>
      </td>
    </tr>
  ));
  const AllOptions = allTableOptions.map((item, index) => {
    return (
      <option key={index} value={item}>
        {item}
      </option>
    );
  });
  return (
    <>
      <Sidebar />

      <div className="p-4 sm:ml-64 mt-10  flex flex-col">
        <div className="flex justify-between items-center align-middle">
          <h1 className="text-3xl font-semibold mb-4">Path Management</h1>
          {/* Create User Button */}
          <button
            onClick={() => setIsModalOpen(true)}
            className=" bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Add Path
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
                  Scanner ID
                </th>
                <th className="px-4 py-2 text-left sticky top-0 bg-gray-100">
                  Path
                </th>

                <th className="px-4 py-2 text-left sticky top-0 bg-gray-100">
                  Status
                </th>
                <th className="px-4 py-2 text-left sticky top-0 bg-gray-100">
                  Table
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
              <h2 className="text-xl font-semibold mb-4">Select Path</h2>
              <div className="mb-4">
                <label className="block text-sm font-bold mb-2" htmlFor="name">
                  Scanner Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  ref={scannerNameRef}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="Enter Scanner Name"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-bold mb-2" htmlFor="email">
                  Scanner Path
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  ref={scannerPathRef}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="Enter the path of scanner"
                />
              </div>

              <div className="mb-4">
                <label
                  className="block text-sm font-bold mb-2"
                  htmlFor="dbTable"
                >
                  DB Table
                </label>
                <select
                  id="dbTable"
                  name="dbTable"
                  ref={tableNameRef} // you can rename this to dbTableRef for clarity
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                >
                  <option value="">---Select DB Table---</option>
                  {AllOptions}
                </select>
              </div>
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
                  Add Path
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
        {/* <p className="text-center bottom-2 text-gray-500 text-xs">
          &copy;IOS.All rights reserved.
        </p> */}
      </div>
    </>
  );
};

export default Pathselector;
