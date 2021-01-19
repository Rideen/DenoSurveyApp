import { Router, RouterContext } from './deps.ts';
import authController from './controllers/AuthController.ts';

const router = new Router();

router
  .get('/', (ctx: RouterContext) => {
    ctx.response.body = 'Hello World';
  })
  .post('/api/login', authController.login)
  .post('/api/register', authController.register)
  ;

export default router;