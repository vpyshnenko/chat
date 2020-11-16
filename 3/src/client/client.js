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
    this.services = { sessionService, messageService };
    this.sessionId = null;
  }
  async connect() {
    const { sessionId } = await this.services.sessionService.openSession({
      username: this.username,
      password: this.password,
    });
    this.sessionId = sessionId;
    const messageStream = await this.services.messageService.getMessageStream({
      sessionId,
    });
    messageStream.subscribe((message) => {
      this.saveMessage(message);
      this.listeners.forEach((fn) => fn(message));
    });
    return { sessionId };
  }
  async disconnect() {
    if (!this.sessionId) {
      throw new Error("not connected");
    }
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    await this.services.sessionService.closeSession({
      sessionId: this.sessionId,
    });
    this.sessionId = null;
  }
  requestMessageStream() {
    if (!this.sessionId) {
      throw new Error("not connected");
    }
    this.subscription = this.services.messageService
      .getMessageStream({ sessionId: this.sessionId })
      .subscribe((message) => {
        this.saveMessage(message);
        this.listeners.forEach((fn) => fn(message));
      });
  }
  async send({ to, body }) {
    if (!this.sessionId) {
      throw new Error("not connected");
    }
    const message = { to, body };
    await this.services.messageService.forward({
      sessionId: this.sessionId,
      message,
    });
  }
  saveMessage(message) {
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
