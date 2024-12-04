import e from "express"
import dotenv  from "dotenv"
import router from "./routes/user.router.js";
import { db_conenct } from "./db/db.js";
import cookieParser from "cookie-parser";
import routers from "./routes/challenge.route.js";
import cors from "cors";
import routerss from "./routes/following.js";
import routersss from "./routes/trainer.route.js";
import routerssss from "./routes/personalgoal.js";
import { completeChallenges } from "./utils/challengeUtils.js";
const app=e();
const corsOptions = {
    origin: 'http://localhost:3000', // Frontend domain
    credentials: true, // Allow cookies to be sent
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Allowed methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
    exposedHeaders: ['Content-Type', 'Authorization'],
    
  };
  
  app.use(cors(corsOptions));
app.use(e.json());
app.use(e.urlencoded({ extended: true }));
app.use(cookieParser());
//dotenv file 
dotenv.config({
    path: "./.env" 
}); 
app.use("/api/v1",routerssss)
app.use("/api/v1/user", router)
app.use("/api/v1/challenge",routers)
app.use("/api/v1/trainer",routersss)
app.use("/api/v1",routerss)


// app.use("/api/v1/challenge",router)
app.listen(process.env.PORT || 3000, () => {
    db_conenct();
    console.log(`Server is running on port ${process.env.PORT || 3000}`);
});
