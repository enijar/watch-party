import { Server as SocketServer, Socket } from "socket.io";
import { VideoState } from "@app/shared";

export default async function watch(
  socketSocket: SocketServer,
  socket: Socket
) {
  socket.on("play", (videoState: VideoState) => {
    socketSocket.emit("play", videoState);
  });

  socket.on("pause", (videoState: VideoState) => {
    socketSocket.emit("pause", videoState);
  });

  socket.on("ended", (videoState: VideoState) => {
    socketSocket.emit("ended", videoState);
  });

  socket.on("seeked", (videoState: VideoState) => {
    socketSocket.emit("seeked", videoState);
  });
}
