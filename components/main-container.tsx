/**
 * This provides UI elements for the main pages of the app
 */
import TransitionContainer from "../components/motion/transition-container";
import Menu from "./menu";

interface IMainContainer {
  role: string;
  children: JSX.Element | JSX.Element[];
  submitRequestHandler: () => void;
}

const MainContainer: React.FC<IMainContainer> = (props) => {
  const { role, children, submitRequestHandler } = props;

  return (
    <TransitionContainer>
      <div className="main-container">
        <Menu submitRequestHandler={submitRequestHandler} role={role} />
        <div className="main-container__body">{children}</div>
      </div>
    </TransitionContainer>
  );
};

MainContainer.displayName = "MainContainer";
export default MainContainer;
