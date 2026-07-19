export default function SearchBar({
search,
setSearch
}){


return (

<input

value={search}

onChange={
e=>setSearch(e.target.value)
}


placeholder="Search books by title, author or ISBN"


className="
w-full
border
p-3
rounded-lg
dark:bg-slate-800
"

/>

);


}