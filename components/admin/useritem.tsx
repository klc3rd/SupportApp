import { SetStateAction, Dispatch, useState, useRef } from "react";
import { ISecuredUser } from "user-types";
import SmallButton from "../ui/small-button";

interface IUserItem {
  user: ISecuredUser;
  currentUser: string;
  onError: (message: string) => void;
  onDelete: (userid: string) => Promise<void>;
}

const UserItem: React.FC<IUserItem> = (props) => {
  const { user, currentUser, onError, onDelete } = props;

  const [deleteStatus, setDeleteStatus] = useState<boolean>(false);

  const roleRef = useRef<HTMLSelectElement | null>(null);

  let currentLoggedInUser: boolean = false;

  if (currentUser === user.username) {
    currentLoggedInUser = true;
  }

  // Change user role
  const roleChangeHandler = async () => {
    const newRole = roleRef.current!.value;

    const response = await fetch("/api/admin/changerole", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: user._id,
        role: newRole,
      }),
    });

    const data = await response.json();

    if (response.status !== 200) {
      onError(data.message);
      return;
    }
  };

  // Modify menu based on user role
  let roleMenu;
  if (user.role === "admin") {
    roleMenu = (
      <>
        <option value="admin">Admin</option>
        <option value="tech">Tech</option>
        <option value="user">User</option>
      </>
    );
  } else if (user.role == "tech") {
    roleMenu = (
      <>
        <option value="tech">Tech</option>
        <option value="admin">Admin</option>
        <option value="user">User</option>
      </>
    );
  } else {
    roleMenu = (
      <>
        <option value="user">User</option>
        <option value="tech">Tech</option>
        <option value="admin">Admin</option>
      </>
    );
  }

  // Return user item line
  return (
    <>
      <div className="admin-panel-cell">{user.username}</div>
      <div className="admin-panel-cell">
        {" "}
        <select
          className="ui-small-btn"
          name="role"
          disabled={currentLoggedInUser}
          onChange={roleChangeHandler}
          ref={roleRef}
        >
          {roleMenu}
        </select>
      </div>
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
