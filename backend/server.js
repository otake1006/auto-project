import { Server } from "colyseus";
import { createServer } from "http";
import { MyRoom } from "./rooms/MyRoom";

const gameServer = new Server({ server: createServer() });
gameServer.define("my_room", MyRoom);
gameServer.listen(2567);