import { RouterContext, hashSync, compareSync, create, verify } from '../deps.ts';
import { usersCollection } from '../mongo.ts';

class AuthController {
  async login(ctx: RouterContext) {
    const { value } = ctx.request.body();
    const { email, password } = await value;

    if (!email || !password) {
      ctx.response.body = {
        message: "Provide email and password."
      };
      ctx.response.status = 422;
      return;
    }

    let userInDb = await usersCollection.findOne({ email });
    if (!userInDb) {
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
      email: email,
      id: userInDb._id.$oid,
      jwt
    };
    ctx.response.status = 200;
  }

  async register(ctx: RouterContext) {
    const { value } = ctx.request.body();
    const { name, email, password } = await value;

    if (!email || !password || !name) {
      ctx.response.body = {
        message: "Provide name, email and password."
      };
      ctx.response.status = 422;
      return;
    }

    let userInDb = await usersCollection.findOne({ email });
    if (userInDb) {
      ctx.response.body = {
        message: "Email is already in use."
      };
      ctx.response.status = 422;
      return;
    }

    const hashedPassword = hashSync(password);
    const id = await usersCollection.insertOne({
      name: name,
      password: hashedPassword,
      email: email,
    });

    ctx.response.status = 201;
    ctx.response.body = {
      id: id.$oid,
      email: email,
      name: name
    }
  }
}

const authController = new AuthController();

export default authController;