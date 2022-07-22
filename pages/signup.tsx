/**
 * User registration page
 */
import Image from "next/image";
import Link from "next/link";
import signupBG from "../assets/signup-bg.jpg";

import AuthInput from "../components/ui/auth/input";
import AuthButton from "../components/ui/auth/button";

import TransitionContainer from "../components/motion/transition-container";

const signupPage = () => {
  // Handle signup
  const signupHandler = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

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
              />
              <AuthInput
                placeholder="Email Address"
                type="text"
                name="email"
                icon="mail"
              />
              <AuthInput
                placeholder="Password"
                type="password"
                name="user"
                icon="lock"
              />
              <AuthInput
                placeholder="Confirm Password"
                type="password"
                name="passwordConfirmation"
                icon="lock"
              />
              <AuthButton>Register</AuthButton>
            </form>
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

export default signupPage;
