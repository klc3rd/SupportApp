/**
 * Shows a background overlay and modal to submit a new tech support request
 */
import TransitionContainer from "../components/motion/transition-container";

interface IAddRequest {
  closeHandler: () => void;
}

const AddRequest: React.FC<IAddRequest> = (props) => {
  const { closeHandler } = props;

  return (
    <TransitionContainer>
      <div onClick={closeHandler} className="addrequest-background"></div>
    </TransitionContainer>
  );
};

AddRequest.displayName = "AddRequest";
export default AddRequest;
