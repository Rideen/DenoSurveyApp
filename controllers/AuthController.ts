import { RouterContext, hashSync, compareSync, create, verify } from '../deps.ts';
import User from '../models/User.ts';

class AuthController {
  async login(ctx: RouterContext) {
    const { value } = ctx.request.body();
    const { email, password } = await value;

    if(!email || !password) {
      ctx.response.body = {
        message: "Provide email and password."
      };
      ctx.response.status = 422;
      return;
    }

    let userInDb = await User.findOne({ email });
    if(!userInDb) {
      ctx.response.body = {
        message: "User not found."
      };
      ctx.response.status = 422;
      return;
    }

    if(!compareSync(password, userInDb.password)) {
      ctx.response.body = {
        message: "Password is incorrect."
      };
      ctx.response.status = 422;
      return;
    }

    const secret = Deno.env.get('JWT_SECRET_KEY')!;
    const jwt = await create({ alg: "HS512", typ: "JWT" }, { iss: userInDb.email, exp: new Date().getTime() + 60 * 60 * 1000 }, secret);
    
    ctx.response.body = {
      id: userInDb.id,
      name: userInDb.name,
      email: userInDb.email,
      jwt
    };
    ctx.response.status = 200;
  }

  async register(ctx: RouterContext) {
    const { value } = ctx.request.body();
    const { name, email, password } = await value;

    if(!email || !password || !name) {
      ctx.response.body = {
        message: "Provide name, email and password."
      };
      ctx.response.status = 422;
      return;
    }

    let userInDb = await User.findOne({ email });
    if (userInDb) {
      ctx.response.body = {
        message: "Email is already in use."
      };
      ctx.response.status = 422;
      return;
    }

    const hashedPassword = hashSync(password);
    let newUser = new User(name, email, hashedPassword);
    await newUser.save();

    ctx.response.status = 201;
    ctx.response.body = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email
    }
  }
}

const authController = new AuthController();

export default authController;