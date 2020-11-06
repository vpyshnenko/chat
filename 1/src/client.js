export class Client {
  constructor({ username, password }) {
    this.username = username;
    this.password = password;
    this.messages = {};
    this.listeners = [];
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
  receive({ from, body }) {
    const message = { from, to: this.username, body };
    if (!(from in this.messages)) {
      this.messages[from] = [];
    }
    this.messages[from].push(message);
    this.listeners.forEach((fn) => fn(message));
  }
  send({ to, body }) {
    const message = { from: this.username, to, body };
    if (!this.server) {
      throw new Error("not connected");
    }
    this.server.forward(message);
    if (!(to in this.messages)) {
      this.messages[to] = [];
    }
    this.messages[to].push(message);
  }
  getMessages(user) {
    return this.messages[user] || [];
  }
  onMessage(fn) {
    this.listeners.push(fn);
  }
}
