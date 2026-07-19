import {
addFavorite
}
from "../../api/favoriteApi";



export default function FavoriteButton({
bookId
}){


const save=
async()=>{

try{

await addFavorite(bookId);

alert(
"Saved"
);

}
catch{

alert(
"Already saved"
);

}

};



return (

<button

onClick={save}

className="
border
px-4
py-2
rounded
"

>

❤ Save

</button>

);

}