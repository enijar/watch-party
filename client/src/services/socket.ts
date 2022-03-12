import socket from "socket.io-client";
import config from "@/config";

export default socket(config.socketUri);
