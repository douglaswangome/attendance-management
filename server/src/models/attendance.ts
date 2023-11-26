import { Response } from "express";
import { Collection } from "mongodb";
import { client } from "../config/mongo";

// Attendance interface
interface Attendance {
	username: string;
	present: boolean;
	latitude: number;
	longitude: number;
}
interface ClassDetails {
	room: string | "online";
	code: string;
	lecturer: string;
	date: { start: string; end: string };
}

// Connect to MongoDB, "moment instance" collection
const connectToAttendance = async (
	unit: string,
	dayAndTime: string
): Promise<Collection<Attendance> | undefined> => {
	try {
		await client.connect();
		const db = client.db(unit);
		let collection: Collection<Attendance> | undefined;

		if (db) {
			const existingCollection = await db
				.listCollections({ name: dayAndTime })
				.toArray();

			if (existingCollection.length > 0) {
				collection = db.collection(dayAndTime);
			} else {
				collection = await db.createCollection(dayAndTime);
			}

			if (collection === undefined) {
				throw new Error(`Could not connect to the ${dayAndTime} collection`);
			}

			return collection;
		} else {
			throw new Error("Could not connect to the database");
		}
	} catch (error) {
		console.log(error);
	}
};

// Add an attendance
const addAttendance = async (
	res: Response,
	attendance: Attendance,
	unit: string,
	dayAndTime: string
): Promise<void> => {
	try {
		const collection = await connectToAttendance(unit, dayAndTime);

		if (collection === undefined) {
			res.status(404).json({ message: "Collection not found" });
			throw new Error("Could not connect to the collection");
		}

		// const attendanceExists = await collection.findOne({
		// 	latitude: attendance.latitude,
		// 	longitude: attendance.longitude,
		// });
		// if (attendanceExists) {
		// 	res.status(400).json({ message: "Attendance already exists!" });
		// 	throw new Error("Attendance already exists!");
		// }

		collection.insertOne(attendance);
		res.status(200).json({ message: "Attendance added successfully!" });
	} catch (error) {
		res
			.status(500)
			.json({ message: "Error adding attendance, try again later!" });
	}
};

// Get all attendances
const getAttendances = async (
	res: Response,
	unit: string,
	dayAndTime: string
): Promise<void> => {
	try {
		const collection = await connectToAttendance(unit, dayAndTime);

		if (collection === undefined) {
			res.status(404).json({ message: "Collection not found" });
			throw new Error("Could not connect to the collection");
		}

		const attendances = await collection.find().toArray();
		res.status(200).json({ attendances });
	} catch (error) {
		res
			.status(500)
			.json({ message: "Error getting attendances, try again later!" });
	}
};

const getAllAttendances = async (
	res: Response,
	unit: string
): Promise<void> => {
	try {
		await client.connect();
		const db = client.db(unit);
		const collectionList = await db.listCollections().toArray();
		const collectionNames = collectionList
			.map((collection) => collection.name)
			.sort();

		res.status(200).json(collectionNames);
	} catch (error) {
		res
			.status(500)
			.json({ message: "Error getting attendances, try again later!" });
	}
};

export { addAttendance, getAttendances, getAllAttendances };
