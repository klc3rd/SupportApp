/**
 * Shows a background overlay and modal to submit a new tech support request
 */
import { useRef, useState } from "react";
import TransitionContainer from "../components/motion/transition-container";
import Input from "./ui/form/input";
import TextArea from "./ui/form/textarea";
import Button from "./ui/button";

interface IAddRequest {
  closeHandler: () => void;
}

let blankErrorText = "This field cannot be blank";

const AddRequest: React.FC<IAddRequest> = (props) => {
  const { closeHandler } = props;

  // Error states to set for each required field
  const [deviceError, setDeviceError] = useState<boolean>(false);
  const [summaryError, setSummaryError] = useState<boolean>(false);
  const [issueError, setIssueError] = useState<boolean>(false);
  const [generalError, setGeneralError] = useState<string | null>(null);

  // Form references
  const deviceRef = useRef<HTMLInputElement | null>(null);
  const summaryRef = useRef<HTMLInputElement | null>(null);
  const issueRef = useRef<HTMLTextAreaElement | null>(null);
  const replicationStepsRef = useRef<HTMLTextAreaElement | null>(null);

  const submitHandler = () => {
    if (deviceRef.current!.value.length === 0) {
      setDeviceError(true);
      return;
    }

    if (summaryRef.current!.value.length === 0) {
      setSummaryError(true);
      return;
    }

    if (issueRef.current!.value.length === 0) {
      setIssueError(true);
      return;
    }

    const device = deviceRef.current!.value;
    const summary = summaryRef.current!.value;
    const issue = issueRef.current!.value;
    const replicationSteps = replicationStepsRef.current!.value;
  };

  const cancelErrors = () => {
    setDeviceError(false);
    setSummaryError(false);
    setIssueError(false);
    setGeneralError(null);
  };

  /**
   * Return add request screen
   */
  return (
    <TransitionContainer>
      <div onClick={closeHandler} className="addrequest-background"></div>
      <div className="addrequest-modal">
        <div className="addrequest-grid">
          <label className="form-label" htmlFor="device">
            Device
          </label>
          <div>
            <Input ref={deviceRef} name="device" onChange={cancelErrors} />
            {deviceError && (
              <>
                <br />
                <span className="error">{blankErrorText}</span>
              </>
            )}
          </div>
          <label className="form-label" htmlFor="summary">
            Issue Summary
          </label>
          <div>
            <Input
              ref={summaryRef}
              maxLength={50}
              name="summary"
              onChange={cancelErrors}
            />
            {summaryError && (
              <>
                <br />
                <span className="error">{blankErrorText}</span>
              </>
            )}
          </div>
          <label className="form-label" htmlFor="issue">
            Issue
          </label>
          <div>
            <TextArea ref={issueRef} name="issue" onChange={cancelErrors} />
            {issueError && (
              <>
                <br />
                <span className="error">{blankErrorText}</span>
              </>
            )}
          </div>
          <label className="form-label" htmlFor="steps">
            Replication Steps
          </label>
          <div>
            <TextArea
              ref={replicationStepsRef}
              name="steps"
              onChange={cancelErrors}
            />
          </div>
          <div className="addrequest-grid-btnbox">
            {generalError && (
              <>
                <br />
                <span className="error">{generalError}</span>
              </>
            )}
            <Button onClick={closeHandler} red={true}>
              Cancel
            </Button>
            <Button onClick={submitHandler}>Submit</Button>
          </div>
        </div>
      </div>
    </TransitionContainer>
  );
};

AddRequest.displayName = "AddRequest";
export default AddRequest;
