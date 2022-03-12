import React from "react";
import { VideoState } from "@app/shared";
import { useParams } from "react-router-dom";
import { WatchWrapper } from "@/pages/watch/styles";
import socket from "@/services/socket";

const TIME_THRESHOLD_IN_SECONDS = 0.5;

function getVideoState(video: HTMLVideoElement): VideoState {
  let state: VideoState["state"];
  if (video.paused) {
    state = "paused";
  } else if (video.ended) {
    state = "ended";
  } else {
    state = "playing";
  }
  return { currentTime: video.currentTime, state };
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

    if (
      video.currentTime < videoState.currentTime - TIME_THRESHOLD_IN_SECONDS ||
      video.currentTime > videoState.currentTime + TIME_THRESHOLD_IN_SECONDS
    ) {
      video.currentTime = videoState.currentTime;
    }
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

  const seekingRef = React.useRef(false);

  const onTimeUpdate = React.useCallback(() => {
    if (seekingRef.current) return;
    socket.emit("videoState", getVideoState(videoRef.current));
  }, []);

  React.useEffect(() => {
    async function onVideoState(videoState: VideoState) {
      await updateVideoState(videoRef.current, videoState);
    }

    socket.on("videoState", onVideoState);

    return () => {
      socket.off("videoState", onVideoState);
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
        onTimeUpdate={onTimeUpdate}
        onSeeking={() => {
          seekingRef.current = true;
        }}
        onSeeked={() => {
          socket.emit("videoState", getVideoState(videoRef.current));
          seekingRef.current = false;
        }}
      />
    </WatchWrapper>
  );
}
