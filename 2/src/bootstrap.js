import { UserService } from "./server/UserService";
import { SessionService } from "./server/SessionService";
import { MessageService } from "./server/MessageServie";
import { Client } from "./client/client";

const userService = new UserService();
const sessionService = new SessionService({ services: { userService } });
const messageService = new MessageService({
  services: { userService, sessionService },
});

const client = new Client({ services: { sessionService, messageService } });
