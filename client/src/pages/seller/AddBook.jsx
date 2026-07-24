import { useState, useEffect } from "react";
import { toast } from "react-toastify";

import { addBook } from "../../api/bookApi";
import { getCategories } from "../../api/categoryApi";


export default function AddBook() {

  const [categories,setCategories] = useState([]);

  const [image,setImage] = useState(null);

  const [preview,setPreview] = useState("");

  const [submitting,setSubmitting] = useState(false);


  const [formData,setFormData] = useState({

    title:"",
    author:"",
    price:"",
    description:"",
    category:"",
    condition:"Used",

  });



  useEffect(()=>{

    const loadCategories = async()=>{

      try{

        const res = await getCategories();

        setCategories(res.data);

      }
      catch(error){

        console.log(
          "Category loading error:",
          error
        );

      }

    };


    loadCategories();


  },[]);





  const handleChange=(e)=>{

    setFormData({

      ...formData,

      [e.target.name]:e.target.value

    });

  };





  const handleImage=(e)=>{

    const file=e.target.files[0];


    if(file){

      setImage(file);

      setPreview(
        URL.createObjectURL(file)
      );

    }

  };





  const handleSubmit=async(e)=>{

    e.preventDefault();



    if(!formData.category){

      toast.error(
        "Please select a category"
      );

      return;

    }



    try{


      setSubmitting(true);



      const data=new FormData();



      data.append(
        "title",
        formData.title
      );


      data.append(
        "author",
        formData.author
      );


      data.append(
        "price",
        formData.price
      );


      data.append(
        "description",
        formData.description
      );


      data.append(
        "category",
        formData.category
      );


      data.append(
        "condition",
        formData.condition
      );



      if(image){

        data.append(
          "image",
          image
        );

      }




      const response = await addBook(data);



      console.log(
        response.data
      );



      toast.success(
        "Book published successfully"
      );



      setFormData({

        title:"",
        author:"",
        price:"",
        description:"",
        category:"",
        condition:"Used",

      });


      setImage(null);

      setPreview("");



    }
    catch(error){


      console.log(
        "Full error:",
        error
      );


      console.log(
        "Server response:",
        error.response?.data
      );



      toast.error(

        error.response?.data?.message
        ||
        "Failed to add book"

      );


    }
    finally{

      setSubmitting(false);

    }

  };




return (

<div>


<h1 className="text-3xl font-bold">

Create Book Listing

</h1>




<form

onSubmit={handleSubmit}

className="space-y-4 mt-5"

>



<input

name="title"

placeholder="Book Title"

value={formData.title}

onChange={handleChange}

className="border p-3 w-full"

/>




<input

name="author"

placeholder="Author"

value={formData.author}

onChange={handleChange}

className="border p-3 w-full"

/>





<input

name="price"

type="number"

placeholder="Price"

value={formData.price}

onChange={handleChange}

className="border p-3 w-full"

/>







<select

name="category"

value={formData.category}

onChange={handleChange}

className="border p-3 w-full"

>


<option value="">

Select Category

</option>



{
categories.map(category=>(


<option

key={category._id}

value={category._id}

>

{category.name}

</option>


))

}



</select>






<select

name="condition"

value={formData.condition}

onChange={handleChange}

className="border p-3 w-full"

>


<option value="New">

New

</option>


<option value="Like New">

Like New

</option>



<option value="Used">

Used

</option>


</select>







<textarea

name="description"

placeholder="Description"

value={formData.description}

onChange={handleChange}

className="border p-3 w-full"

/>







<input

type="file"

accept="image/*"

onChange={handleImage}

className="border p-3 w-full"

/>






{
preview &&

<img

src={preview}

alt="preview"

className="w-40 h-40 object-cover"

/>

}





<button

disabled={submitting}

className="bg-blue-600 text-white px-5 py-3 rounded"

>


{
submitting
?
"Uploading..."
:
"Publish Book"
}


</button>




</form>


</div>

);


}