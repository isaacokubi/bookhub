import { useState } from "react";
import { toast } from "react-toastify";

import {
  addFavorite,
  removeFavorite,
} from "../../api/favoriteApi";


export default function FavoriteButton({ book }) {

  const [favorite, setFavorite] = useState(false);


  const handleFavorite = async () => {

    try {

      if (favorite) {

        await removeFavorite(book._id);

        setFavorite(false);

        toast.success(
          "Removed from favorites"
        );


      } else {

        await addFavorite(book._id);

        setFavorite(true);

        toast.success(
          "Added to favorites"
        );

      }


    } catch (error) {

      console.error(error);

      toast.error(
        "Something went wrong"
      );

    }

  };


  return (

    <button
      onClick={handleFavorite}
      className="
      text-2xl
      hover:scale-110
      transition
      "
    >

      {favorite ? "❤️" : "🤍"}

    </button>

  );

}