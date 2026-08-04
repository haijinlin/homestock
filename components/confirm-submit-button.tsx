"use client";

import type { MouseEvent, ReactNode } from "react";

type ConfirmSubmitButtonProps = {
  children: ReactNode;
  className?: string;
  disabled?: boolean;
  message: string;
  title?: string;
};

export function ConfirmSubmitButton({
  children,
  className,
  disabled,
  message,
  title,
}: ConfirmSubmitButtonProps) {
  function confirmSubmit(event: MouseEvent<HTMLButtonElement>) {
    if (!window.confirm(message)) event.preventDefault();
  }

  return (
    <button
      className={className}
      disabled={disabled}
      onClick={confirmSubmit}
      title={title}
      type="submit"
    >
      {children}
    </button>
  );
}

