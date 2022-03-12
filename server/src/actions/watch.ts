import { Server as SocketServer, Socket } from "socket.io";
import { VideoState } from "@app/shared";

export default async function watch(
  socketSocket: SocketServer,
  socket: Socket
) {
  socket.on("videoState", (videoState: VideoState) => {
    socketSocket.emit("videoState", videoState);
  });
}
