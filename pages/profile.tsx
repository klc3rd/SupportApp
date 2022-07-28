import { NextApiRequest, NextApiResponse } from "next";
import { Session, unstable_getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]";
import MainContainer from "../components/main-container";

interface IProfile {
  userRole: string;
  userEmail: string;
}

const Profile: React.FC<IProfile> = (props) => {
  const { userRole, userEmail } = props;

  return (
    <MainContainer role={userRole}>
      <div className="profile">Test</div>
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
  if (session && session.user!.email) {
    return {
      props: {
        userRole: session.user.role,
        userEmail: session.user.email,
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

export default Profile;
