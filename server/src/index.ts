import bodyParser from "body-parser";
import cors from "cors";
import express, { Express, Request, Response } from "express";
import helmet from "helmet";
import http from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
dotenv.config();

const app: Express = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "http://localhost:5173",
  })
);
app.use(helmet());
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
  },
});

io.on("connection", (socket) => {
  socket.on("join_class", (data) => {
    socket.join(data);
  });

  socket.on("send_notification", (data) => {
    socket.to(data.room).emit("notification", data.message);
  });

  socket.on("update_polygon", (data) => {
    socket.to(data.room).emit("polygon", data);
  });

  socket.on("send_polygon", (data) => {
    console.log(data);
    socket.to(data.room).emit("polygon_markers", data);
  });
});

server.listen(process.env.PORT, (): void => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
