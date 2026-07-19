import helmet from "helmet";

import rateLimit from "express-rate-limit";

import mongoSanitize from "express-mongo-sanitize";

import xss from "xss-clean";



export const securityMiddleware=(app)=>{


app.use(
helmet()
);



app.use(
mongoSanitize()
);



app.use(
xss()
);



app.use(

rateLimit({

windowMs:
15*60*1000,

max:300

})

);


};