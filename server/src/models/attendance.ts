import { Response } from "express";
import { Collection, Db, Document } from "mongodb";
import { client } from "../config/mongo";
import { Attendance } from "../utils/types";

// Connect to MongoDB, "moment instance" collection
const connectToAttendance = async (
	unit: string,
	moment: string
): Promise<Collection<Attendance> | undefined> => {
	try {
		await client.connect();
		const db: Db | undefined = client.db(unit);
		let collection: Collection<Attendance> | undefined;

		if (db) {
			collection = db.collection(moment);

			if (collection === undefined) {
				throw new Error(`Could not connect to the ${moment} collection`);
			}
			return collection;
		} else {
			throw new Error("Could not connect to the database");
		}
	} catch (error) {
		console.log(error);
	}
};

// Create an attendance record
const createCollection = async (
	res: Response,
	unit: string,
	moment: string
): Promise<void> => {
	try {
		await client.connect();
		const db: Db | undefined = client.db(unit);

		if (!db) {
			res.status(500).send("Unable to connect to database");
			return;
		}
		const existingCollections = await db.listCollections().toArray();
		if (existingCollections.find((collection) => collection.name === moment)) {
			res.status(400).send("Attendance sheet already exists");
			return;
		}
		const collection: Collection<Attendance> = await db.createCollection(
			moment
		);
		if (!collection) {
			res.status(500).send("Unable to create attendance sheet");
		} else {
			res.status(200).send("Attendance sheet created successfully");
		}
	} catch (error) {
		res.status(500).send("Error creating attendance sheet");
		console.log(error);
	}
};

// Add an attendance record
const addAttendance = async (
	res: Response,
	unit: string,
	moment: string,
	attendance: Attendance
): Promise<void> => {
	try {
		const collection = await connectToAttendance(unit, moment);

		if (collection === undefined) {
			res.status(404).json({ message: "Collection not found" });
			throw new Error("Could not connect to the collection");
		}

		const result = await collection.insertOne(attendance);

		if (result.insertedId === undefined) {
			res.status(500).json({ message: "Attendance not added" });
			throw new Error("Attendance not added");
		}

		res.status(200).json({ message: "Attendance added" });
	} catch (error) {
		res.status(500).send("Error adding attendance");
		console.log(error);
	}
};

// Get an attendance records
const getAttendance = async (
	res: Response,
	unit: string,
	moment: string
): Promise<void> => {
	try {
		const collection = await connectToAttendance(unit, moment);

		if (collection === undefined) {
			res.status(404).send("Collection not found");
			throw new Error("Could not connect to the collection");
		}

		const attendances = await collection.find().toArray();

		if (attendances.length === 0) {
			res.status(404).send("No attendances found");
			throw new Error("No attendances found");
		}

		res.status(200).json(attendances);
	} catch (error) {
		res.status(500).send("Error getting attendances");
		console.log(error);
	}
};

export { createCollection, getAttendance, addAttendance };
