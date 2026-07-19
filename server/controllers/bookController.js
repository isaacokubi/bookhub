import Book from "../models/Book.js";

import {
uploadImage
}
from "../services/cloudinaryService.js";



// CREATE BOOK


export const createBook =
async(req,res,next)=>{


try{


const images=[];



if(req.files){


for(
const file of req.files
){

const url =
await uploadImage(file);


images.push(url);


}

}



const book =
await Book.create({

...req.body,

images,

seller:req.user._id

});



res.status(201).json(book);


}

catch(error){

next(error);

}


};





// GET ALL BOOKS


export const getBooks =
async(req,res)=>{


const {

search,

category,

condition,

minPrice,

maxPrice,

sort

}=req.query;



let query={

status:"approved"

};



if(search){


query.$or=[


{
title:
{
$regex:
search,
$options:"i"
}
},


{
author:
{
$regex:
search,
$options:"i"
}
},


{
ISBN:
{
$regex:
search,
$options:"i"
}

}


];


}




if(category)

query.category=category;



if(condition)

query.condition=condition;



if(minPrice || maxPrice)


query.price={

$gte:
minPrice || 0,


$lte:
maxPrice || 999999

};




let books =
Book.find(query)
.populate(
"seller",
"name rating"
);



if(sort==="lowest")

books.sort(
"price"
);


if(sort==="highest")

books.sort(
"-price"
);


if(sort==="newest")

books.sort(
"-createdAt"
);



const result =
await books;



res.json(result);


};





// SINGLE BOOK


export const getBook =
async(req,res)=>{


const book =
await Book.findById(
req.params.id
)

.populate(
"seller",
"name rating"
);



if(!book)

return res.status(404)
.json({

message:"Book not found"

});



book.views++;


await book.save();



res.json(book);


};





// SELLER BOOKS


export const sellerBooks =
async(req,res)=>{


const books =
await Book.find({

seller:req.user._id

});



res.json(books);


};





// UPDATE BOOK


export const updateBook =
async(req,res)=>{


const book =
await Book.findById(
req.params.id
);



if(
book.seller.toString()
!==req.user._id.toString()
)

return res.status(403)
.json({

message:"Not allowed"

});



Object.assign(
book,
req.body
);



await book.save();



res.json(book);


};





// DELETE BOOK


export const deleteBook =
async(req,res)=>{


const book =
await Book.findById(
req.params.id
);



if(
book.seller.toString()
!==req.user._id.toString()
)

return res.status(403)
.json({

message:"Not allowed"

});



await book.deleteOne();



res.json({

message:"Deleted"

});


};