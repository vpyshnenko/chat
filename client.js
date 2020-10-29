import { ok, fail } from "./helper.js";

export class Client {
  constructor({ username, password }) {
    this.username = username;
    this.password = password;
    this.messages = {};
    this.server = null;
  }
  connect(server) {
    this.server = server;
    server.connect({
      username: this.username,
      password: this.password,
      client: this,
    });
  }
  receive({ from, message }) {
    if (!(from in this.messages)) {
      this.messages[from] = [];
    }
    this.messages[from].push(message);
    console.log({ from, message });
  }
  send({ to, message }) {
    if (!this.server) {
      return { fail, message: "not connected" };
    }
    const response = this.server.sendMessage({
      from: this.username,
      to,
      message,
    });
    if (response.fail) {
      throw new Error(response.message);
    }
  }
}
