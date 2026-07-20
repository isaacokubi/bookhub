import Favorite from "../models/Favorite.js";

export const addFavorite = async (req, res) => {
  const favorite = await Favorite.create({
    user: req.user._id,

    book: req.body.book,
  });

  res.status(201).json(favorite);
};

export const removeFavorite = async (req, res) => {
  await Favorite.findOneAndDelete({
    user: req.user._id,

    book: req.params.bookId,
  });

  res.json({
    message: "Removed",
  });
};

export const myFavorites = async (req, res) => {
  const favorites = await Favorite.find({
    user: req.user._id,
  })

    .populate("book");

  res.json(favorites);
};
