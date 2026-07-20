import { useFavorite } from "../context/FavoriteContext";

export default function Favorites() {
  const { favorites } = useFavorite();

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
            "
          >
            <h2
              className="
              font-bold
              "
            >
              {book.title}
            </h2>

            <p>{book.author}</p>

            <p>KES {book.price}</p>
          </div>
        ))
      )}
    </div>
  );
}
