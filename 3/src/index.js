import { createMicroservice, ASYNC_MODEL_TYPES } from "./libs/scalecube.js";
import { UserService } from "./server/UserService.js";
import { SessionService } from "./server/SessionService.js";
import { MessageService } from "./server/MessageService.js";
import { Client } from "./client/client.js";
export const MySeedAddress = "seed";

// Create a service
createMicroservice({
  address: MySeedAddress,
});

export const userServiceDefinition = {
  serviceName: "UserService",
  methods: {
    register: {
      asyncModel: ASYNC_MODEL_TYPES.REQUEST_RESPONSE,
    },
    authorize: {
      asyncModel: ASYNC_MODEL_TYPES.REQUEST_RESPONSE,
    },
    isRegistered: {
      asyncModel: ASYNC_MODEL_TYPES.REQUEST_RESPONSE,
    },
  },
};
export const sessionServiceDefinition = {
  serviceName: "SessionService",
  methods: {
    openSession: {
      asyncModel: ASYNC_MODEL_TYPES.REQUEST_RESPONSE,
    },
    closeSession: {
      asyncModel: ASYNC_MODEL_TYPES.REQUEST_RESPONSE,
    },
    validate: {
      asyncModel: ASYNC_MODEL_TYPES.REQUEST_RESPONSE,
    },
    getUser: {
      asyncModel: ASYNC_MODEL_TYPES.REQUEST_RESPONSE,
    },
  },
};
export const messageServiceDefinition = {
  serviceName: "MessageService",
  methods: {
    forward: {
      asyncModel: ASYNC_MODEL_TYPES.REQUEST_RESPONSE,
    },
    getMessageStream: {
      asyncModel: ASYNC_MODEL_TYPES.REQUEST_STREAM,
    },
  },
};
// Create a service
createMicroservice({
  services: [
    {
      definition: userServiceDefinition,
      reference: new UserService(),
    },
    {
      definition: sessionServiceDefinition,
      reference: ({ createProxy }) => {
        const userService = createProxy({
          serviceDefinition: userServiceDefinition,
        });
        return new SessionService({ services: { userService } });
      },
    },
    {
      definition: messageServiceDefinition,
      reference: ({ createProxy }) => {
        const userService = createProxy({
          serviceDefinition: userServiceDefinition,
        });
        const sessionService = createProxy({
          serviceDefinition: sessionServiceDefinition,
        });
        return new MessageService({
          services: { userService, sessionService },
        });
      },
    },
  ],
  seedAddress: MySeedAddress,
});

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
