import MainContainer from "../../components/main-container";
import { NextApiRequest, NextApiResponse } from "next";
import { Session, unstable_getServerSession } from "next-auth";
import { useRouter } from "next/router";
import { authOptions } from "../api/auth/[...nextauth]";

interface IAdminIndex {
  userRole: string;
}

const AdminIndex: React.FC<IAdminIndex> = (props) => {
  const { userRole } = props;

  // Get ticket id from URL Param
  const router = useRouter();
  const ticket_id = router.query.tid;

  /**
   * Return main profile page
   */
  return (
    <MainContainer role={userRole}>
      <div></div>
    </MainContainer>
  );
};

/**
 * Serverside code
 */
export const getServerSideProps = async (context: {
  req: NextApiRequest;
  res: NextApiResponse;
}) => {
  const session: Session | null = await unstable_getServerSession(
    context.req,
    context.res,
    authOptions
  );

  // Get currently logged in user's role and email
  // if unsuccessful, forward to login page
  if (session) {
    return {
      props: {
        userRole: session.user.role,
      },
    };
  } else {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }
};

AdminIndex.displayName = "AdminIndex";
export default AdminIndex;
