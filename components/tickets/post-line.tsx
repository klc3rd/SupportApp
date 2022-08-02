import { useEffect, useState } from "react";
import { ISecuredUser } from "user-types";
import { IPost } from "ticket-types";

interface IPostLine {
  post: IPost;
}

const PostLine: React.FC<IPostLine> = (props) => {
  const { post } = props;

  const [error, setError] = useState<string | null>(null);
  const [postingUser, setPostingUser] = useState<ISecuredUser | null>(null);

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

  return (
    <>
      <div>
        {error && <div className="error">{error}</div>}
        {!error && <div>{postingUser?.username}</div>}
      </div>
    </>
  );
};

PostLine.displayName = "PostLine";
export default PostLine;
