import { setup } from "./setup.js";

test("c1 echo test: send msg to himself", async (done) => {
  expect.assertions(3);
  const { u1, c1 } = setup();
  c1.onMessage((msg) => {
    expect(msg.from).toBe(u1);
    expect(msg.to).toBe(u1);
    expect(msg.body).toBe("Hello");
    done();
  });
  await c1.connect();
  await c1.send({ to: u1, body: "Hello" });
});
test("c1 successfuly send message to c2", async (done) => {
  expect.assertions(3);
  const { u1, u2, c1, c2 } = setup();
  c2.onMessage((msg) => {
    expect(msg.from).toBe(u1);
    expect(msg.to).toBe(u2);
    expect(msg.body).toBe("Hello");
    done();
  });
  await Promise.all([c1.connect(), c2.connect()]);
  await c1.send({ to: u2, body: "Hello" });
});
test("c1 successfuly send message to c2 and also receive his own sent message", async (done) => {
  expect.assertions(3);
  const { u1, u2, c1, c2 } = setup();
  c1.onMessage((msg) => {
    expect(msg.from).toBe(u1);
    expect(msg.to).toBe(u2);
    expect(msg.body).toBe("Hello");
    done();
  });
  await Promise.all([c1.connect(), c2.connect()]);
  await c1.send({ to: u2, body: "Hello" });
});
test("c2 is not connected; c1 successfuly send message to c2; c2 connects and receives delayed message", async (done) => {
  expect.assertions(3);
  const { u1, u2, c1, c2 } = setup();
  c2.onMessage((msg) => {
    expect(msg.from).toBe(u1);
    expect(msg.to).toBe(u2);
    expect(msg.body).toBe("Hello");
    done();
  });
  await c1.connect();
  await c1.send({ to: u2, body: "Hello" });
  await c2.connect();
});
test.only("c1 send msg to c2; c2 sends to c1; c1 disconnects; c1 connects and receives ", async (done) => {
  expect.assertions(2);
  const { u1, u2, c1, c2 } = setup();
  await Promise.all([c1.connect(), c2.connect()]);
  await c1.send({ to: u2, body: "Hello" });
  await c2.send({ to: u1, body: "Hi" });
  await c1.disconnect();
  let i = 0;
  const arr = [
    { from: u1, to: u2, body: "Hello" },
    { from: u2, to: u1, body: "Hi" },
  ];
  c1.onMessage((msg) => {
    expect(msg).toStrictEqual(arr[i++]);
    if (i === 2) {
      done();
    }
  });
  await c1.connect();
});
