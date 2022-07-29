import { SetStateAction, Dispatch } from "react";
import { ISecuredUser } from "user-types";
import SmallButton from "../ui/small-button";

interface IUserItem {
  user: ISecuredUser;
  currentUser: string;
  onDelete?: () => void;
  onError?: Dispatch<SetStateAction<string | null>>;
}

const UserItem: React.FC<IUserItem> = (props) => {
  const { user, currentUser, onDelete, onError } = props;

  let currentLoggedInUser: boolean = false;

  if (currentUser === user.username) {
    currentLoggedInUser = true;
  }

  return (
    <>
      <div className="admin-panel-cell">{user.username}</div>
      <div className="admin-panel-cell">{user.role}</div>
      <div className="admin-panel-cell">
        <SmallButton onClick={onDelete} disabled={currentLoggedInUser}>
          Delete
        </SmallButton>
      </div>
    </>
  );
};

UserItem.displayName = "UserItem";
export default UserItem;
