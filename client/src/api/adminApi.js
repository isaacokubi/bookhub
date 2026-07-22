// client/src/api/adminApi.js

import axios from "axios";


const API = `${import.meta.env.VITE_API_URL}/admin`;


// Get authentication token

const getAuthConfig = () => {

  const token = localStorage.getItem("token");


  return {
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
  };

};



// =======================
// ADMIN DASHBOARD
// =======================

export const getDashboardStats = async () => {

  try {

    const response = await axios.get(
      `${API}/dashboard`,
      getAuthConfig()
    );


    console.log(
      "Dashboard API response:",
      response.data
    );


    return response.data;


  } catch (error) {

    console.error(
      "Dashboard API error:",
      error.response?.data || error.message
    );


    throw error;

  }

};



// =======================
// USERS
// =======================

export const getUsers = async () => {

  try {

    const response = await axios.get(
      `${API}/users`,
      getAuthConfig()
    );


    console.log(
      "Users API response:",
      response.data
    );


    return response.data;


  } catch (error) {

    console.error(
      "Users API error:",
      error.response?.data || error.message
    );


    throw error;

  }

};



export const deleteUser = async (id) => {

  const response = await axios.delete(
    `${API}/users/${id}`,
    getAuthConfig()
  );


  return response.data;

};



// =======================
// BOOKS
// =======================

export const getBooks = async () => {

  const response = await axios.get(
    `${API}/books`,
    getAuthConfig()
  );


  return response.data;

};


// Alias for admin pages

export const getAdminBooks = getBooks;



export const deleteBook = async (id) => {

  const response = await axios.delete(
    `${API}/books/${id}`,
    getAuthConfig()
  );


  return response.data;

};



// =======================
// ORDERS
// =======================

export const getOrders = async () => {

  try {

    const response = await axios.get(
      `${API}/orders`,
      getAuthConfig()
    );


    console.log(
      "Orders API response:",
      response.data
    );


    return response.data;


  } catch (error) {

    console.error(
      "Orders API error:",
      error.response?.data || error.message
    );


    throw error;

  }

};



export const updateOrderStatus = async (
  id,
  status
) => {

  const response = await axios.put(
    `${API}/orders/${id}`,
    {
      status,
    },
    getAuthConfig()
  );


  return response.data;

};



// =======================
// SELLERS
// =======================


export const getSellers = async () => {

  const response = await axios.get(
    `${API}/sellers`,
    getAuthConfig()
  );


  return response.data;

};



// Delete seller

export const deleteSeller = async (id) => {

  const response = await axios.delete(
    `${API}/sellers/${id}`,
    getAuthConfig()
  );


  return response.data;

};