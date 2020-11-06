class UserService {
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
  authorize({ username, password }) {
    if (!(username in this.users)) {
      throw new Error("not registered");
    }
    if (this.users[username] !== password) {
      throw new Error("auth failed");
    }
  }
  isRegistered(username) {
    return username in this.users;
  }
}
