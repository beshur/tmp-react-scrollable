import React, { useState, useCallback} from "react";
import Messages from './Messages';
import ResizableBox from './ResizableBox';
import ErrorBoundary from './ErrorBoundary';

const videoBtnStyle = {
  position: 'fixed',
  zIndex: 10,
  right: 0,
  top: 0
};

const videoStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: 400,
  backgroundColor: 'grey',
};

const boxStyles = {
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
}

function VideoBox({height = 400}) {
  return <div style={{...videoStyle, height}}><span>Video</span></div>;
}

export default function App() {
  const [videoVisible, setVideoVisible] = useState(false);
  const [videoHeight, setVideoHeight] = useState(400);
  const onButtonClick = useCallback(() => {
    setVideoVisible(!videoVisible);
  }, [videoVisible]);

  const onCallHeightChanged = useCallback((height) => {
    setVideoHeight(height);
  }, []);

  return (
    <div style={boxStyles}>
      <button style={videoBtnStyle} onClick={onButtonClick}>Toggle Video</button>
      {videoVisible && (<ErrorBoundary>
          <ResizableBox height={videoHeight} onCallHeightChanged={setVideoHeight}>
            <VideoBox height={videoHeight} />
          </ResizableBox>
        </ErrorBoundary>)
      }
      <Messages />
    </div>
  );
}
