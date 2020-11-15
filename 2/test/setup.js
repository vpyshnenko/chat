import { UserService } from "../src/server/UserService.js";
import { SessionService } from "../src/server/SessionService.js";
import { MessageService } from "../src/server/MessageService.js";
import { Client } from "../src/client/client.js";

const u1 = { username: "Alice", password: "FG%^&GFRE$" };
const u2 = { username: "Bob", password: "l;kj(*UYHYG%^F" };

export const setup = () => {
  const userService = new UserService();
  userService.register(u1);
  userService.register(u2);

  const sessionService = new SessionService({ services: { userService } });
  const messageService = new MessageService({
    services: { userService, sessionService },
  });
  const services = { userService, sessionService, messageService };

  const c1 = new Client({
    services,
    ...u1,
  });
  const c2 = new Client({
    services,
    ...u2,
  });
  return { u1: u1.username, u2: u2.username, c1, c2, services };
};
