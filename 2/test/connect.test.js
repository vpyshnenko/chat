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
  const services = { userService, sessionService, messageService };

  const c1 = new Client({
    services,
    ...u1,
  });
  const c2 = new Client({
    services,
    ...u2,
  });
  return { c1, c2, services };
};

test("connect success", async () => {
  expect.assertions(1);
  const { c1 } = setup();
  const { sessionId } = await c1.connect();
  expect(sessionId).toBeTruthy();
});
test("connect fail", async () => {
  expect.assertions(1);
  const { services } = setup();
  const c1 = new Client({
    services,
    username: "Alice",
    password: "wrong-password",
  });
  await expect(c1.connect()).rejects.toThrow("auth failed");
});
test("try disconnect client, which is not connected", async () => {
  expect.assertions(1);
  const { c1 } = setup();
  await expect(c1.disconnect()).rejects.toThrow("not connected");
});
test("send msg before connect => reject with 'not connected'", async () => {
  expect.assertions(1);
  const { c1 } = setup();
  await expect(c1.send({ to: u2.username, body: "Hello" })).rejects.toThrow(
    "not connected"
  );
});
test("c1 echo test: send msg to himself", async (done) => {
  expect.assertions(3);
  const { c1 } = setup();
  c1.onMessage((msg) => {
    expect(msg.from).toBe(u1.username);
    expect(msg.to).toBe(u1.username);
    expect(msg.body).toBe("Hello");
    done();
  });
  await c1.connect();
  await c1.send({ to: u1.username, body: "Hello" });
});
