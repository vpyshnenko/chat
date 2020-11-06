export class Server {
  constructor() {
    this.users = {};
    this.messages = {};
    this.connections = {};
  }
  register({ username, password }) {
    if (!(username in this.users)) {
      this.users[username] = password;
    } else {
      throw new Error("user already registered");
    }
  }
  connect({ username, password, client }) {
    if (!(username in this.users)) {
      throw new Error("not registered");
    }
    if (this.users[username] !== password) {
      throw new Error("auth failed");
    }
    this.connections[username] = client;
    const clientMessages = this.messages[username];
    if (clientMessages && clientMessages.length) {
      setTimeout(() => {
        clientMessages.forEach((msg) => client.receive(msg));
      });
    }
  }
  forward({ from, to, body }) {
    if (!(from in this.connections)) {
      throw new Error("not authenticated");
    }
    if (!(to in this.users)) {
      throw new Error("unknown receiver");
    }
    if (!(to in this.connections)) {
      if (!(to in this.messages)) {
        this.messages[to] = [];
      }
      this.messages[to].push({ from, body });
      return;
    }
    this.connections[to].receive({ from, body });
  }
}
