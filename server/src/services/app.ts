import { createServer } from "http";
import * as express from "express";
import { Server as SocketServer } from "socket.io";
import config from "../config";

export const app = express();
export const server = createServer(app);

export const socketSocket = new SocketServer(server, {
  cors: {
    origin(requestOrigin, callback) {
      const origin = config.corsOrigins.find((corsOrigin) => {
        return corsOrigin === requestOrigin;
      });
      callback(null, origin);
    },
    methods: ["GET", "POST", "PATCH", "DELETE"],
    credentials: true,
  },
});
