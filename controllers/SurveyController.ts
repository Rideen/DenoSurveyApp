import { RouterContext } from '../deps.ts';
import { Survey } from '../models/Survey.ts';
import BaseSurveyController from "./BaseSurveyController.ts";

class SurveyController extends BaseSurveyController {
  async getAllForUser(ctx: RouterContext) {
    const userId = ctx.state.user.id;
    const surveys = await Survey.findByUser(userId);
    ctx.response.status = 200;
    ctx.response.body = surveys;
  }

  async getSingle(ctx: RouterContext) {
    const surveyId = ctx.params.id!;

    const survey = await this.findSurveyOrFail(surveyId, ctx);
    if (survey) {
      ctx.response.status = 200;
      ctx.response.body = survey;
    }
  }

  async create(ctx: RouterContext) {
    const { value } = ctx.request.body();
    const { name, description } = await value;

    if (!name || !description) {
      ctx.response.status = 422;
      ctx.response.body = "Name and description are mandatory.";
    }

    const userId = ctx.state.user.id;
    const createdSurvey = await Survey.create(new Survey(userId, name, description));

    ctx.response.status = 201;
    ctx.response.body = createdSurvey;
  }

  async update(ctx: RouterContext) {
    const surveyId = ctx.params.id!;

    const survey = await this.findSurveyOrFail(surveyId, ctx);

    if (survey) {
      const { value } = ctx.request.body();
      const { name, description } = await value;
      const userId = ctx.state.user.id;
      const modifiedSurvey = await Survey.update(surveyId, name, description, userId);
      ctx.response.body = modifiedSurvey;
    }
  }

  async delete(ctx: RouterContext) {
    const surveyId = ctx.params.id!;

    const survey = await this.findSurveyOrFail(surveyId, ctx);
    if (survey) {
      await Survey.delete(surveyId);
      ctx.response.status = 204;
    }
  }
}

const surveyController = new SurveyController();
export default surveyController;