import { usersCollection } from "../mongo.ts";
import BaseModel from "./BaseModel.ts";

export interface UserSchema {
  _id: { $oid: string };
  name: string;
  email: string;
  password: string;
}

export class User extends BaseModel {
  id: string = '';
  name: string = '';
  email: string = '';
  password: string = '';

  constructor(name: string, email: string, password: string) {
    super();
    this.name = name;
    this.email = email;
    this.password = password;
  }

  static async create(user: User) {
    const id = await usersCollection.insertOne({
      name: user.name,
      email: user.email,
      password: user.password
    });

    user.id = id.$oid;

    return user;
  }

  static async findOne(email: string): Promise<User> {
    const user = await usersCollection.findOne({email});
    return User.prepare(user);
  }

  protected static prepare(data: any): User {
    data = BaseModel.prepare(data);
    const user = new User(data.name, data.email, data.password);
    user.id = data.id;
    return user;
  }
}