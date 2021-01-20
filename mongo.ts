import { init, MongoClient } from "./deps.ts";
import { SurveySchema } from "./models/Survey.ts";
import { UserSchema } from "./models/User.ts";

//await init();

const client = new MongoClient();
const mongoUrl = Deno.env.get("MONGO_URL")!;
client.connectWithUri(mongoUrl);

const db = client.database("DenoSurvey");

const usersCollection = db.collection<UserSchema>("users");
const surveysCollection = db.collection<SurveySchema>("surveys");
const questionsCollection = db.collection("questions");
export { db, usersCollection, surveysCollection, questionsCollection };