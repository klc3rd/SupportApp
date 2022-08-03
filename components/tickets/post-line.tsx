import { useEffect, useState, useRef } from "react";
import { ISecuredUser } from "user-types";
import { IPost } from "ticket-types";
import TextArea from "../ui/form/textarea";
import Button from "../ui/button";
import ShowIcon from "../ui/icons";

interface IPostLine {
  userid: string;
  post: IPost;
  currentChangeCount: number;
  changeCounter: (num: number) => void;
}

const PostLine: React.FC<IPostLine> = (props) => {
  const { post, userid, currentChangeCount, changeCounter } = props;

  const messageRef = useRef<HTMLTextAreaElement | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [postingUser, setPostingUser] = useState<ISecuredUser | null>(null);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [editable, setEditable] = useState<boolean>(false);

  useEffect(() => {
    const getUser = async () => {
      const response = await fetch(`/api/getuser/${post.poster_id}`);
      const data = await response.json();

      if (response.status !== 200) {
        setError(data.message);
        return;
      }

      setPostingUser(data);
    };

    getUser();
  }, []);

  useEffect(() => {
    // Should use be able to edit this post?
    if (post?.poster_id === userid) {
      setEditable(true);
    }
  }, [post]);

  // Submit post edit handler
  const submitHandler = async () => {
    let message = messageRef.current?.value;

    if (message == "") {
      message = post.message;
    }

    const response = await fetch("/api/tickets/posts/update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        post_id: post._id,
        message: message,
      }),
    });
    const data = await response.json();

    if (response.status !== 200) {
      setError(data.message);
      return;
    }

    changeCounter(currentChangeCount + 1);
    setEditMode(false);
  };

  // format date
  let date = new Date(post.date).toLocaleString();

  /**
   * Return post
   */
  return (
    <>
      <div>
        {error && <div className="error">{error}</div>}
        {!error && (
          <>
            <div className="post">
              <div>Posted By</div>
              <div className="post-value">{postingUser?.username}</div>
              <div className="post-date">Date</div>
              <div className="post-value post-date">{date}</div>
              <div className="post-message">
                {editMode && (
                  <div className="post-edit">
                    <TextArea ref={messageRef} name="message">
                      {post.message}
                    </TextArea>
                    <div className="post-edit-btnbox">
                      <Button
                        onClick={() => {
                          setEditMode(false);
                        }}
                        red={true}
                      >
                        Cancel Edit
                      </Button>
                      <Button onClick={submitHandler}>Submit</Button>
                    </div>
                  </div>
                )}
                {!editMode && (
                  <>
                    {editable && (
                      <ShowIcon
                        onClick={() => {
                          setEditMode(true);
                        }}
                        icon="edit"
                      />
                    )}
                    <span className="post-message-text">{post.message}</span>
                  </>
                )}
              </div>
            </div>
            <hr className="ticket-divider post-divider" />
          </>
        )}
      </div>
    </>
  );
};

PostLine.displayName = "PostLine";
export default PostLine;
