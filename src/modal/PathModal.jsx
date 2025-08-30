import React from "react";

const PathModal = () => {
  return (
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
            ref={userNameRef}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Enter Username"
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
            ref={emailRef}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Enter the path of scanner"
          />
        </div>

        <div className="flex justify-between">
          <button
            onClick={handleAddUser}
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Add User
          </button>
          <button
            onClick={() => setIsModalOpen(false)}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default PathModal;
