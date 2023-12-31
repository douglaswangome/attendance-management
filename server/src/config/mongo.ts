import { MongoClient, ServerApiVersion } from "mongodb"
import dotenv from "dotenv";
dotenv.config();

const client = new MongoClient(process.env.MONGO_URI || "", {
	serverApi: {
		version: ServerApiVersion.v1,
		strict: true,
		deprecationErrors: true,
	},
});

export { client };
