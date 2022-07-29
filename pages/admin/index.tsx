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

  // User deletion status
  const [userDeletion, setUserDeletion] = useState<boolean>(false);

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
  }, [userDeletion]);

  // Delete user
  const deleteUserHandler = async (userid: string) => {
    // Add this later
    console.log(`Running delete user on user ${userid}`);

    const response = await fetch("/api/admin/deleteuser", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userid: userid }),
    });

    const data = await response.json();

    if (response.status !== 200) {
      setError(data.message);
    }

    setUserDeletion((status) => !status);
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
