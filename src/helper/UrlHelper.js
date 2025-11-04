import React, { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import qs from "qs";

// https://txcfswqz-8000.inc1.devtunnels.ms/docs
const URL = "http://192.168.0.100:8000";
// const URL = "http://localhost:8000";
export const login = async (body) => {
  try {
    const response = await axios.post(
      `${URL}/auth/login`,
      qs.stringify(body), // convert object to form-encoded string
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );
    return response; // return the full response to handle status outside
  } catch (error) {
    console.error(error);
    return error.response; // return full error response to handle status outside
  }
};

export const getAllUsers = async () => {
  const token = localStorage.getItem("upsctoken");

  try {
    const response = await axios.get(`${URL}/users/allusers`, {
      headers: {
        Authorization: `Bearer ${token}`, // ✅ Added Bearer token format
      },
    });
    return response.data; // return the full response to handle status outside
  } catch (error) {
    console.error(error);
    return error.response; // return full error response to handle status outside
  }
};

export const createUser = async (body) => {
  const token = localStorage.getItem("upsctoken");

  try {
    const response = await axios.post(
      `${URL}/auth/register`,
      { ...body },
      {
        headers: {
          Authorization: `Bearer ${token}`, // ✅ Added Bearer token format
        },
      }
    );
    return response.data; // return the full response to handle status outside
  } catch (error) {
    console.error(error);
    return error.response; // return full error response to handle status outside
  }
};

export const getUserById = async (id) => {
  const token = localStorage.getItem("upsctoken");

  try {
    const response = await axios.get(`${URL}/users/userdetail${id}`, {
      headers: {
        token: `${token}`,
      },
    });
    return response.data; // return the full response to handle status outside
  } catch (error) {
    console.error(error);
    return error.response; // return full error response to handle status outside
  }
};

export const updateUserById = async (id, body) => {
  const token = localStorage.getItem("upsctoken");

  try {
    const response = await axios.put(
      `${URL}/api/users/update/${id}`,
      { ...body },
      {
        headers: {
          token: `${token}`,
        },
      }
    );
    return response.data; // return the full response to handle status outside
  } catch (error) {
    console.error(error);
    return error.response; // return full error response to handle status outside
  }
};

export const deleteUserById = async (id) => {
  const token = localStorage.getItem("upsctoken");

  try {
    const response = await axios.delete(`${URL}/api/users/remove/${id}`, {
      headers: {
        token: `${token}`,
      },
    });
    return response.data; // return the full response to handle status outside
  } catch (error) {
    console.error(error);
    return error.response; // return full error response to handle status outside
  }
};

export const uploadData = async (formdata) => {
  const token = localStorage.getItem("upsctoken");

  try {
    const response = await axios.post(
      `${URL}/api/serializes/upload`,
      formdata,
      {
        headers: {
          token: `${token}`,
        },
        responseType: "blob", // Important: Set this to handle Blob responses
      }
    );

    return response; // return the full response to handle status outside
  } catch (error) {
    console.error(error);
    return error.response; // return full error response to handle status outside
  }
};

export const getAllData = async () => {
  const token = localStorage.getItem("upsctoken");

  try {
    const response = await axios.get(
      `${URL}/api/serializes/getall/serialize`,

      {
        headers: {
          token: `${token}`,
        },
      }
    );
    return response.data; // return the full response to handle status outside
  } catch (error) {
    console.error(error);
    return error.response; // return full error response to handle status outside
  }
};

export const downloadDataById = async (id, type) => {
  const token = localStorage.getItem("upsctoken");

  try {
    const response = await axios.get(
      `${URL}/api/serializes/download/textreport?serializeId=${id}&fileType=${type}`,
      {
        headers: {
          token: `${token}`,
        },
        responseType: "blob", // Important: Set this to handle Blob responses
      }
    );
    console.log(response);
    // Return both the data and headers in an object
    return response;
  } catch (error) {
    console.error(error);
    // Return both error data and error headers, if available
    return {
      data: error.response ? error.response.data : null,
      headers: error.response ? error.response.headers : null,
    };
  }
};

export const getUserAnalytics = async () => {
  const token = localStorage.getItem("upsctoken");

  try {
    const response = await axios.get(
      `${URL}/api/users/analytics`,

      {
        headers: {
          token: `${token}`,
        },
      }
    );
    return response.data; // return the full response to handle status outside
  } catch (error) {
    console.error(error);
    return error.response; // return full error response to handle status outside
  }
};

export const checkData = async (filename) => {
  const token = localStorage.getItem("upsctoken");

  try {
    const response = await axios.get(
      `${URL}/api/serializes/check?filename=${filename}`,
      {
        headers: {
          token: `${token}`,
        },
      }
    );

    return response.data; // return the full response to handle status outside
  } catch (error) {
    console.error(error);
    return error.response.data; // return full error response to handle status outside
  }
};

export const savedPathFetch = async () => {
  const token = localStorage.getItem("upsctoken");

  try {
    const response = await axios.get(`${URL}/folders/list`, {
      headers: {
        Authorization: `Bearer ${token}`, // ✅ Added Bearer token format
      },
    });

    // Return both the data and headers in an object
    return response;
  } catch (error) {
    console.error(error);
    // Return both error data and error headers, if available
    return {
      data: error.response ? error.response.data : null,
      headers: error.response ? error.response.headers : null,
    };
  }
};

export const deactivePath = async (folder_id) => {
  const token = localStorage.getItem("upsctoken");

  try {
    const response = await axios.post(
      `${URL}/folders/${folder_id}/deactivate`,
      {
        folder_id,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`, // ✅ Added Bearer token format
        },
      }
    );

    // Return both the data and headers in an object
    return response;
  } catch (error) {
    console.error(error);
    // Return both error data and error headers, if available
    return {
      data: error.response ? error.response.data : null,
      headers: error.response ? error.response.headers : null,
    };
  }
};

export const createTable = async (body) => {
  const token = localStorage.getItem("upsctoken");

  try {
    const response = await axios.post(`${URL}/tables/create`, body, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    // Return both the data and headers in an object
    return response;
  } catch (error) {
    console.error(error);
    // Return both error data and error headers, if available
    return {
      data: error.response ? error.response.data : null,
      headers: error.response ? error.response.headers : null,
    };
  }
};

export const fetchTables = async () => {
  const token = localStorage.getItem("upsctoken");

  try {
    const response = await axios.get(`${URL}/tables/all`, {
      headers: {
        Authorization: `Bearer ${token}`, // ✅ Added Bearer token format
      },
    });

    // Return both the data and headers in an object
    return response;
  } catch (error) {
    console.error(error);
    // Return both error data and error headers, if available
    return {
      data: error.response ? error.response.data : null,
      headers: error.response ? error.response.headers : null,
    };
  }
};

export const deleteTable = async (tableName) => {
  const token = localStorage.getItem("upsctoken");

  try {
    const response = await axios.delete(`${URL}/tables/delete/${tableName}`, {
      headers: {
        Authorization: `Bearer ${token}`, // ✅ Added Bearer token format
      },
    });

    // Return both the data and headers in an object
    return response;
  } catch (error) {
    console.error(error);
    // Return both error data and error headers, if available
    return {
      data: error.response ? error.response.data : null,
      headers: error.response ? error.response.headers : null,
    };
  }
};

export const addNewPath = async (body) => {
  const token = localStorage.getItem("upsctoken");

  try {
    const response = await axios.post(`${URL}/folders/add`, body, {
      headers: {
        Authorization: `Bearer ${token}`, // ✅ Added Bearer token format
      },
    });

    // Return both the data and headers in an object
    return response;
  } catch (error) {
    console.error(error);
    // Return both error data and error headers, if available
    return {
      data: error.response ? error.response.data : null,
      headers: error.response ? error.response.headers : null,
    };
  }
};

export const activatePath = async (folder_id) => {
  const token = localStorage.getItem("upsctoken");

  try {
    const response = await axios.post(
      `${URL}/folders/${folder_id}/activate`,
      {
        folder_id,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`, // ✅ Added Bearer token format
        },
      }
    );

    // Return both the data and headers in an object
    return response;
  } catch (error) {
    console.error(error);
    // Return both error data and error headers, if available
    return {
      data: error.response ? error.response.data : null,
      headers: error.response ? error.response.headers : null,
    };
  }
};
// **************//////////////*************************++++++++++++ */
export const searchRecord = async (tableName, queryDetail, col_name) => {
  const token = localStorage.getItem("upsctoken");

  try {
    const response = await axios.get(
      `${URL}/tables/searchrecord?table_name=${tableName}&search_value=${queryDetail}&column_name=${col_name}`,
      {
        headers: {
          Authorization: `Bearer ${token}`, // ✅ Added Bearer token format
        },
      }
    );

    // Return both the data and headers in an object
    return response;
  } catch (error) {
    console.error(error);
    // Return both error data and error headers, if available
    throw error;
  }
};

