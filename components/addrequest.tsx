/**
 * Shows a background overlay and modal to submit a new tech support request
 */
import TransitionContainer from "../components/motion/transition-container";
import Input from "./ui/form/input";
import TextArea from "./ui/form/textarea";

interface IAddRequest {
  closeHandler: () => void;
}

const AddRequest: React.FC<IAddRequest> = (props) => {
  const { closeHandler } = props;

  return (
    <TransitionContainer>
      <div onClick={closeHandler} className="addrequest-background"></div>
      <div className="addrequest-modal">
        <div className="addrequest-grid">
          <label className="form-label" htmlFor="device">
            Device
          </label>
          <div>
            <Input name="device" />
          </div>
          <label className="form-label" htmlFor="summary">
            Issue Summary
          </label>
          <div>
            <Input name="summary" />
          </div>
          <label className="form-label" htmlFor="issue">
            Issue
          </label>
          <div>
            <TextArea name="issue" />
          </div>
          <label className="form-label" htmlFor="steps">
            Replication Steps
          </label>
          <div>
            <TextArea name="steps" />
          </div>
        </div>
      </div>
    </TransitionContainer>
  );
};

AddRequest.displayName = "AddRequest";
export default AddRequest;
