import React from "react";
import { JobDetailsProps } from "../types/types";
import { BoldDiv, JobDetailsContainer, JobInfo, ProgressContainer } from "../skins";

const JobDetails = (props: JobDetailsProps) => {
  const { jobName, status, estimatedCompletion, totalDuration, isRight } = props;
  return (
    <JobDetailsContainer isRight={isRight}>
      <>
        <JobInfo>
          <BoldDiv>Job Name: {jobName}</BoldDiv>
          <div>Status: {status}</div>
        </JobInfo>
        <div>
          {totalDuration && isRight && (
            <BoldDiv>
              Total Time Taken : {totalDuration}
            </BoldDiv>
          )}
        </div>
      </>
      {!isRight && (
        <ProgressContainer>
          <BoldDiv>Progress : {estimatedCompletion} Seconds Remaining</BoldDiv>
          <progress
            style={{ width: "100%" }}
            value={(totalDuration! - estimatedCompletion!) / totalDuration!}
          />
        </ProgressContainer>
      )}
    </JobDetailsContainer>
  );
};

export default React.memo(JobDetails);
