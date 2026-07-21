import Favorite from "../models/Favorite.js";

// Add favorite
export const addFavorite = async (req, res) => {
  try {
    const favorite = await Favorite.create({
      user: req.user.id,

      book: req.body.bookId,
    });

    res.status(201).json(favorite);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

// Get user favorites
export const getFavorites = async (req, res) => {
  try {
    const favorites = await Favorite.find({
    user: req.user._id,
    }).populate("book");

    res.json(favorites);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Remove favorite
export const removeFavorite = async (req, res) => {
  try {
    await Favorite.findOneAndDelete({
      user: req.user.id,

      book: req.params.bookId,
    });

    res.json({
      message: "Removed from favorites",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
