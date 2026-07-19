import express from "express";


import {

initiatePayment,

mpesaCallback

}

from "../controllers/mpesaController.js";


import auth from "../middleware/auth.js";



const router =
express.Router();



router.post(

"/stkpush",

auth,

initiatePayment

);



router.post(

"/callback",

mpesaCallback

);



export default router;