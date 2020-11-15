export class SessionService {
  constructor({ services: { userService } }) {
    this.sessions = {};
    this.services = { userService };
  }
  genSessionId(username, timestamp) {
    //some crypto expected here
    return `${username}_${timestamp}`;
  }
  //TODO disconnect
  async openSession({ username, password }) {
    await this.services.userService.authorize({ username, password });
    const startAt = Date.now();
    const sessionId = this.genSessionId(username, startAt);
    this.sessions[sessionId] = { username, startAt };
    return { sessionId };
  }
  async closeSession({ sessionId }) {
    await this.validate({ sessionId });
    delete this.sessions[sessionId];
  }
  async validate({ sessionId }) {
    if (!(sessionId in this.sessions)) {
      throw new Error("session is not valid");
    }
  }
  async getUser({ sessionId }) {
    await this.validate({ sessionId });
    const { username } = this.sessions[sessionId];
    return { username };
  }
  //TODO handle session expiration
}
