/**
 * User registration page
 */
import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import signupBG from "../assets/signup-bg.jpg";

import AuthInput from "../components/ui/auth/input";
import AuthButton from "../components/ui/auth/button";

import TransitionContainer from "../components/motion/transition-container";

const SignupPage: React.FC = () => {
  // Store error messages, for each category of error so it can
  // be placed in the appropriate place
  const [userError, setUserError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [userCreated, setUserCreated] = useState<boolean>(false);

  // Form reference
  const usernameRef = useRef<HTMLInputElement | null>(null);
  const emailRef = useRef<HTMLInputElement | null>(null);
  const passwordRef = useRef<HTMLInputElement | null>(null);
  const confirmPasswordRef = useRef<HTMLInputElement | null>(null);

  // Handle signup
  const signupHandler = (event: React.FormEvent<HTMLFormElement>) => {
    // Reset error states after submitting form
    setUserError(null);
    setEmailError(null);
    setPasswordError(null);
    setGeneralError(null);

    event.preventDefault();

    const username = usernameRef.current?.value;
    const email = emailRef.current?.value;
    const password = passwordRef.current?.value;
    const passwordConfirmation = confirmPasswordRef.current?.value;

    // Check that the username is not blank
    if (username!.length === 0) {
      setUserError("Username cannot be blank");
      return;
    }

    // Check that the email is not blank
    if (email!.length === 0) {
      setEmailError("Email cannot be blank");
      return;
    }

    // Check that email is in the correct format
    const emailRegex = new RegExp(/[A-Z0-9._%+-]+@[A-Z0-9-]+.+.[A-Z]{2,4}/gim);
    if (!emailRegex.test(email!)) {
      setEmailError("Email must be in the correct format");
      return;
    }

    // Check that the password and password confirmation match
    if (password != passwordConfirmation) {
      setPasswordError("Password and password confirmation do not match");
      return;
    }

    // Check that the password is at least 8 characters
    if (password!.length < 8) {
      setPasswordError("Password must be at least 8 characters");
      return;
    }

    /**
     * Send request to create user
     */
    fetch("/api/auth/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username,
        email: email,
        password: password,
        passwordConfirmation: passwordConfirmation,
      }),
    }).then((response) => {
      // If there is an error, parse JSON and return error
      if (response.status != 200) {
        response.json().then((data) => {
          setGeneralError(data.message);
          return;
        });
      } else {
        // If there is no error, return api response and set
        // userCreated state to true
        response.json().then((data) => {
          setUserCreated(true);
        });
      }
    });
  };

  /**
   * Temporary
   */
  useEffect(() => {
    console.log(userCreated);
  }, [userCreated]);

  // Return signup page
  return (
    <TransitionContainer>
      <div className="signup">
        <div className="auth__panel">
          <div className="auth__box">
            <form onSubmit={signupHandler}>
              <AuthInput
                placeholder="Username"
                type="text"
                name="user"
                icon="profile"
                ref={usernameRef}
                onChange={() => {
                  setUserError(null);
                }}
              />
              {userError && <span className="error">{userError}</span>}
              <AuthInput
                placeholder="Email Address"
                type="text"
                name="email"
                icon="mail"
                ref={emailRef}
                onChange={() => {
                  setEmailError(null);
                }}
              />
              {emailError && <span className="error">{emailError}</span>}
              <AuthInput
                placeholder="Password"
                type="password"
                name="user"
                icon="lock"
                ref={passwordRef}
                onChange={() => {
                  setPasswordError(null);
                }}
              />
              <AuthInput
                placeholder="Confirm Password"
                type="password"
                name="passwordConfirmation"
                icon="lock"
                ref={confirmPasswordRef}
                onChange={() => {
                  setPasswordError(null);
                }}
              />
              {passwordError && (
                <>
                  <span className="error">{passwordError}</span>
                  <p />
                </>
              )}

              <AuthButton>Register</AuthButton>
            </form>
            {generalError && <span className="error">{generalError}</span>}
            <Link href="/login">
              <span className="auth-link">Already a user? Login here</span>
            </Link>
          </div>
        </div>
        <div className="signup__background">
          <Image
            src={signupBG}
            alt="login background"
            layout="fill"
            objectFit="cover"
          />
        </div>
      </div>
    </TransitionContainer>
  );
};

SignupPage.displayName = "SignupPage";
export default SignupPage;
