import ToggleSwitch from "./Switch";
import { ToogleProps, TopBarProps } from "../types/types";
import { Logo, NavButtons, QuanDiv, TopBarContainer } from "../skins";

const TopBar = (props: ToogleProps & TopBarProps) => {
  const { checked, timeQuantum } = props;
  return (
    <TopBarContainer>
      <Logo>SJF JOB SCHEDULER</Logo>
      <QuanDiv>
        {checked ? <div>Time Quantam : {timeQuantum} Seconds</div> : <></>}
        <NavButtons>
          <ToggleSwitch {...props} />
        </NavButtons>
      </QuanDiv>
    </TopBarContainer>
  );
};

export default TopBar;
