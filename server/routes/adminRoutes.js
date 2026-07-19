import express from "express";

import auth from "../middleware/auth.js";

import {
authorize
}
from "../middleware/role.js";

import {

dashboard,

users,

suspendUser,

activateUser,

deleteUser,

pendingBooks,

approveBook,

rejectBook,

payments,

payouts,

approvePayout

}

from "../controllers/adminController.js";



const router =
express.Router();



router.use(
auth
);

router.use(
authorize("admin")
);



router.get(
"/dashboard",
dashboard
);



router.get(
"/users",
users
);



router.put(
"/users/:id/suspend",
suspendUser
);



router.put(
"/users/:id/activate",
activateUser
);



router.delete(
"/users/:id",
deleteUser
);



router.get(
"/books/pending",
pendingBooks
);



router.put(
"/books/:id/approve",
approveBook
);



router.put(
"/books/:id/reject",
rejectBook
);



router.get(
"/payments",
payments
);



router.get(
"/payouts",
payouts
);



router.put(
"/payouts/:id/approve",
approvePayout
);



export default router;