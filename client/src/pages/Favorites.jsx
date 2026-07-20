import { useFavorite } from "../context/FavoriteContext";

export default function Favorites() {
  const { favorites, removeFavorite } = useFavorite();

  return (
    <div
      className="
      container
      mx-auto
      py-10
      "
    >
      <h1
        className="
        text-3xl
        font-bold
        mb-6
        "
      >
        Favorite Books
      </h1>

      {favorites.length === 0 ? (
        <p className="mt-5">No favorite books yet.</p>
      ) : (
        favorites.map((book) => (
          <div
            key={book._id}
            className="
            border
            p-4
            my-3
            rounded
            flex
            justify-between
            items-center
            "
          >
            <div>
              <h2
                className="
                font-bold
                text-lg
                "
              >
                {book.title}
              </h2>

              <p>{book.author}</p>

              <p>KES {book.price}</p>
            </div>

            <button
              onClick={() => removeFavorite(book._id)}
              className="
              bg-red-500
              text-white
              px-4
              py-2
              rounded
              hover:bg-red-600
              transition
              "
            >
              Remove
            </button>
          </div>
        ))
      )}
    </div>
  );
}
