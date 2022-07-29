import { SetStateAction, Dispatch, useState } from "react";
import { ISecuredUser } from "user-types";
import SmallButton from "../ui/small-button";

interface IUserItem {
  user: ISecuredUser;
  currentUser: string;
  onDelete: (userid: string) => Promise<void>;
  onError?: Dispatch<SetStateAction<string | null>>;
}

const UserItem: React.FC<IUserItem> = (props) => {
  const { user, currentUser, onDelete, onError } = props;

  const [deleteStatus, setDeleteStatus] = useState<boolean>(false);

  let currentLoggedInUser: boolean = false;

  if (currentUser === user.username) {
    currentLoggedInUser = true;
  }

  // Change delete status
  const deleteHandler = () => {
    setDeleteStatus(true);
  };

  // Return user item line
  return (
    <>
      <div className="admin-panel-cell">{user.username}</div>
      <div className="admin-panel-cell">{user.role}</div>
      <div className="admin-panel-cell">
        {!deleteStatus && (
          <SmallButton
            onClick={() => {
              setDeleteStatus(true);
            }}
            disabled={currentLoggedInUser}
          >
            Delete
          </SmallButton>
        )}
        {deleteStatus && (
          <>
            <SmallButton
              onClick={() => {
                onDelete(user._id);
                setDeleteStatus(false);
              }}
              red={true}
              disabled={currentLoggedInUser}
            >
              Confirm
            </SmallButton>
            <SmallButton
              onClick={() => {
                setDeleteStatus(false);
              }}
              disabled={currentLoggedInUser}
            >
              Cancel
            </SmallButton>
          </>
        )}
      </div>
    </>
  );
};

UserItem.displayName = "UserItem";
export default UserItem;
