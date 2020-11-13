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
  }
  //TODO disconnect
  // connect_() {
  //   clientAuthService
  //     .auth({ username: this.username, password: this.password })
  //     .then(({ sessionId }) => {
  // 	this.sessionId = sessionId
  //       clientMessageService.messages$({sessionId}).subscribe
  //     });
  // }
  connect() {
    const { sessionId } = this.services.sessionService.openSession({
      username: this.username,
      password: this.password,
    });
    this.sessionId = sessionId;

    this.requestMessageStream();
  }
  disconnect() {
    this.subscription.unsubscribe();
    this.services.sessionService.closeSession({ sessionId: this.sessionId });
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
  send({ to, body }) {
    if (!this.sessionId) {
      // throw new Error("not connected");
      return Promise.reject(new Error("not connected"));
    }
    const message = { to, body };
    this.services.messageService.forward({
      sessionId: this.sessionId,
      ...message,
    });
    this.saveMessage(message);
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
