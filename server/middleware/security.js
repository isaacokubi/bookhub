import helmet from "helmet";
// import mongoSanitize from "express-mongo-sanitize";
import rateLimit from "express-rate-limit";
import xss from "xss";


export const securityMiddleware = (app)=>{

    app.use(helmet());

    // app.use(mongoSanitize());


    app.use((req,res,next)=>{

        if(req.body){

            Object.keys(req.body).forEach(key=>{

                if(typeof req.body[key] === "string"){

                    req.body[key] = xss(req.body[key]);

                }

            });

        }

        next();

    });


    app.use(rateLimit({

        windowMs:15 * 60 * 1000,

        max:100

    }));

};