import { ReplaySubject } from "../libs/rxjs.js";

export class MessageService {
  constructor({ services: { userService, sessionService } }) {
    this.delayedMessages = {};
    this.messageStreams = {};
    this.services = { userService, sessionService };
  }
  forward({ sessionId, to, body }) {
    const message = { to, body };
    this.services.sessionService.validate(sessionId);
    const from = this.services.sessionService.getUser(sessionId);
    if (!this.services.userService.isRegistered(to)) {
      throw new Error("unknown receiver");
    }
    if (to in this.messageStreams) {
      this.messageStreams[to].next(message);
    } else {
      this.pushToDelayedMessages(to, message);
    }
  }
  getMessageStream({ sessionId }) {
    this.services.sessionService.validate(sessionId);
    const username = this.services.sessionService.getUser(sessionId);
    const messageStream = new ReplaySubject();
    this.messageStreams[username] = messageStream;
    this.deliverDelayedMessages(username, messageStream);
    return messageStream;
  }
  deliverDelayedMessages(username, messageStream) {
    if (username in this.delayedMessages) {
      this.delayedMessages[username].forEach((message) => {
        messageStream.next(message);
      });
    }
  }
  pushToDelayedMessages(username, message) {
    if (!(username in this.delayedMessages)) {
      this.delayedMessages[username] = [];
    }
    this.delayedMessages[username].push(message);
  }
}
