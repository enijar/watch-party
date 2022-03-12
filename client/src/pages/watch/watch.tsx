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

  const videoStateEmittedRef = React.useRef(false);

  const onPlay = React.useCallback(() => {
    if (videoStateEmittedRef.current) return;
    socket.emit("videoState", getVideoState(videoRef.current, "playing"));
  }, []);

  const onPause = React.useCallback(() => {
    if (videoStateEmittedRef.current) return;
    socket.emit("videoState", getVideoState(videoRef.current, "paused"));
  }, []);

  const onEnded = React.useCallback(() => {
    if (videoStateEmittedRef.current) return;
    socket.emit("videoState", getVideoState(videoRef.current, "ended"));
  }, []);

  React.useEffect(() => {
    let idleCallback: number;

    async function onVideoState(videoState: VideoState) {
      videoStateEmittedRef.current = true;
      await updateVideoState(videoRef.current, videoState);
      idleCallback = requestIdleCallback(() => {
        videoStateEmittedRef.current = false;
      });
    }

    socket.on("videoState", onVideoState);

    return () => {
      socket.off("videoState", onVideoState);
      cancelIdleCallback(idleCallback);
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
      />
    </WatchWrapper>
  );
}
