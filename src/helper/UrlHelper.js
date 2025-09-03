import React, { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import qs from "qs";

// https://txcfswqz-8000.inc1.devtunnels.ms/docs
const URL = "http://192.168.1.15:8000";
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