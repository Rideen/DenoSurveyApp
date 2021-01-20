import { surveysCollection } from "../mongo.ts";
import BaseModel from "./BaseModel.ts";

export interface SurveySchema {
  _id: { $oid: string };
  userId: string;
  name: string;
  description: string;
}

export class Survey extends BaseModel {
  id: string = '';
  userId: string = '';
  name: string = '';
  description: string = '';

  constructor(userId: string, name: string, description: string) {
    super();
    this.userId = userId;
    this.name = name;
    this.description = description;
  }

  static async create(survey: Survey) {
    const id = await surveysCollection.insertOne({
      name: survey.name,
      description: survey.description,
      userId: survey.userId
    });

    survey.id = id.$oid;

    return survey;
  }

  static async findByUser(userId: string): Promise<Survey[]> {
    const surveys = await surveysCollection.find({userId});
    return surveys.map((survey: any) => Survey.prepare(survey));
  }

  protected static prepare(data: any): Survey {
    data = BaseModel.prepare(data);
    const survey = new Survey(data.userId, data.name, data.description);
    survey.id = data.id;
    return survey;
  }
}