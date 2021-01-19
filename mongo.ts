import { MongoClient } from "./deps.ts";
import UserSchema from "./models/User.ts";

const client = new MongoClient();
const mongoUrl = Deno.env.get("MONGO_URL")!;
await client.connectWithUri(mongoUrl);

const db = client.database("deno_survey");

export const usersCollection = db.collection<UserSchema>('users');