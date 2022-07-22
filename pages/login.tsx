/**
 * Login page, index will direct to this page if there is not an active session
 */

import Image from "next/image";
import AuthInput from "../components/ui/auth/input";
import AuthButton from "../components/ui/auth/button";

import Link from "next/link";

import loginBG from "../assets/login-bg.jpg";
import React from "react";

import TransitionContainer from "../components/motion/transition-container";

const LoginPage: React.FC = () => {
  // Handle login
  const loginHandler = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    console.log("Form works");
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
            <form onSubmit={loginHandler}>
              <AuthInput
                placeholder="Username"
                type="text"
                name="user"
                icon="profile"
              />
              <AuthInput
                placeholder="Password"
                type="password"
                name="user"
                icon="lock"
              />
              <AuthButton>Login</AuthButton>
            </form>
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
