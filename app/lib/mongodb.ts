import { MongoClient, Db } from "mongodb";

let client: MongoClient;
let db: Db;

const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/3ripple";

if (!uri) {
  throw new Error("Please define the MONGODB_URI environment variable");
}

export async function connectToDatabase() {
  if (db) return { client, db };

  client = new MongoClient(uri);
  await client.connect();
  db = client.db(); // use database from URI
  console.log("Connected to MongoDB");
  return { client, db };
}
