export interface SurveySchema {
  _id: { $oid: string };
  name: string;
  description: string;
}