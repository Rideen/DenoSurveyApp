import { RouterContext, verify, decode } from "../deps.ts";
import { User } from "../models/User.ts";

export const authMiddleware = async (ctx: RouterContext, next: Function) => {
  const headers = ctx.request.headers;
  const authHeader = headers.get('Authorization');

  if (!authHeader) {
    ctx.response.status = 401;
    return;
  }

  const jwt = authHeader.split(' ')[1];
  if (!jwt) {
    ctx.response.status = 401;
    return;
  }

  try {
    const { payload, signature, header } = decode(jwt);
    const user = await User.findOne(payload.iss!);
    ctx.state.user = user;
    await next();
  } catch (e) {
    ctx.response.status = 401;
  }
}