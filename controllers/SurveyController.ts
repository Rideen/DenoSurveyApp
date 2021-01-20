import { RouterContext } from '../deps.ts';
import { Survey } from '../models/Survey.ts';
import { surveysCollection } from '../mongo.ts';

class SurveyController {
  async getAllForUser(ctx: RouterContext) {
    const surveys = await Survey.findByUser('1');
    ctx.response.status = 200;
    ctx.response.body = surveys;
  }

  async getSingle(ctx: RouterContext) {

  }

  async create(ctx: RouterContext) {
    const { value } = ctx.request.body();
    const { name, description, userId } = await value;

    if (!name || !description) {
      ctx.response.status = 422;
      ctx.response.body = "Name and description are mandatory.";
    }

    const createdSurvey = await Survey.create(new Survey(userId, name, description));

    ctx.response.status = 201;
    ctx.response.body = createdSurvey;
  }

  async update(ctx: RouterContext) {

  }

  async delete(ctx: RouterContext) {

  }
}

const surveyController = new SurveyController();
export default surveyController;