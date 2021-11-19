import express from 'express';
import http from 'http';
import cors from 'cors';
import { Server } from 'socket.io';

const app = express();

app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: '*'
    }
});

io.on("connection", (socket) => {
    console.log(`User Connected ${socket.id}`);

    socket.on("join_room", (data) => {
        socket.join(data);
        console.log(`User with ID: ${socket.id} joined room: ${data}`);
    });

    socket.on("send_message", (data) => {
        socket.to(data.room).emit("receive_message", data);
    });

    socket.on("disconnect", () => {
        console.log("User Disconnected ", socket.id);
    });
});

app.get("/", (req, res) => {
    res.send("<h2>API is Running</h2>");
})

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
    console.log(`Server running on PORT : ${PORT}`);
});