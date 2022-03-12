import socket from "socket.io-client";
import config from "@/config";

console.log("config.socketUri", config.socketUri);

export default socket(config.socketUri);
