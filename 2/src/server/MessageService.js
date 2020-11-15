import { ReplaySubject } from "../libs/rxjs.js";

export class MessageService {
  constructor({ services: { userService, sessionService } }) {
    this.delayedMessages = {};
    this.messageStreams = {};
    this.services = { userService, sessionService };
  }
  // message = {to, body}
  async forward({ sessionId, message }) {
    const { username: from } = await this.services.sessionService.getUser({
      sessionId,
    });
    message.from = from;
    this.pushMessageToStream(from, message);
    const { to } = message;
    if (to !== from) {
      if (!(await this.services.userService.isRegistered({ username: to }))) {
        throw new Error("unknown receiver");
      }
      this.pushMessageToStream(to, message);
    }
  }
  pushMessageToStream(to, message) {
    if (!(to in this.messageStreams)) {
      this.messageStreams[to] = new ReplaySubject();
    }
    this.messageStreams[to].next(message);
  }
  async getMessageStream({ sessionId }) {
    const { username } = await this.services.sessionService.getUser({
      sessionId,
    });
    if (!(username in this.messageStreams)) {
      this.messageStreams[username] = new ReplaySubject();
    }
    return this.messageStreams[username];
  }
}
