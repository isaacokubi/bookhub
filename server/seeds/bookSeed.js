import "dotenv/config";

import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";

import cloudinary from "../config/cloudinary.js";

import Book from "../models/Book.js";
import User from "../models/User.js";
import Category from "../models/Category.js";

import bcrypt from "bcryptjs";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const books = [
  {
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    ISBN: "9780743273565",
    description: "Classic American novel about wealth and ambition.",
    price: 1200,
    condition: "Like New",
    category: "Fiction",
    language: "English",
    quantity: 10,
    location: "Nairobi",
    deliveryOptions: ["Pickup", "Courier"],
    image: "gatsby.jpg",
  },

  {
    title: "Atomic Habits",
    author: "James Clear",
    ISBN: "9780735211292",
    description: "A practical guide to building better habits.",
    price: 1800,
    condition: "New",
    category: "Self Help",
    language: "English",
    quantity: 15,
    location: "Nairobi",
    deliveryOptions: ["Courier"],
    image: "atomic.jpg",
  },

  {
    title: "Clean Code",
    author: "Robert C. Martin",
    ISBN: "9780132350884",
    description: "A guide to writing clean and maintainable software.",
    price: 2500,
    condition: "Used",
    category: "Programming",
    language: "English",
    quantity: 5,
    location: "Mombasa",
    deliveryOptions: ["Pickup"],
    image: "clean-code.jpg",
  },

  {
    title: "Rich Dad Poor Dad",
    author: "Robert Kiyosaki",
    ISBN: "9781612680194",
    description: "A personal finance book about investing and money mindset.",
    price: 1500,
    condition: "Like New",
    category: "Business",
    language: "English",
    quantity: 12,
    location: "Nairobi",
    deliveryOptions: ["Pickup", "Courier"],
    image: "rich-dad.jpg",
  },

  {
    title: "The Lean Startup",
    author: "Eric Ries",
    ISBN: "9780307887894",
    description: "How entrepreneurs build successful businesses through innovation.",
    price: 2200,
    condition: "New",
    category: "Business",
    language: "English",
    quantity: 8,
    location: "Nakuru",
    deliveryOptions: ["Courier"],
    image: "lean-startup.jpg",
  },



  {
    title: "The Psychology of Money",
    author: "Morgan Housel",
    ISBN: "9780857197689",
    description: "Lessons about wealth, greed, and happiness.",
    price: 1900,
    condition: "New",
    category: "Self Help",
    language: "English",
    quantity: 14,
    location: "Nairobi",
    deliveryOptions: ["Courier"],
    image: "psychology-money.jpg",
  },

  {
    title: "Deep Work",
    author: "Cal Newport",
    ISBN: "9781455586691",
    description: "Rules for focused success in a distracted world.",
    price: 2100,
    condition: "Like New",
    category: "Self Help",
    language: "English",
    quantity: 10,
    location: "Eldoret",
    deliveryOptions: ["Pickup", "Courier"],
    image: "deep-work.jpg",
  },

  {
    title: "Steve Jobs",
    author: "Walter Isaacson",
    ISBN: "9781451648546",
    description: "Biography of Apple's founder Steve Jobs.",
    price: 3000,
    condition: "Used",
    category: "Biography",
    language: "English",
    quantity: 5,
    location: "Nairobi",
    deliveryOptions: ["Courier"],
    image: "steve-jobs.jpg",
  },

  {
    title: "Long Walk to Freedom",
    author: "Nelson Mandela",
    ISBN: "9780316548182",
    description: "Autobiography of Nelson Mandela's life.",
    price: 2500,
    condition: "Like New",
    category: "Biography",
    language: "English",
    quantity: 6,
    location: "Nairobi",
    deliveryOptions: ["Pickup"],
    image: "mandela.jpg",
  },

  {
    title: "The 7 Habits of Highly Effective People",
    author: "Stephen Covey",
    ISBN: "9781982137274",
    description: "Principles for personal and professional effectiveness.",
    price: 2000,
    condition: "New",
    category: "Self Help",
    language: "English",
    quantity: 11,
    location: "Thika",
    deliveryOptions: ["Courier"],
    image: "7-habits.jpg",
  },

  {
    title: "Python Crash Course",
    author: "Eric Matthes",
    ISBN: "9781593279288",
    description: "Hands-on programming guide for Python beginners.",
    price: 2700,
    condition: "New",
    category: "Programming",
    language: "English",
    quantity: 8,
    location: "Nairobi",
    deliveryOptions: ["Pickup", "Courier"],
    image: "python-crash-course.jpg",
  },

  {
    title: "Design Patterns",
    author: "Gang of Four",
    ISBN: "9780201633610",
    description: "Reusable solutions for software design problems.",
    price: 3500,
    condition: "Used",
    category: "Programming",
    language: "English",
    quantity: 4,
    location: "Mombasa",
    deliveryOptions: ["Courier"],
    image: "design-patterns.jpg",
  },

  {
    title: "The 48 Laws of Power",
    author: "Robert Greene",
    ISBN: "9780140280197",
    description: "A guide to influence and strategic thinking.",
    price: 1800,
    condition: "Like New",
    category: "Business",
    language: "English",
    quantity: 13,
    location: "Nairobi",
    deliveryOptions: ["Pickup"],
    image: "48-laws.jpg",
  },

  {
    title: "Think and Grow Rich",
    author: "Napoleon Hill",
    ISBN: "9781585424337",
    description: "Classic book about success and personal achievement.",
    price: 1300,
    condition: "Used",
    category: "Business",
    language: "English",
    quantity: 16,
    location: "Kisumu",
    deliveryOptions: ["Courier"],
    image: "think-grow-rich.jpg",
  },

 

  {
    title: "Zero to One",
    author: "Peter Thiel",
    ISBN: "9780804139298",
    description: "Notes on startups and creating the future.",
    price: 2300,
    condition: "New",
    category: "Business",
    language: "English",
    quantity: 7,
    location: "Nairobi",
    deliveryOptions: ["Courier"],
    image: "zero-to-one.jpg",
  },
];

