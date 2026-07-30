import Order from "../models/Order.js";
import Book from "../models/Book.js";


// ======================================
// CREATE ORDER
// ======================================

export const createOrder = async (req, res) => {

  try {


    const {
      books,
      total
    } = req.body;



    if (!books || books.length === 0) {

      return res.status(400).json({

        message:
          "No books selected"

      });

    }



    if (!total) {

      return res.status(400).json({

        message:
          "Total amount is required"

      });

    }



    console.log(
      "ORDER REQUEST:",
      req.body
    );



    const orderBooks = await Promise.all(

      books.map(async(item)=>{


        const bookId =
          item.book?._id ||
          item.book ||
          item.bookId ||
          item._id;



        const book =
          await Book.findById(bookId);



        if (!book) {


          throw new Error(

            `Book not found. Received ID: ${bookId}`

          );


        }



        return {

          book:
            book._id,


          seller:
            book.seller || null,


          price:
            book.price,


          quantity:
            item.quantity || 1

        };


      })

    );




    const commission =
      Number(total) * 0.10;



    const sellerAmount =
      Number(total) - commission;




    const order =
      await Order.create({


        user:
          req.user.id,


        books:
          orderBooks,


        total:
          Number(total),


        commission,


        sellerAmount,


        paymentStatus:
          "Pending",


        status:
          "Processing"


      });





    console.log(
      "CREATED ORDER:",
      order
    );




    return res.status(201).json({

      _id:
        order._id,


      total:
        order.total,


      paymentStatus:
        order.paymentStatus,


      status:
        order.status

    });



  } catch(error) {


    console.log(
      "Create Order Error:",
      error.message
    );


    return res.status(500).json({

      message:
        error.message

    });


  }

};




// ======================================
// GET USER ORDERS
// ======================================

export const getOrders = async(req,res)=>{

  try {


    const orders =
      await Order.find({

        user:
          req.user.id

      })

      .populate({

        path:
          "books.book",

        select:
          "title author price images"

      })

      .populate({

        path:
          "books.seller",

        select:
          "name email"

      })

      .sort({

        createdAt:
          -1

      });



    res.json(orders);



  } catch(error){


    res.status(500).json({

      message:
        error.message

    });


  }

};