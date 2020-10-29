import { ok, fail } from "./helper.js";

export class Server {
  constructor() {
    this.users = {};
    this.messages = {};
    this.connections = {};
  }
  register({ username, password }) {
    if (!this.users[username]) {
      this.users[username] = password;
      return { ok };
    }
    return { fail, message: "User already registered" };
  }
  connect({ username, password, client }) {
    if (!(username in this.users)) {
      return { fail, message: "Not registered" };
    }
    if (this.users[username] !== password) {
      return { fail, message: "Auth failed" };
    }
    this.connections[username] = client;
    return { ok };
  }
  sendMessage({ from, to, message }) {
    if (!(from in this.connections)) {
      return { fail, message: "Not authenticated" };
    }
    if (!(to in this.users)) {
      return { fail, message: "unknown receiver" };
    }
    if (!(to in this.connections)) {
      if (!(to in this.messages)) {
        this.messages[to] = [];
      }
      this.messages[to].push({ from, message });
      return { ok, message: "receiver unavailable" };
    }
    this.connections[to].receive({ from, message });
    return { ok };
  }
}
