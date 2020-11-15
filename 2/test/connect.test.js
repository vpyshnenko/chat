import { Client } from "../src/client/client.js";
import { setup } from "./setup.js";

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
  const { c1, u2 } = setup();
  await expect(c1.send({ to: u2, body: "Hello" })).rejects.toThrow(
    "not connected"
  );
});
