import React from 'react';

export interface IButton {
  children: React.ReactNode;
  onClick: (evt?: any) => void;
}

const Button = ({ children, onClick }: IButton) => {
  return <button onClick={onClick}>{children}</button>;
};

export default Button;
