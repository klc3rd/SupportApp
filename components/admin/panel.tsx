/**
 * This is the admin panel, used for managing users
 */
import { SetStateAction, Dispatch } from "react";
import { ISecuredUser } from "user-types";

import UserItem from "./useritem";

interface IAdminPanel {
  users: ISecuredUser[] | null;
  currentUser: string;
  onDelete: (userid: string) => Promise<void>;
  onError?: Dispatch<SetStateAction<string | null>>;
}

const AdminPanel: React.FC<IAdminPanel> = (props) => {
  const { users, currentUser, onDelete, onError } = props;

  return (
    <div className="admin-panel">
      <div className="admin-panel-header">Username</div>
      <div className="admin-panel-header">Role</div>
      <div className="admin-panel-header">Delete</div>
      {users?.map((user) => {
        return (
          <UserItem
            key={user._id}
            user={user}
            currentUser={currentUser}
            onDelete={onDelete}
            onError={onError}
          />
        );
      })}
    </div>
  );
};

AdminPanel.displayName = "AdminPanel";
export default AdminPanel;
