import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser";
import { PORT } from "./config/env.js";
import { test } from "./test.js";
import authRouter from "./routes/auth.routes.js";
import errorMiddleware from "./middlewares/error.middleware.js";
import projectRouter from "./routes/project.routes.js";
import memberRouter from "./routes/member.routes.js";
import taskRouter from "./routes/task.routes.js";
import notificationRouter from "./routes/notification.routes.js";
import dashboardRouter from "./routes/dashboard.routes.js";
import settingsRouter from "./routes/settings.routes.js";
import { Server } from "socket.io";
import { createServer } from "http";
import { initializeSocket } from "./socket/socket.js";
import helmet from "helmet"

const app = express()

const server = createServer(app)

initializeSocket(server)

app.use(helmet())

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
app.use('/api/v1/projects', projectRouter);
app.use("/api/v1", memberRouter)
app.use("/api/v1", taskRouter)
app.use("/api/v1", notificationRouter);
app.use("/api/v1", dashboardRouter);
app.use("/api/v1", settingsRouter);

app.use(errorMiddleware);

const startServer = async() => {
    try{
        console.log("Trying to connect to database : ");
        server.listen(PORT, async()=>{ // <-- httpServer, plus app
            console.log(`App running on : http://localhost:${PORT}`);
            await test();
       });
    }catch(err){
        console.error(err); 
    }
}

await startServer();