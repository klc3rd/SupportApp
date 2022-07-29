import MainContainer from "../../components/main-container";
import { useEffect, useState } from "react";
import { ISecuredUser } from "user-types";
import { adminProps as getServerSideProps } from "../../components/serverProps";

import AdminPanel from "../../components/admin/panel";

interface IAdminIndex {
  username: string;
  userRole: string;
}

const AdminIndex: React.FC<IAdminIndex> = (props) => {
  const { username, userRole } = props;

  const [error, setError] = useState<string | null>(null);

  // Store users array
  const [users, setUsers] = useState<ISecuredUser[] | null>(null);

  // Get users
  useEffect(() => {
    const getUsers = async () => {
      const response = await fetch("/api/admin");
      const data = await response.json();

      if (response.status !== 200) {
        setError(data.message);
        return;
      }

      setUsers(data);
    };

    getUsers();
  }, []);

  // Delete user
  const deleteUserHandler = async () => {
    // Add this later
    console.log("Running delete user");
  };

  /**
   * Return main profile page
   */
  return (
    <MainContainer role={userRole}>
      <>
        {error && (
          <div className="error" style={{ marginTop: "1rem" }}>
            {error}
          </div>
        )}
        {!error && (
          <AdminPanel
            users={users}
            onDelete={deleteUserHandler}
            onError={setError}
            currentUser={username}
          />
        )}
      </>
    </MainContainer>
  );
};

export { getServerSideProps };

AdminIndex.displayName = "AdminIndex";
export default AdminIndex;
