class MessageService {
  constructor({ services: { userService, sessionService } }) {
    this.delayedMessages = {};
    this.messageStreams = {};
  }
  forward({ sessionId, to, body }) {
    const message = { to, body };
    sessionService.validate(sessionId);
    const from = sessionService.getUser(sessionId);
    if (!userService.isRegistered(to)) {
      throw new Error("unknown receiver");
    }
    if (username in this.messageStreams) {
      this.messageStreams[username].next(message);
    } else {
      this.pushToDelayedMessages(username, message);
    }
  }
  getMessageStream({ sessionId }) {
    sessionService.validate(sessionId);
    const username = sessionService.getUser(sessionId);
    const messageStream = new Subject();
    this.messageStreams[username] = messageStream;
    this.deliverDelayedMessages(username, messageStream);
    return messageStream;
  }
  deliverDelayedMessage(username, messageStream) {
    if (username in this.delayedMessages) {
      this.delayedMessages[username].forEach((message) => {
        messageStream.next(message);
      });
    }
  }
  pushToDelayedMessages(username, message) {
    if (!(username in this.delayedMessage)) {
      this.delayedMessage[username] = [];
    }
    this.delayedMessages[username].push(message);
  }
}
