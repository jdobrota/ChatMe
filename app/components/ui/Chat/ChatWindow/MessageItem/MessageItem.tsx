"use client";

import styles from "./MessageItem.module.css";
import TimeAgo from "react-timeago";
import SeenByUsers from "./SeenByUsers";
import { Message } from "types/types";
import useMessageItem from "./MessageItem.hook";

function MessageItem({ children: message }: { children: Message }) {
  const {
    mine,
    seen,
    showDetails,
    setShowDetails,
    doNotSendSeenRequest,
    setMessageAsSeen,
  } = useMessageItem(message);

  return (
    <li
      className={`${mine ? styles.sent : styles.received} ${
        message?.pending ? styles.pending : ""
      }`}
      // onWheel={doNotSendSeenRequest ? () => {} : () => setMessageAsSeen()}
      onMouseOver={doNotSendSeenRequest ? () => {} : () => setMessageAsSeen()}
    >
      {!mine && (
        <img
          width={40}
          height={40}
          src={message?.profilePic}
          alt="Profile picture"
          className={styles.image}
        />
      )}
      <div className={mine ? styles.sentText : styles.receivedText}>
        {/* <p className="text-xs">{message?.from}</p> */}
        {showDetails && (
          <SeenByUsers seenByUsers={message.seenBy} message={message} />
        )}
        <p
          onClick={() => setShowDetails(!showDetails)}
          className={`${styles.text} ${
            mine ? styles.textSent : styles.textReceived
          } ${message?.message.search(" ") ? "break-all" : ""} ${
            !seen ? styles.unseen : ""
          }`}
        >
          {message?.message}
        </p>
        {showDetails && (
          <label
            className={`${styles.status} ${
              mine ? styles.statusSent : styles.statusReceived
            }`}
          >
            {`${mine ? "Sent: " : "Received: "}`}
            <TimeAgo date={new Date(message?.timeStamp)} />
          </label>
        )}
      </div>
      {mine && (
        <img
          width={40}
          height={40}
          src={message?.profilePic}
          alt="Profile picture"
          className={styles.image}
        />
      )}
    </li>
  );
}
export default MessageItem;
