import User from "../models/user";

  export async function fetchUsers() {
    try {
      const users = await User.find();
      return users;
    } catch (error) {
      throw new Error(error);
    }
  }

  export async function findById(id) {
    try {
      const user = await User.findById(id);
      return user;
    } catch (error) {
      throw new Error(error);
    }
  }
