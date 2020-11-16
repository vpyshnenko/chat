import { MySeedAddress } from "./seed.js";
import { createMicroservice } from "./libs/scalecube.js";
import { UserService } from "./server/UserService.js";
import { SessionService } from "./server/SessionService.js";
import { MessageService } from "./server/MessageService.js";
import {
  userServiceDefinition,
  sessionServiceDefinition,
  messageServiceDefinition,
} from "./definitions.js";

export const bootstrap = () => {
  // Create empty Microservice container with seed address
  createMicroservice({
    address: MySeedAddress,
  });

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
};
