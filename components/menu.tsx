import { signOut } from "next-auth/react";
import Button from "./ui/button";
import Link from "next/link";

interface IMenu {
  role: string;
}

const Menu: React.FC<IMenu> = (props) => {
  const { role } = props;

  return (
    <div className="main-container__menubox">
      <div className="main-container__menubox-menu">
        <div></div>
        <div>
          <Link href="/">
            <span className="main-container__menubox-menu-link">Home</span>
          </Link>
          {role == "admin" && (
            <Link href="/admin">
              <span className="main-container__menubox-menu-link">Admin</span>
            </Link>
          )}
          <Link href="/profile">
            <span className="main-container__menubox-menu-link">Profile</span>
          </Link>
          <span
            onClick={() => {
              signOut();
            }}
            className="main-container__menubox-menu-link"
          >
            Logout
          </span>
        </div>
      </div>
    </div>
  );
};

export default Menu;
