import api from "./axios";

export const createReview =
(data)=>
api.post(
"/reviews",
data
);

export const getBookReviews =
(bookId)=>
api.get(
`/reviews/book/${bookId}`
);