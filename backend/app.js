import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser";
import { PORT } from "./config/env.js";
import { test } from "./test.js";
import authRouter from "./routes/auth.routes.js";
import errorMiddleware from "./middlewares/error.middleware.js";

const app = express()

app.use(cors({
        origin : [
            "http://localhost:5173",
    ],
    credentials : true
}))

app.use(cookieParser())
app.use(express.json());
app.use(express.urlencoded({extended : true}));

app.use("/api/v1/auth", authRouter);

app.use(errorMiddleware);

const startServer = async() => {
    try{
        console.log("Trying to connect to database : ");
        app.listen(PORT, async()=>{ // <-- httpServer, plus app
            console.log(`App running on : http://localhost:${PORT}`);
            await test();
       });
    }catch(err){
        console.error(err);
    }
}

await startServer();