import mongoose from "mongoose";


const connectDatabase = async()=>{


try{


const connection =
await mongoose.connect(
process.env.MONGODB_URI
);


console.log(

`MongoDB Connected:
${connection.connection.host}`

);


}

catch(error){


console.log(
"Database Error:",
error.message
);


process.exit(1);


}


};



export default connectDatabase;