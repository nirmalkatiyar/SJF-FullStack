export interface IPayload {
  type: "name" | "duration" | "clear";
  payload?: string;
}

export interface IPreempt {
  preempt: boolean;
  timeQuantum: string;
}

export interface IPayloadJobs {
  type: "completed" | "pending" | "timeQuan";
  payload: IJob[] | IPreempt;
}

export interface IJob {
  name: string;
  duration: number;
  status: string;
  remTime?: number;
  msg?: string;
}
export interface IJobs {
  completed: IJob[];
  pending: IJob[];
  preempt?: boolean;
  timeQuantum?: string;
}

export interface IJobInput {
  name: string;
  duration: string;
}

export interface PopUpProps {
  closeForm: () => void;
  fieldData: IJobInput;
  onChangePrimaryField: (val: string) => void;
  onChangeSecondaryField?: (val: string) => void;
  onClickAddJob: () => void;
  headerText: string;
  primaryField: string;
  secondaryField?: string;
  primaryFieldValue: string;
  secondaryFieldValue?: string;
  btnText: string;
}

export interface ToogleProps {
  checked: boolean;
  onToggle: () => void;
}

export interface InputTextProps {
  value: string;
  fieldType: string;
  onChange: (val: string) => void;
}

export interface HeaderProps {
  onClick?: () => void;
  title: string;
}

export interface JobDetailsProps {
    jobName: string;
    status: string;
    estimatedCompletion?: number;
    isRight?: boolean;
    totalDuration?: number;
  }

export interface TopBarProps {
    timeQuantum: string
}

export interface JobScreenProps {
  jobsData : IJobs
  clock : number
  setShowPortal : (value : boolean) => void   
}
