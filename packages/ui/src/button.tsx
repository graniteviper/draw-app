"use client";

export type ButtonProps = {
  label: string;
  className?: string;
};

export const Button = ({ label, className }: ButtonProps) => {
  return <button className={className}>{label}</button>;
};
