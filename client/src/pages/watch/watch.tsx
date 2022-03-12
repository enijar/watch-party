import React from "react";
import { VideoState } from "@app/shared";
import { useParams } from "react-router-dom";
import { WatchWrapper } from "@/pages/watch/styles";
import socket from "@/services/socket";

function getVideoState(
  video: HTMLVideoElement,
  state: VideoState["state"]
): VideoState {
  return {
    currentTime: video.currentTime,
    state,
  };
}

async function updateVideoState(
  video: HTMLVideoElement,
  videoState: VideoState
) {
  try {
    switch (videoState.state) {
      case "playing":
        await video.play();
        break;
      case "paused":
        await video.pause();
        break;
      case "ended":
        await video.pause();
        break;
    }
    video.currentTime = videoState.currentTime;
  } catch (err) {
    console.error(err);
  }
}

export default function Watch() {
  const { id } = useParams();

  const [interacted, setInteracted] = React.useState(false);

  React.useEffect(() => {
    function onInteract() {
      setInteracted(true);
    }

    window.addEventListener("pointerdown", onInteract);
    return () => {
      window.removeEventListener("pointerdown", onInteract);
    };
  }, []);

  const videoRef = React.useRef<HTMLVideoElement>();

  const onPlay = React.useCallback(() => {
    socket.emit("play", getVideoState(videoRef.current, "playing"));
  }, []);

  const onPause = React.useCallback(() => {
    socket.emit("pause", getVideoState(videoRef.current, "paused"));
  }, []);

  const onEnded = React.useCallback(() => {
    socket.emit("ended", getVideoState(videoRef.current, "ended"));
  }, []);

  const onSeeked = React.useCallback(() => {
    // @todo implement this without causing loop issues
    // let state: VideoState["state"];
    // if (videoRef.current.paused) {
    //   state = "paused";
    // } else if (videoRef.current.ended) {
    //   state = "ended";
    // } else {
    //   state = "playing";
    // }
    // socket.emit("seeked", getVideoState(videoRef.current, state));
  }, []);

  React.useEffect(() => {
    async function onPlay(videoState: VideoState) {
      console.log("play");
      return updateVideoState(videoRef.current, videoState);
    }

    async function onPause(videoState: VideoState) {
      console.log("pause");
      return updateVideoState(videoRef.current, videoState);
    }

    async function onEnded(videoState: VideoState) {
      console.log("ended");
      return updateVideoState(videoRef.current, videoState);
    }

    async function onSeeked(videoState: VideoState) {
      console.log("seeked");
      return updateVideoState(videoRef.current, videoState);
    }

    socket.on("play", onPlay);
    socket.on("pause", onPause);
    socket.on("ended", onEnded);
    socket.on("seeked", onSeeked);

    return () => {
      socket.off("play", onPlay);
      socket.off("pause", onPause);
      socket.off("ended", onEnded);
      socket.off("seeked", onSeeked);
    };
  }, []);

  return (
    <WatchWrapper>
      <video
        ref={videoRef}
        src={`/uploads/${id}.mp4`}
        playsInline
        controls
        muted={!interacted}
        onPlay={onPlay}
        onPause={onPause}
        onEnded={onEnded}
        onSeeked={onSeeked}
      />
    </WatchWrapper>
  );
}
