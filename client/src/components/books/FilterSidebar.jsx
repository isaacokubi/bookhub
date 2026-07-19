export default function FilterSidebar({
filters,
setFilters
}){


return (

<div
className="
space-y-4
"
>


<select

className="
border
p-3
rounded
w-full
"

value={filters.category}

onChange={
e=>
setFilters({
...filters,
category:e.target.value
})
}

>

<option value="">
All Categories
</option>


<option>
Academic
</option>


<option>
Fiction
</option>


<option>
Business
</option>


<option>
Technology
</option>


</select>



<select

className="
border
p-3
rounded
w-full
"

value={filters.condition}

onChange={
e=>
setFilters({
...filters,
condition:e.target.value
})
}

>


<option value="">
Any Condition
</option>


<option>
New
</option>


<option>
Used
</option>


<option>
Like New
</option>


</select>


</div>

);


}