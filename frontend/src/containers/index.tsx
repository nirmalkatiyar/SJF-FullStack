import {
  useCallback,
  useEffect,
  useReducer,
  useRef,
  useState,
} from "react";
import TopBar from "../components/TopBar";
import { createPortal } from "react-dom";
import PopUpForm from "../components/PopUp";
import axios from "axios";
import { toast } from "react-toastify";
import {
  IJob,
  IJobInput,
  IJobs,
  IPayload,
  IPayloadJobs,
  IPreempt,
} from "../types/types";
import { checkNumber, throttle } from "./helper";
import JobScreen from "./JobsScreen";
import { apiRoute } from "../Runtimes/Runtime";

// reducer for jobs and time quantum
function jobReducer(state: IJobs, action: IPayloadJobs) {
  switch (action.type) {
    case "completed":
    case "pending":
      return { ...state, [action.type]: action.payload };
    case "timeQuan":
      return {
        ...state,
        timeQuantum: (action.payload as IPreempt).timeQuantum,
        preempt: (action.payload as IPreempt).preempt,
      };
    default:
      return state;
  }
}

// reducer for input fields
function inputReducer(state: IJobInput, action: IPayload) {
  switch (action.type) {
    case "name":
    case "duration":
      return { ...state, [action.type]: action.payload };
    case "clear":
      return { name: "", duration: "" };
    default:
      return state;
  }
}

function JobScreenCon() {
  const intervalRef = useRef<NodeJS.Timer | null>(null);
  const [clock, setClock] = useState(0);
  const [timeQuan, setTimeQuan] = useState("");
  const [showPortal, setShowPortal] = useState(false);
  const [timeQuantumPopUp, setTimeQuantumPopUp] = useState(false);
  const [jobsData, dispatchJobsData] = useReducer(jobReducer, {
    completed: [],
    pending: [],
  });
  const [fieldData, dispatchFieldData] = useReducer(inputReducer, {
    name: "",
    duration: "",
  });
  /**
   * @param callback callback function to be called after the api call
   */
  const getJobs = useCallback((callback?: () => void) => {
    setClock(0);
    axios
      .get(`${apiRoute}jobs`)
      .then(({ data }: { data: IJobs }) => {
        setTimeQuan(data.preempt ? data.timeQuantum! : "");
        dispatchJobsData({
          type: "timeQuan",
          payload: {
            preempt: data.preempt!,
            timeQuantum: data.timeQuantum!,
          },
        });
        if (data?.pending?.[0]?.status === "running") {
          clearInterval(intervalRef.current!);
          intervalRef.current = setInterval(() => {
            setClock((prev) => prev + 1);
          }, 1000);
        }
        data.pending &&
          dispatchJobsData({ type: "pending", payload: data.pending });
        data.completed &&
          dispatchJobsData({ type: "completed", payload: data.completed });
        callback && callback();
      })
      .catch((err) => toast.error(err.message));
  }, []);

  useEffect(() => {
    getJobs();

    // setting up the websocket connection
    const socket = new WebSocket(`${apiRoute}ws`);

    // on connection established
    socket.onopen = () => {
      console.log("WebSocket connection established");
    };

    // throttling the getJobs function to avoid multiple api calls
    const throttledFunc = throttle(getJobs, 20);

    // on message received
    socket.onmessage = (event) => {
      const message: IJob = JSON.parse(event.data);
      if (message.msg === "CS") {
        toast.success(`Job ${message.name} got Context switched`);
      }
      toast.success(
        `Job ${message.name} is ${message.status} with duration ${
          message.status === "completed" ? message.duration : message.remTime
        } seconds`
      );
      throttledFunc();
    };
    // clearing the interval and closing the websocket connection on unmount
    return () => {
      socket.close();
      clearInterval(intervalRef.current!);
    };
  }, []);

  /**
   * closes the popup
   */
  const closePopUp = useCallback(() => {
    setShowPortal(false);
    dispatchFieldData({ type: "clear" });
  }, []);

  /**
   * Calls the api to add a new job
   */
  const onSubmitAddJob = useCallback(() => {
    if (!fieldData.name || !fieldData.duration) {
      toast.error("Please fill all the fields");
    } else {
      axios
        .post(`${apiRoute}jobs`, {
          ...fieldData,
          duration: parseInt(fieldData.duration),
        })
        .then(() => getJobs())
        .catch((err) => toast.error(err.message));
      closePopUp();
    }
  }, [fieldData]);

  /**
   * Toggle between preemptive and non-preemptive SJF
   */
  const handleToggle = useCallback(() => {
    if (jobsData.pending.length > 0) {
      toast.error(
        `To switch to the Preemptive/Non-Preemptive SJF there must be No pending or running jobs`
      );
      return;
    }
    if (jobsData.preempt === true) {
      axios
        .post(`${apiRoute}preempt`, {
          isPreemptive: false,
        })
        .then(() => getJobs())
        .catch((err) => toast.error(err.message));
    } else {
      setShowPortal(true);
      setTimeQuantumPopUp(true);
    }
  }, [jobsData]);

  /**
   * Closes the time quantum popup
   */
  const closeTimeQuantumPopUp = useCallback(() => {
    closePopUp();
    setTimeQuantumPopUp(false);
    setTimeQuan("");
  }, []);

  /**
   * Calls the api to set the time quantum
   */
  const onSubmitAddJobQuan = useCallback(() => {
    if (timeQuan === "") {
      toast.error("Please fill all the fields");
    } else {
      axios
        .post(`${apiRoute}preempt`, {
          isPreemptive: true,
          timeQuantum: parseInt(timeQuan),
        })
        .then(() => getJobs(closeTimeQuantumPopUp))
        .catch((err) => toast.error(err.message));
    }
  }, [timeQuan]);

  return (
    <>
      {showPortal &&
        createPortal(
          timeQuantumPopUp ? (
            <PopUpForm
              primaryFieldValue={timeQuan}
              headerText="Set Time Quantum"
              primaryField="Time Quantum (in Sec.)"
              closeForm={closeTimeQuantumPopUp}
              fieldData={fieldData}
              onClickAddJob={onSubmitAddJobQuan}
              onChangePrimaryField={(val: string) => {
                checkNumber(val) && setTimeQuan(val);
              }}
              btnText="Set Time Quantum"
            />
          ) : (
            <PopUpForm
              primaryFieldValue={fieldData.name}
              secondaryFieldValue={fieldData.duration}
              headerText="Add New Job"
              primaryField="Job Name"
              secondaryField="Burst Time (in Sec.)"
              closeForm={closePopUp}
              fieldData={fieldData}
              onClickAddJob={onSubmitAddJob}
              onChangeSecondaryField={(val: string) => {
                checkNumber(val) &&
                  dispatchFieldData({ type: "duration", payload: val });
              }}
              onChangePrimaryField={(val: string) => {
                dispatchFieldData({ type: "name", payload: val });
              }}
              btnText="Add Job"
            />
          ),
          document.getElementById("portal") as HTMLElement
        )}
      <div className="App">
        <TopBar
          checked={jobsData.preempt!}
          onToggle={handleToggle}
          timeQuantum={jobsData.timeQuantum!}
        />
        <JobScreen
          jobsData={jobsData}
          clock={clock}
          setShowPortal={setShowPortal}
        />
      </div>
    </>
  );
}
//toggle

export default JobScreenCon;
