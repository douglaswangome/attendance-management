import { Response } from "express";
import { Collection } from "mongodb";
import { client } from "../config/mongo";
import dotenv from "dotenv";
dotenv.config({ path: "../.env" });

const UNITSCOLLECTION: string = "units";

interface Unit {
	code: string;
	title: string;
	semester: { year: string; period: string };
	lecturer: string;
	school: string;
	department: string;
}

// Connect to MongoDB, "units" collection
const connectToUnits = async (): Promise<Collection<Unit> | undefined> => {
	try {
		await client.connect();
		const db = client.db(process.env.DB_NAME);
		let collection: Collection<Unit> | undefined;

		if (db) {
			collection = db.collection(UNITSCOLLECTION);

			if (collection === undefined) {
				throw new Error(`Could not connect to the units collection`);
			}
			return collection;
		} else {
			throw new Error("Could not connect to the database");
		}
	} catch (error) {
		console.log(error);
	}
};

// Get all units
const getUnits = async (
	res: Response,
	role: "admin" | "student",
	first: string,
	second: string
): Promise<void> => {
	try {
		const collection = await connectToUnits();

		if (collection === undefined) {
			res.status(404).json({ message: "Collection not found" });
			throw new Error("Could not connect to the collection");
		}

		if (role === "student") {
			const units = await collection
				.find({
					"semester.year": first,
					"semester.period": second,
				})
				.toArray();
			res.status(200).json(units);
		} else {
			const units = await collection
				.find({ school: first, department: second })
				.toArray();
			res.status(200).json(units);
		}
	} catch (error) {
		res.status(500).json({ message: "Error getting units, try again later!" });
	}
};

export { getUnits };
