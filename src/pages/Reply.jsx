import { useEffect } from "react";
import { useParams, useOutletContext } from "react-router-dom";

import ReplyTextarea from "../components/ReplyTextarea";

export default function Reply() {
  const { repliedCommentId } = useParams();
  const [replyStatus, setReplyStatus] = useOutletContext();

  useEffect(() => {
    if(repliedCommentId) {
      setReplyStatus(true);
    }
  }, [repliedCommentId, setReplyStatus]);

  return (
    replyStatus && <ReplyTextarea />
  );
}