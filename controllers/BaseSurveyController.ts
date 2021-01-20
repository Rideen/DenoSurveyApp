import { RouterContext } from "../deps.ts";
import { Survey } from "../models/Survey.ts";

export default class BaseSurveyController {
  async findSurveyOrFail(surveyId: string, ctx: RouterContext): Promise<Survey | null> {
    const survey = await Survey.findById(surveyId);
    if (!survey) {
      ctx.response.status = 404;
      ctx.response.body = { message: "Incorrect survey ID." };
      return null;
    }

    const userId = ctx.state.user.id;
    if(survey.userId !== userId) {
      ctx.response.status = 403;
      ctx.response.body = { message: "Specified user does not have permissions on this survey." };
      return null;
    }

    return survey;
  }
}