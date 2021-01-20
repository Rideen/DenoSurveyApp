import { renderFileToString, RouterContext } from "../deps.ts";
import { Survey } from "../models/Survey.ts";

class SiteController {
  async surveys(ctx: RouterContext) {
    const surveys = await Survey.findAll();
    ctx.response.body = await renderFileToString(`${Deno.cwd()}/views/surveys.ejs`, { surveys });
  }

  viewSurvey() {

  }
}

const siteController = new SiteController();
export default siteController;