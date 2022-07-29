import MainContainer from "../components/main-container";
import { useState, useEffect, useRef } from "react";
import ShowIcon from "../components/ui/icons";
import Input from "../components/ui/form/input";
import SmallButton from "../components/ui/small-button";

import { serverProps as getServerSideProps } from "../components/serverProps";

interface IProfile {
  userRole: string;
}

const Profile: React.FC<IProfile> = (props) => {
  const { userRole } = props;

  const [username, setUsername] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [passwordChanged, setPasswordChanged] = useState<boolean>(false);

  const [editEmail, setEditEmail] = useState<boolean>(false);
  const [editPassword, setEditPassword] = useState<boolean>(false);

  // Ref for new email address
  const emailRef = useRef<HTMLInputElement | null>(null);

  // Ref for updating password
  const oldPasswordRef = useRef<HTMLInputElement | null>(null);
  const newPasswordRef = useRef<HTMLInputElement | null>(null);
  const confirmPasswordRef = useRef<HTMLInputElement | null>(null);

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

  // Updates email address
  const editEmailHandler = async () => {
    const email = emailRef.current!.value;

    if (email.length === 0) {
      setEditEmail(false);
      return;
    }

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

  // Updates password
  const updatePasswordHandler = async () => {
    setError(null);

    const oldPassword = oldPasswordRef.current!.value;
    const newPassword = newPasswordRef.current!.value;
    const confirmPassword = confirmPasswordRef.current!.value;

    if (oldPassword.length === 0) {
      setError("Old password cannot be blank");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("New password and confirmation must match");
      return;
    }

    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    // Update password
    const response = await fetch("/api/profile/password", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        oldPassword: oldPassword,
        newPassword: newPassword,
      }),
    });

    const data = await response.json();

    if (response.status !== 200) {
      setError(data.message);
      return;
    }

    setEditPassword(false);
    setPasswordChanged(true);
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

  // Edit password element
  const EditPassword = (
    <div className="profile-grid-field-edit">
      <Input
        name="email"
        type="password"
        maxLength={30}
        ref={oldPasswordRef}
        placeholder="Old password"
      />
      <Input
        name="email"
        type="password"
        maxLength={30}
        ref={newPasswordRef}
        placeholder="New password"
      />
      <Input
        name="email"
        type="password"
        maxLength={30}
        ref={confirmPasswordRef}
        placeholder="Confirm new password"
      />

      <div>
        <SmallButton onClick={() => setEditPassword(false)} red={true}>
          Cancel
        </SmallButton>
        <SmallButton onClick={updatePasswordHandler}>Submit</SmallButton>
      </div>
    </div>
  );

  // Clear errors and edit statuses
  const clearStatus = () => {
    setError(null);
    setPasswordChanged(false);
  };

  /**
   * Return main profile page
   */
  return (
    <MainContainer role={userRole}>
      <div className="profile">
        <div className="error" style={{ marginBottom: "1rem" }}>
          {error}
        </div>
        <div className="message" style={{ marginBottom: "1rem" }}>
          {passwordChanged && "Password has been changed"}
        </div>
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
                  clearStatus();
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
                  clearStatus();
                }}
              >
                <ShowIcon icon="edit" />
              </div>
            )}
            {editPassword && EditPassword}
          </div>
        </div>
      </div>
    </MainContainer>
  );
};

export { getServerSideProps };

Profile.displayName = "Profile";
export default Profile;
