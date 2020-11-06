export class Client {
  constructor({
    username,
    password,
    services: { sessionService, messageService },
  }) {
    this.username = username;
    this.password = password;
    this.messages = [];
    this.listeners = [];
    this.services = services;
  }
  //TODO disconnect
  connect() {
    this.sessionId = this.services.sessionService.connect({
      username: this.username,
      password: this.password,
    });
    this.requestMessageStream();
  }
  requestMessageStream() {
    this.services.messageService
      .getMessageStream({ sessionId: this.sessionId })
      .subscribe((message) => {
        this.saveMessage(message);
        this.listeners.forEach((fn) => fn(message));
      });
  }
  send({ to, body }) {
    if (!this.sessionId) {
      throw new Error("not connected");
    }
    const message = { to, body };
    this.messageService.forward({ sessionId, ...message });
    this.saveMessage(message);
  }
  saveMessage() {
    this.messages.push(message);
  }
  getMessages(username) {
    return this.messages.filter(
      ({ from, to }) => username === from || username === to
    );
  }
  onMessage(fn) {
    this.listeners.push(fn);
  }
}
