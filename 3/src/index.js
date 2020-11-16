import { createMicroservice } from "./libs/scalecube.js";
import { MySeedAddress } from "./seed.js";
import { bootstrap } from "./bootstrap.js";
import { Client } from "./client/client.js";
import {
  userServiceDefinition,
  sessionServiceDefinition,
  messageServiceDefinition,
} from "./definitions.js";

bootstrap();

const microservice = createMicroservice({ seedAddress: MySeedAddress });

// With proxy
const userService = microservice.createProxy({
  serviceDefinition: userServiceDefinition,
});
const sessionService = microservice.createProxy({
  serviceDefinition: sessionServiceDefinition,
});
const messageService = microservice.createProxy({
  serviceDefinition: messageServiceDefinition,
});

const u1 = { username: "Alice", password: "FG%^&GFRE$" };
const u2 = { username: "Bob", password: "l;kj(*UYHYG%^F" };

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
const run = async () => {
  await userService.register(u1);
  await userService.register(u2);
  // await userService.authorize(u1);
  // const isU1Registered = await userService.isRegistered({
  //   username: u1.username,
  // });
  // console.log("u1: ", isU1Registered);
  // const { sessionId } = await sessionService.openSession(u1);
  // const user = await sessionService.getUser({ sessionId });
  // console.log("user: ", user);
  // messageService.getMessageStream({ sessionId }).subscribe((message) => {
  //   console.log("message: ", message);
  // });
  // await messageService.forward({
  //   sessionId,
  //   message: { to: "Alice", body: "Hello" },
  // });
  // await sessionService.closeSession({ sessionId });
  // await sessionService.validate({ sessionId });

  await c1.connect();
  await c1.send({ to: u2.username, body: "Hello Bob" });
  await c1.send({ to: u2.username, body: "How are you?" });
  await c2.connect();
  await c2.send({ to: u1.username, body: "Hi, I'm ok" });
  await c1.disconnect();
  console.log("CONNECT");
  await c1.connect();
};

run();
