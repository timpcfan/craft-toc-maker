import React = require("react");

interface SwitchProps {
  id: string;
  info: string;
  checked: boolean;
  disabled: boolean;
}

const Switch: React.FunctionComponent<SwitchProps> = ({
  id,
  info,
  checked,
  disabled,
}: SwitchProps) => {
  return (
    <div className="form-check form-switch">
      <input
        className="form-check-input"
        type="checkbox"
        role="switch"
        id={id}
        defaultChecked={checked}
        disabled={disabled}
      />
      <label className="form-check-label" htmlFor={id}>
        {info}
      </label>
    </div>
  );
};

export default Switch;
