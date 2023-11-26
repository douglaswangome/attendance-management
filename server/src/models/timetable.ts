import { Response } from "express";
import { Collection } from "mongodb";
import { client } from "../config/mongo";
import dotenv from "dotenv";
dotenv.config({ path: "../.env" });
import { Timetable } from "../utils/types";

const TIMETABLECOLLECTION: string = "timetable";

// Connect to MongoDB, "timetable" collection
const connectToTimetable = async (): Promise<
	Collection<Timetable> | undefined
> => {
	try {
		await client.connect();
		const db = client.db(process.env.DB_NAME);
		let collection: Collection<Timetable> | undefined;

		if (db) {
			collection = db.collection(TIMETABLECOLLECTION);

			if (collection === undefined) {
				throw new Error(`Could not connect to the timetable collection`);
			}
			return collection;
		} else {
			throw new Error("Could not connect to the database");
		}
	} catch (error) {
		console.log(error);
	}
};

// Add Timetable
const addTimetable = async (
	res: Response,
	timetable: Timetable[]
): Promise<void> => {
	try {
		const collection = await connectToTimetable();

		if (collection === undefined) {
			res.status(404).json({ message: "Collection not found" });
			throw new Error("Could not connect to the collection");
		}

		const result = await collection.insertMany(timetable);

		if (result.insertedCount === 0) {
			res.status(500).json({ message: "Timetable not added" });
			throw new Error("Timetable not added");
		}

		res.status(200).json({ message: "Timetable added" });
	} catch (error) {
		console.log(error);
	}
};

// Get Timetable
const getTimetable = async (
	res: Response,
	role: "admin" | "student",
	first: string, // school
	second: string, // department
	third?: string, // year
	fourth?: string // period
): Promise<void> => {
	try {
		const collection = await connectToTimetable();

		if (collection === undefined) {
			res.status(404).json({ message: "Collection not found" });
			throw new Error("Could not connect to the collection");
		}

		if (role === "student") {
			const timetable = await collection
				.find({
					school: first,
					department: second,
					"semester.year": third,
					"semester.period": fourth,
				})
				.toArray();

			if (timetable.length === 0) {
				res.status(404).json({ message: "Timetable not found" });
				throw new Error("Timetable not found");
			}

			res.status(200).json({ timetable });
		} else if (role === "admin") {
			const timetable = await collection
				.find({
					school: first,
					department: second,
				})
				.toArray();

			if (timetable.length === 0) {
				res.status(404).json({ message: "Timetable not found" });
				throw new Error("Timetable not found");
			}

			res.status(200).json(timetable);
		}
	} catch (error) {
		console.log(error);
	}
};

export { addTimetable, getTimetable };
