import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import {
  getFavorites,
  addFavorite as addFavoriteApi,
  removeFavorite as removeFavoriteApi,
} from "../api/favoriteApi";


const FavoriteContext = createContext();



export function FavoriteProvider({ children }) {


  const [favorites, setFavorites] = useState([]);


useEffect(() => {

  const token = localStorage.getItem("token");

  if(token){
    loadFavorites();
  }

}, []);




  const loadFavorites = async () => {

    try {

      const res = await getFavorites();


      setFavorites(

        res.data.map(
          (item) => item.book
        )

      );


    } catch(error) {

      console.log(
        "Loading favorites failed:",
        error
      );


      setFavorites([]);

    }

  };





  const addFavorite = async (book) => {

    try {


      await addFavoriteApi({

        bookId: book._id

      });



      setFavorites((prev)=>[

        ...prev,

        book

      ]);



    } catch(error) {


      console.log(
        "Add favorite failed:",
        error
      );


    }

  };







  const removeFavorite = async (id) => {

    try {


      await removeFavoriteApi(id);



      setFavorites((prev)=>

        prev.filter(

          (book)=>book._id !== id

        )

      );



    } catch(error) {


      console.log(
        "Remove favorite failed:",
        error
      );


    }

  };







  const isFavorite = (id) => {


    return favorites.some(

      (book)=>book._id === id

    );


  };







  return (

    <FavoriteContext.Provider

      value={{

        favorites,

        addFavorite,

        removeFavorite,

        isFavorite,

        loadFavorites,

      }}

    >

      {children}

    </FavoriteContext.Provider>

  );

}




export const useFavorite = () =>

  useContext(FavoriteContext);