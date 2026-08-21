import {Server} from "socket.io"
import socketAuth from "./socketAuth.js";

let io

export const initializeSocket = (server) => {

    io = new Server(server, {
        cors : {
            origin : [
                "http://localhost:5173",
                 "https://nexora-virid-omega.vercel.app"
            ],
            credentials : true
        }
    })

    io.use(socketAuth);

    io.on('connection', (socket)=>{

        const user = socket.user;

        socket.join(`user_${user.id}`)
               socket.on("project:join", (projectId) => {

            socket.join(`project_${projectId}`);

            console.log(
                `${user.firstName} joined project_${projectId}`
            );
        });

        if(user.role === "ADMIN"){
            socket.join("admins")
        }

        console.log(`${user.firstName} connected`)
    });


    return io;
}

export const getIo = () => {

    if(!io){
        throw new Error("Socket.io is not initialized");
    }

    return io;
}