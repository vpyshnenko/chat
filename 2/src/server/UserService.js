export class UserService {
  constructor() {
    this.users = {};
  }
  register({ username, password }) {
    if (!(username in this.users)) {
      this.users[username] = password;
    } else {
      throw new Error("user already registered");
    }
  }
  async authorize({ username, password }) {
    if (username in this.users && this.users[username] === password) {
      return;
    }
    throw new Error("auth failed");
  }
  async isRegistered({ username }) {
    return username in this.users;
  }
}
