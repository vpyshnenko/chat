import { UserService } from "../src/server/UserService.js";
import { SessionService } from "../src/server/SessionService.js";
import { MessageService } from "../src/server/MessageService.js";
import { Client } from "../src/client/client.js";

const u1 = { username: "Alice", password: "FG%^&GFRE$" };
const u2 = { username: "Bob", password: "l;kj(*UYHYG%^F" };

const setup = () => {
  const userService = new UserService();
  userService.register(u1);
  userService.register(u2);

  const sessionService = new SessionService({ services: { userService } });
  const messageService = new MessageService({
    services: { userService, sessionService },
  });

  const c1 = new Client({
    services: { sessionService, messageService },
    ...u1,
  });
  const c2 = new Client({
    services: { sessionService, messageService },
    ...u2,
  });
  return { c1, c2 };
};

test("c1 echo test: send msg to himself", (done) => {
  const { c1 } = setup();
  c1.connect();
  c1.onMessage((msg) => {
    expect(msg.from).toBe(u1.username);
    expect(msg.to).toBe(u1.username);
    expect(msg.body).toBe("Hello");
    done();
  });
  c1.send({ to: u1.username, body: "Hello" });
});
test("send msg before connect => reject with 'not connected'", () => {
  const { c1 } = setup();
  expect(c1.send({ to: u2.username, body: "Hello" })).rejects.toThrow(
    "not connected"
  );
});
