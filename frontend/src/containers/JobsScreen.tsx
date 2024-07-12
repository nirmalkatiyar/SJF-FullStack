import { HeadingDiv, LeftContainer, ScrollDiv } from "../skins";
import Header from "../components/Header";
import JobDetails from "../components/JobDetails";
import { JobScreenProps } from "../types/types";

export default function JobScreen(props: JobScreenProps) {
  const { jobsData, clock, setShowPortal } = props;

  return (
    <div style={{ display: "flex" }}>
      <LeftContainer isLeft>
        <Header onClick={() => setShowPortal(true)} title={"Job List"} />
        <ScrollDiv isLeft>
          <HeadingDiv>
            Jobs running via {!jobsData.preempt && "Non-"}Preemptive SJF
            Algorithm
          </HeadingDiv>
          {jobsData.pending.map((job, index) => {
            if (index === 0) {
              return (
                <JobDetails
                  jobName={job.name}
                  status={job.status}
                  estimatedCompletion={job.remTime! - clock}
                  totalDuration={job.duration}
                />
              );
            }
            return (
              <JobDetails
                jobName={job.name}
                status={job.status}
                estimatedCompletion={job.remTime!}
                totalDuration={job.duration}
              />
            );
          })}
        </ScrollDiv>
      </LeftContainer>
      <LeftContainer>
        <Header title={"Completed Job List"} />
        <ScrollDiv>
          {jobsData.completed.map((job) => {
            return (
              <JobDetails
                isRight
                jobName={job.name}
                status={job.status}
                estimatedCompletion={job.duration}
                totalDuration={job.duration}
              />
            );
          })}
        </ScrollDiv>
      </LeftContainer>
    </div>
  );
}
