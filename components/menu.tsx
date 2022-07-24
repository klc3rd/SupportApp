import { signOut } from "next-auth/react";
import Button from "./ui/button";
import Link from "next/link";

interface IMenu {
  role: string;
}

const Menu: React.FC<IMenu> = (props) => {
  const { role } = props;

  const submitRequestHandler = () => {
    console.log("It works!");
  };

  return (
    <div className="main-container__menubox">
      <div className="main-container__menubox-menu">
        <div>
          <Button icon="add" onClick={submitRequestHandler}>
            Submit Request
          </Button>
        </div>
        <div>
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
