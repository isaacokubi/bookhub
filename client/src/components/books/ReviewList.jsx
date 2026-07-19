export default function ReviewList({
reviews
}){

return (

<div className="space-y-4">

{
reviews.map(review=>(

<div

key={review._id}

className="
border
p-4
rounded
"

>

<h4 className="font-bold">

{review.buyer?.name}

</h4>

<p>

⭐ {review.rating}/5

</p>

<p>

{review.comment}

</p>

</div>

))
}

</div>

);

}