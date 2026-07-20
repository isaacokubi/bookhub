import axios from "axios";


const API =
"https://bookhub-1-d9b3.onrender.com/api/favorites";



const getAuthConfig = () => {

  const token = localStorage.getItem("token");


  return {
    headers:{
      Authorization:`Bearer ${token}`
    }
  };

};





export const addFavorite = (bookId) => {

  return axios.post(
    API,
    {
      bookId,
    },
    getAuthConfig()
  );

};






export const getFavorites = () => {

  return axios.get(
    API,
    getAuthConfig()
  );

};






export const removeFavorite = (bookId) => {

  return axios.delete(
    `${API}/${bookId}`,
    getAuthConfig()
  );

};