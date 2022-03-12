import config from "./config";
import { server, socketSocket } from "./services/app";
import watch from "./actions/watch";
import videoState from "./state/video-state";

(async () => {
  try {
    socketSocket.on("connection", (socket) => {
      socket.emit("videoState", videoState);
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
