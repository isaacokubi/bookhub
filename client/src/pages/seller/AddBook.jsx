import { useState } from "react";
import { toast } from "react-toastify";
import { createBook } from "../../api/sellerApi";

export default function AddBook() {
  const [image, setImage] = useState(null);

  const [book, setBook] = useState({
    title: "",
    author: "",
    price: "",
    description: "",
    category: "",
    condition: "Used",
  });

  const handleChange = (e) => {
    setBook({
      ...book,
      [e.target.name]: e.target.value,
    });
  };

  const submit = async (e) => {
    e.preventDefault();

    if (!image) {
      toast.error("Please select a book image");
      return;
    }

    try {
      const formData = new FormData();

      Object.keys(book).forEach((key) => {
        formData.append(key, book[key]);
      });

      formData.append("image", image);

      await createBook(formData);

      toast.success("Book uploaded successfully");

      setBook({
        title: "",
        author: "",
        price: "",
        description: "",
        category: "",
        condition: "Used",
      });

      setImage(null);
    } catch (error) {
      console.log(error.response?.data || error);

      toast.error("Failed to upload book");
    }
  };

  return (
    <div
      className="
      container
      mx-auto
      max-w-xl
      py-10
      "
    >
      <h1
        className="
        text-3xl
        font-bold
        mb-5
        "
      >
        Add Book
      </h1>

      <form
        onSubmit={submit}
        className="
        space-y-4
        "
      >
        <input
          name="title"
          value={book.title}
          onChange={handleChange}
          className="
          border
          p-3
          w-full
          rounded
          "
          placeholder="Book title"
        />

        <input
          name="author"
          value={book.author}
          onChange={handleChange}
          className="
          border
          p-3
          w-full
          rounded
          "
          placeholder="Author"
        />

        <input
          name="price"
          value={book.price}
          onChange={handleChange}
          type="number"
          className="
          border
          p-3
          w-full
          rounded
          "
          placeholder="Price"
        />

        <textarea
          name="description"
          value={book.description}
          onChange={handleChange}
          className="
          border
          p-3
          w-full
          rounded
          "
          placeholder="Description"
        />

        <input
          name="category"
          value={book.category}
          onChange={handleChange}
          className="
          border
          p-3
          w-full
          rounded
          "
          placeholder="Category"
        />

        <select
          name="condition"
          value={book.condition}
          onChange={handleChange}
          className="
          border
          p-3
          w-full
          rounded
          "
        >
          <option value="Used">Used</option>

          <option value="New">New</option>
        </select>

        <input
          type="file"
          accept="image/*"
          className="
          border
          p-3
          w-full
          "
          onChange={(e) => setImage(e.target.files[0])}
        />

        <button
          type="submit"
          className="
          bg-blue-600
          text-white
          px-5
          py-3
          rounded
          hover:bg-blue-700
          "
        >
          Upload Book
        </button>
      </form>
    </div>
  );
}
