import { Server as SocketServer, Socket } from "socket.io";
import { VideoState } from "@app/shared";
import serverVideoState from "../state/video-state";

export default async function watch(
  socketSocket: SocketServer,
  socket: Socket
) {
  socket.on("videoState", (videoState: VideoState) => {
    serverVideoState.currentTime = videoState.currentTime;
    serverVideoState.state = videoState.state;
    socketSocket.emit("videoState", videoState);
  });
}
