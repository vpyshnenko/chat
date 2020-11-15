import { UserService } from "./server/UserService.js";
import { SessionService } from "./server/SessionService.js";
import { MessageService } from "./server/MessageService.js";
import { Client } from "./client/client.js";

const u1 = { username: "Alice", password: "FG%^&GFRE$" };
const u2 = { username: "Bob", password: "l;kj(*UYHYG%^F" };

const userService = new UserService();
userService.register(u1);
userService.register(u2);

const sessionService = new SessionService({ services: { userService } });
const messageService = (window.mS = new MessageService({
  services: { userService, sessionService },
}));

const c1 = (window.c1 = new Client({
  services: { sessionService, messageService },
  ...u1,
}));
c1.onMessage((msg) => console.log("c1 incoming message: ", msg));

const c2 = (window.c2 = new Client({
  services: { sessionService, messageService },
  ...u2,
}));
c2.onMessage((msg) => console.log("c2 incoming message: ", msg));

const c3 = (window.c3 = new Client({
  services: { sessionService, messageService },
  ...u2,
}));
c3.onMessage((msg) => console.log("c3 incoming message: ", msg));
(async () => {
  await c1.connect();
  await c1.send({ to: u2.username, body: "Hello Bob" });
  await c1.send({ to: u2.username, body: "How are you?" });
  await c2.connect();
  await c2.send({ to: u1.username, body: "Hi, I'm ok" });
  await c1.disconnect();
  console.log("CONNECT");
  await c1.connect();
})();
