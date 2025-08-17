import { useCallback, useEffect, useRef, useState } from "react";
import styles from "./index.module.css";
import { TextMessage } from "../../../../domains/TextMessage/models/TextMessage";
import { TextMessageHistoryUseCase } from "../../../../domains/TextMessage/usecase/TextMessageHistoryUseCase";
import { GetHistoryInput } from "../../../../domains/TextMessage/repotisories/TextMessageHistoryRepository";
import { MessageListItem } from "./MessageListItem";

export type MessageListProps = {
  messages: TextMessage[];
  roomId: string;
  beforeSentAt: string;
  hasNext: boolean;
  fetchMore: TextMessageHistoryUseCase["getMessageHistory"];
};

export const MessageList = ({
  messages,
  roomId,
  beforeSentAt,
  fetchMore,
  hasNext,
}: MessageListProps) => {
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const bottomBoundaryRef = useRef<HTMLDivElement | null>(null);
  const [needFetchMore, setNeedFetchMore] = useState(false);

  const scrollObserver = useCallback(
    (node: Element) => {
      if (!scrollContainerRef.current) return;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting && hasNext) {
              setNeedFetchMore(true);
            }
          });
        },
        {
          root: scrollContainerRef.current,
          threshold: 1.0,
        }
      );

      observer.observe(node);
    },
    [hasNext]
  );

  useEffect(() => {
    if (bottomBoundaryRef.current) {
      scrollObserver(bottomBoundaryRef.current);
    }
  }, [scrollObserver]);

  useEffect(() => {
    if (needFetchMore) {
      const input: GetHistoryInput = {
        roomId: roomId,
        limit: 10,
        beforeSentAt: beforeSentAt,
      }
      fetchMore(input);
      setNeedFetchMore(false);
    }
  }, [needFetchMore, fetchMore]);

  return (
    <div
      ref={scrollContainerRef}
      className={styles.container}
    >
      {messages.map((message, index) => (
        <MessageListItem
          key={message.id}
          message={message}
          isOdd={index % 2 === 0}
        />
      ))}
      <div ref={bottomBoundaryRef} />
    </div>
  );
};
