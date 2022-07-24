/**
 * This provides UI elements for the main pages of the app
 */
interface iMainContainer {
  role: string;
  children: JSX.Element | JSX.Element[];
}

const MainContainer: React.FC<iMainContainer> = (props) => {
  const { role, children } = props;

  return <>{children}</>;
};

MainContainer.displayName = "MainContainer";
export default MainContainer;
