import MainContainer from "../../components/main-container";
import { useEffect, useState } from "react";
import { ISecuredUser } from "user-types";

import { adminProps as getServerSideProps } from "../../components/serverProps";

interface IAdminIndex {
  userRole: string;
}

const AdminIndex: React.FC<IAdminIndex> = (props) => {
  const { userRole } = props;

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
          <div className="admin-panel">
            <div className="admin-panel-header">Username</div>
            <div className="admin-panel-header">Role</div>
            <div className="admin-panel-header">Delete</div>
          </div>
        )}
      </>
    </MainContainer>
  );
};

export { getServerSideProps };

AdminIndex.displayName = "AdminIndex";
export default AdminIndex;
