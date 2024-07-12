import { ToogleProps } from "../types/types";
import { Input, Label, Switch } from "../skins";


const ToggleSwitch = (props: ToogleProps) => {
  const { checked, onToggle } = props;
  return (
    <Label>
      <span>{checked ? "Preemptive" : "Non-Preemptive"}</span>
      <Input checked={checked} type="checkbox" onChange={onToggle} />
      <Switch />
    </Label>
  );
};

export default ToggleSwitch;
