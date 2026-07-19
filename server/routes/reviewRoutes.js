import express from "express";

import auth from "../middleware/auth.js";

import {

createReview,

getBookReviews,

getSellerReviews

}

from "../controllers/reviewController.js";



const router =
express.Router();



router.post(
"/",
auth,
createReview
);



router.get(
"/book/:bookId",
getBookReviews
);



router.get(
"/seller/:sellerId",
getSellerReviews
);



export default router;