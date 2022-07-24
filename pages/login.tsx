/**
 * Login page, index will direct to this page if there is not an active session
 */
import { useRef, useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import AuthInput from "../components/ui/auth/input";
import AuthButton from "../components/ui/auth/button";

import Link from "next/link";

import loginBG from "../assets/login-bg.jpg";
import React from "react";
import { signIn } from "next-auth/react";

import TransitionContainer from "../components/motion/transition-container";

const LoginPage: React.FC = () => {
  const router = useRouter();

  // userError and passwordError are not for login api response, they
  // are purely for ensuring the fields are filled
  const [userError, setUserError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  // generalError are for api response errors, such as incorrect credentials
  const [generalError, setGeneralError] = useState<string | null>(null);

  // To update the page when the user is registered and login is being processed
  const [loginStatus, setloginStatus] = useState<boolean>(false);

  const usernameRef = useRef<HTMLInputElement | null>(null);
  const passwordRef = useRef<HTMLInputElement | null>(null);

  // Handle login
  const loginHandler = () => {
    const username = usernameRef.current?.value;
    const password = passwordRef.current?.value;

    // Check that the username is filled
    if (!username) {
      setUserError("Enter a username");
      return;
    }

    // Check that the password is filled
    if (!password) {
      setPasswordError("Enter a password");
      return;
    }

    signIn("credentials", { redirect: false, username, password }).then(
      (response) => {
        setloginStatus(true);

        if (response!.status != 200) {
          setGeneralError("Invalid username or password");
          passwordRef.current!.value = "";
          setloginStatus(false);
          return;
        }
        setGeneralError(null);
        router.push("/");
      }
    );
  };

  // Clears errors when typing
  const cancelErrors = () => {
    setUserError(null);
    setPasswordError(null);
    setGeneralError(null);
  };

  // Disable the form submission as I need to process via the login button
  const formDisable = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  // Return login component
  return (
    <TransitionContainer>
      <div className="login">
        <div className="login__background">
          <Image
            src={loginBG}
            alt="login background"
            layout="fill"
            objectFit="cover"
          />
        </div>
        <div className="auth__panel">
          <div className="auth__box">
            <form onSubmit={formDisable}>
              <AuthInput
                placeholder="Username"
                type="text"
                name="user"
                icon="profile"
                ref={usernameRef}
                onChange={cancelErrors}
              />
              {userError && <span className="error">{userError}</span>}
              <AuthInput
                placeholder="Password"
                type="password"
                name="user"
                icon="lock"
                ref={passwordRef}
                onChange={cancelErrors}
              />
              <>
                <span className="error">{passwordError}</span>
                <p />
              </>
              <AuthButton onClick={loginHandler} disabled={loginStatus}>
                {loginStatus ? "Logging in" : "Login"}
              </AuthButton>
            </form>
            {generalError && <span className="error">{generalError}</span>}
            <Link href="/signup">
              <span className="auth-link">Not a user? Register here</span>
            </Link>
          </div>
        </div>
      </div>
    </TransitionContainer>
  );
};

LoginPage.displayName = "LoginPage";
export default LoginPage;
