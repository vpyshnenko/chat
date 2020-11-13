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

const c1 = new Client({ services: { sessionService, messageService }, ...u1 });
const c2 = new Client({ services: { sessionService, messageService }, ...u2 });

c1.connect();
c1.onMessage((msg) => console.log("c1 incoming message: ", msg));
c2.onMessage((msg) => console.log("c2 incoming message: ", msg));
c1.send({ to: u2.username, body: "Hello Alice" });
c1.send({ to: u2.username, body: "How are you?" });
c2.connect();
c2.send({ to: u1.username, body: "Hi, I'm ok" });
