import { Server } from "./server.js";
import { Client } from "./client.js";

const u1 = { username: "Alice", password: "FG%^&GFRE$" };
const u2 = { username: "Bob", password: "l;kj(*UYHYG%^F" };

const s = (window.s = new Server());
s.register(u1);
s.register(u2);

const c1 = (window.c1 = new Client(u1));
const c2 = (window.c2 = new Client(u2));

c1.connect(s);
c2.connect(s);
c2.onMessage((msg) => console.log("incoming message: ", msg));
c1.send({ to: u2.username, body: "Hello world" });
c2.send({ to: u1.username, message: "Hi" });
