import MainContainer from "../components/main-container";
import { NextApiRequest, NextApiResponse } from "next";
import { useState, useEffect, useRef } from "react";
import { Session, unstable_getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]";
import ShowIcon from "../components/ui/icons";
import Input from "../components/ui/form/input";
import SmallButton from "../components/ui/small-button";
import { signOut } from "next-auth/react";

interface IProfile {
  userRole: string;
}

const Profile: React.FC<IProfile> = (props) => {
  const { userRole } = props;

  const [username, setUsername] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [editEmail, setEditEmail] = useState<boolean>(false);
  const [editPassword, setEditPassword] = useState<boolean>(false);

  const emailRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    // Get user info with this effect
    const getUser = async () => {
      const response = await fetch("/api/profile");
      const data = await response.json();

      // If there is an error, set the error state
      if (response.status !== 200) {
        setError(data.message);
        return;
      }

      setUsername(data.username);
      setEmail(data.email);
    };

    getUser();
  }, [editEmail]);

  const cancelErrors = () => {
    setError(null);
  };

  const editEmailHandler = async () => {
    const email = emailRef.current!.value;

    const emailRegex = new RegExp(/[A-Z0-9._%+-]+@[A-Z0-9-]+.+.[A-Z]{2,4}/gim);
    if (!emailRegex.test(email!)) {
      setError("Email must be in the correct format");
      return;
    }

    const response = await fetch("/api/profile/email", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        email: email,
      }),
    });

    const data = await response.json();

    if (response.status !== 200) {
      const error = data.message;
      if (error.includes("email_1 dup key")) {
        setError("Email is in use");
      } else {
        setError(data.message);
      }
    }
    setEditEmail(false);
    return;
  };

  // Edit email element
  const EditEmail = (
    <div className="profile-grid-field-edit">
      <Input name="email" ref={emailRef} maxLength={30} placeholder={email!} />
      <div>
        <SmallButton onClick={() => setEditEmail(false)} red={true}>
          Cancel
        </SmallButton>
        <SmallButton onClick={editEmailHandler}>Submit</SmallButton>
      </div>
    </div>
  );

  /**
   * Return main profile page
   */
  return (
    <MainContainer role={userRole}>
      <div className="profile">
        <div className="error">{error}</div>
        <div className="profile-grid">
          <div className="profile-grid-header">Username</div>
          <div className="profile-grid-field">{username}</div>
          <div className="profile-grid-header">Email</div>
          <div className="profile-grid-field">
            {!editEmail && email}
            {!editEmail && (
              <div
                className="profile-grid-edit"
                onClick={() => {
                  setEditEmail(true);
                  setError(null);
                }}
              >
                <ShowIcon icon="edit" />
              </div>
            )}
            {editEmail && EditEmail}
          </div>
          <div className="profile-grid-header">Password</div>
          <div className="profile-grid-field">
            {!editPassword && `***************`}
            {!editPassword && (
              <div
                className="profile-grid-edit"
                onClick={() => {
                  setEditPassword(true);
                  setError(null);
                }}
              >
                <ShowIcon icon="edit" />
              </div>
            )}
          </div>
        </div>
      </div>
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

Profile.displayName = "Profile";
export default Profile;
