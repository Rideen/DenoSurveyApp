import { RouterContext } from '../deps.ts';
import { surveysCollection } from '../mongo.ts';

class SurveyController {
  async getAllForUser(ctx: RouterContext) {
    ctx.response.status = 200;
    ctx.response.body = [];
  }

  async getSingle(ctx: RouterContext) {

  }

  async create(ctx: RouterContext) {
    const { value } = ctx.request.body();
    const { name, description } = await value;

    if (!name || !description) {
      ctx.response.status = 422;
      ctx.response.body = "Name and description are mandatory.";
    }

    const id = await surveysCollection.insertOne({
      name: name,
      description: description
    });

    ctx.response.status = 201;
    ctx.response.body = {
      name: name,
      description: description,
      id: id.$oid
    };
  }

  async update(ctx: RouterContext) {

  }

  async delete(ctx: RouterContext) {

  }
}

const surveyController = new SurveyController();
export default surveyController;