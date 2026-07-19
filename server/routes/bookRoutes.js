import express from "express";


import {

createBook,

getBooks,

getBook,

updateBook,

deleteBook,

sellerBooks

}

from "../controllers/bookController.js";



import auth from "../middleware/auth.js";

import upload from "../middleware/upload.js";



const router =
express.Router();





router.get(
"/",
getBooks
);



router.get(
"/seller",
auth,
sellerBooks
);



router.get(
"/:id",
getBook
);



router.post(

"/",

auth,

upload.array(
"images",
5
),

createBook

);



router.put(

"/:id",

auth,

updateBook

);



router.delete(

"/:id",

auth,

deleteBook

);



export default router;