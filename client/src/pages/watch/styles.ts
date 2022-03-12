import styled from "styled-components";

export const WatchWrapper = styled.main`
  padding: 1em;
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;

  video {
    max-width: 100%;
    max-height: 100%;
    display: block;
  }
`;
