import { ReactElement } from "react";

type MyButtonProps = {
  onClick?: () => void;
  label: string;
  className: string;
};

const Button: React.FC<MyButtonProps> = ({ onClick,label,className }): ReactElement<HTMLButtonElement> => {
  return <button className={className} onClick={onClick}>{label}</button>;
};

export default Button;