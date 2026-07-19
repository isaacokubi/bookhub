import express from "express";

import auth from "../middleware/auth.js";

import {

addFavorite,

removeFavorite,

myFavorites

}

from "../controllers/favoriteController.js";



const router =
express.Router();



router.post(
"/",
auth,
addFavorite
);



router.delete(
"/:bookId",
auth,
removeFavorite
);



router.get(
"/",
auth,
myFavorites
);



export default router;