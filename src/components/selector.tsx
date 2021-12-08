import * as React from "react";

interface SelectorProps {
  id: string;
  title: string;
  items: Array<string>;
  defaultValue: string;
  disabled: boolean;
}

const Selector: React.FunctionComponent<SelectorProps> = ({
  id,
  title,
  items,
  defaultValue,
  disabled,
}: SelectorProps) => {
  return (
    <>
      <label className="fw-bold">{title}</label>
      <select
        id={id}
        className="form-select"
        defaultValue={defaultValue}
        disabled={disabled}
      >
        {items.map((x) => (
          <option value={x}>{x}</option>
        ))}
      </select>
    </>
  );
};

export default Selector;
