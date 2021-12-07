import React = require("react");

const Switch = (porps: { id: string; info: string; checked: boolean }) => {
  return (
    <div className="form-check form-switch">
      <input
        className="form-check-input"
        type="checkbox"
        role="switch"
        id={"switch-" + porps.id}
        defaultChecked={porps.checked}
      />
      <label className="form-check-label" htmlFor={"switch-" + porps.id}>
        {porps.info}
      </label>
    </div>
  );
};

export default Switch;
