import { Server } from "../src/server.js";
import { Client } from "../src/client.js";

const u1 = { username: "Alice", password: "FG%^&GFRE$" };
const u2 = { username: "Bob", password: "l;kj(*UYHYG%^F" };

const setup = () => {
  const s = new Server();
  s.register(u1);
  s.register(u2);
  const c1 = new Client(u1);
  const c2 = new Client(u2);
  return { s, c1, c2 };
};

test("c1 successfully send message to c2", (done) => {
  const { s, c1, c2 } = setup();
  c1.connect(s);
  c2.connect(s);
  c2.onMessage((msg) => {
    expect(msg.from).toBe(u1.username);
    expect(msg.body).toBe("Hello");
    done();
  });
  c1.send({ to: u2.username, body: "Hello" });
});
test("c2 receives delayed messages ", (done) => {
  const { s, c1, c2 } = setup();
  c1.connect(s);
  c2.onMessage((msg) => {
    done();
  });
  c1.send({ to: u2.username, body: "Hello" });
  c2.connect(s);
});
test("getMessages", () => {
  const { s, c1, c2 } = setup();
  c1.connect(s);
  c2.connect(s);
  c1.send({ to: u2.username, body: "Hello" });
  c2.send({ to: u1.username, body: "Hi" });
  const messages = [
    { from: "Alice", to: "Bob", body: "Hello" },
    { from: "Bob", to: "Alice", body: "Hi" },
  ];
  expect(c1.getMessages(u2.username)).toStrictEqual(messages);
  expect(c2.getMessages(u1.username)).toStrictEqual(messages);
});
