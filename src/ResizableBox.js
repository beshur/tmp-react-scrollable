import {Resizable} from 're-resizable';
import React, {useCallback, useEffect, useRef, useState} from 'react';

export default function ResizableBox({onCallHeightChanged, height, children}) {
  const resizableRef = useRef();
  const onResizeStop = useCallback(
    (e, dir, ref, d) => {
      console.log('d', d);
      onCallHeightChanged(height + d.height);
    },
    [height, onCallHeightChanged],
  );
  const [windowHeight, setWindowHeight] = useState(0);
  useEffect(() => {
    setWindowHeight(window.innerHeight);
  }, []);

  return (
    <Resizable
      ref={resizableRef}
      size={{width: '100%', height}}
      minHeight={300}
      maxHeight={windowHeight}
      onResizeStop={onResizeStop}
      handleStyles={{bottom: {bottom: '5px', cursor: 'row-resize'}}}
      enable={{
        top: false,
        right: false,
        bottom: true,
        left: false,
        topRight: false,
        bottomRight: false,
        bottomLeft: false,
        topLeft: false,
      }}>
      {children}
    </Resizable>
  );
}
