import { useState, useEffect } from "react";
import { toast } from "react-toastify";

import { addBook } from "../../api/bookApi";
import { getCategories } from "../../api/categoryApi";

export default function AddBook() {
  const [categories, setCategories] = useState([]);

  const [loadingCategories, setLoadingCategories] = useState(true);

  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    author: "",
    price: "",
    description: "",
    category: "",
    condition: "Used",
  });

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const res = await getCategories();

        console.log("Categories:", res.data);

        setCategories(Array.isArray(res.data) ? res.data : []);
      } catch (error) {
        console.log("Category loading error:", error);

        toast.error("Failed to load categories");
      } finally {
        setLoadingCategories(false);
      }
    };

    loadCategories();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,

      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSubmitting(true);

      const response = await addBook(formData);

      console.log("Book created:", response.data);

      toast.success("Book published successfully");

      setFormData({
        title: "",
        author: "",
        price: "",
        description: "",
        category: "",
        condition: "Used",
      });
    } catch (error) {
      console.log("Full error:", error);

      console.log("Response:", error.response?.data);

      toast.error(error.response?.data?.message || "Failed to add book");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <h1
        className="
        text-3xl
        font-bold
        "
      >
        Create Book Listing
      </h1>

      <form
        onSubmit={handleSubmit}
        className="
        space-y-4
        mt-5
        "
      >
        <input
          name="title"
          value={formData.title}
          onChange={handleChange}
          className="border p-3 w-full"
          placeholder="Book Title"
          required
        />

        <input
          name="author"
          value={formData.author}
          onChange={handleChange}
          className="border p-3 w-full"
          placeholder="Author"
          required
        />

        <input
          name="price"
          type="number"
          value={formData.price}
          onChange={handleChange}
          className="border p-3 w-full"
          placeholder="Price"
          required
        />

        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          className="border p-3 w-full"
          required
        >
          <option value="">
            {loadingCategories ? "Loading categories..." : "Select Category"}
          </option>

          {categories.map((category) => (
            <option key={category._id} value={category._id}>
              {category.name}
            </option>
          ))}
        </select>

        <select
          name="condition"
          value={formData.condition}
          onChange={handleChange}
          className="border p-3 w-full"
        >
          <option value="Used">Used</option>

          <option value="New">New</option>
        </select>

        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="border p-3 w-full"
          placeholder="Description"
        />

        <button
          type="submit"
          disabled={submitting}
          className="
          bg-blue-600
          text-white
          px-5
          py-3
          rounded
          disabled:opacity-50
          "
        >
          {submitting ? "Publishing..." : "Publish Book"}
        </button>
      </form>
    </div>
  );
}
