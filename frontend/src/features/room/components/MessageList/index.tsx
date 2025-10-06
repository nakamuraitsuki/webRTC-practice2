import React, { useCallback, useEffect, useRef, useState } from "react";
import { TextMessage } from "../../../../domains/TextMessage/models/TextMessage";
import { TextMessageHistoryUseCase } from "../../../../domains/TextMessage/usecase/TextMessageHistoryUseCase";
import { GetHistoryInput } from "../../../../domains/TextMessage/repotisories/TextMessageHistoryRepository";
import { Avatar, Divider, List, ListItemAvatar, ListItemText } from "@mui/material";
import { apiClient } from "../../../../infrastructure/api/apiClient";

import styles from "./index.module.css";

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
    <div ref={scrollContainerRef} className={styles.container}>
      <List sx={{ width: 'fit-couten', margin: 'auto', maxWidth: 360, bgcolor: 'background.paper' }}>
        {messages.map((message) => (
          <>
            <ListItemAvatar>
              <Avatar src={`${apiClient.baseUrl}/api/user/icon/${message.user_id}`} />
            </ListItemAvatar>
            <ListItemText
              primary={message.content}
              secondary={
                <React.Fragment>
                  {message.sent_at}
                </React.Fragment>
              }
            />
            <Divider variant="inset" component="li" />
          </>
        ))}
      </List>
      <div ref={bottomBoundaryRef} />
    </div>
    );
};
