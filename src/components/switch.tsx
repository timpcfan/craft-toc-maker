import React = require("react");

const Switch = (porps: {
  id: string;
  info: string;
  checked: boolean;
  disable: boolean;
}) => {
  return (
    <div className="form-check form-switch">
      <input
        className="form-check-input"
        type="checkbox"
        role="switch"
        id={porps.id}
        defaultChecked={porps.checked}
        disabled={porps.disable}
      />
      <label className="form-check-label" htmlFor={"switch-" + porps.id}>
        {porps.info}
      </label>
    </div>
  );
};

export default Switch;
