import { Response } from "express";
import { ObjectId, Collection } from "mongodb";
import { client } from "../config/mongo"
import dotenv from "dotenv";
dotenv.config({ path: "../.env" });

const USERSCOLLECTION: string = "users";

// User interface
interface User {
  _id: ObjectId;
  username: string;
  email: { address: string, verified: boolean };
  role: string;
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
        throw new Error(`Could not connect to the ${USERSCOLLECTION} collection`)
      }
      return collection;
    } else {
      throw new Error("Could not connect to the database");
    }
  } catch (error) {
    console.log(error);
  }
}

// Add a user
const addUser = async (res: Response, user: User): Promise<void> => {
  try {
    const collection = await connectToUsers();
    const userExists = await collection?.findOne({ email: user.email });
    if (userExists) {
      res.status(400).json({ message: "User already exists!" });
      return;
    }
    collection?.insertOne(user)
    res.status(200).json({ message: "User added successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Error adding user, try again later!" });
  }
};

// Get a user
const getUser = async (res: Response, username: string): Promise<void> => {
  try {
    const collection = await connectToUsers();
    const user = await collection?.findOne({ username: username });
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ message: "User not found!" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error getting user, try again later!" });
  }
}

// Export functions
export { addUser, getUser }