async function seedBooks() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    console.log("Database connected");

    /*
CREATE SEED SELLER
*/

    let seller = await User.findOne({
      email: "seller@bookhub.com",
    });

    if (!seller) {
      const password = await bcrypt.hash("password123", 10);

      seller = await User.create({
    name: "BookHub Seller",
    email: "seller@bookhub.com",
    phone: "0712345678",
    password,
    role: "seller"
});

      console.log("Seller created");
    }

    /*
CREATE CATEGORIES
*/

    const categoryNames = [
      "Fiction",
      "Self Help",
      "Programming",
      "Business",
      "Biography",
    ];

    const categories = {};

    for (const name of categoryNames) {
      let category = await Category.findOne({
        name,
      });

      if (!category) {
        category = await Category.create({
          name,
        });
      }

      categories[name] = category._id;
    }

    /*
CLEAR OLD BOOKS
*/

    await Book.deleteMany();

    const uploadedBooks = [];

    for (const book of books) {
      const imagePath = path.join(__dirname, "images", book.image);

      const upload = await cloudinary.uploader.upload(imagePath, {
        folder: "bookhub/books",
      });

      uploadedBooks.push({
        title: book.title,

        author: book.author,

        ISBN: book.ISBN,

        description: book.description,

        price: book.price,

        condition: book.condition,

        category: categories[book.category],

        language: book.language,

        quantity: book.quantity,

        location: book.location,

        deliveryOptions: book.deliveryOptions,

        images: [upload.secure_url],

        seller: seller._id,

        status: "approved",
      });

      console.log(`${book.title} uploaded`);
    }

    await Book.insertMany(uploadedBooks);

    console.log("✅ 20 books seeded successfully");

    process.exit();
  } catch (error) {
    console.error(error);

    process.exit(1);
  }
}

seedBooks();
