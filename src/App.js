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

const lastHeight = 400;

export default function App() {
  const [videoVisible, setVideoVisible] = useState(false);
  const [videoHeight, setVideoHeight] = useState(0);
  const onButtonClick = useCallback(() => {
    if (videoVisible) {
      setVideoHeight(0);
    } else {
      setVideoHeight(lastHeight);
    }
    setVideoVisible(!videoVisible);
  }, [videoVisible]);

  const onCallHeightChanged = useCallback((height) => {
    lastHeight = height;
    setVideoHeight(height);
  }, []);

  return (
    <div style={boxStyles}>
      <button style={videoBtnStyle} onClick={onButtonClick}>Toggle Video</button>
      <div style={{position: 'relative', zIndex: 1}}>
        {videoVisible && (<ErrorBoundary>
            <ResizableBox height={videoHeight} onCallHeightChanged={setVideoHeight}>
              <VideoBox height={videoHeight} />
            </ResizableBox>
          </ErrorBoundary>)
        }
      </div>
      <Messages videoHeight={videoHeight} />
    </div>
  );
}