export const searchStudentRecord = async (obj) => {
  const token = localStorage.getItem("upsctoken");

  try {
    const response = await axios.post(
      `${URL}/tables/searchstudentwiserecord`, // ✅ POST instead of GET
      obj, // ✅ send your JSON body here
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data; // or return response if you want headers too
  } catch (error) {
    console.error("Error fetching student records:", error);
    throw error;
  }
};

export const getColumnFromTable = async (tableName) => {
  const token = localStorage.getItem("upsctoken");

  try {
    const response = await axios.get(
      `${URL}/tables/columns?table_name=${tableName}`,
      {
        headers: {
          Authorization: `Bearer ${token}`, // ✅ Added Bearer token format
        },
      }
    );

    // Return both the data and headers in an object
    return response;
  } catch (error) {
    console.error(error);
    // Return both error data and error headers, if available
    throw error;
  }
};

export const getImage = async (csvPath, frontSideImage) => {
  const token = localStorage.getItem("upsctoken");

  try {
    const response = await axios.get(
      `${URL}/tables/image?csv_path=${csvPath}&front_side_image=${frontSideImage}`,
      {
        headers: {
          Authorization: `Bearer ${token}`, // ✅ Added Bearer token format
        },
      }
    );

    // Return both the data and headers in an object
    return response;
  } catch (error) {
    console.error(error);
    // Return both error data and error headers, if available
    throw error;
  }
};

// Dashboard API'S

export const getActiveUsers = async () => {
  const token = localStorage.getItem("upsctoken");

  try {
    const response = await axios.get(`${URL}/dashboard/activeusers`, {
      headers: {
        Authorization: `Bearer ${token}`, // ✅ Added Bearer token format
      },
    });

    // Return both the data and headers in an object
    return response;
  } catch (error) {
    console.error(error);
    // Return both error data and error headers, if available
    throw error;
  }
};

export const getTotalUsers = async () => {
  const token = localStorage.getItem("upsctoken");

  try {
    const response = await axios.get(`${URL}/dashboard/totalusers`, {
      headers: {
        Authorization: `Bearer ${token}`, // ✅ Added Bearer token format
      },
    });

    // Return both the data and headers in an object
    return response;
  } catch (error) {
    console.error(error);
    // Return both error data and error headers, if available
    throw error;
  }
};

export const getTotalFileScanned = async () => {
  const token = localStorage.getItem("upsctoken");

  try {
    const response = await axios.get(`${URL}/dashboard/totalfilescanned`, {
      headers: {
        Authorization: `Bearer ${token}`, // ✅ Added Bearer token format
      },
    });

    // Return both the data and headers in an object
    return response;
  } catch (error) {
    console.error(error);
    // Return both error data and error headers, if available
    throw error;
  }
};

export const getTodayFileScanned = async () => {
  const token = localStorage.getItem("upsctoken");

  try {
    const response = await axios.get(`${URL}/dashboard/todaysfilescanned`, {
      headers: {
        Authorization: `Bearer ${token}`, // ✅ Added Bearer token format
      },
    });

    // Return both the data and headers in an object
    return response;
  } catch (error) {
    console.error(error);
    // Return both error data and error headers, if available
    throw error;
  }
};

export const getTodaysScannerWise = async () => {
  const token = localStorage.getItem("upsctoken");

  try {
    const response = await axios.get(`${URL}/dashboard/todaysdatascannerwise`, {
      headers: {
        Authorization: `Bearer ${token}`, // ✅ Added Bearer token format
      },
    });

    // Return both the data and headers in an object
    return response;
  } catch (error) {
    console.error(error);
    // Return both error data and error headers, if available
    throw error;
  }
};

export const getTotalScannerWise = async (startTime, endTime) => {
  const token = localStorage.getItem("upsctoken");

  try {
    const response = await axios.get(
      `${URL}/dashboard/totaldatascannerwise?start_date=${startTime}&end_date=${endTime}`,
      {
        headers: {
          Authorization: `Bearer ${token}`, // ✅ Added Bearer token format
        },
      }
    );

    // Return both the data and headers in an object
    return response;
  } catch (error) {
    console.error(error);
    // Return both error data and error headers, if available
    throw error;
  }
};

export const getUserLogsInfo = async (startTime, endTime) => {
  const token = localStorage.getItem("upsctoken");

  try {
    const response = await axios.get(
      `${URL}/opticviewlogs/loginlogs?start_date=${startTime}&end_date=${endTime}`,
      {
        headers: {
          Authorization: `Bearer ${token}`, // ✅ Added Bearer token format
        },
      }
    );

    // Return both the data and headers in an object
    return response;
  } catch (error) {
    console.error(error);
    // Return both error data and error headers, if available
    throw error;
  }
};
