import config from "./config";
import { server, socketSocket } from "./services/app";
import watch from "./actions/watch";

(async () => {
  try {
    socketSocket.on("connection", (socket) => {
      watch(socketSocket, socket);
    });

    server.listen(config.port, () => {
      console.log(`Server running at http://localhost${config.port}`);
    });
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
