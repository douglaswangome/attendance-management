import bodyParser from "body-parser";
import cors from "cors";
import express, { Express, Request, Response } from "express";
import helmet from "helmet";
import http from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
dotenv.config();
import { addUser, getUser, getStudents, getLecturerName } from "./models/users";
import { getUnits } from "./models/units";
import { addTimetable, getTimetable } from "./models/timetable";
import {
	addAttendance,
	createCollection,
	getAllAttendance,
	getAttendance,
} from "./models/attendance";

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

// Routes
// // User
app.post("/api/add_user", (req: Request, res: Response) =>
	addUser(res, req.body.user)
);
app.get("/api/get_user", (req: Request, res: Response) =>
	getUser(res, req.query.username as string)
);
app.get("/api/get_students", (req: Request, res: Response) =>
	getStudents(res, req.query.year as string, req.query.period as string)
);
app.get("/api/get_lecturer_name", (req: Request, res: Response) =>
	getLecturerName(res, req.query.id as string)
);

// // Units
app.get("/api/get_units", (req: Request, res: Response) =>
	getUnits(
		res,
		req.query.role as "student" | "admin",
		req.query.first as string,
		req.query.second as string
	)
);

// // Timetable
app.post("/api/add_timetable", (req: Request, res: Response) =>
	addTimetable(res, req.body.timetable)
);
app.get("/api/get_timetable", (req: Request, res: Response) =>
	getTimetable(
		res,
		req.query.role as "student" | "admin",
		req.query.first as string,
		req.query.second as string,
		req.query.third as string,
		req.query.fourth as string
	)
);

// // Attendance
app.post("/api/create_attendance_collection", (req: Request, res: Response) =>
	createCollection(res, req.body.code, req.body.moment)
);
app.post("/api/add_attendance", (req: Request, res: Response) =>
	addAttendance(res, req.body.unit, req.body.moment, req.body.attendances)
);
app.get("/api/get_attendance", (req: Request, res: Response) =>
	getAttendance(res, req.query.unit as string, req.query.moment as string)
);
app.get("/api/get_all_attendance", (req: Request, res: Response) =>
	getAllAttendance(res, req.query.unit as string)
);

server.listen(process.env.PORT, (): void => {
	console.log(`Server is running on port ${process.env.PORT}`);
});
