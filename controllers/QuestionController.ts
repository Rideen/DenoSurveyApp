import { RouterContext } from '../deps.ts';
import { Question } from "../models/Question.ts";
import BaseSurveyController from "./BaseSurveyController.ts";

class QuestionController extends BaseSurveyController {
  async getBySurvey(ctx: RouterContext) {
    const surveyId = ctx.params.surveyId!;
    const survey = await this.findSurveyOrFail(surveyId, ctx);

    if (survey) {
      const questions = await Question.findBySurvey(surveyId);
      ctx.response.status = 200;
      ctx.response.body = questions;
    }
  }

  async getSingle(ctx: RouterContext) {
    const questionId = ctx.params.id!;

    const question = await Question.findById(questionId);

    if (!question) {
      ctx.response.status = 404;
      ctx.response.body = { message: "Invalid quesiton ID." };
    }
    ctx.response.body = question;
  }

  async create(ctx: RouterContext) {
    const { value } = ctx.request.body();
    const { text, type, required, data } = await value;

    if (!text || !type || !required || !data) {
      ctx.response.status = 422;
      ctx.response.body = "Text, type, required and data fields are mandatory.";
    }

    const surveyId = ctx.params.surveyId!;
    const survey = await this.findSurveyOrFail(surveyId, ctx);

    if (survey) {
      const question = new Question(surveyId, text, type, required, data);
      await question.create();

      ctx.response.status = 201;
      ctx.response.body = question;
    }
  }

  async update(ctx: RouterContext) {
    const questionId = ctx.params.id!;

    const question = await Question.findById(questionId);

    if (!question) {
      ctx.response.status = 404;
      ctx.response.body = { message: "Invalid quesiton ID." };
    }

    const { value } = ctx.request.body();
    const { text, type, required, data } = await value;
    await question?.update(text, type, required, data);
    ctx.response.body = question;
  }

  async delete(ctx: RouterContext) {
    const questionId = ctx.params.id!;

    const question = await Question.findById(questionId);

    if (!question) {
      ctx.response.status = 404;
      ctx.response.body = { message: "Invalid quesiton ID." };
    }

    await question?.delete();
    ctx.response.status = 204;
  }
}

const questionController = new QuestionController();
export default questionController;