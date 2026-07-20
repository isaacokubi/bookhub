import BookCard from "./BookCard";


export default function BookGrid({
books=[]
}){


return (

<div
className="
grid
grid-cols-1
md:grid-cols-3
lg:grid-cols-4
gap-6
"
>


{[...new Map(
  books.map(book => [book._id, book])
).values()].map(book => (
  <BookCard
    key={book._id}
    book={book}
  />
))}



</div>


);


}