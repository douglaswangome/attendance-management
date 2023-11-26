import { Response } from "express";
import { ObjectId, Collection } from "mongodb";
import { client } from "../config/mongo";
import dotenv from "dotenv";
dotenv.config({ path: "../.env" });
import { Semester } from "../utils/types";

const USERSCOLLECTION: string = "users";

// User interface
interface User {
	_id: ObjectId;
	username: string;
	email: { address: string; verified: boolean };
	role: string;
	name?: string;
	department?: string;
	school?: string;
}

// Connect to MongoDB, users collection
const connectToUsers = async (): Promise<Collection<User> | undefined> => {
	try {
		await client.connect();
		const db = client.db(process.env.DB_NAME);
		let collection: Collection<User> | undefined;

		if (db) {
			collection = db.collection(USERSCOLLECTION);

			if (collection === undefined) {
				throw new Error(
					`Could not connect to the ${USERSCOLLECTION} collection`
				);
			}
			return collection;
		} else {
			throw new Error("Could not connect to the database");
		}
	} catch (error) {
		console.log(error);
	}
};

// Add a user
const addUser = async (res: Response, user: User): Promise<void> => {
	try {
		const collection = await connectToUsers();

		if (collection === undefined) {
			res.status(404).send("Collection not found");
			throw new Error("Could not connect to the collection");
		}

		const userExists = await collection.findOne({ email: user.email });
		if (userExists) {
			res.status(400).send("User already exists!");
			throw new Error("User already exists!");
		}

		collection.insertOne(user);
		res.status(200).json("User added successfully!");
	} catch (error) {
		res.status(500).send("Error adding user, try again later!");
	}
};

// Get a user
const getUser = async (res: Response, username: string): Promise<void> => {
	try {
		const collection = await connectToUsers();

		if (collection === undefined) {
			res.status(404).json({ message: "Collection not found" });
			throw new Error("Could not connect to the collection");
		}

		const user = await collection.findOne({ username });
		if (user) {
			res.status(200).json(user);
		} else {
			res.status(404).send("User not found!");
			throw new Error("User not found!");
		}
	} catch (error) {
		res.status(500).send("Error getting user, try again later!");
	}
};

// Get a lecturer name
const getLecturerName = async (res: Response, id: string): Promise<void> => {
	try {
		const collection = await connectToUsers();

		if (collection === undefined) {
			res.status(404).json({ message: "Collection not found" });
			throw new Error("Could not connect to the collection");
		}

		const lecturer = await collection.findOne({ _id: new ObjectId(id) });
		if (lecturer) {
			res.status(200).send(lecturer.name);
		} else {
			res.status(404).send("Lecturer not found!");
			throw new Error("Lecturer not found!");
		}
	} catch (error) {
		res.status(500).send("Error getting lecturer, try again later!");
	}
};

// Get students
const getStudents = async (res: Response, year: string, period: string) => {
	try {
		const collection = await connectToUsers();

		if (collection === undefined) {
			res.status(404).json({ message: "Collection not found" });
			throw new Error("Could not connect to the collection");
		}

		const students = await collection
			.find({
				role: "student",
				"semester.year": year,
				"semester.period": period,
			})
			.toArray();
		if (students) {
			res.status(200).json(students);
		} else {
			res.status(404).send("Students not found!");
			throw new Error("Students not found!");
		}
	} catch (error) {
		console.log(error);
	}
};

// Export functions
export { addUser, getUser, getStudents, getLecturerName };
