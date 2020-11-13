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
  connect({ username, password }) {
    this.services.userService.authorize({ username, password });
    const startAt = Date.now();
    const sessionId = this.genSessionId(username, startAt);
    this.sessions[sessionId] = { username, startAt };
    return { sessionId };
  }
  validate(sessionId) {
    if (!(sessionId in this.sessions)) {
      throw new Error("session is not valid");
    }
  }
  getUser(sessionId) {
    const user = this.sessions[sessionId];
    if (user) {
      return user.username;
    }
    return null;
  }
  //TODO handle session expiration
}
