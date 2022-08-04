/**
 * This is the admin panel, used for managing users
 */
import { ISecuredUser } from "user-types";

import UserItem from "./useritem";

interface IAdminPanel {
  users: ISecuredUser[] | null;
  currentUser: string;
  onError: (message: string) => void;
  onDelete: (userid: string) => Promise<void>;
}

const AdminPanel: React.FC<IAdminPanel> = (props) => {
  const { users, currentUser, onError, onDelete } = props;

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
            onError={onError}
            onDelete={onDelete}
          />
        );
      })}
    </div>
  );
};

AdminPanel.displayName = "AdminPanel";
export default AdminPanel;
