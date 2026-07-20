export default function AddBook() {
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
        className="
space-y-4
mt-5
"
      >
        <input className="border p-3 w-full" placeholder="Book Title" />

        <input className="border p-3 w-full" placeholder="Author" />

        <input className="border p-3 w-full" placeholder="Price" />

        <textarea className="border p-3 w-full" placeholder="Description" />

        <button
          className="
bg-blue-600
text-white
px-5
py-3
rounded
"
        >
          Publish Book
        </button>
      </form>
    </div>
  );
}
