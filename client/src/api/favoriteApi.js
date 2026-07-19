import api from "./axios";

export const addFavorite =
(book)=>
api.post(
"/favorites",
{book}
);

export const removeFavorite =
(bookId)=>
api.delete(
`/favorites/${bookId}`
);

export const getFavorites =
()=>
api.get(
"/favorites"
);