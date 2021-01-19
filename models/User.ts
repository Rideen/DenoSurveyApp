import { usersCollection } from "../mongo.ts";

export default class User implements UserSchema {
  public id?: string;
  public name: string;
  public email: string;
  public password: string;
  public _id: { $oid: string; } = { $oid: '' };

  constructor(name: string, email: string, password: string) {
    this.id = '';
    this.name = name;
    this.email = email;
    this.password = password;
  }

  static async findOne(params: object) {
    const user = await usersCollection.findOne(params);
    if (user) {
      user.id = user._id.$oid;
      return user;
    }
    return null;
  }

  async save() {
    delete this.id;
    const { $oid } = await usersCollection.insertOne(this);
    this.id = $oid;
    return this;
  }
}

// Defining schema interface
export interface UserSchema {
  _id: { $oid: string };
  name: string;
  email: string;
  password: string;
}