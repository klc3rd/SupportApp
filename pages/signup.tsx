/**
 * User registration page
 */
import { useRouter } from "next/router";
import { useState, useRef } from "react";
import { signIn } from "next-auth/react";

import Image from "next/image";
import Link from "next/link";
import signupBG from "../assets/signup-bg.jpg";

import AuthInput from "../components/ui/auth/input";
import AuthButton from "../components/ui/auth/button";

import TransitionContainer from "../components/motion/transition-container";

const SignupPage: React.FC = () => {
  const router = useRouter();
  // Store error messages, for each category of error so it can
  // be placed in the appropriate place
  const [userError, setUserError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [generalError, setGeneralError] = useState<string | null>(null);

  const [registrationStatus, setRegistrationStatus] = useState<boolean>(false);

  // Form reference
  const usernameRef = useRef<HTMLInputElement | null>(null);
  const emailRef = useRef<HTMLInputElement | null>(null);
  const passwordRef = useRef<HTMLInputElement | null>(null);
  const confirmPasswordRef = useRef<HTMLInputElement | null>(null);

  // Handle signup
  const signupHandler = async () => {
    // Reset error states after submitting form
    setUserError(null);
    setEmailError(null);
    setPasswordError(null);
    setGeneralError(null);

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

    // Register usuer
    const response = await fetch("/api/auth/signup", {
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
    });

    if (response.status != 200) {
      const data = await response.json();
      setGeneralError(data.message);
      return;
    }

    // Sign in based on registered info then redirect page
    setRegistrationStatus(true);
    await signIn("credentials", {
      redirect: false,
      username,
      password,
    });

    setGeneralError(null);
    router.push("/");
  };

  // Clears errors when typing
  const cancelErrors = () => {
    setUserError(null);
    setEmailError(null);
    setPasswordError(null);
    setGeneralError(null);
  };

  // Disable the form submission as I need to process via the login button
  const formDisable = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  // Return signup page
  return (
    <TransitionContainer>
      <div className="signup">
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
                placeholder="Email Address"
                type="text"
                name="email"
                icon="mail"
                ref={emailRef}
                onChange={cancelErrors}
              />
              {emailError && <span className="error">{emailError}</span>}
              <AuthInput
                placeholder="Password"
                type="password"
                name="user"
                icon="lock"
                ref={passwordRef}
                onChange={cancelErrors}
              />
              <AuthInput
                placeholder="Confirm Password"
                type="password"
                name="passwordConfirmation"
                icon="lock"
                ref={confirmPasswordRef}
                onChange={cancelErrors}
              />
              {passwordError && (
                <>
                  <span className="error">{passwordError}</span>
                  <p />
                </>
              )}

              <AuthButton onClick={signupHandler} disabled={registrationStatus}>
                {registrationStatus ? "Registered, logging in..." : "Register"}
              </AuthButton>
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
