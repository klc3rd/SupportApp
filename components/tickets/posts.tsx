/******************************
 * This page displays the responses to each ticket
 ******************************/

import { useEffect, useState, useRef } from "react";
import { ITicket, IPost } from "ticket-types";
import Button from "../ui/button";
import TextArea from "../ui/form/textarea";
import Status from "../../lib/enums/ticket-status";

interface IPostsPage {
  userid: string;
  username: string;
  userRole: string;
  ticket: ITicket;
  currentChangeCount: number;
  changeCounter: (num: number) => void;
}

const Posts: React.FC<IPostsPage> = (props) => {
  const { userid, ticket, currentChangeCount, changeCounter } = props;

  const [posts, setPosts] = useState<IPost | null>(null);
  const [error, setError] = useState<string | null>(null);

  const postRef = useRef<HTMLTextAreaElement | null>(null);

  const ticketOpen = ticket.status !== Status.Closed;
  const canPost =
    (userid === ticket.poster_id || userid === ticket.assigned_id) &&
    ticketOpen;

  /**
   * Submit post/response
   */
  const postHandler = async () => {
    if (!postRef.current) {
      setError("Cannot retrieve reference to field");
      return;
    }

    const message = postRef.current.value;

    if (message === "") {
      setError("Post cannot be empty");
      return;
    }

    // Send post
    const response = await fetch("/api/tickets/posts", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        ticket_id: ticket._id,
        poster_id: ticket.poster_id,
        assigned_id: ticket.assigned_id,
        message: message,
      }),
    });

    // Check for error
    const data = await response.json();
    if (response.status !== 200) {
      setError(data.message);
    }

    postRef.current.value = "";

    // This counter is to trigger refresh in parent component
    changeCounter(currentChangeCount + 1);
  };

  /**
   * Reset error statuses
   */
  const resetError = () => {
    setError(null);
  };

  /**
   * Show posts and response field
   */
  return (
    <>
      <div className="ticket-grid-field">
        <hr className="ticket-divider" />
        <div className="ticket-post">{!posts && "No posts found"}</div>
      </div>
      <div className="ticket-grid-field">
        <hr className="ticket-divider" />
        <div className="ticket-postfield">
          {!canPost &&
            "Only the posting user or an assigned tech can respond to an open ticket"}
          {canPost && (
            <>
              <TextArea ref={postRef} onChange={resetError} name="post" />
              <div className="ticket-postfield-btnbox">
                {error && <span className="error">{error}</span>}
                <Button red={true}>Close Ticket</Button>
                <Button onClick={postHandler}>Submit</Button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

/**
 * Serverside code
 */

Posts.displayName = "Posts";
export default Posts;
