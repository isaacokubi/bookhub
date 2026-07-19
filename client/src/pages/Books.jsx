import {
useEffect,
useState
}
from "react";


import {
getBooks
}
from "../api/bookApi";


import BookGrid from "../components/books/BookGrid";

import SearchBar from "../components/books/SearchBar";

import FilterSidebar from "../components/books/FilterSidebar";



export default function Books(){


const [books,setBooks]=useState([]);

const [search,setSearch]=useState("");

const [filters,setFilters]=useState({

category:"",
condition:""

});



useEffect(()=>{


loadBooks();


},[search,filters]);



const loadBooks=async()=>{


try{


const res =
await getBooks({

search,

...filters

});


setBooks(res.data);


}

catch{

setBooks([]);

}


};



return (

<div
className="
container
mx-auto
px-5
py-10
"
>


<h1
className="
text-4xl
font-bold
mb-8
"
>

Browse Books

</h1>


<SearchBar

search={search}

setSearch={setSearch}

/>



<div
className="
grid
md:grid-cols-4
gap-8
mt-8
"
>


<div>

<FilterSidebar

filters={filters}

setFilters={setFilters}

/>

</div>



<div
className="
md:col-span-3
"
>

<BookGrid books={books}/>

</div>


</div>



</div>


);


}