import React, { useState, useMemo, useCallback, useRef } from "react";
import AutoSizer from 'react-virtualized-auto-sizer';
import noop from 'lodash/noop';
import { DynamicSizeList } from "dynamic-virtualized-list";

const OVERSCAN_COUNT_BACKWARD = 80;
const OVERSCAN_COUNT_FORWARD = 80;
const HEIGHT_TRIGGER_FOR_MORE_POSTS = 800;
const OFFSET_TO_SHOW_SCROLL_TO_BOTTOM_BUTTON = 250;
const HISTORY_LOADER_ID = "HISTORY_LOADER";
const TYPING_INDICATORS_BLOCK_ID = "TYPING_INDICATORS_BLOCK";
const INIT_SCROLL_TO_INDEX = () => ({
  index: 0,
  position: "end"
});
const INIT_RANGE_TO_RENDER = () => [0, 100];

const listStyle = {
  position: "absolute",
  bottom: "0",
  maxHeight: "100%"
};
const innerListStyle = {
  padding: "16px 0 0"
};

const messagesList = [];
const messagesMapById = {};
for (let i = 0; i < 200; i++) {
  messagesList.push(i);
  messagesMapById[i] = {
    messageId: i,
    channelId: "7cbb488a",
    type: "regular",
    text: "d " + i,
    attachments: [],
    mentions: [],
    enrichments: [],
    giphy: null,
    latestReactions: [],
    ownReactions: [],
    reactionCounts: {},
    direction: "outgoing",
    createdAt: "2021-06-17T13:11:42.145Z",
    updatedAt: null,
    user: null,
    quote: null,
    forward: null,
    state: "sent",
    silent: false,
    event: null
  };
}

export default function Messages() {
  const listRef = useRef();
  const listInnerRef = useRef();
  const [correctScrollToBottom, setCorrectScrollToBottom] = useState(true);
  const correctScrollToBottomRef = useRef();
  correctScrollToBottomRef.current = correctScrollToBottom;
  const [loadOffsetWithInRange, setLoadOffsetWithInRange] = useState(false);
  const messagesMapByIdRef = useRef();
  messagesMapByIdRef.current = messagesMapById;

  const onScroll = useCallback(
    ({ scrollHeight, scrollOffset, scrollDirection, clientHeight }) => {
      if (scrollHeight <= 0) {
        return;
      }
      const didUserScrollBackwards = scrollDirection === "backward";
      const isOffsetWithInRange = scrollOffset < HEIGHT_TRIGGER_FOR_MORE_POSTS;
      const offsetFromBottom = scrollHeight - clientHeight - scrollOffset;

      setLoadOffsetWithInRange(didUserScrollBackwards && isOffsetWithInRange);
      setCorrectScrollToBottom(
        offsetFromBottom < OFFSET_TO_SHOW_SCROLL_TO_BOTTOM_BUTTON
      );
    },
    []
  );

  const data = useMemo(
    () =>
      messagesList.length > 0
        ? [TYPING_INDICATORS_BLOCK_ID, ...messagesList, HISTORY_LOADER_ID]
        : messagesList,
    [messagesList, messagesMapById]
  );

  const rowRenderer = useCallback(({ data, itemId, style }) => {
    if (itemId === HISTORY_LOADER_ID) {
      return <span>Loading...</span>;
    }

    if (itemId === TYPING_INDICATORS_BLOCK_ID) {
      return <span>Typing...</span>;
    }

    const message = messagesMapByIdRef.current[itemId];
    return (
      <div style={style}>
        <div>AB: {message.text}</div>
      </div>
    );
  }, []);

  return (
    <div style={{width: '100%', height: '100%'}}>
      <AutoSizer>
        {({ height, width }) => (
          <DynamicSizeList
            itemData={data}
            onScroll={onScroll}
            ref={listRef}
            innerRef={listInnerRef}
            height={height}
            width={width}
            style={listStyle}
            innerListStyle={innerListStyle}
            initScrollToIndex={INIT_SCROLL_TO_INDEX}
            initRangeToRender={INIT_RANGE_TO_RENDER}
            overscanCountForward={OVERSCAN_COUNT_FORWARD}
            overscanCountBackward={OVERSCAN_COUNT_BACKWARD}
            correctScrollToBottom={correctScrollToBottom}
            canLoadMorePosts={noop}
            onItemsRendered={noop}
            loaderId={HISTORY_LOADER_ID}
          >
            {rowRenderer}
          </DynamicSizeList>
        )}
      </AutoSizer>
    </div>
  );
}
