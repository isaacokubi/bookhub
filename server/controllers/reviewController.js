import Review from "../models/Review.js";
import User from "../models/User.js";



export const createReview =
async(req,res,next)=>{

try{

const {
book,
seller,
rating,
comment
}=req.body;



const review =
await Review.create({

book,
seller,

buyer:req.user._id,

rating,
comment

});



const reviews =
await Review.find({
seller
});



const average =

reviews.reduce(
(sum,item)=>sum+item.rating,
0
)
/ reviews.length;



await User.findByIdAndUpdate(

seller,

{

rating:{

average,
count:reviews.length

}

}

);



res.status(201).json(review);

}
catch(error){

next(error);

}

};





export const getBookReviews =
async(req,res)=>{

const reviews =
await Review.find({

book:req.params.bookId,

approved:true

})

.populate(
"buyer",
"name"
)

.sort("-createdAt");



res.json(reviews);

};





export const getSellerReviews =
async(req,res)=>{

const reviews =
await Review.find({

seller:req.params.sellerId

})

.populate(
"buyer",
"name"
);



res.json(reviews);

};